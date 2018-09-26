<?php

namespace App\Services;


use App\Models\Address;
use App\Models\Settings;
use App\Models\Transactions;
use Illuminate\Support\Facades\DB;

class SyncService
{
    /**
     * 同步交易
     */
    public function synchronizeTransactions()
    {
        //获取setting表中记录的下一个要同步的区块高度
        $last_block_height = Settings::where('key','last_block_height')->first();
        //组装参数
        if($last_block_height->value < 10)
        {
            $param[] = ['0x'.$last_block_height->value,true];
        }else{
            $param[] = [base_convert($last_block_height->value,10,16),true];
        }
        //获取下一个区块
        $rpcService = new RpcService();
        $next_block = $rpcService->getBlockByNumber($param);
        DB::beginTransaction();
        try{
            if(isset($next_block[0]['result']))
            {
                $transactions = $next_block[0]['result']['transactions'];
                //如果此区块有交易
                if(count($transactions) > 0)
                {
                    foreach($transactions as $v)
                    {
                        //写入交易记录表
                        $transactionsModel = new Transactions();
                        $transactionsModel->from = $v->from;
                        $transactionsModel->to = $v->to;
                        $transactionsModel->hash = $v->hash;
                        $transactionsModel->block_hash = $v->blockHash;
                        $transactionsModel->block_number = $v->blockNumber;
                        $transactionsModel->gas_price = $v->gasPrice;
                        $transactionsModel->amount = bcdiv(base_convert($v->value,16,10) ,gmp_pow(10,18),18);
                        $transactionsModel->save();
                        //记录地址
                        Address::saveAddress($v->from);
                        Address::saveAddress($v->to);
                    }
                }
            }
            //记录下一个要同步的区块高度
            $last_block_height->value = bcadd($last_block_height->value,1,0);
            $last_block_height->save();
            DB::commit();
            echo '同步成功';
        } catch (\Exception $e) {
            DB::rollback();
            echo $e->getMessage();
        }

    }
}
