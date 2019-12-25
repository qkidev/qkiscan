@extends('layout.app')
@section('content')
    <div data-v-1fd0f8d0="" class="vcontainer page" style="min-height: 812px!important;">
        <div data-v-1fd0f8d0="" class="header">
            <span data-v-1fd0f8d0="" class="name">地址</span>
            <span data-v-1fd0f8d0="" class="address">{{$address}}</span>
            @if($note)
            <span data-v-1fd0f8d0="" class="note">({{$note->name}})</span>
            @endif
        </div>

        <div data-v-1fd0f8d0="" class="main">
            <h4 data-v-1fd0f8d0="" class="vfs-18 vcolor-192330 mobile-padding">通证</h4>
            <div data-v-1fd0f8d0="" class="vshadow d-block d-lg-flex baseinfo">
                <div data-v-1fd0f8d0="" class="detail" style="width:100%">
                    @foreach(($addressModel['balances']??[]) as $balance)
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
                    <a href="/address/{{$address}}" class="btn btn-secondary">交易明细</a>
                    <button type="button" class="btn btn-info">通证明细</button>
                </div>
                <br>

                <div class="table-responsive bg-white" style="margin-top: 10px">
                    <table class="table table-hover">
                        <thead>
                        <tr>
                            <th width="5%">#</th>
                            <th width="10%">交易哈希值</th>
                            <th>时间</th>
                            <th>发送方</th>
                            <th>进/出</th>
                            <th>接收方</th>
                            <th>数量</th>
                            <th>通证</th>
                        </tr>
                        </thead>
                        @include('layout.tz-transaction', ['txs'=>$txs, 'type'=>1])
                    </table>

                    <div style="display: flex;justify-content: space-between;padding: 0 5px;">
                        <div style="font-size: 14px;">当前第{{$txs ?$txs->currentPage():0}}页</div>
                        {{$txs?$txs->links('vendor.pagination.bootstrap-4'):''}}
                    </div>
                </div>



            </div>

        </div>
    </div>

@stop
