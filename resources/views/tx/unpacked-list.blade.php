@extends('layout.app')
@section('content')

    <div class="vcontainer page">
            <div data-v-cd5b40a0="" id="block-trade-detail" class="tradedetail">
                <div data-v-cd5b40a0="" class="top">
                    <span data-v-cd5b40a0="" class="title">未打包Tx</span>
                </div>
                <ul data-v-cd5b40a0="" class="middle">
                    @foreach($transactions['pending'] as $value)
                        @foreach($value as $v)
                        <li data-v-cd5b40a0="" class="item vshadow">
                            <div data-v-8701ced6="" data-v-cd5b40a0="" class="tx-detail">
                                <div data-v-8701ced6="" class="hash-section">
                                    <i data-v-8701ced6="" class="vicon icon-hash d-none d-lg-inline-block"></i>
                                    <a data-v-8701ced6="" href="/tx/{{$v['hash']}}" class="hash font-hash-title">
                                        <span data-v-8701ced6="" class="d-lg-inline-block">{{$v['hash']}}</span>
                                    </a>
                                    <span data-v-8701ced6="" class="output font-coin-title"> {{float_format(bcdiv(base_convert($v['value'],16,10) ,gmp_pow(10,18),18))}} QKI</span>
                                    <!---->
                                </div>
                            </div>
                        </li>
                        @endforeach
                    @endforeach
                </ul>
            </div>

            <div data-v-cd5b40a0="" id="block-trade-detail" class="tradedetail">
                <div data-v-cd5b40a0="" class="top">
                    <span data-v-cd5b40a0="" class="title">无法打包Tx</span>
                </div>
                <ul data-v-cd5b40a0="" class="middle">
                    @foreach($transactions['queued'] as $value)
                        @foreach($value as $v)
                            <li data-v-cd5b40a0="" class="item vshadow">
                                <div data-v-8701ced6="" data-v-cd5b40a0="" class="tx-detail">
                                    <div data-v-8701ced6="" class="hash-section">
                                        <i data-v-8701ced6="" class="vicon icon-hash d-none d-lg-inline-block"></i>
                                        <a data-v-8701ced6="" href="/tx/{{$v['hash']}}" class="hash font-hash-title">
                                            <span data-v-8701ced6="" class="d-lg-inline-block">{{$v['hash']}}</span>
                                        </a>
                                        <span data-v-8701ced6="" class="output font-coin-title"> {{float_format(bcdiv(base_convert($v['value'],16,10) ,gmp_pow(10,18),18))}} QKI</span>
                                        <!---->
                                    </div>
                                </div>
                            </li>
                        @endforeach
                    @endforeach
                </ul>
            </div>
        </div>
    </div>

@stop
