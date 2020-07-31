@extends('layout.app')
@section('content')
    <div data-v-1fd0f8d0="" class="vcontainer page" style="min-height: 812px!important;width: 1500px">
        <div data-v-1fd0f8d0="" class="header">
            <span data-v-1fd0f8d0="" class="name">节点统计列表 <small>(总节点数:{{$nodes->total()}})</small></span>
        </div>
        <div data-v-1fd0f8d0="" class="main">
            <div data-v-cd5b40a0="" id="block-trade-detail" class="tradedetail" style="padding-bottom: 30px;">
                <div>
                    <table aria-busy="false" aria-colcount="4" class="vtable vshadow table b-table">
                        <thead class="">
                        <tr>
                            <th aria-colindex="1" class="">节点ID</th>
                            <th aria-colindex="2" class="">IP地址</th>
                            <th aria-colindex="3" class="">端口</th>
                            <th aria-colindex="4" class="">操作系统</th>
                            <th aria-colindex="5" class="">支持协议</th>
{{--                            <th aria-colindex="6" class="">网络ID</th>--}}
                            <th aria-colindex="7" class="">当前同步的高度</th>
{{--                            <th aria-colindex="8" class="">创世区块高度</th>--}}
                            <th aria-colindex="9" class="">协议版本</th>
                        </tr>
                        </thead>
                        <tbody class="">
                        @foreach($nodes as $k => $node)
                            <tr class="">
                                <td aria-colindex="1" class="">
                                   <a href="/node-statistics/{{$node['node_id']}}" style="color: #000000">{{$node['node_id']}}</a>
                                </td>
                                <td aria-colindex="2" class="">
                                    <span class="block-time">{{$node['ip']}}</span>
                                </td>
                                <td aria-colindex="3" class="">
                                    <span class="block-time">{{$node['port']}}</span>
                                </td>
                                <td aria-colindex="4" class="">
                                    <span class="block-time">{{$node['os']}}</span>
                                </td>
                                <td aria-colindex="5" class="">
                                    @foreach($node['protocol'] as $k_p => $protocol)
                                        <span class="block-time"> {{replaceStr($protocol)}}  </span>
                                    @endforeach
                                </td>
{{--                                <td aria-colindex="6" class="">--}}
{{--                                    <span class="block-time">{{$node['network_id']}}</span>--}}
{{--                                </td>--}}
                                <td aria-colindex="7" class="">
                                    <span class="block-time">{{$node['currentBlock']}}</span>
                                </td>
{{--                                <td aria-colindex="8" class="">--}}
{{--                                    <span class="block-time">{{$node['genesis_block_hash']}}</span>--}}
{{--                                </td>--}}
                                <td aria-colindex="9" class="">
                                    <span class="block-time">{{$node['protocol_version']}}</span>
                                </td>
                                </td>
                            </tr>
                        @endforeach
                        </tbody>
                    </table>

                    <div class="pull-right paginate" style="float: right;width: 50%;margin-top: 30px">
                        {{ $nodes->links() }}
                    </div>
                </div>
            </div>

        </div>
    </div>
@stop
