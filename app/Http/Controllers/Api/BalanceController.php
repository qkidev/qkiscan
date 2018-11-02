<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use EthereumRPC\EthereumRPC;
use EthereumRPC\Validator;
use ERC20\ERC20;
use App\Services\RpcService;

class BalanceController extends Controller
{
    /**
     * 获取通证余额
     */
    public function getTokenBalance(Request $request)
    {
        $address = $request->input('address');
        $contract_address = $request->input('contract_address');

        if (empty($address)) {
            return response()->json(['code' => 500, 'message' => '缺少参数：address', 'data' => '']);
        }
        if (empty($contract_address)) {
            return response()->json(['code' => 500, 'message' => '缺少参数：contract_address', 'data' => '']);
        }
        if (!Validator::Address($address)) {
            return response()->json(['code' => 500, 'message' => '无效的地址', 'data' => '']);
        }

        //连接rpc
        $url_arr = parse_url(env("RPC_HOST"));
        $geth = new EthereumRPC($url_arr['host'], $url_arr['port']);
        $erc20 = new ERC20($geth);

        try {
            $token = $erc20->token($contract_address);
            $balance = $token->balanceOf($address);

            return response()->json(['code' => 0, 'message' => 'OK', 'data' => $balance]);
        } catch (\Exception $exception) {

            return response()->json(['code' => 500, 'message' => '数据异常', 'data' => '']);
        }
    }

    /**
     * 获取qki余额
     */
    public function getQkiBalance(Request $request)
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

        if (isset($data['result'])) {
            $balance = float_format(bcdiv(gmp_strval($data['result']) ,gmp_pow(10,18),18));
        } else {
            $balance = 0;
        }

        return response()->json(['code' => 0, 'message' => 'OK', 'data' => $balance]);
    }
}
