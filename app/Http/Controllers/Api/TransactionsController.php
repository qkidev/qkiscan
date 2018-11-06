<?php

namespace App\Http\Controllers\Api;

use App\Models\Address;
use App\Models\Token;
use App\Models\TokenTx;
use App\Models\Transactions;
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
                $result[$k]['amount'] = $tx->amount;
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
                $result[$k]['amount'] = $tx->amount;
                $result[$k]['created_at'] = $tx->created_at->format('Y-m-d H:i:s');
                if($tx->from == $address && $result[$k]['amount'] != 0)
                {
                    $result[$k]['amount'] = '-'.$result[$k]['amount'];
                }
                $result[$k]['hash'] = $tx->hash;
            }
        }

        return response()->json(['code' => 0, 'message' => 'OK', 'data' => $result]);
    }
}
