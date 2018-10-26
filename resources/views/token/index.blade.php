@extends('layout.app')
@section('content')
    <div data-v-1fd0f8d0="" class="vcontainer page" style="min-height: 812px!important;">
        <div data-v-1fd0f8d0="" class="header">
            <span data-v-1fd0f8d0="" class="name">合约地址</span>
            <span data-v-1fd0f8d0="" class="address">{{$address}}</span></div>
        <div data-v-1fd0f8d0="" class="main">
            <h4 data-v-1fd0f8d0="" class="vfs-18 vcolor-192330 mobile-padding">基本信息</h4>
            <div data-v-1fd0f8d0="" class="vshadow d-block d-lg-flex baseinfo">
                <div data-v-1fd0f8d0="" class="detail" style="width:100%">
                    <div data-v-1fd0f8d0="" class="vflex-between-center vborder-b balance">
                        <span data-v-1fd0f8d0="" class="vfs-12 vfw-500 vcolor-192330">通证名称</span>
                        <div data-v-1fd0f8d0="">
                            <span data-v-1fd0f8d0="" class="vfs-20 vcolor-52cbca">{{$token->token_name}}</span>
                            <span data-v-1fd0f8d0="" class="vfs-20 vcolor-192330 vpl-5">&nbsp;</span>
                        </div>
                    </div>
                    <div data-v-1fd0f8d0="" class="vflex-between-center vborder-b balance">
                        <span data-v-1fd0f8d0="" class="vfs-12 vfw-500 vcolor-192330">通证符号</span>
                        <div data-v-1fd0f8d0="">
                            <span data-v-1fd0f8d0="" class="vfs-20 vcolor-52cbca">{{$token->token_symbol}}</span>
                            <span data-v-1fd0f8d0="" class="vfs-20 vcolor-192330 vpl-5">&nbsp;</span>
                        </div>
                    </div>
                    <div data-v-1fd0f8d0="" class="vflex-between-center vborder-b balance">
                        <span data-v-1fd0f8d0="" class="vfs-12 vfw-500 vcolor-192330">小数位数</span>
                        <div data-v-1fd0f8d0="">
                            <span data-v-1fd0f8d0="" class="vfs-20 vcolor-52cbca">{{$decimals}}</span>
                            <span data-v-1fd0f8d0="" class="vfs-20 vcolor-192330 vpl-5">&nbsp;</span>
                        </div>
                    </div>
                    <div data-v-1fd0f8d0="" class="vflex-between-center vborder-b balance">
                        <span data-v-1fd0f8d0="" class="vfs-12 vfw-500 vcolor-192330">通证总量</span>
                        <div data-v-1fd0f8d0="">
                            <span data-v-1fd0f8d0="" class="vfs-20 vcolor-52cbca">{{$result . " " . $token->token_symbol}}</span>
                            <span data-v-1fd0f8d0="" class="vfs-20 vcolor-192330 vpl-5">&nbsp;</span></div>
                    </div>
                </div>
            </div>

            <div data-v-cd5b40a0="" id="block-trade-detail" class="tradedetail" style="padding-bottom: 30px;">
                <div data-v-cd5b40a0="" class="top">
                    <span data-v-cd5b40a0="" class="title">交易明细</span>
                </div>
                <div>
                    <table aria-busy="false" aria-colcount="4" class="vtable vshadow table b-table">
                        <thead class="">
                        <tr>
                            <th aria-colindex="1" class="">hash</th>
                            <th aria-colindex="2" class="time-label pc-hash" style="text-align: center;">交易时间</th>
                            <th aria-colindex="3" class="">来源</th>
                            <th aria-colindex="4" class="pc-hash">接收</th>
                            <th aria-colindex="5" class="pc-hash">数量</th>
                            <th aria-colindex="4" class="web-hash">接收</th>
                            <th aria-colindex="5" class="web-hash">数量</th>
                        </tr>
                        </thead>
                        <!---->
                        <tbody class="">
                        @foreach($tx as $item)
                            <tr class="">
                                <td aria-colindex="1" class="pc-hash">
                                    <a href="/tx/{{$item['hash']}}" class="text3">{{$item['hash']}}</a>
                                </td>
                                <td aria-colindex="1" class="web-hash">
                                    <a href="/tx/{{$item['hash']}}" class="text3">{{mb_substr($item['hash'],0,10,'utf-8')}}...</a>
                                </td>
                                <td aria-colindex="2" class="pc-hash">
                                    <span class="block-time" style="text-align: center;">{{$item['created_at']}}</span>
                                </td>
                                <td aria-colindex="3" class="pc-hash">
                                    <a href="/address/{{$item['from_address']}}" class="text3 vtext-monospace">{{mb_substr($item['from_address'],0,30,'utf-8')}}...</a>
                                </td>
                                <td aria-colindex="4" class="pc-hash">
                                    <a href="/address/{{$item['to_address']}}" class="text3 vtext-monospace">{{mb_substr($item['to_address'],0,30,'utf-8')}}...</a>
                                </td>
                                <td aria-colindex="3" class="web-hash">
                                    <a href="/address/{{$item['from_address']}}" class="text3 vtext-monospace">{{mb_substr($item['from_address'],0,5,'utf-8')}}...</a>
                                </td>
                                <td aria-colindex="4" class="web-hash">
                                    <a href="/address/{{$item['to_address']}}" class="text3 vtext-monospace">{{mb_substr($item['to_address'],0,5,'utf-8')}}...</a>
                                </td>
                                <td aria-colindex="5" class="">{{float_format($item['amount'])}}</td>
                            </tr>
                        @endforeach
                        </tbody>
                    </table>
                </div>
                <div style="display: flex;justify-content: space-between;padding: 0 5px;">
                    <div style="font-size: 14px;">当前第{{$tx->currentPage()}}页</div>
                    {{$tx->links('vendor.pagination.bootstrap-4')}}
                </div>
            </div>

        </div>
    </div>

@stop