<?php

namespace App\Console\Commands;

use App\Models\RpcNode;
use App\Services\RpcService;
use Illuminate\Console\Command;

class CheckRpcNode extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'CheckRpcNode';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

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
     * @return int
     */
    public function handle()
    {
        $RpcNode = RpcNode::all();
        foreach ($RpcNode as $node)
        {
            try
            {
                echo $node->name . "\n";
                $real_last_block = $this->rpc($node->url,'eth_getBlockByNumber',['latest',false]);
                $block_time = HexDec2($real_last_block["result"]['timestamp']);
                if(time() - $block_time < 20)
                {
                    $node->success++;
                    $node->last_success_time = time();
                }
                else
                {
                    $node->failure++;
                }
                $node->save();
            }
            catch (\Exception $exception)
            {

            }
        }
    }


    /**
     * rpc
     * @param $url
     * @param $method
     * @param $params
     * @return mixed
     */
    public function rpc($url,$method, $params)
    {
        $id = rand(1, 100);
        $rpc_param = [
            'jsonrpc' => "2.0",
            "method" => $method,
            "params" => $params,
            "id" => $id
        ];

        $param = json_encode($rpc_param);
        $data_str = $this->curlPost($url,$param);
        $data = json_decode($data_str, true);

        return $data;
    }




    /**
     * post请求
     * @param $url
     * @param $data
     * @return mixed
     */
    public function curlPost($url,$data)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        // post数据
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json'
        ));
        // post的变量
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        $output = curl_exec($ch);

        curl_close($ch);

        return $output;
    }
}
