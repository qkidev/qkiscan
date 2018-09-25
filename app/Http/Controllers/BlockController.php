<?php

namespace App\Http\Controllers;


use App\Services\RpcService;
use Illuminate\Http\Request;

class BlockController extends Controller
{
    public function index()
    {

        return view("block.index");
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
