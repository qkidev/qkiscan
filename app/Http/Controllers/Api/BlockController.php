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
        $lastBlock = HexDec2($lastBlock);
        $lastBlock = $lastBlock - ($page - 1) * 20 - 1;

        $blockArray = $rpcService->getBlockString($lastBlock);
        $block = $rpcService->getBlockByNumber($blockArray);
        $blockList = array();

        if ($block) {
            foreach ($block as $key => $item) {
                $blockList[$key]['height'] = float_format(HexDec2($item['result']['number']));
                $blockList[$key]['created_at'] = date("Y-m-d H:i:s", HexDec2($item['result']['timestamp']) + 28800);
                $blockList[$key]['tx_count'] = count($item['result']['transactions']);
                $blockList[$key]['hash'] = $item['result']['hash'];
            }
        }

        return response()->json(['code' => 0, 'message' => 'OK', 'data' => $blockList]);
    }

    /**
     * 获取区块详情
     * @param Request $request
     * @param RpcService $rpcService
     * @return \Illuminate\Http\JsonResponse
     */
    public function blockDetail(Request $request, RpcService $rpcService)
    {
        $hash = $request->input('hash');
        if (!$hash) {
            return response()->json(['code' => 500, 'message' => '缺少必要参数', 'data' => '']);
        }
        $blockInfo = $rpcService->getBlockByHash($hash);
        if(!isset($blockInfo['result']))
        {
            return response()->json(['code' => 500, 'message' => '请输入正确的区块HASH', 'data' => '']);
        }
        $blockInfo = $blockInfo['result'];
        $data = [];
        if ($blockInfo)
        {
            $data['hash'] = $hash;
            $data['height'] = HexDec2($blockInfo['number']);
            $data['created_at'] = date("Y-m-d H:i:s",HexDec2($blockInfo['timestamp'])+28800);
            $data['tx_count'] = count($blockInfo['transactions']);
            $data['size'] = bcdiv(HexDec2($blockInfo['size']),1000,3);
            $data['miner'] = $blockInfo['miner'];
            $data['difficulty'] = HexDec2($blockInfo['difficulty']);
            $data['transactions'] = [];
            foreach($blockInfo['transactions'] as $k => $v)
            {
                $data['transactions'][$k]['hash'] = $v['hash'];
                $data['transactions'][$k]['amount'] = bcdiv(HexDec2($v['value']) ,gmp_pow(10,18),18);
            }
        }

        return response()->json(['code' => 0, 'message' => 'OK', 'data' => $data]);
    }
}
