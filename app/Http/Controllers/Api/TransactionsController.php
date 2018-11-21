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

        $list = TokenTx::select(DB::raw('token_tx.*,t.hash'))
            ->leftJoin('transactions as t', 'token_tx.tx_id', 't.id')
            ->where([['token_id', '=', $token->id],['from_address_id', '=', $user_address->id]])
            ->orWhere([['token_id', '=', $token->id],['to_address_id', '=', $user_address->id]])
            ->orderBy('id','desc')
            ->paginate($pageSize);

        $result = [];
        if(count($list) > 0)
        {
            foreach ($list as $k => $tx)
            {
                $result[$k]['amount'] = float_format($tx->amount);
                $result[$k]['created_at'] = $tx->created_at->format('Y-m-d H:i:s');
                if($tx->from_address_id == $user_address->id)
                {
                    $result[$k]['amount'] = '-'.$result[$k]['amount'];
                }
                $result[$k]['hash'] = $tx->hash;
            }
        }

        return response()->json(['code' => 0, 'message' => 'OK', 'data' => $result]);

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
        if(!$address)
        {
            return response()->json(['code' => 500, 'message' => '缺少必要参数', 'data' => '']);
        }

        $transactions = Transactions::where('from',$address)
            ->orWhere('to',$address)
            ->orderBy('id','desc')
            ->paginate($pageSize);

        $result = [];
        if($transactions)
        {
            foreach ($transactions as $k => $tx)
            {
                $result[$k]['amount'] = float_format($tx->amount);
                $result[$k]['created_at'] = $tx->created_at->format('Y-m-d H:i:s');
                if(strtolower($tx->from) == strtolower($address) && $result[$k]['amount'] != 0)
                {
                    $result[$k]['amount'] = '-'.$result[$k]['amount'];
                }
                $result[$k]['hash'] = $tx->hash;
            }
        }

        return response()->json(['code' => 0, 'message' => 'OK', 'data' => $result]);
    }

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
        $used_gas = base_convert($gas[0]['result']['gasUsed'],16,10)??0;
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
}
