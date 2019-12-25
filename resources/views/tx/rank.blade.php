@extends('layout.app')
@section('content')

    <div class="vcontainer page">
            <div data-v-cd5b40a0="" id="block-trade-detail" class="tradedetail">
                <ul data-v-cd5b40a0="" class="middle">
                    @foreach($transactions as $k=>$v)
                        <a href="/address/{{$v['address']['address']}}" style="color: #52cbca;">
                            <li data-v-cd5b40a0="" class="item vshadow">
                                <div data-v-8701ced6="" data-v-cd5b40a0="" class="tx-detail">
                                    <div data-v-8701ced6="" class="hash-section">
                                        <span style="margin-left:10px;font-size: 20px;font-weight: bold">{{$k+1}}</span>
                                        <span style="margin-left:10px;">{{$v['address']['address']}}</span>
                                        <span data-v-8701ced6="" class="output font-coin-title"> {{float_format($v['amount'])}} {{strtoupper($v['name'])}}</span>
                                    </div>

                                </div>
                            </li>
                        </a>
                    @endforeach
                </ul>
            </div>
        </div>
    </div>

@stop