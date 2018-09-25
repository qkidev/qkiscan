@extends('layout.app')
@section('content')
    <div class="vcontainer page">
        <div class="mobile-padding">
            <ol class="breadcrumb">
                <li role="presentation" class="breadcrumb-item">
                    <a href="/block" class="active" target="_self">区块</a></li>
                <li role="presentation" class="breadcrumb-item active">
                    <span aria-current="location">QKI区块列表</span></li>
            </ol>
            <!--<div class="date-select">
                <span class="vfs-12 vcolor-192330">从</span>
                <input type="date" class="date" id="start_time" value="">
                <span class="vfs-12 vcolor-192330">至</span>
                <input type="date" class="date" id="end_time" value="">
                <span class="view-all">全部</span>
            </div>-->
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
                    <th aria-colindex="4" class="">区块Hash</th></tr>
                </tr>
                </thead>
                <!---->
                <tbody class="">
                <tr class="">
                    <td aria-colindex="1" class="">
                        <a href="/block/detail?hash=a16e162e8588da31fc2cd4cf02110cd27f1fbd61aa77fd5e5f5f149a0cf10f29" class="text3">32983</a>
                    </td><td aria-colindex="2" class="">
                        <span class="block-time">2018-09-25 11:10:02</span>
                    </td>
                    <td aria-colindex="3" class="">8</td>
                    <td aria-colindex="4" class="pc-hash">
                        <a href="/block/detail?hash=a16e162e8588da31fc2cd4cf02110cd27f1fbd61aa77fd5e5f5f149a0cf10f29" class="text3 vtext-monospace">a16e162e8588da31fc2cd4cf02110cd27f1fbd61aa77fd5e5f5f149a0cf10f29</a>
                    </td>
                    <td aria-colindex="4" class="web-hash">
                        <a href="/block/detail?hash=a16e162e8588da31fc2cd4cf02110cd27f1fbd61aa77fd5e5f5f149a0cf10f29" class="text3 vtext-monospace">a16e162e8588da31fc</a>
                    </td>
                </tr>
                <tr class="">
                    <td aria-colindex="1" class="">
                        <a href="/block/detail?hash=3f16cbede380ae5044aab580508d886b12120ad5d46e4a2487e526639c32a122" class="text3">32982</a>
                    </td><td aria-colindex="2" class="">
                        <span class="block-time">2018-09-25 11:00:02</span>
                    </td>
                    <td aria-colindex="3" class="">9</td>
                    <td aria-colindex="4" class="pc-hash">
                        <a href="/block/detail?hash=3f16cbede380ae5044aab580508d886b12120ad5d46e4a2487e526639c32a122" class="text3 vtext-monospace">3f16cbede380ae5044aab580508d886b12120ad5d46e4a2487e526639c32a122</a>
                    </td>
                    <td aria-colindex="4" class="web-hash">
                        <a href="/block/detail?hash=3f16cbede380ae5044aab580508d886b12120ad5d46e4a2487e526639c32a122" class="text3 vtext-monospace">3f16cbede380ae5044</a>
                    </td>
                </tr>


                </tbody>
            </table>
            <ul class="pagination" role="navigation">

                <li class="page-item disabled" aria-disabled="true" aria-label="« Previous">
                    <span class="page-link" aria-hidden="true">上一页</span>
                </li>


                <li class="page-item">
                    <a class="page-link" href="https://qki.wbdacdn.com/block?page=2" rel="next" aria-label="Next »">下一页</a>
                </li>
            </ul>
        </div>
    </div>
    <script type="text/javascript">

    </script>
@stop