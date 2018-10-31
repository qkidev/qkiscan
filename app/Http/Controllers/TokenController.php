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
        $url_arr = parse_url(env("RPC_HOST"));
        $geth = new EthereumRPC($url_arr['host'], $url_arr['port']);
        $erc20 = new ERC20($geth);
        $token_obj = $erc20->token($address);
        $data['token'] = $token;
        $data['decimals'] = $token_obj->decimals();
        $data['result'] = float_format($token_obj->totalSupply());
        $data['address'] = $address;
        $data['tx'] = TokenTx::select(DB::raw('token_tx.*,token.contract_address,token.token_symbol,a.address as from_address,b.address as to_address,t.hash'))
            ->leftJoin("token","token_tx.token_id","token.id")
            ->leftJoin("address as a",'token_tx.from_address_id','a.id')
            ->leftJoin("address as b",'token_tx.to_address_id','b.id')
            ->leftJoin("transactions as t",'token_tx.tx_id','t.id')
            ->where('token_tx.token_id',$token->id)
            ->orderBy('token_tx.id','desc')
            ->paginate(20);

        return view("token.index",$data);
    }
}
