<?php

namespace App\Http\Controllers;


use App\Models\Address;
use App\Models\TokenTx;
use App\Models\Transactions;
use App\Models\AddressNotes;
use App\Services\RpcService;

class AddressController extends Controller
{
    /**
     * 地址详情
     * @param $address
     * @return string
     */
    public function index($address)
    {
        $address = strtolower($address);
        try{
            $RpcService = new RpcService();

            $params = array(
                [$address,"latest"]
            );

            $data = $RpcService->rpc("eth_getBalance",$params);

            $data = isset($data[0])?$data[0]:array();

            $data['result'] = float_format(bcdiv(gmp_strval($data['result']) ,gmp_pow(10,18),18));

            $data['address'] = $address;

            $data['transactions'] = Transactions::whereNull('payee')
                ->where(function($query) use ($address){
                    $query->where('from',$address)->orWhere('to',$address);
                })
                ->orderBy('id','desc')->paginate(20);


	        $account_data = $RpcService->rpc("eth_getTransactionCount",$params);
	        $account_data = isset($account_data[0])?$account_data[0]:array();

	        $data['nonce'] = float_format(HexDec2($account_data['result']))??0;

            foreach ($data['transactions'] as &$v){
                $v->created_at = formatTime($v->created_at, 2);
            }

            $data['note'] = AddressNotes::where("address",$address)->first();

            return view("address.index",$data);
        }catch (\Exception $e){
            if (app()->bound('sentry')) {
                app('sentry')->captureException($e);
            }
            return '<h1>出错了</h1>';
        }
    }

    /**
     * 地址的通证交易
     * @param $address
     *
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\View\View
     */
    public function token($address){
        $address = strtolower($address);
        try{
            $addressModel = Address::with('balances')
                ->whereAddress($address)
                ->first();
            $txs = [];

            if ($addressModel){
                $txs = TokenTx::with(['token', 'transaction'])
                    ->where('to_address_id', $addressModel->id)
                    ->orWhere('from_address_id', $addressModel->id)
                    ->orderBy('id','desc')
                    ->paginate(20);
            }
            $note = AddressNotes::where("address",$address)->first();

            return view('address.token', [
                'address' => $address,
                'addressModel' => $addressModel,
                'txs' => $txs,
                'note' => $note
            ]);
        }catch (\Exception $e){
            if (app()->bound('sentry')) {
                app('sentry')->captureException($e);
            }
            return '<h1>出错了</h1>';
        }
    }
}
