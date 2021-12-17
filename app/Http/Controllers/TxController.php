<?php

namespace App\Http\Controllers;

use App\Models\AddressNotes;
use App\Models\Balances;
use App\Models\Token;
use App\Models\TokenTx;
use App\Models\Transactions;
use App\Services\RpcService;
use Carbon\Carbon;
use ERC20\ERC20;
use EthereumRPC\EthereumRPC;
use EthereumRPC\Response\TransactionInputTransfer;
use Illuminate\Support\Facades\Cache;

class TxController extends Controller
{
    const TX_CACHE_KEY = 'tx:list:';

    /**
     * 交易详细
     * @param $hash
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     * @throws \ERC20\Exception\ERC20Exception
     * @throws \EthereumRPC\Exception\ConnectionException
     * @throws \EthereumRPC\Exception\ContractABIException
     * @throws \EthereumRPC\Exception\ContractsException
     * @throws \EthereumRPC\Exception\GethException
     * @throws \EthereumRPC\Exception\ResponseObjectException
     * @throws \HttpClient\Exception\HttpClientException
     */
    public function index($hash)
    {
        try{
            $RpcService = new RpcService();

            $params = array(
                [$hash]
            );


            $data = $RpcService->rpc("eth_getTransactionByHash",$params);

            $data = isset($data[0]['result'])?$data[0]['result']:null;
            if($data){
                $block = $RpcService->rpc("eth_getBlockByNumber",[[$data['blockNumber'], true]]);
                $block = isset($block[0]['result'])?$block[0]['result']:null;
                if($block)
                {
                    $data['created_at'] = formatTime($block['timestamp']);
                }else{
                    $data['created_at'] = "";
                }

                $gas = $RpcService->rpc('eth_getTransactionReceipt',[[$hash]]);
                //var_dump($gas);exit;
                $data['nonce'] = (int)HexDec2($data['nonce']);
                //查询交易是否成功
                if(isset($gas[0]['result']))
                {
                    $gas = $gas[0]['result'];
                    $tx_status = HexDec2($gas['status']);
                    if($tx_status == 1)
                    {
                        $data['tx_status'] = "交易成功";
                    }else{
                        $data['tx_status'] = "交易失败";
                    }
                    $data['gas'] = float_format(HexDec2($gas['gasUsed']))??0;
                    $data['gasPrice'] = float_format(bcdiv(HexDec2($data['gasPrice']) ,gmp_pow(10,18),18));
                    $data['blockNumber'] = base_convert($data['blockNumber'],16,10);
                    $data['value'] = float_format(bcdiv(HexDec2($data['value']) ,gmp_pow(10,18),18));
                    $data['contract_address'] = isset($gas['contractAddress'])?$gas['contractAddress']:'';
                    //计算区块确认数
                    $newestBlock = $RpcService->rpc('eth_blockNumber', [[]]);
                    $data['blockConfirm'] = base_convert($newestBlock[0]['result'], 16, 10) - $data['blockNumber'];
                }else{
                    $data['gas'] = float_format(HexDec2($data['gas']))??0;
                    $data['gasPrice'] = float_format(bcdiv(HexDec2($data['gasPrice']) ,gmp_pow(10,18),18));
                    $data['value'] = float_format(bcdiv(HexDec2($data['value']) ,gmp_pow(10,18),18));
                    $data['tx_status'] = '区块打包中';
                    $data['blockConfirm'] = 0;
                }

            }
            $data['from_note'] = AddressNotes::where("address",$data['from'])->first();
            $data['to_note'] = AddressNotes::where("address",$data['to'])->first();
            $data['is_token_tx'] = false;
            //获取通证交易记录
            if (substr($data['input']??"", 0, 10) === '0xa9059cbb') {
                //实例化通证
                $url_arr = parse_url(env("RPC_HOST"));
                $geth = new EthereumRPC($url_arr['host'], $url_arr['port']);
                $erc20 = new ERC20($geth);
                $token = $erc20->token($data['to']);
                $decimals = $token->decimals();
                $data['is_token_tx'] = true;
                //保存通证交易
                $token_tx =  new TransactionInputTransfer($data['input']);
                $data['token_tx_amount'] = bcdiv(HexDec2($token_tx->amount),gmp_pow(10,$decimals),18);
                $data['token_tx_to'] = $token_tx->payee;
                $data['token_tx_to_note'] = AddressNotes::where("address",$data['token_tx_to'])->first();
                $data['token'] = Token::where('contract_address',$data['to'])->first();
            }

            return view("tx.index",$data);
        }catch (\Exception $e){
            if (app()->bound('sentry')) {
                app('sentry')->captureException($e);
            }
            return '<h1>出错了</h1>';
        }
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


    /**
     * cct排行榜
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function cctPage()
    {
        $data['transactions'] = Balances::where('name', 'cct')
            ->orderBy("amount","desc")
            ->limit(100)
            ->get();
        $data['currentPage'] = 'cct-page';
        return view('tx.rank',$data);
    }
}
