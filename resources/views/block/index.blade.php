@extends('layout.app')
@section('content')
    <div class="vcontainer page">
        <div class="mobile-padding">
            <ol class="breadcrumb">
                <li role="presentation" class="breadcrumb-item">
                    <a href="/block" class="active" target="_self">区块</a></li>
                <li role="presentation" class="breadcrumb-item active">
                    <span aria-current="location">QKI区块列表(当前高度已同步至{{$last_block_height}})</span></li>
            </ol>
        </div>
        <div class="vshadow clearfix data-panel">
            <table aria-busy="false" aria-colcount="7" class="vtable vfs-12 table b-table" id="__BVID__121_">
                <!---->
                <!---->
                <thead class="">
                <tr>
                    <th aria-colindex="1" class="">区块高度</th>
                    <th aria-colindex="2" class="time-label">出块时间</th>
                    <th aria-colindex="3" class="">交易数量</th>
                    <th aria-colindex="4" class="pc-hash">大小(KB)</th>
                    <th aria-colindex="5" class="pc-hash">gas上限</th>
                    <th aria-colindex="6" class="">出块方</th>
                    <th aria-colindex="7" class="">区块Hash</th></tr>
                </tr>
                </thead>
                <!---->
                <tbody class="">
                @foreach($block as $item)
                    <tr class="">
                        <td aria-colindex="1" class="">
                            <a href="/block/detail?hash={{$item['hash']}}" class="text3">{{$item['height']}}</a>
                        <td aria-colindex="2" class="">
                            <span class="block-time" style="text-align: center;">{{$item['created_at']}}</span>
                        </td>
                        <td aria-colindex="3" class="">{{$item['tx_count']}}</td>
                        <td aria-colindex="4" class="pc-hash">{{$item['size']}}</td>
                        <td aria-colindex="5" class="pc-hash">{{$item['difficulty']}}</td>
                        <td aria-colindex="6" class="pc-hash">
                            <a href="/address/{{$item['miner']}}" class="text3 vtext-monospace">{{$item['miner']}}</a>
                        </td>
                        <td aria-colindex="7" class="pc-hash">
                            <a href="/block/detail?hash={{$item['hash']}}" class="text3 vtext-monospace">{{$item['hash']}}</a>
                        </td>
                        <td aria-colindex="6" class="web-hash">
                            <a href="/address?hash={{$item['miner']}}" class="text3 vtext-monospace">{{mb_substr($item['miner'],0,5,'utf-8')}}</a>
                        </td>
                        <td aria-colindex="7" class="web-hash">
                            <a href="/block/detail?hash={{$item['hash']}}" class="text3 vtext-monospace">{{mb_substr($item['hash'],0,5,'utf-8')}}</a>
                        </td>
                    </tr>
                @endforeach
                </tbody>
            </table>
            <ul class="pagination" role="navigation">
                @if($first_block)
                    <li class="page-item" aria-disabled="true" aria-label="« Previous">
                        <a class="page-link" href="/block?last_block={{$first_block}}" rel="previous" aria-label="« Previous">上一页</a>
                    </li>
                @endif
                <li class="page-item">
                    <a class="page-link" href="/block?last_block={{$last_block}}" rel="next" aria-label="Next »">下一页</a>
                </li>
            </ul>
        </div>
    </div>
    <script type="text/javascript">

    </script>
@stop