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
        $lastBlock = $last_block_height->value;
        $block_height = $last_block_height;
        $blockArray = array();
        for($i=0;$i<500;$i++)
        {
            //组装参数
            if($lastBlock < 10)
            {
                $blockArray[$i] = ['0x' . $lastBlock,true];
            }else{
                $blockArray[$i] = ['0x' . base_convert($lastBlock,10,16),true];
            }

            $lastBlock++;
        }
        //获取下一个区块
        $rpcService = new RpcService();
        $blocks = $rpcService->getBlockByNumber($blockArray);
        DB::beginTransaction();
        try{
            if($blocks)
            {
                echo "区块获取成功 \n";
                foreach ($blocks as $block)
                {
                    if($block['result'])
                    {
                        $transactions = $block['result']['transactions'];
                        //如果此区块有交易
                        if(isset($transactions) && count($transactions) > 0)
                        {
                            foreach($transactions as $v)
                            {
                                //写入交易记录表
                                $transactionsModel = new Transactions();
                                $transactionsModel->from = $v['from'];
                                $transactionsModel->to = $v['to'];
                                $transactionsModel->hash = $v['hash'];
                                $transactionsModel->block_hash = $v['blockHash'];
                                $transactionsModel->block_number = base_convert($v['blockNumber'],16,10);
                                $transactionsModel->gas_price = 0;
                                $transactionsModel->amount = bcdiv(base_convert($v['value'],16,10) ,gmp_pow(10,18),18);
                                $transactionsModel->save();
                                //记录地址
                                Address::saveAddress($v['from']);
                                Address::saveAddress($v['to']);
                            }
                        }

                        $block_height = bcadd(base_convert($block['result']['number'],16,10),1,0);
                        echo "区块高度：" . $block_height." \n";
                        //记录下一个要同步的区块高度
                        Settings::where('key','last_block_height')->update(['value' => $block_height]);
                    }
                }

            }else{
                $block_height = $last_block_height->value;
                //记录下一个要同步的区块高度
                Settings::where('key','last_block_height')->update(['value' => $block_height]);
            }
            DB::commit();
            echo '同步成功 \n';
        } catch (\Exception $e) {
            DB::rollback();
            echo $e->getMessage();
        }

    }
}
