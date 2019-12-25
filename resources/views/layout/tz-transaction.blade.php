<tbody>
@foreach($txs as $v)
    <tr>
        <td width="5%">
            @include('layout.icon', ['status'=>$v['tx_status']])
        </td>
        <td width="10%">
            <a href="/tx/{{$type==1?$v['transaction']['hash']:$v['hash']}}" title="{{$type==1?$v['transaction']['hash']:$v['hash']}}" class="hash font-hash-title">
                {{str_limit($type==1?$v['transaction']['hash']:$v['hash'],15)}}
            </a>
        </td>
        <td>{{formatTime($v['created_at'],2)}}</td>
        <td>
            <a href="/address/{{$type==1?$v['transaction']['from']:$v['from']}}/token" title="{{$type==1?$v['transaction']['from']:$v['from']}}" class="hash font-hash-title">
                {{str_limit($type==1?$v['transaction']['from']:$v['from'],15)}}
            </a>
        </td>
        @if($type==1)
        <td>
            @if($v['transaction']['from'] == $address)
                <span class="badge badge-warning">出</span>
            @else
                <span class="badge badge-success">进</span>
            @endif
        </td>
        @endif
        <td>
            @if(!empty($type==1?$v['transaction']['payee']:$v['payee']))
                <a href="/address/{{$type==1?$v['transaction']['payee']:$v['payee']}}/token"
                   title="{{$type==1?$v['transaction']['payee']:$v['payee']}}" class="hash font-hash-title">
                    {{str_limit($type==1?$v['transaction']['payee']:$v['payee'],15)}}
                </a>
            @else
                <a href="/address/{{$type==1?$v['transaction']['to']:$v['to']}}/token"
                   title="{{$type==1?$v['transaction']['to']:$v['to']}}" class="hash font-hash-title">
                    {{str_limit($type==1?$v['transaction']['to']:$v['to'],15)}}
                </a>
            @endif
        </td>
        <td class="text-right">{{float_format($type==1?$v['amount']:$v['tokenTx']['amount'])}}</td>
        <td>
            <a href="/token/{{$v['token']['contract_address']}}/token"
               title="{{$v['token']['token_symbol']}}" class="hash font-hash-title">
                {{strtoupper($v['token']['token_name'])}}
            </a>
        </td>
    </tr>
@endforeach
</tbody>
