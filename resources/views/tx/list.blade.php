@extends('layout.app')
@section('content')

    <div class="vcontainer page">
            <div data-v-cd5b40a0="" id="block-trade-detail" class="tradedetail">
                <div data-v-cd5b40a0="" class="top">
                    <span data-v-cd5b40a0="" class="title">最近Tx</span>
                    <span data-v-cd5b40a0="">
                                    <span data-v-cd5b40a0="" class="txcount">共 {{$transactions->total()}}笔</span>
                    </span>
                    <span data-v-cd5b40a0="" class="title" style="cursor: pointer;float: right;color: {{$type==1?'grey':'black'}}" onclick="getData(2)">通证Tx</span>
                    <span data-v-cd5b40a0="" class="title" style="cursor: pointer;float: right;margin-right: 15px;color: {{$type==2?'grey':'black'}}" onclick="getData(1)">QKITx</span>
                </div>
                @if($type==1)
                <ul data-v-cd5b40a0="" class="middle">
                    @include('layout.qki-transaction', ['transactions'=>$transactions, 'type'=>2])
                </ul>
                @else
                <div class="table-responsive bg-white" style="margin-top: 10px">
                    <table class="table table-hover">
                        <thead>
                        <tr>
                            <th width="5%">#</th>
                            <th width="10%">Tx哈希值</th>
                            <th>时间</th>
                            <th>发送方</th>
                            <th>接收方</th>
                            <th>数量</th>
                            <th>通证</th>
                        </tr>
                        </thead>
                        @include('layout.tz-transaction', ['txs'=>$transactions, 'type'=>2])
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
