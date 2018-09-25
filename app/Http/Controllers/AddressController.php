<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Services\RpcService;

class AddressController extends Controller
{
    /**
     * 地址详情
     * @param $address
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index($address)
    {

        $RpcService = new RpcService();

        $params = [$address,"latest"];

        $data = $RpcService->rpc("eth_getBalance",$params);

        return view("address.index");
    }
}
