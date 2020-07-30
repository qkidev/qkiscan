<?php

namespace App\Http\Controllers;

use App\Models\Balances;
use App\Models\NodeStatistics;
use App\Models\Token;
use App\Models\TokenTx;
use App\Services\NodeService;
use App\Services\RpcService;
use ERC20\ERC20;
use EthereumRPC\EthereumRPC;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class NodeStatisticsController extends Controller
{
    /**
     * 合约地址
     * @param Request $request
     * @param $address
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\Http\RedirectResponse|\Illuminate\View\View
     */
    public function index(Request $request)
    {
        $data['nodes'] = NodeStatistics::orderBy("updated_at", "desc")->paginate($request->per_page ?: 20);
        return view("node-statistics.index", $data);
    }


}
