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
                @if($type==1)
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
                @else
                <div class="table-responsive bg-white" style="margin-top: 10px">
                    <table class="table table-hover">
                        <thead>
                        <tr>
                            <th width="10%">交易哈希值</th>
                            <th>时间</th>
                            <th>发送方</th>
                            <th>接收方</th>
                            <th>数量</th>
                            <th>通证</th>
                        </tr>
                        </thead>
                        <tbody>
                        @foreach($transactions as $v)
                            <tr>
                                <td width="10%">
                                    <a href="/tx/{{$v['hash']}}" title="{{$v['hash']}}" class="hash font-hash-title">
                                        {{str_limit($v['hash'],15)}}
                                    </a>
                                </td>
                                <td>{{formatTime($v['created_at'],2)}}</td>
                                <td>
                                    <a href="/address/{{$v['from']}}" title="{{$v['from']}}" class="hash font-hash-title">
                                        {{str_limit($v['from'],15)}}
                                    </a>
                                </td>
                                <td>
                                    @if(!empty($v['payee']))
                                        <a href="/address/{{$v['payee']}}"
                                           title="{{$v['payee']}}" class="hash font-hash-title">
                                            {{str_limit($v['payee'],15)}}
                                        </a>
                                    @else
                                        <a href="/address/{{$v['to']}}"
                                           title="{{$v['to']}}" class="hash font-hash-title">
                                            {{str_limit($v['to'],15)}}
                                        </a>
                                    @endif
                                </td>
                                <td class="text-right">{{float_format($v['tokenTx']['amount'])}}</td>
                                <td>
                                    <a href="/token/{{$v['token']['contract_address']}}"
                                       title="{{$v['token']['token_symbol']}}" class="hash font-hash-title">
                                        {{strtoupper($v['token']['token_name'])}}
                                    </a>
                                </td>
                            </tr>
                        @endforeach
                        </tbody>
                    </table>
                </div>
                @endif
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