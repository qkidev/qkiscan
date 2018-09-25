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
                        <span data-v-0c97b89a="" class="text2">{{$from}}</span></li>
                    <li data-v-0c97b89a="" class="item">
                        <span data-v-0c97b89a="" class="text2 strong">接收</span>
                        <span data-v-0c97b89a="" class="text2">{{$to}}</span></li>

                </ul>
            </div>
        </div>


    </div>

@stop