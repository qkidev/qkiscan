@extends('layout.app')
@section('content')

    <div class="vcontainer page">
        <div data-v-cd5b40a0="" class="header d-block d-lg-flex">
            <span data-v-cd5b40a0="" class="block">区块</span>
            <span data-v-cd5b40a0="" class="height">{{$data['info']->height}}</span>
            <span data-v-cd5b40a0="" class="fork">
                            <!----></span>
            <span data-v-cd5b40a0="" class="desc d-block d-lg-inline-block">
                <span data-v-cd5b40a0="" class="d-lg-inline-block">块哈希&nbsp;&nbsp;&nbsp;&nbsp;</span>{{$data['info']->hash_id}}</span></div>
        <div data-v-cd5b40a0="" class="main">
            <div data-v-cd5b40a0="" class="baseinfo">
                <div data-v-cd5b40a0="" class="title font-info-title">基本信息</div>
                <div data-v-cd5b40a0="" class="vshadow d-block d-lg-flex">
                    <div data-v-cd5b40a0="" class="left" style="width:100%;padding-right:20px;">
                        <ul data-v-cd5b40a0="" class="vsection">
                            <li data-v-cd5b40a0="" class="item">
                                <span data-v-cd5b40a0="" class="vcolor-192330 strong">高度</span>
                                <div data-v-cd5b40a0="">
                                    <span data-v-cd5b40a0="" class="vcolor-192330">{{$data['info']->height}}</span>
                                </div>
                            </li>
                            <li data-v-cd5b40a0="" class="item">
                                <span data-v-cd5b40a0="" class="vcolor-192330 strong">时间</span>
                                <span data-v-cd5b40a0="" id="block-time" class="vcolor-192330" data-original-title="" title="">{{$data['info']->created_at}}</span>

                            </li>

                            <li data-v-cd5b40a0="" class="item">
                                <span data-v-cd5b40a0="" class="vcolor-192330 strong">笔数</span>
                                <span data-v-cd5b40a0="" class="vcolor-192330">{{$data['info']->tx_count}}</span></li>

                        </ul>
                    </div>

                </div>
            </div>
            <div data-v-cd5b40a0="" id="block-trade-detail" class="tradedetail">
                <div data-v-cd5b40a0="" class="top">
                    <span data-v-cd5b40a0="" class="title">交易明细</span>
                    <span data-v-cd5b40a0="">
                                    <span data-v-cd5b40a0="" class="txcount">共 {{$data['info']->tx_count}}笔</span>
                    <div class="float-right">
                        {!! $data['transaction']->appends(['hash'=>$_GET['hash']])->render() !!}

                    </div>

                </div>
                <ul data-v-cd5b40a0="" class="middle">
                    @foreach($data['transaction'] as $v)
                    <li data-v-cd5b40a0="" class="item vshadow">
                        <div data-v-8701ced6="" data-v-cd5b40a0="" class="tx-detail">
                            <div data-v-8701ced6="" class="hash-section">
                                <i data-v-8701ced6="" class="vicon icon-hash d-none d-lg-inline-block"></i>
                                <a data-v-8701ced6="" href="/tx/{{$v->tx_hash}}" class="hash font-hash-title">

                                    <span data-v-8701ced6="" class="d-lg-inline-block">{{$v->tx_hash}}</span></a>
                                <span data-v-8701ced6="" class="output font-coin-title"> {{$v->total_amount}} QKI</span>
                                <!----></div>

                        </div>
                    </li>
                    @endforeach

                </ul>
                <div data-v-cd5b40a0="" class="bottom">
                    {!! $data['transaction']->appends(['hash'=>$_GET['hash']])->render() !!}

                </div>
            </div>
        </div>
    </div>

@stop