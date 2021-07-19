<?php

namespace App\Http\Controllers;


use App\Models\Settings;
use App\Services\RpcService;
use Illuminate\Http\Request;

class BlockController extends Controller
{
    public function index(Request $request, RpcService $rpcService)
    {
        try{
            $requestLastBlock = $request->input('last_block');

            $lastBlock = $rpcService->lastBlockHeightNumber();
            $lastBlock = (int)HexDec2($lastBlock??0);
            if($requestLastBlock)
            {
                if($requestLastBlock <= $lastBlock)
                {
                    $lastBlock = bcsub($requestLastBlock,1,0);
                }
            }

            $blockArray = $rpcService->getBlockString($lastBlock);
            $block = $rpcService->getBlockByNumber($blockArray);
            $blockList = array();
            foreach ($block as $key => $item)
            {
                if(!$item['result'])
                {
                    break;
                }
                $blockList[$key] = $item['result'];
                $blockList[$key]['height'] = base_convert($blockList[$key]['number'],16,10);
                $blockList[$key]['gasLimit'] = base_convert($blockList[$key]['gasLimit'],16,10);
                $blockList[$key]['created_at'] = date("Y-m-d H:i:s",HexDec2($blockList[$key]['timestamp'])+28800);
                $blockList[$key]['tx_count'] = count($blockList[$key]['transactions']);
                $blockList[$key]['size'] = bcdiv(HexDec2($blockList[$key]['size']),1000,3);
                $blockList[$key]['difficulty'] = HexDec2($blockList[$key]['difficulty']);
            }

            $data['first_block'] = 0;
            $data['last_block'] = 0;
            $data['block'] = [];
            if(count($blockList) > 0)
            {
                if($requestLastBlock)
                {
                    $data['first_block'] = bcadd($blockList[0]['height'],20,0);
                }
                $data['last_block'] = $blockList[count($blockList)-1]['height'];
                $data['block'] = $blockList;

            }
            $data['last_block_height'] = Settings::getValueByKey("last_block_height");
            $data['currentPage'] = "block";
            return view("block.index",$data);
        }catch (\Exception $e){
            if (app()->bound('sentry')) {
                app('sentry')->captureException($e);
            }
            return '<h1>出错了</h1>';
        }
    }

    /**
     * 区块详细页
     * @param Request $request
     * @param RpcService $rpcService
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function detail(Request $request, RpcService $rpcService)
    {
        try{
            $hash = $request->input('hash');
            if (!$hash) {
                return back();
            }
            $blockInfo = $rpcService->getBlockByHash($hash)['result'];
            $data = [];
            if ($blockInfo)
            {
                $data['hash'] = $hash;
                $data['number'] = HexDec2($blockInfo['number']);
                $data['created_at'] = date("Y-m-d H:i:s",HexDec2($blockInfo['timestamp'])+28800);
                $data['tx_count'] = count($blockInfo['transactions']);
                $data['size'] = bcdiv(HexDec2($blockInfo['size']),1000,3);
                $data['miner'] = $rpcService->cliqueGetSigner($blockInfo['number']);
                $data['difficulty'] = HexDec2($blockInfo['difficulty']);
                $data['totalDifficulty'] = HexDec2($blockInfo['totalDifficulty']);
                $data['gasLimit'] = HexDec2($blockInfo['gasLimit']);
                $data['gasUsed'] = HexDec2($blockInfo['gasUsed']);
                $data['transactions'] = [];
                foreach($blockInfo['transactions'] as $k => $v)
                {
                    $data['transactions'][$k]['hash'] = $v['hash'];
                    $data['transactions'][$k]['created_at'] = isset($v['created_at'])?$v['created_at']:null;
                    $data['transactions'][$k]['value'] = bcdiv(HexDec2($v['value']) ,gmp_pow(10,18),18);
                }
            }
            return view("block.detail",$data);
        }catch (\Exception $e){
            if (app()->bound('sentry')) {
                app('sentry')->captureException($e);
            }
            return '<h1>出错了</h1>';
        }
    }




}
