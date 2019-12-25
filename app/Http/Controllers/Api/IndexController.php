<?php

namespace App\Http\Controllers\Api;

use App\Services\RpcService;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class IndexController extends Controller
{

    /**
     * 搜索
     * @param Request $request
     * @param RpcService $rpcService
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(Request $request, RpcService $rpcService)
    {
        $keyword = $request->input('keyword');

        if(!$keyword)
        {
            return response()->json(['code' => 500, 'msg' => '请输入正确的地址、区块高度或Hash值', 'data' => '']);
        }

        //判断是否为数字，如果为数字，优先查询区块
        if(is_numeric($keyword))
        {
            $keyword = [['0x'.base_convert($keyword,10,16),true]];
            $result = $rpcService->getBlockByNumber($keyword);
            $blockInfo = $result[0]['result'];
            if(isset($blockInfo) && $blockInfo['hash'])
            {
                $data['type'] = 'block';
                $data['hash'] = $blockInfo['hash'];
                return response()->json(['code' => 0, 'msg' => 'OK', 'data' => $data]);
            }else{
                return response()->json(['code' => 500, 'msg' => '请输入正确的地址、区块高度或Hash值', 'data' => '']);
            }
        }else{
            $hash_leng = strlen($keyword);
            if($hash_leng == 42)
            {
                //地址查询
                $data['type'] = 'address';
                $data['hash'] = $keyword;
                return response()->json(['code' => 0, 'msg' => 'OK', 'data' => $data]);
            }else if($hash_leng == 66){
                //hash查询
                $result = $rpcService->getBlockByHash($keyword);
                $blockInfo = $result['result'];
                if(isset($blockInfo) && $blockInfo['hash'])
                {
                    $data['type'] = 'block';
                    $data['hash'] = $keyword;
                    return response()->json(['code' => 0, 'msg' => 'OK', 'data' => $data]);
                }else{
                    $params = array(
                        [$keyword]
                    );
                    $data = $rpcService->rpc("eth_getTransactionByHash",$params);
                    if(isset($data) && $data[0]['result'])
                    {
                        $data['type'] = 'transaction';
                        $data['hash'] = $keyword;
                        return response()->json(['code' => 0, 'msg' => 'OK', 'data' => $data]);
                    }else{
                        return response()->json(['code' => 500, 'msg' => '请输入正确的地址、区块高度或Hash值', 'data' => '']);
                    }
                }
            }else{
                return response()->json(['code' => 500, 'msg' => '请输入正确的地址、区块高度或Hash值', 'data' => '']);
            }
        }
    }
}
