@extends('layout.app')
@section('content')
    <div data-v-0c97b89a="" class="vcontainer page">
        <div data-v-0c97b89a="" class="header d-block d-lg-flex">
            <span data-v-0c97b89a="" class="name">通证交易</span>
            <span data-v-0c97b89a="" class="hash d-block d-lg-inline-block">{{$tx->hash}}</span></div>
        <div data-v-0c97b89a="" class="base">
            <p data-v-0c97b89a="" class="title mobile-padding">基本信息</p>
            <div data-v-0c97b89a="" class="d-block d-lg-flex vshadow">
                <ul data-v-0c97b89a="" class="vsection base-left">
                    <li data-v-0c97b89a="" class="item">
                        <span data-v-0c97b89a="" class="text2 strong">合约地址</span>
                        <div data-v-0c97b89a="">
                            <a data-v-0c97b89a="" href="/token/{{$tx->contract_address}}" class="vcolor-52cbca">{{$tx->contract_address}}</a>
                        </div>
                    </li>
                    <li data-v-0c97b89a="" class="item">
                        <span data-v-0c97b89a="" class="text2 strong">数量</span>
                        <span data-v-0c97b89a="" class="text2" data-original-title="" title="" style="padding-left: 170px;">{{$tx->amount . " " . $tx->token_symbol}}</span>
                    </li>

                </ul>
                <ul data-v-0c97b89a="" class="vsection base-right">
                    <li data-v-0c97b89a="" class="item">
                        <span data-v-0c97b89a="" class="text2 strong">来源</span>
                        <span data-v-0c97b89a="" class="text2"><a data-v-0c97b89a="" href="/address/{{$tx->from_address}}" class="hash font-hash-content">{{$tx->from_address}}</a></span></li>
                    <li data-v-0c97b89a="" class="item">
                        <span data-v-0c97b89a="" class="text2 strong">接收</span>
                        <span data-v-0c97b89a="" class="text2"><a data-v-0c97b89a="" href="/address/{{$tx->to_address}}" class="hash font-hash-content">{{$tx->to_address}}</a></span></li>

                </ul>
            </div>
        </div>

    </div>

@stop