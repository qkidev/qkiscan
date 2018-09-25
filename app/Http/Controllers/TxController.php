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

        $params = array(
            [$hash]
        );

        $data = $RpcService->rpc("eth_getTransactionByHash",$params);

        $data = isset($data[0]['result'])?$data[0]['result']:null;
        if($data){

            $data['gas'] = base_convert($data['gas'],16,10);
            $data['blockNumber'] = base_convert($data['blockNumber'],16,10);
            $data['value'] = float_format(bcdiv(gmp_strval($data['value']) ,gmp_pow(10,18),18));

        }

        return view("tx.index",$data);
    }

}
