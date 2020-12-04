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
        $this->info(now());
        $number = Block::oldest('number')->firstOrFail()->value('number');
        if ($number < 1) {
            $this->warn("无需填充数据");
            return ;
        }
        $this->info("将从高度: $number, 开始逆向填充数据");

        //获取下一个区块
        $rpcService = new RpcService();
        $syncService = new SyncService();
        do {
            $blocks = $rpcService->getBlockByNumber($this->buildParams($number));

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
        } while ($number > 0);
    }

    /**
     * 批量构建参数
     * @param int $number
     *
     * @return array
     */
    protected function buildParams(int $number): array {
        $num = 0;
        $blockArray = [];

        do{
            $number--;
            $num++;

            //组装参数
            if($number < 10) {
                $blockArray[] = ['0x' . $number,true];
            } else {
                $blockArray[] = ['0x' . base_convert($number,10,16),true];
            }
        } while ($number > 0 && $num < 2);

        return $blockArray;
    }
}
