<?php

namespace App\Http\Controllers;


use App\Services\RpcService;
use Illuminate\Http\Request;

class BlockController extends Controller
{
    public function index()
    {

        return view("block.index");
    }

    /**
     * 区块详细页
     * @param Request $request
     * @param RpcService $rpcService
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function detail(Request $request, RpcService $rpcService)
    {
        $hash = $request->input('hash');
        if(!$hash)
        {
            return back();
        }
        $blockInfo = $rpcService->getBlockByHash($hash);
        dd($blockInfo);
        return view("block.detail");
    }




}
