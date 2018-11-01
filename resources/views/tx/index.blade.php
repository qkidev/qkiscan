@extends('layout.app')
@section('content')
    <div data-v-0c97b89a="" class="vcontainer page">
        <div data-v-0c97b89a="" class="header d-block d-lg-flex">
            <span data-v-0c97b89a="" class="name">交易</span>
            <span data-v-0c97b89a="" class="hash d-block d-lg-inline-block">{{$hash}}</span></div>
        <div data-v-0c97b89a="" class="base">
            <p data-v-0c97b89a="" class="title mobile-padding">基本信息</p>
            <div data-v-0c97b89a="" class="d-block d-lg-flex vshadow">
                <ul data-v-0c97b89a="" class="vsection base-left">
                    <li data-v-0c97b89a="" class="item">
                        <span data-v-0c97b89a="" class="text2 strong">高度</span>
                        <div data-v-0c97b89a="">
                            <a data-v-0c97b89a="" href="/block/detail?hash={{$blockHash}}" class="vcolor-52cbca">{{$blockNumber}}</a>
                        </div>
                    </li>
                    <li data-v-0c97b89a="" class="item">
                        <span data-v-0c97b89a="" class="text2 strong">gas</span>
                        <span data-v-0c97b89a="" id="hash-time" class="text2" data-original-title="" title="">{{$gas}}</span>

                    </li>
                    <li data-v-0c97b89a="" class="item">
                        <span data-v-0c97b89a="" class="text2 strong">金额</span>
                        <span data-v-0c97b89a="" class="text2" data-original-title="" title="" style="padding-left: 170px;">{{$value}}</span>
                    </li>

                </ul>
                <ul data-v-0c97b89a="" class="vsection base-right">
                    <li data-v-0c97b89a="" class="item">
                        <span data-v-0c97b89a="" class="text2 strong">来源</span>
                        <span data-v-0c97b89a="" class="text2"><a data-v-0c97b89a="" href="/address/{{$from}}" class="hash font-hash-content">{{$from}}</a></span></li>
                    <li data-v-0c97b89a="" class="item">
                        <span data-v-0c97b89a="" class="text2 strong">接收</span>
                        <span data-v-0c97b89a="" class="text2"><a data-v-0c97b89a="" href="/address/{{$to}}" class="hash font-hash-content">{{$to}}</a></span></li>
                    <li data-v-0c97b89a="" class="item">
                        <span data-v-0c97b89a="" class="text2 strong">input</span>
                        <textarea class="form-control" rows="1" readonly style="width: 65%; min-width: 278px; max-width: 324px">{{ $input }}</textarea>
                    </li>

                </ul>
            </div>
        </div>
        @if($is_token_tx)
            <div data-v-0c97b89a="" class="base">
                <p data-v-0c97b89a="" class="title mobile-padding">通证交易</p>
                <div data-v-0c97b89a="" class="d-block d-lg-flex vshadow">
                    <ul data-v-0c97b89a="" class="vsection base-left">
                        <li data-v-0c97b89a="" class="item">
                            <span data-v-0c97b89a="" class="text2 strong">金额</span>
                            <span data-v-0c97b89a="" class="text2" data-original-title="" title="" style="padding-left: 170px;">{{$token_tx_amount}}</span>
                        </li>
                        <li data-v-0c97b89a="" class="item">
                            <span data-v-0c97b89a="" class="text2 strong">来源</span>
                            <span data-v-0c97b89a="" class="text2"><a data-v-0c97b89a="" href="/address/{{$from}}" class="hash font-hash-content">{{$from}}</a></span></li>
                        <li data-v-0c97b89a="" class="item">
                            <span data-v-0c97b89a="" class="text2 strong">接收</span>
                            <span data-v-0c97b89a="" class="text2"><a data-v-0c97b89a="" href="/address/{{$token_tx_to}}" class="hash font-hash-content">{{$token_tx_to}}</a></span></li>

                    </ul>
                    <ul data-v-0c97b89a="" class="vsection base-right">
                        <li data-v-0c97b89a="" class="item">
                            <span data-v-0c97b89a="" class="text2 strong">通证名称</span>
                            <span data-v-0c97b89a="" class="text2" data-original-title="" title="" style="padding-left: 170px;">{{$token->token_name}}</span>
                        </li>
                        <li data-v-0c97b89a="" class="item">
                            <span data-v-0c97b89a="" class="text2 strong">通证符号</span>
                            <span data-v-0c97b89a="" class="text2" data-original-title="" title="" style="padding-left: 170px;">{{$token->token_symbol}}</span>
                        </li>

                        <li data-v-0c97b89a="" class="item">
                            <span data-v-0c97b89a="" class="text2 strong">合约地址</span>
                            <span data-v-0c97b89a="" class="text2"><a data-v-0c97b89a="" href="/token/{{$token->contract_address}}" class="hash font-hash-content">{{$token->contract_address}}</a></span>
                        </li>
                    </ul>
                </div>
            </div>
        @endif


    </div>

@stop