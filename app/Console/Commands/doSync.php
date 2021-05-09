<?php

namespace App\Console\Commands;

use App\Services\SyncService;
use Illuminate\Console\Command;

class doSync extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'doSync {key}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = '执行同步';

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
        $key = $this->argument('key');
        if(strlen($key) < 1)
        {
            $key = 'last_block_height';
        }
        (new SyncService())->synchronizeTransactions($key);
    }
}
