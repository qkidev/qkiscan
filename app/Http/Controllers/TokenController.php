<?php

namespace App\Http\Controllers;

use App\Models\Balances;
use App\Models\Token;
use App\Models\TokenTx;
use ERC20\ERC20;
use EthereumRPC\EthereumRPC;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class TokenController extends Controller
{
    /**
     * 合约地址
     * @param Request $request
     * @param $address
     * @return \Illuminate\Contracts\View\Factory|\Illuminate\Http\RedirectResponse|\Illuminate\View\View
     */
    public function index(Request $request, $address)
    {

        try{
            $token = Token::where("contract_address",$address)->first();
            if(empty($token))
            {
                return back();
            }

            //查询通证总量
            //实例化通证
            $data['page'] = (int)$request->input('page', 0);
            if($data['page'] < 1)
                $data['page'] = 1;
            $offset = 20 * ($data['page'] - 1);
            $data['contract_address'] = $address;
            $url_arr = parse_url(env("RPC_HOST"));
            $geth = new EthereumRPC($url_arr['host'], $url_arr['port']);
            $erc20 = new ERC20($geth);
            $token_obj = $erc20->token($address);
            $data['token'] = $token;
            $data['decimals'] = $token_obj->decimals();
            $data['result'] = float_format($token_obj->totalSupply());
            $data['address'] = $address;
            $data['tx'] = TokenTx::select(DB::raw('token_tx.*,token.contract_address,token.token_symbol,a.address as from_address,b.address as to_address,t.hash'))
                ->join("token","token_tx.token_id","token.id")
                ->join("address as a",'token_tx.from_address_id','a.id')
                ->join("address as b",'token_tx.to_address_id','b.id')
                ->join("transactions as t",'token_tx.tx_id','t.id')
                ->where('token_tx.token_id',$token->id)
                ->orderBy('token_tx.id','desc')
                ->offset($offset)
                ->limit(20)
                ->get();
            foreach ($data['tx'] as &$v){
                $v->created_at = formatTime($v->created_at, 2);
            }
            $token_id = $token->id;
            $data['transactions_num'] = Cache::remember("transactions_num_{$token->id}", 5, function () use ($token_id){
                return TokenTx::where([['tx_status', 1], ['token_id', $token_id]])->count();
            });
            $data['hour_24_num'] = Cache::remember("token_{$token->id}_hour_24_num", 5, function () use ($token_id){
                $start = time()-24*60*60;
                return TokenTx::where([['tx_status', 1], ['token_id',$token_id]])->whereRaw("unix_timestamp(created_at)>$start")->count();
            });
            $data['hour_24_amount'] = Cache::remember("token_{$token->id}_hour_24_amount", 5, function () use ($token_id){
                $start = time()-24*60*60;
                return TokenTx::where([['tx_status', 1], ['token_id', $token_id]])->whereRaw("unix_timestamp(created_at)>$start")->sum('amount');
            });
            $data['address_num'] = Cache::remember("token_{$token->id}_address_num", 5, function () use ($token){
                return Balances::where([['name', $token->token_name], ['amount', '>', 0]])->count();
            });
            // token top 100
            if (empty($data['page']) || $data['page']<=1){
                $data['top'] = Balances::with('address')
                    ->orderBy("amount","desc")
                    ->where('name', $token_obj->name())
                    ->limit(100)
                    ->get();
            }

            return view("token.index",$data);
        }catch (\Exception $e){
            if (app()->bound('sentry')) {
                app('sentry')->captureException($e);
            }
            return '<h1>出错了</h1>';
        }
    }
}
