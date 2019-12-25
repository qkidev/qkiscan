@extends('layout.app')
@section('content')

    <div class="vcontainer page">
            <div data-v-cd5b40a0="" id="block-trade-detail" class="tradedetail">
                <ul data-v-cd5b40a0="" class="middle">
                    @foreach($bps as $bp=>$v)
                        <a href="/address/{{$bp}}" style="color: #52cbca;">
                            <li data-v-cd5b40a0="" class="item vshadow">
                                <div data-v-8701ced6="" data-v-cd5b40a0="" class="tx-detail">
                                    <div data-v-8701ced6="" class="hash-section">
                                        <span style="margin-left:10px;">{{$bp}}</span>
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