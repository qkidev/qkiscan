<?php

namespace App\Http\Controllers;

use App\Services\RpcService;
class TxController extends Controller
{
    /**
     * 交易详细
     * @param $hash
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index($hash)
    {

        $RpcService = new RpcService();

        $params = [$hash];

        $data = $RpcService->rpc("eth_getTransactionByHash",$params);

        return view("tx.index",$data);
    }

}
