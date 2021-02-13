@extends('layout.app')
@section('content')

    <div class="vcontainer page">
        <div data-v-1fd0f8d0="" class="header">
            <span data-v-1fd0f8d0="" class="name">公共rpc节点</span>
            <span data-v-1fd0f8d0="" class="address">统计节点在线率</span>
        </div>
        <div data-v-1fd0f8d0="" class="main">


            <div data-v-cd5b40a0="" id="block-trade-detail" class="tradedetail" style="padding-bottom: 30px;">
                <div data-v-cd5b40a0="" class="top">
                    <span data-v-cd5b40a0="" class="title">TOP100</span>
                </div>
                <div>
                    <table aria-busy="false" aria-colcount="4" class="vtable vshadow table b-table">
                        <thead class="">
                        <tr>
                            <th aria-colindex="1" class="">名称</th>
                            <th aria-colindex="1" class="">url</th>
                            <th aria-colindex="1" class="">在线率</th>
                            <th aria-colindex="1" class="">上次在线时间</th>
                        </tr>
                        </thead>
                        <tbody class="">
                        @foreach($rpc_nodes as $k => $node)
                            <tr class="">
                                <td aria-colindex="1" class="">
                                    {{$node->name}}
                                </td>
                                <td aria-colindex="1" class="">
                                    {{$node->url}}
                                </td>
                                <td aria-colindex="1" class="">
                                    {{number_format($node->success/($node->success+$node->failure)*100,2)}}%
                                </td>
                                <td aria-colindex="1" class="">
                                    {{diffTimeStr($node->last_success_time)}}
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