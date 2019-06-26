@extends('layout.app')
@section('content')

    <div class="vcontainer page">
            <div data-v-cd5b40a0="" id="block-trade-detail" class="tradedetail">
                <div data-v-cd5b40a0="" class="top">
                    <span data-v-cd5b40a0="" class="title">CCT排行榜</span>
                    <span data-v-cd5b40a0="">
                                    <span data-v-cd5b40a0="" class="txcount">共 {{$transactions->total()}}笔</span>
                    </span>
                </div>
                <ul data-v-cd5b40a0="" class="middle">
                    @foreach($transactions as $v)
                    <li data-v-cd5b40a0="" class="item vshadow">
                        <div data-v-8701ced6="" data-v-cd5b40a0="" class="tx-detail">
                            <div data-v-8701ced6="" class="hash-section">
                                <i data-v-8701ced6="" class="vicon icon-hash d-none d-lg-inline-block"></i>
                                <span style="margin-left:10px;">{{$v['created_at']}}</span>
                                <span data-v-8701ced6="" class="output font-coin-title"> {{float_format($v['cct'])}} CCT</span>
                                <!----></div>

                        </div>
                    </li>
                    @endforeach
                </ul>
                <div data-v-cd5b40a0="" class="bottom">
                    {{$transactions->links()}}
                </div>
            </div>
        </div>
    </div>

@stop