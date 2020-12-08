<?php

namespace App\Http\Controllers;

use App\Model\Account;
use App\Model\Block;
use App\Model\MasterNode;
use App\Model\Transaction;
use App\Model\TxOut;
use App\Models\Balances;
use App\Models\Settings;
use App\Models\Transactions;
use App\Service\APIService;
use App\Service\SyncService;
use App\Services\RpcService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class IndexController extends Controller
{
    const HOME_CACHE_KEY = 'home:data';

    /**
     * 首页
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index()
    {
        if (Cache::has(self::HOME_CACHE_KEY)) {
            return view("index.index", Cache::get(self::HOME_CACHE_KEY));
        }

        $rpcService = new RpcService();
        $lastBlock = $rpcService->lastBlockHeightNumber() ?? 0;

        $lastBlock = (int)HexDec2($lastBlock);

        $blockArray = $rpcService->getBlockString($lastBlock);
        $block = $rpcService->getBlockByNumber($blockArray);
        $blockList = array();
        if (!empty($block)) {
            foreach ($block as $key => $item) {
                if (!$item['result']) {
                    break;
                }
                $blockList[$key] = $item['result'];
                $blockList[$key]['height'] = base_convert($blockList[$key]['number'], 16, 10);
                $blockList[$key]['gasLimit'] = base_convert($blockList[$key]['gasLimit'], 16, 10);
                $blockList[$key]['gasUsed'] = base_convert($blockList[$key]['gasUsed'], 16, 10);
                $blockList[$key]['created_at'] = formatTime($blockList[$key]['timestamp']);
                $blockList[$key]['tx_count'] = count($blockList[$key]['transactions']);
                $blockList[$key]['size'] = bcdiv(HexDec2($blockList[$key]['size']), 1000, 3);
                $blockList[$key]['difficulty'] = HexDec2($blockList[$key]['difficulty']);
            }
        }
        $data['max_height'] = 0;
        if (count($blockList) > 0) {
            $data['max_height'] = $blockList[0]['height'] + 1;
        }
        $end = Carbon::now();
        //缓存1分钟
        $data['transactions_num'] = Cache::remember("home_transactions_num", 1, function () {
            return Transactions::count();
        });
        //缓存1分钟
        $data['hour_24_num'] = Cache::remember("home_token_hour_24_num", 1, function () {
            $latestNumber = Settings::getValueByKey("last_block_height");
            return \App\Models\Block::where('number', '>', $latestNumber - 5760)->sum('transaction_count');
        });
        //缓存1分钟
        $data['address_num'] = Cache::remember("home_address_num", 1, function () {
            return Balances::where('name', 'qki')->where('amount', '>', 0)->count();
        });


        $data['block'] = $blockList;
        $data['currentPage'] = "index";
        // 数据缓存 15s
        Cache::put(self::HOME_CACHE_KEY, $data, $end->addSeconds(60));
        return view("index.index", $data);
    }

    /**
     * 搜索
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function search(Request $request, RpcService $rpcService)
    {
        $keyword = strtolower($request->input('keyword'));

        //判断是否为数字，如果为数字，优先查询区块
        if (is_numeric($keyword)) {
            $keyword = [['0x' . base_convert($keyword, 10, 16), true]];
            $result = $rpcService->getBlockByNumber($keyword);
            $blockInfo = $result[0]['result'];
            if (isset($blockInfo) && $blockInfo['hash']) {
                $url = "/block/detail?hash=" . $blockInfo['hash'];
                return redirect($url);
            } else {
                //todo 跳转404页面
                return view("error.404");
            }
        } else {
            $hash_leng = strlen($keyword);
            if ($hash_leng == 42) {
                //地址查询
                $url = "/address/" . $keyword;
                return redirect($url);
            } else if ($hash_leng == 66) {
                //hash查询
                $result = $rpcService->getBlockByHash($keyword);
                $blockInfo = $result['result'];
                if (isset($blockInfo) && $blockInfo['hash']) {
                    $url = "/block/detail?hash=" . $blockInfo['hash'];
                    return redirect($url);
                } else {
                    $params = array(
                        [$keyword]
                    );
                    $data = $rpcService->rpc("eth_getTransactionByHash", $params);
                    if (isset($data) && $data[0]['result']) {
                        $url = "/tx/" . $keyword;
                        return redirect($url);
                    } else {
                        //todo 跳转404页面
                        return view("error.404");
                    }
                }
            } else {
                //todo 跳转404页面
                return view("error.404");
            }
        }
    }

    /**
     * 接口页面
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function api()
    {
        return view("index.api");
    }

    /**
     *  输出openSearchXml
     * @param Request $request
     * @return \Illuminate\Contracts\Routing\ResponseFactory|\Illuminate\Http\Response
     */
    public function openSearchXml(Request $request)
    {
        echo '<?xml version="1.0" encoding="UTF-8"?>';
        echo '<OpenSearchDescription xmlns="http://a9.com/-/spec/opensearch/1.1/"><InputEncoding>UTF-8</InputEncoding>
            <ShortName>QKI区块浏览器</ShortName>
            <Description>QKI区块浏览器搜索</Description>
            <Url type="text/html" template="https://' . $request->getHost() . '/search?keyword={searchTerms}"/>
        </OpenSearchDescription>';
        return response('', 200, ['Content-type' => 'text/xml']);
    }


    public function bp()
    {
        $rpcService = new RpcService();
        $rpc_data = $rpcService->rpc1('clique_status', []);

        if (isset($rpc_data) && $rpc_data['result']) {
            $data['bps'] = $rpc_data['result']['sealerActivity'];
        } else {
            $data['bps'] = [];
        }

        return view('index.bp', $data);
    }

}
