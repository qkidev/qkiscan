<?php

namespace App\Http\Controllers;

use App\Models\Token;
use App\Models\Transactions;
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
            $gas = $RpcService->rpc('eth_getTransactionReceipt',[[$hash]]);
            $gas = isset($gas[0]['result'])?$gas[0]['result']:null;
            $data['gas'] = base_convert($gas['gasUsed'],16,10)??0;
            $data['gasPrice'] = bcdiv(base_convert($data['gasPrice'],16,10) ,gmp_pow(10,18),18);
            $data['blockNumber'] = base_convert($data['blockNumber'],16,10);
            $data['value'] = float_format(bcdiv(gmp_strval($data['value']) ,gmp_pow(10,18),18));
            $data['nonce'] = base_convert($data['nonce'],16,10);
            //查询交易是否成功
            $receipt = $RpcService->rpc("eth_getTransactionReceipt",[[$hash]]);
            if(isset($receipt[0]['result']))
            {
                $tx_status = base_convert($receipt[0]['result']['status'],16,10);
                if($tx_status == 1)
                {
                    $data['tx_status'] = "交易成功";
                }else{
                    $data['tx_status'] = "交易失败";
                }
            }else{
                $data['tx_status'] = '交易状态获取失败';
            }
        }

        $data['is_token_tx'] = false;
        //获取通证交易记录
        if (substr($data['input']??"", 0, 10) === '0xa9059cbb') {
            $data['is_token_tx'] = true;
            //保存通证交易
            $token_tx =  new TransactionInputTransfer($data['input']);
            $data['token_tx_amount'] = bcdiv(base_convert($token_tx->amount,16,10),1000000000000000000,18);
            $data['token_tx_to'] = $token_tx->payee;
            $data['token'] = Token::where('contract_address',$data['to'])->first();
        }

        return view("tx.index",$data);
    }

    /**
     * 交易列表
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function list()
    {
        $data['transactions'] = Transactions::orderBy("id","desc")
            ->paginate(20);
        $data['currentPage'] = 'tx-list';
        return view("tx.list",$data);
    }

    /**
     * 未打包交易列表
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function unpackedTxList()
    {
        $rpcService = new RpcService();

        $arr = $rpcService->rpc("txpool_content",[[]]);

        $data['transactions'] = $arr[0]['result'] ?? [];
        $data['currentPage'] = 'unpacked-tx-list';

        return view('tx.unpacked-list',$data);
    }
}
