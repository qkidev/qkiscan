<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use EthereumRPC\EthereumRPC;
use EthereumRPC\Validator;
use ERC20\ERC20;

class BalanceController extends Controller
{
    /**
     * 获取通证余额
     */
    public function getTokenBalance(Request $request)
    {
        $address = $request->input('address');
        $contract_address = $request->input('contract_address');

        // 测试数据, 上线需删除
        if (empty($address)) {
            $address = '0x90690214C93886F6B6d0D89e975329d99d547117 ';
        }
        if (empty($contract_address)) {
            $contract_address = '0xF20a1B8F61A186F8485A037549149079c0f3b493';
        }

        if (!Validator::Address($address)) {
            return response()->json(['code' => 500, 'message' => '无效的地址', 'data' => '']);
        }

        //连接rpc
        $geth = new EthereumRPC('127.0.0.1', 8545);
        $erc20 = new ERC20($geth);

        $token = $erc20->token($contract_address);
        $balance = $token->balanceOf($address);

        return response()->json(['code' => 0, 'message' => 'OK', 'data' => $balance]);
    }
}
