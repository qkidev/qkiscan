<?php

namespace App\Http\Controllers\Api;

use App\Models\Address;
use App\Models\Token;
use App\Models\TokenTx;
use App\Models\Transactions;
use App\Services\RpcService;
use ERC20\ERC20;
use EthereumRPC\EthereumRPC;
use EthereumRPC\Validator;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class TransactionsController extends Controller
{
    /**
     * 获取通证交易记录
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTokenTx(Request $request)
    {
        $address = $request->input('address');
        $contract_address = $request->input('contract_address');
        $pageSize = $request->input('pageSize',20);
        $callback = $request->input('callback');

        if(!$address || !$contract_address)
        {
            return response()->json(['code' => 500, 'message' => '缺少必要参数', 'data' => '']);
        }

        if (!Validator::Address($address)) {
            return response()->json(['code' => 500, 'message' => '无效的地址', 'data' => '']);
        }

        $user_address = Address::where('address',$address)->first();
        if(!$user_address)
        {
            return response()->json(['code' => 500, 'message' => '地址不存在，请检查', 'data' => '']);
        }

        $token = Token::where('contract_address',$contract_address)->first();
        if(!$token)
        {
            return response()->json(['code' => 500, 'message' => '合约地址有误，请检查', 'data' => '']);
        }

        $address_id = $user_address->id;

        $list = TokenTx::select(DB::raw('token_tx.*,t.hash,t.tx_status'))
            ->leftJoin('transactions as t', 'token_tx.tx_id', 't.id')
            ->where([['token_id', '=', $token->id],['t.tx_status', '=', 1]])
            ->where(function ($query) use ($address_id) {
                $query->Where('from_address_id', '=', $address_id)
                    ->orWhere('to_address_id', '=', $address_id);
            })
            ->orderBy('id','desc')
            ->take($pageSize)
            ->get();

        $result = [];
        if(count($list) > 0)
        {
            foreach ($list as $k => $tx)
            {
                $result[$k]['amount'] = float_format($tx->amount);
                $result[$k]['created_at'] = formatTime($tx->created_at, 2);
                if($tx->from_address_id == $user_address->id)
                {
                    $result[$k]['amount'] = '-'.$result[$k]['amount'];
                }
                $result[$k]['hash'] = $tx->hash;
                $result[$k]['tx_status'] = $tx->tx_status;
            }
        }

        if($callback)
        {
            return response($callback."('". json_encode($result). "')");
        }else{

            return response()->json(['code' => 0, 'message' => 'OK', 'data' => $result]);
        }

    }

    /**
     * 获取QKI交易记录
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTransactions(Request $request)
    {
        $address = $request->input('address');
        $pageSize = $request->input('pageSize',20);
        $callback = $request->input('callback');
        if(!$address)
        {
            return response()->json(['code' => 500, 'message' => '缺少必要参数', 'data' => '']);
        }

        $transactions = Transactions::whereNull('payee')
            ->where(function($query) use ($address){
                $query->where('from',$address)->orWhere('to',$address);
            })
            ->orderBy('id','desc')
            ->paginate($pageSize);

        $result = [];
        if($transactions)
        {
            $i = 0;
            foreach ($transactions as $k => $tx)
            {
                if($tx->amount != 0)
                {
                    $result[$i]['amount'] = float_format($tx->amount);
                    $result[$i]['created_at'] = formatTime($tx->created_at, 2);
                    if(strtolower($tx->from) == strtolower($address))
                    {
                        $result[$i]['amount'] = '-'.$result[$i]['amount'];
                    }
                    $result[$i]['hash'] = $tx->hash;
                    $result[$i]['from'] = $tx->from;
                    $result[$i]['to'] = $tx->to;
                    $result[$i]['tx_status'] = $tx->tx_status;
                    $i++;
                }
            }
        }

        if($callback)
        {
            return response($callback."('". json_encode($result). "')");
        }else{

            return response()->json(['code' => 0, 'message' => 'OK', 'data' => $result]);
        }
    }

    /**
     * 获取通证详情
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTokenTxInfo(Request $request)
    {
        $hash = $request->input('hash');
        if(!$hash)
        {
            return response()->json(['code' => 500, 'message' => '缺少必要参数', 'data' => '']);
        }

        $tx = Transactions::where("hash",$hash)->first();
        if(!$tx)
        {
            return response()->json(['code' => 500, 'message' => '该交易不存在或暂未同步，请稍后再试', 'data' => '']);
        }

        $token_tx = TokenTx::where('tx_id',$tx->id)->first();

        $result = [];
        //获取收款方地址
        $to_address = Address::find($token_tx->to_address_id);
        //计算矿工费
        $rpc = new RpcService();
        $gas = $rpc->rpc('eth_getTransactionReceipt',[[$hash]]);
        $used_gas = HexDec2($gas[0]['result']['gasUsed'])??0;
        //获取通证
        $token = Token::find($token_tx->token_id);

        $result['from'] = $tx->from;
        $result['to'] = $to_address->address;
        $result['gas_price'] = bcmul($used_gas,$tx->gas_price,18);
        $result['token_name'] = $token->token_name;
        $result['token_symbol'] = $token->token_symbol;
        $result['contract_address'] = $token->contract_address;
        $result['amount'] = float_format($token_tx->amount);
        $result['height'] = $tx->block_number;
        $result['created_at'] = $token_tx->created_at->format('Y-m-d H:i:s');

        return response()->json(['code' => 0, 'message' => 'OK', 'data' => $result]);
    }

    /**
     * 获取交易详情
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getTx(Request $request)
    {
        $hash = $request->input('hash');
        if(!$hash)
        {
            return response()->json(['code' => 500, 'message' => '缺少必要参数', 'data' => '']);
        }
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
                $created_at = base_convert($block['timestamp'], 16 ,10);
                $data['created_at'] = date('Y-m-d H:i:s', $created_at);
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
            }else{
                $data['tx_status'] = '交易状态获取失败';
            }

        }
        $data['is_token_tx'] = false;
        //如果是通证交易
        if (substr($data['input']??"", 0, 10) === '0xa9059cbb') {
            $data['is_token_tx'] = true;
        }

        return response()->json(['code' => 0, 'message' => 'OK', 'data' => $data]);
    }
}
