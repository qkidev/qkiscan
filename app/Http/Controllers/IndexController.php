<?php

namespace App\Http\Controllers;

use App\Model\Account;
use App\Model\Block;
use App\Model\MasterNode;
use App\Model\Transaction;
use App\Model\TxOut;
use App\Models\Address;
use App\Models\Balances;
use App\Models\Transactions;
use App\Service\APIService;
use App\Service\SyncService;
use App\Services\RpcService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class IndexController extends Controller
{

    /**
     * 首页
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index()
    {
        $rpcService = new RpcService();
        $lastBlock = $rpcService->lastBlockHeightNumber() ?? 0;

        $lastBlock = (int)HexDec2($lastBlock);

        $blockArray = $rpcService->getBlockString($lastBlock);
        $block = $rpcService->getBlockByNumber($blockArray);
        $blockList = array();
        if(!empty($block))
        {
            foreach ($block as $key => $item)
            {
                if(!$item['result'])
                {
                    break;
                }
                $blockList[$key] = $item['result'];
                $blockList[$key]['height'] = base_convert($blockList[$key]['number'],16,10);
                $blockList[$key]['gasLimit'] = base_convert($blockList[$key]['gasLimit'],16,10);
                $blockList[$key]['created_at'] = formatTime($blockList[$key]['timestamp']);
                $blockList[$key]['tx_count'] = count($blockList[$key]['transactions']);
                $blockList[$key]['size'] = bcdiv(HexDec2($blockList[$key]['size']),1000,3);
                $blockList[$key]['difficulty'] = HexDec2($blockList[$key]['difficulty']);
            }
        }
        $data['max_height'] = 0;
        if (count($blockList)>0){
            $data['max_height'] = $blockList[0]['height']+1;
        }
        $data['transactions_num'] = Transactions::where('tx_status', 1)->count();
        $start = time()-24*60*60-28800;
        $end = time()-28800;
        $data['hour_24_num'] = Transactions::where('tx_status', 1)->whereTime('created_at', '<', $end)->whereTime('created_at', '>', $start)->count();
        $data['address_num'] = Balances::where('name', 'qki')->where('amount', '>', 0)->count();
        $data['block'] = $blockList;
        $data['currentPage'] = "index";
        return view("index.index",$data);
    }

    /**
     * 搜索
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function search(Request $request, RpcService $rpcService)
    {
        $keyword = $request->input('keyword');

        //判断是否为数字，如果为数字，优先查询区块
        if(is_numeric($keyword))
        {
            $keyword = [['0x'.base_convert($keyword,10,16),true]];
            $result = $rpcService->getBlockByNumber($keyword);
            $blockInfo = $result[0]['result'];
            if(isset($blockInfo) && $blockInfo['hash'])
            {
                $url = "/block/detail?hash=".$blockInfo['hash'];
                return redirect($url);
            }else{
                //todo 跳转404页面
                return view("error.404");
            }
        }else{
            $hash_leng = strlen($keyword);
            if($hash_leng == 42)
            {
                //地址查询
                $url = "/address/".$keyword;
                return redirect($url);
            }else if($hash_leng == 66){
                //hash查询
                $result = $rpcService->getBlockByHash($keyword);
                $blockInfo = $result['result'];
                if(isset($blockInfo) && $blockInfo['hash'])
                {
                    $url = "/block/detail?hash=".$blockInfo['hash'];
                    return redirect($url);
                }else{
                    $params = array(
                        [$keyword]
                    );
                    $data = $rpcService->rpc("eth_getTransactionByHash",$params);
                    if(isset($data) && $data[0]['result'])
                    {
                        $url = "/tx/".$keyword;
                        return redirect($url);
                    }else{
                        //todo 跳转404页面
                        return view("error.404");
                    }
                }
            }else{
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

}
