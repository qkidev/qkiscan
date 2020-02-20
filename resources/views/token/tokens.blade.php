@extends('layout.app')
@section('content')
    <div data-v-1fd0f8d0="" class="vcontainer page" style="min-height: 812px!important;">
        <div data-v-1fd0f8d0="" class="header">
            <span data-v-1fd0f8d0="" class="name">通证列表</span></div>
        <div data-v-1fd0f8d0="" class="main">


            <div data-v-cd5b40a0="" id="block-trade-detail" class="tradedetail" style="padding-bottom: 30px;">
                <div data-v-cd5b40a0="" class="top">
                    <span data-v-cd5b40a0="" class="title">TOP100</span>
                </div>
                <div>
                    <table aria-busy="false" aria-colcount="4" class="vtable vshadow table b-table">
                        <thead class="">
                        <tr>
                            <th aria-colindex="1" class="">排名</th>
                            <th aria-colindex="1" class="">地址</th>
                            <th aria-colindex="1" class="">数量</th>
                            <th aria-colindex="1" class="">持有地址数</th>
                        </tr>
                        </thead>
                        <tbody class="">
                        @foreach($tokens as $k => $token)
                            <tr class="">
                                <td aria-colindex="1" class="">
                                    {{($k+1)}}
                                </td>
                                <td aria-colindex="1" class="">
                                    <a href="/token/{{$token['contract_address']}}/" class="text3">{{$token['token_symbol']}}</a>
                                </td>
                                <td aria-colindex="1" class="">
                                    <span class="block-time">{{$token['token_symbol']}}</span>
                                </td>
                                <td aria-colindex="1" class="">
                                    <span class="block-time">{{$token['holders']}}</span>
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
