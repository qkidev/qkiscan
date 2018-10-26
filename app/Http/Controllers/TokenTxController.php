<?php

namespace App\Http\Controllers;

use App\Models\TokenTx;
use App\Models\Transactions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TokenTxController extends Controller
{

    /**
     * 通证交易
     * @param $hash
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function index($hash)
    {

        $transaction = Transactions::where('hash',$hash)->first();
        if(empty($transaction))
        {
            return back();
        }

        $data['tx'] = TokenTx::select(DB::raw('token_tx.*,token.contract_address,token.token_symbol,a.address as from_address,b.address as to_address,t.hash'))
           ->leftJoin("token","token_tx.token_id","token.id")
           ->leftJoin("address as a",'token_tx.from_address_id','a.id')
           ->leftJoin("address as b",'token_tx.to_address_id','b.id')
           ->leftJoin("transactions as t",'token_tx.tx_id','t.id')
           ->where('token_tx.tx_id',$transaction->id)
           ->first();

        if(empty($data['tx']))
        {
            return back();
        }

        return view("tokenTx.index",$data);
    }
}
