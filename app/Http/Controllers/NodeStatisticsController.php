<?php

namespace App\Http\Controllers;

use App\Models\NodeStatistics;
use Illuminate\Http\Request;

class NodeStatisticsController extends Controller
{

    /**
     * 节点列表
     * @param Request $request
     * @param $address
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\Http\RedirectResponse|\Illuminate\View\View
     */
    public function index(Request $request)
    {
        $data['nodes'] = NodeStatistics::orderBy("updated_at", "desc")->paginate($request->per_page ?: 20);
        return view("node-statistics.index", $data);
    }


    /**
     * 节点详情
     *
     * @param $node_id
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function show($node_id)
    {
        $data = NodeStatistics::where('node_id', $node_id)->first();
        return view("node-statistics.detail", $data);
    }

}
