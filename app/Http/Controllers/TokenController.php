<?php

namespace App\Http\Controllers;

use App\Models\Token;
use App\Models\TokenTx;
use ERC20\ERC20;
use EthereumRPC\EthereumRPC;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TokenController extends Controller
{
    /**
     * 合约地址
     * @param $address
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\Http\RedirectResponse|\Illuminate\View\View
     * @throws \ERC20\Exception\ERC20Exception
     * @throws \EthereumRPC\Exception\ConnectionException
     * @throws \EthereumRPC\Exception\ContractABIException
     * @throws \EthereumRPC\Exception\ContractsException
     * @throws \EthereumRPC\Exception\GethException
     * @throws \HttpClient\Exception\HttpClientException
     */
    public function index($address)
    {

        $token = Token::where("contract_address",$address)->first();
        if(empty($token))
        {
            return back();
        }

        //查询通证总量
        //实例化通证
        $geth = new EthereumRPC(env('ETH_RPC_HOST'), env('ETH_RPC_PORT'));
        $erc20 = new ERC20($geth);
        $token_obj = $erc20->token($address);
        $data['symbol'] = $token_obj->symbol();
        $data['result'] = float_format($token_obj->totalSupply());

        $data['address'] = $address;

        $data['transactions'] = TokenTx::select(DB::raw("token_tx.*,transactions.hash as hash"))
            ->where('token_id',$token->id)
            ->leftJoin('transactions', 'token_tx.tx_id', '=', 'transactions.id')
            ->orderBy('id','desc')->paginate(20);

        return view("token.index",$data);
    }
}
