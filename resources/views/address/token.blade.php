@extends('layout.app')
@section('content')
    <div data-v-1fd0f8d0="" class="vcontainer page" style="min-height: 812px!important;">
        <div data-v-1fd0f8d0="" class="header">
            <span data-v-1fd0f8d0="" class="name">地址</span>
            <span data-v-1fd0f8d0="" class="address">{{$address->address}}</span>
        </div>

        <div data-v-1fd0f8d0="" class="main">
            <h4 data-v-1fd0f8d0="" class="vfs-18 vcolor-192330 mobile-padding">通证</h4>
            <div data-v-1fd0f8d0="" class="vshadow d-block d-lg-flex baseinfo">
                <div data-v-1fd0f8d0="" class="detail" style="width:100%">
                    @foreach($address->balances as $balance)
                    <div data-v-1fd0f8d0="" class="vflex-between-center vborder-b balance">
                        <span data-v-1fd0f8d0="" class="vfs-12 vfw-500 vcolor-192330">{{strtoupper($balance->name)}}</span>
                        <div data-v-1fd0f8d0="">
                            <span data-v-1fd0f8d0="" class="vfs-20 vcolor-52cbca">{{number_format($balance->amount, 8)}}</span>
                        </div>
                    </div>
                    @endforeach
                </div>
            </div>

            <div data-v-cd5b40a0="" id="block-trade-detail" class="tradedetail" style="padding-bottom: 30px;">

                <div class="btn-group" role="group" >
                    <a href="/address/{{$address->address}}" class="btn btn-secondary">交易明细</a>
                    <button type="button" class="btn btn-info">通证明细</button>
                </div>
                <br>

                <div class="table-responsive bg-white" style="margin-top: 10px">
                    <table class="table table-hover">
                        <thead>
                        <tr>
                            <th width="10%">交易哈希值</th>
                            <th>时间</th>
                            <th>发送方</th>
                            <th>进/出</th>
                            <th>接收方</th>
                            <th>价值</th>
                            <th>通证</th>
                        </tr>
                        </thead>
                        <tbody>
                        @foreach($txs as $v)
                            <tr>
                                <td width="10%">
                                    <a href="/tx/{{$v['transaction']['hash']}}" title="{{$v['transaction']['hash']}}" class="hash font-hash-title">
                                        {{str_limit($v['transaction']['hash'],15)}}
                                    </a>
                                </td>
                                <td>{{formatTime($v['created_at'],2)}}</td>
                                <td>
                                    <a href="/address/{{$v['transaction']['from']}}" title="{{$v['transaction']['from']}}" class="hash font-hash-title">
                                        {{str_limit($v['transaction']['from'],15)}}
                                    </a>
                                </td>
                                <td>
                                    @if($v['transaction']['from'] == $address->address)
                                        <span class="badge badge-warning">出</span>
                                    @else
                                        <span class="badge badge-success">进</span>
                                    @endif
                                </td>
                                <td>
                                    @if(!empty($v['transaction']['payee']))
                                        <a href="/address/{{$v['transaction']['payee']}}"
                                           title="{{$v['transaction']['payee']}}" class="hash font-hash-title">
                                            {{str_limit($v['transaction']['payee'],15)}}
                                        </a>
                                    @else
                                        <a href="/address/{{$v['transaction']['to']}}"
                                           title="{{$v['transaction']['to']}}" class="hash font-hash-title">
                                            {{str_limit($v['transaction']['to'],15)}}
                                        </a>
                                    @endif
                                </td>
                                <td class="text-right">{{float_format($v['amount'])}}</td>
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

                    <div style="display: flex;justify-content: space-between;padding: 0 5px;">
                        <div style="font-size: 14px;">当前第{{$txs->currentPage()}}页</div>
                        {{$txs->links('vendor.pagination.bootstrap-4')}}
                    </div>
                </div>



            </div>

        </div>
    </div>

@stop