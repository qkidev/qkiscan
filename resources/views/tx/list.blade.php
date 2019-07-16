@extends('layout.app')
@section('content')

    <div class="vcontainer page">
            <div data-v-cd5b40a0="" id="block-trade-detail" class="tradedetail">
                <div data-v-cd5b40a0="" class="top">
                    <span data-v-cd5b40a0="" class="title">最近交易</span>
                    <span data-v-cd5b40a0="">
                                    <span data-v-cd5b40a0="" class="txcount">共 {{$transactions->total()}}笔</span>
                    </span>
                    <span data-v-cd5b40a0="" class="title" style="cursor: pointer;float: right;color: {{$type==1?'grey':'black'}}" onclick="getData(2)">通证交易</span>
                    <span data-v-cd5b40a0="" class="title" style="cursor: pointer;float: right;margin-right: 15px;color: {{$type==2?'grey':'black'}}" onclick="getData(1)">QKI交易</span>
                </div>
                <ul data-v-cd5b40a0="" class="middle">
                    @foreach($transactions as $v)
                    <li data-v-cd5b40a0="" class="item vshadow">
                        <div data-v-8701ced6="" data-v-cd5b40a0="" class="tx-detail">
                            <div data-v-8701ced6="" class="hash-section">
                                <i data-v-8701ced6="" class="vicon icon-hash d-none d-lg-inline-block"></i>
                                <a data-v-8701ced6="" href="/tx/{{$v['hash']}}" class="hash font-hash-title">
                                    <span data-v-8701ced6="" class="d-lg-inline-block">{{$v['hash']}}</span>
                                </a>
                                <span style="margin-left:10px;">{{$v['created_at']}}</span>
                                <span data-v-8701ced6="" class="output font-coin-title"> {{float_format($v['amount'])}} QKI</span>
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
<script>
    function getData($type) {
        location.href = '/tx-list/'+$type;
    }
</script>