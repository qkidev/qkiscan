<?php

namespace App\Http\Controllers\Api;

use App\Models\Token;
use App\Models\TokenTx;
use App\Models\Transactions;
use App\Services\RpcService;
use ERC20\ERC20;
use EthereumRPC\EthereumRPC;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class AddressController extends Controller
{
    /**
     * 获取地址详情
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAddressInfo(Request $request)
    {
        $address = $request->input('address');

        if (empty($address)) {
            return response()->json(['code' => 500, 'message' => '缺少参数：address', 'data' => '']);
        }

        $RpcService = new RpcService();

        $params = array(
            [$address,"latest"]
        );

        $data = $RpcService->rpc("eth_getBalance",$params);

        $data = isset($data[0])?$data[0]:array();

        $data['result'] = float_format(bcdiv(gmp_strval($data['result']) ,gmp_pow(10,18),18));

        $data['address'] = $address;

        $data['transactions'] = Transactions::where('from',$address)->orWhere('to',$address)->orderBy('id','desc')->paginate(20);

        return response()->json(['code' => 0, 'message' => 'OK', 'data' => $data]);
    }

    /**
     * 获取合约地址详情
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse|\Illuminate\Http\RedirectResponse
     * @throws \ERC20\Exception\ERC20Exception
     * @throws \EthereumRPC\Exception\ConnectionException
     * @throws \EthereumRPC\Exception\ContractABIException
     * @throws \EthereumRPC\Exception\ContractsException
     * @throws \EthereumRPC\Exception\GethException
     * @throws \HttpClient\Exception\HttpClientException
     */
    public function getTokenAddressInfo(Request $request)
    {
        $address = $request->input('address');

        if (empty($address)) {
            return response()->json(['code' => 500, 'message' => '缺少参数：address', 'data' => '']);
        }

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

        return response()->json(['code' => 0, 'message' => 'OK', 'data' => $data]);
    }
}
