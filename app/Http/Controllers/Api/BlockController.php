<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\RpcService;

class BlockController extends Controller
{
    /**
     * 区块列表接口
     */
    public function getBlock(Request $request, RpcService $rpcService)
    {
        $page = $request->input('page', 1);

        $lastBlock = $rpcService->lastBlockHeightNumber();
        $lastBlock = base_convert($lastBlock,16,10);
        $lastBlock = $lastBlock - ($page - 1) * 20 - 1;

        $blockArray = $rpcService->getBlockString($lastBlock);
        $block = $rpcService->getBlockByNumber($blockArray);
        $blockList = array();
        foreach ($block as $key => $item)
        {
            $blockList[$key]['height'] = base_convert($item['result']['number'],16,10);
            $blockList[$key]['created_at'] = date("Y-m-d H:i:s",base_convert($item['result']['timestamp'],16,10)+28800);
            $blockList[$key]['tx_count'] = count($item['result']['transactions']);
            $blockList[$key]['hash '] = $item['result']['hash'];
        }

        return response()->json(['code' => 0, 'message' => 'OK', 'data' => $blockList]);
    }
}
