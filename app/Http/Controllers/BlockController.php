<?php

namespace App\Http\Controllers;


use App\Services\RpcService;
use Illuminate\Http\Request;

class BlockController extends Controller
{
    public function index(Request $request, RpcService $rpcService)
    {
        $requestLastBlock = $request->input('last_block');

        $lastBlock = $rpcService->lastBlockHeightNumber();
        $lastBlock = base_convert($lastBlock,16,10);
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
            $blockList[$key] = $item['result'];
            $blockList[$key]['height'] = base_convert($blockList[$key]['number'],16,10);
            $blockList[$key]['created_at'] = date("Y-m-d H:i:s",base_convert($blockList[$key]['timestamp'],16,10)+28800);
            $blockList[$key]['tx_count'] = count($blockList[$key]['transactions']);
        }

        $data['first_block'] = 0;
        if($requestLastBlock)
        {
            $data['first_block'] = bcadd($blockList[0]['height'],20,0);
        }
        $data['last_block'] = $blockList[count($blockList)-1]['height'];
        $data['block'] = $blockList;
        return view("block.index",$data);
    }

    /**
     * 区块详细页
     * @param Request $request
     * @param RpcService $rpcService
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function detail(Request $request, RpcService $rpcService)
    {
        $hash = $request->input('hash');
        if (!$hash) {
            return back();
        }
        $blockInfo = $rpcService->getBlockByHash($hash)['result'];
        $data = [];
        if ($blockInfo)
        {
            $data['hash'] = $hash;
            $data['number'] = base_convert($blockInfo['number'],16,10);
            $data['created_at'] = date("Y-m-d H:i:s",base_convert($blockInfo['timestamp'],16,10)+28800);
            $data['tx_count'] = count($blockInfo['transactions']);
            $data['transactions'] = [];
            foreach($blockInfo['transactions'] as $k => $v)
            {
                $data['transactions'][$k]['hash'] = $v['hash'];
                $data['transactions'][$k]['value'] = bcdiv(base_convert($v['value'],16,10) ,gmp_pow(10,18),18);
            }
        }
        return view("block.detail",$data);
    }




}
