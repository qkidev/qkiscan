<?php

namespace App\Http\Controllers;

use App\Model\Account;
use App\Model\Block;
use App\Model\MasterNode;
use App\Model\Transaction;
use App\Model\TxOut;
use App\Service\APIService;
use App\Service\SyncService;
use App\Services\RpcService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class IndexController extends Controller
{

    /**
     * 首页
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index()
    {
        $rpcService = new RpcService();
        $lastBlock = $rpcService->lastBlockHeightNumber();
        echo $lastBlock;
        exit();
        $lastBlock = base_convert($lastBlock,16,10);
        $blockString = $rpcService->getBlockString($lastBlock);
        $block = $rpcService->getBlockByNumber($blockString);
        $blockList = array();
        foreach ($block as $key => $item)
        {
            $blockList[$key] = $item['result'];
            $blockList[$key]['height'] = base_convert($blockList[$key]['number'],16,10);
            $blockList[$key]['created_at'] = date("Y-m-d H:i:s",base_convert($blockList[$key]['timestamp'],16,10)+28800);
            $blockList[$key]['tx_count'] = count($blockList[$key]['transactions']);
        }

        $data['block'] = $blockList;
        return view("index.index",$data);
    }

}
