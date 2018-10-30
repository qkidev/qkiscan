<?php

namespace App\Console\Commands;

use App\Models\Settings;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class truncateTables extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'truncateTables';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '截断表';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        DB::beginTransaction();
        try{
            DB::table('address')->truncate();
            DB::table('token')->truncate();
            DB::table('token_tx')->truncate();
            DB::table('transactions')->truncate();
            Settings::where('key','last_block_height')->update(['value' => 0]);

            DB::commit();
            echo "操作成功";
        }catch (\Exception $exception)
        {
            DB::rollBack();
            echo "操作失败，失败原因：".$exception->getMessage();
        }
    }
}
