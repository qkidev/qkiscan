@extends('layout.app')
@section('content')

    <div class="page">
        <div class="vcontainer">
            <div class="panel-block">
                <div class="clearfix panel-header">
                    <span class="float-left" style="margin-right: 20px">最近出块</span>
                    <span class="float-left" style="margin-right: 20px">累计交易笔数:{{$transactions_num}}</span>
                    <span class="float-left" style="margin-right: 20px">有余额地址数:{{$address_num}}</span>
                    <span class="float-left" style="margin-right: 20px">累计区块数:{{$max_height}}</span>
                    <span class="float-left" style="margin-right: 20px">最近24小时交易笔数:{{$hour_24_num}}</span>
                    <a href="/block" class="float-right">查看更多</a></div>
                <div>
                    <table aria-busy="false" aria-colcount="4" class="vtable vshadow table b-table">
                        <thead class="">
                        <tr>
                            <th aria-colindex="1" class="">区块高度</th>
                            <th aria-colindex="2" class="time-label" style="text-align: center;">出块时间</th>
                            <th aria-colindex="3" class="pc-hash">交易数量</th>
                            <th aria-colindex="4" class="">大小(KB)</th>
                            <th aria-colindex="5" class="pc-hash">gas上限</th>
                            <th aria-colindex="6" class="pc-hash">出块方</th>
                            <th aria-colindex="7" class="">区块Hash</th></tr>
                        </thead>
                        <!---->
                        <tbody class="">
                            @foreach($block as $item)
                                <tr class="">
                                    <td aria-colindex="1" class="">
                                        <a href="/block/detail?hash={{$item['hash']}}" class="text3">{{$item['height']}}</a>
                                    <td aria-colindex="2" class="">
                                        <span class="block-time" style="text-align: center;">{{$item['created_at']}}</span>
                                    </td>
                                    <td aria-colindex="3" class="pc-hash">{{$item['tx_count']}}</td>
                                    <td aria-colindex="4" class="">{{$item['size']}}</td>
                                    <td aria-colindex="5" class="pc-hash">{{$item['gasLimit']}}</td>
                                    <td aria-colindex="6" class="pc-hash">
                                        <a href="/address/{{$item['miner']}}" class="text3 vtext-monospace">{{$item['miner']}}</a>
                                    </td>
                                    <td aria-colindex="7" class="pc-hash">
                                        <a href="/block/detail?hash={{$item['hash']}}" class="text3 vtext-monospace">{{$item['hash']}}</a>
                                    </td>
                                    <td aria-colindex="7" class="web-hash">
                                        <a href="/block/detail?hash={{$item['hash']}}" class="text3 vtext-monospace">{{mb_substr($item['hash'],0,12,'utf-8')}}</a>
                                    </td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
@stop
