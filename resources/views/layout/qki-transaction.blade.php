@foreach($transactions as $v)
    <li data-v-cd5b40a0="" class="item vshadow">
        <div data-v-8701ced6="" data-v-cd5b40a0="" class="tx-detail">
            <div data-v-8701ced6="" class="hash-section">
                @include('layout.icon', ['status'=>$v['tx_status']])
                <a data-v-8701ced6="" href="/tx/{{$v['hash']}}" class="hash font-hash-title">
                    <span data-v-8701ced6="" class="d-lg-inline-block">{{$v['hash']}}</span>
                </a>
                <span style="margin-left:10px;">{{$v['created_at']}}</span>
                @if($type == 2)
                <span data-v-8701ced6="" class="output font-coin-title"> {{float_format($v['amount'])}} QKI</span>
                @elseif($type == 1)
                <span data-v-8701ced6="" @if(strtolower($v['from']) == strtolower($address)) style="color: red;" @else style="color: #00b275;" @endif class="output font-coin-title"> {{float_format($v['amount'])}} QKI</span>
                @endif
                    <!----></div>

        </div>
    </li>
@endforeach
