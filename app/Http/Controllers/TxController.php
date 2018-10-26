<?php

namespace App\Http\Controllers;

use App\Models\Token;
use App\Services\RpcService;
use EthereumRPC\Response\TransactionInputTransfer;

class TxController extends Controller
{
    /**
     * 交易详细
     * @param $hash
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     * @throws \EthereumRPC\Exception\ResponseObjectException
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

        $data['is_token_tx'] = false;
        //获取通证交易记录
        if (substr($data['input'], 0, 10) === '0xa9059cbb') {
            $data['is_token_tx'] = true;
            //保存通证交易
            $token_tx =  new TransactionInputTransfer($data['input']);
            $data['token_tx_amount'] = bcdiv(base_convert($token_tx->amount,16,10),1000000000000000000,8);
            $data['token_tx_to'] = $token_tx->payee;
            $data['token'] = Token::where('contract_address',$data['to'])->first();
        }

        return view("tx.index",$data);
    }

}
