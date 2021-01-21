<?php

namespace App\Console\Commands;

use App\Models\Block;
use App\Services\RpcService;
use App\Services\SyncService;
use Illuminate\Console\Command;

class fillBlockData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fillBlockData';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '填充未同步区块数据到block表';

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        //获取最后一个高度
        $real_last_block = (new RpcService())->rpc('eth_getBlockByNumber',[['latest',true]]);
        $real_last_block = HexDec2($real_last_block[0]['result']['number']??'') ?? 0;

        $this->info(now());
        $now_block = Block::orderBy('id', 'desc')->first();
        if(!empty($now_block))
        {
            $number = $now_block->number;
        }
        else
        {
            $number = 0;
        }
        if ($number >= $real_last_block - 2) {
            $this->warn("无需填充数据");
            return ;
        }
        $this->info("将从高度: $number, 开始正向填充数据");

        //获取下一个区块
        $rpcService = new RpcService();
        $syncService = new SyncService();
        do {

            //组装参数
            for($i=0;$i<100;$i++)
            {
                $number++;
                if(Block::where('number',$number)->exists())
                {
                    echo "存在$number\n";
                    continue;
                }
                //组装参数
                if($number < 10)
                {
                    $blockArray[$i] = ['0x' . $number,true];
                }else{
                    $blockArray[$i] = ['0x' . base_convert($number,10,16),true];
                }
            }


            $blocks = $rpcService->getBlockByNumber($blockArray);

            if(!$blocks) {
                echo "获取数据失败\n";
                break;
            }

            foreach ($blocks as $block) {
                if($block['result']) {
                    // 存储区块数据
                    $blk = $syncService->saveBlock($block['result']);
                    $this->info("区块 {$blk->number} 同步成功");
                    $number = $blk->number;
                } else {
                    $this->warn(json_encode($block));
                    break;
                }
            }
            if ($number >= $real_last_block - 3)
                break;

        } while ($number > 0);
    }
}
