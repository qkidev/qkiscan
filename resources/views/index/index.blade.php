@extends('layout.app')
@section('content')

    <div class="page">
        <div class="vcontainer">
            <div class="panel-block">
                <div class="clearfix panel-header">
                    <span class="float-left">最近出块</span>
                    <a href="/block" class="float-right">查看更多</a></div>
                <div>
                    <table aria-busy="false" aria-colcount="4" class="vtable vshadow table b-table">
                        <thead class="">
                        <tr>
                            <th aria-colindex="1" class="">区块高度</th>
                            <th aria-colindex="2" class="time-label" style="text-align: center;">出块时间</th>
                            <th aria-colindex="3" class="">交易数量</th>
                            <th aria-colindex="4" class="">区块Hash</th></tr>
                        </thead>
                        <!---->
                        <tbody class="">
                            @foreach($list as $item)
                                <tr class="">
                                    <td aria-colindex="1" class="">
                                        <a href="/block/detail?hash={{$item->hash_id}}" class="text3">{{$item->height}}</a>
                                    <td aria-colindex="2" class="">
                                        <span class="block-time" style="text-align: center;">{{$item->created_at}}</span>
                                    </td>
                                    <td aria-colindex="3" class="">{{$item->tx_count}}</td>
                                    <td aria-colindex="4" class="pc-hash">
                                        <a href="/block/detail?hash={{$item->hash_id}}" class="text3 vtext-monospace">{{$item->hash_id}}</a>
                                    </td>
                                    <td aria-colindex="4" class="web-hash">
                                        <a href="/block/detail?hash={{$item->hash_id}}" class="text3 vtext-monospace">{{mb_substr($item->hash_id,0,18,'utf-8')}}</a>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="panel-network row">
                <div class="panel col-12 col-lg-12">
                    <div class="clearfix panel-header">
                        <span class="float-left">全网数据</span></div>
                    <div class="row panel-container">
                        <div class="inner-panel col-12 col-lg-12 collapsed-padding">
                            <ul class="vsection vshadow">
                                <li class="item">
                                    <span class="text2 strong">全网算力</span>
                                    <span class="text2">{{$total_power}}万</span>
                                </li>
                                <li class="item">
                                    <span class="text2 strong">总积分数</span>
                                    <span class="text2">{{$amount}}万 QKI</span>
                                </li>
                                <li class="item">
                                    <span class="text2 strong">有积分的地址数</span>
                                    <span class="text2">{{$address_available}}</span>
                                </li>
                                <li class="item">
                                    <span class="text2 strong">总节点数</span>
                                    <span class="text2">{{$node_num}}</span>
                                </li>
                                <li class="item">
                                    <span class="text2 strong">总用户数</span>
                                    <span class="text2">{{$user_num}}</span>
                                </li>
                                <li class="item">
                                    <span class="text2 strong">总冻结数</span>
                                    <span class="text2">{{$freeze_amount}}万 QKI</span>
                                </li>
                                <li class="item">
                                    <span class="text2 strong">24小时交易笔数</span>
                                    <span class="text2">{{$transaction_num}}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@stop
