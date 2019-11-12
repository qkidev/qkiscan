<?php

namespace App\Services;


use App\Models\Address;
use App\Models\Balances;
use App\Models\Settings;
use App\Models\Token;
use App\Models\TokenTx;
use App\Models\Transactions;
use ERC20\ERC20;
use EthereumRPC\EthereumRPC;
use EthereumRPC\Response\TransactionInputTransfer;
use Illuminate\Support\Facades\DB;

class SyncService
{
    public $address = [];
    public $token = [];

    /**
     * 同步交易
     */
    public function synchronizeTransactions()
    {
        $this->unlock('create');
        if ($this->isLock('create')) {
            echo "已锁";
            return;
        }
        $this->lock('create');
        ini_set('max_execution_time', 0);
        $end_time = time() + 58;
        while (true)
        {
            if($end_time <= time())
            {
                break;
            }
            $this->syncTx();
            sleep(1);
        }
        $this->unlock('create');

        echo "区块同步成功";
    }

    public function syncTx()
    {
        //获取setting表中记录的下一个要同步的区块高度
        $last_block_height = Settings::where('key','last_block_height')->first();
        if(!$last_block_height){
            $last_block_height = new Settings();
            $last_block_height->key = 'last_block_height';
            $last_block_height->value = 1;
            $last_block_height->save();
        }
        $lastBlock = $last_block_height->value;
        $blockArray = array();
        //获取最后一个高度
        $real_last_block = (new RpcService())->rpc('eth_getBlockByNumber',[['latest',true]]);
        $real_last_block = HexDec2($real_last_block[0]['result']['number']??'') ?? 0;
        $num = 500;
        if($real_last_block)
        {
            if($lastBlock + 10 >= $real_last_block)
            {
                $num = 1;
            }
        }
        for($i=0;$i<$num;$i++)
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
        if(!$blocks)
        {
            echo "获取数据失败";
            return false;
        }
        else
        {
        	echo "获取区块" . count($blocks) . "个\n";
        }
        DB::beginTransaction();
        try{

            $block_height = $last_block_height->value;
            if($blocks)
            {
                echo "区块获取成功 \n";
                foreach ($blocks as $block)
                {
                    if($block['result'])
                    {
                        $block_time = HexDec2($block['result']['timestamp']);
                        $block_height = bcadd(HexDec2($block['result']['number']),1,0);
                        //至少需要一个区块确认
                        if($block_height >= $real_last_block - 2)
                        {
                        	echo "区块确认数不够\n";
                            break;
                        }
	                    $last_block_height->value = $block_height;

                        //保存出块方地址、保存通证
                        $this->saveAddress($block['result']['miner']);
                        $transactions = $block['result']['transactions'];
                        //如果此区块有交易
                        if(isset($transactions) && count($transactions) > 0)
                        {
                            $timestamp = date("Y-m-d H:i:s",$block_time);
                            foreach($transactions as $tx)
                            {
                                if(!Transactions::where('hash',$tx['hash'])->exists())
                                $this->saveTx($tx, $timestamp);
                            }
                        }
                    }
                    else
                    {
	                    $last_block_height->save();
                        DB::commit();
                        echo "没有结果，当前高度:$block_height\n";
                        return false;
                    }
                }

            }

            //记录下一个要同步的区块高度
	        $last_block_height->save();
            DB::commit();
            echo "同步成功，当前高度:$block_height\n";
            return true;
        } catch (\Exception $e) {
            DB::rollback();
            echo "file:" . $e->getFile() . " line:" . $e->getLine() . $e->getMessage() . "\n";
            return false;
        }
    }

    /**
     * 判断地址是否为合约地址
     * @param $address
     * @return int
     * @throws \EthereumRPC\Exception\ConnectionException
     * @throws \EthereumRPC\Exception\GethException
     * @throws \HttpClient\Exception\HttpClientException
     */
    public function checkAddressType($address)
    {
        //判断是否为合约地址
        $url_arr = parse_url(env("RPC_HOST"));
        $geth = new EthereumRPC($url_arr['host'], $url_arr['port']);
        $request = $geth->jsonRPC("eth_getCode",null,[$address,"latest"]);
        $res = $request->get("result");
        if($res == "0x")
        {
            //普通地址
            return Address::TYPE_NORMAL_ADDRESS;
        }else{
            //合约地址
            return Address::TYPE_CONTRACT_ADDRESS;
        }
    }

    /**
     * 保存地址
     * @param $address
     * @param $type
     * @return bool|int
     * @throws \ERC20\Exception\ERC20Exception
     * @throws \EthereumRPC\Exception\ConnectionException
     * @throws \EthereumRPC\Exception\ContractABIException
     * @throws \EthereumRPC\Exception\ContractsException
     * @throws \EthereumRPC\Exception\GethException
     * @throws \HttpClient\Exception\HttpClientException
     */
    public function saveAddress($address)
    {
        if(!$address)
        {
            return true;
        }
        //判断地址是否保存过
        if(isset($this->address[$address]))
            return true;

        $address_type = $this->checkAddressType($address);

        $is_exist = Address::where('address',$address)->first();
        if(empty($is_exist))
        {
            $addressModel = new Address();
            $addressModel->type = $address_type;
            $addressModel->address = $address;
            $addressModel->amount = 0;
            $addressModel->save();
            $this->address[$address] = $addressModel->id;

            //如果为合约地址，保存通证
            if($address_type == 2)
            {
                $this->saveToken($address);
            }
            return $addressModel->id;
        }else{
            $this->address[$address] = $is_exist->id;
            if($address_type == 2)
            {
                $token = Token::where('contract_address',$address)->first();
                if ($token){
                    $this->token[$address] = $token->id;
                } else {
                    $this->saveToken($address);
                }
            }
            return true;
        }
    }

    /**
     * 保存通证
     * @param $address
     * @return bool
     * @throws \ERC20\Exception\ERC20Exception
     * @throws \EthereumRPC\Exception\ConnectionException
     * @throws \EthereumRPC\Exception\ContractABIException
     * @throws \EthereumRPC\Exception\ContractsException
     * @throws \EthereumRPC\Exception\GethException
     * @throws \HttpClient\Exception\HttpClientException
     */
    public function saveToken($address)
    {
        //判断通证是否存在
        if(isset($this->token[$address]))
            return true;
        $token_is_exist = Token::where('contract_address',$address)->first();
        if(!empty($token_is_exist))
        {
            $this->token[$address] = $token_is_exist->id;
            return true;
        }
        //实例化通证
        $url_arr = parse_url(env("RPC_HOST"));
        $geth = new EthereumRPC($url_arr['host'], $url_arr['port']);
        $erc20 = new ERC20($geth);
        $token = $erc20->token($address);
        $tokenModel = new Token();
        $tokenModel->token_name = $token->name();
        $tokenModel->token_symbol = $token->symbol();
        $tokenModel->contract_address = $address;
        $tokenModel->save();
        $this->token[$address] = $tokenModel->id;

        return true;
    }

    /**
     * 保存通证交易记录
     * @param $token_id
     * @param $amount
     * @param $from_address_id
     * @param $to_address_id
     * @param $tx_id
     * @param $timestamp
     * @param $tx_status
     * @return bool
     */
    public function saveTokenTx($token_id,$amount,$from_address_id,$to_address_id,$tx_id,$timestamp,$tx_status)
    {
        $tokenTx = new TokenTx();
        $tokenTx->token_id = $token_id;
        $tokenTx->from_address_id = $from_address_id;
        $tokenTx->to_address_id = $to_address_id;
        if ($amount >= 100000000000000000000){
            $amount = '99999999999999999999';
        }
        $tokenTx->amount = $amount;
        $tokenTx->tx_id = $tx_id;
        $tokenTx->created_at = $timestamp;
        $tokenTx->tx_status = $tx_status;

        return $tokenTx->save();
    }

    /**
     * @param $v
     * @param $timestamp
     * @return Transactions
     * @throws
     */
    public function saveTx($v, $timestamp): Transactions
    {
        //查询交易是否成功
        $receipt = (new RpcService())->rpc("eth_getTransactionReceipt",[[$v['hash']]]);
       if(isset($receipt[0]['result'])) {
            if(isset($receipt[0]['result']['root']))
            {
                $tx_status = 1;
            }else{
                $tx_status = HexDec2($receipt[0]['result']['status']);
            }
        }else{
            echo "没有回执:" . $v['hash'] . "\n";
            $tx_status = 0;
        }
//        $exist = Transactions::where('hash',$v['hash'])->first();
//        if($exist)
//            $tx = $exist;
//        else
        $tx = new Transactions();
        $tx->from = $v['from'];
        $tx->to = $v['to'] ?? '';
        $tx->hash = $v['hash'];
        $tx->block_hash = $v['blockHash'];
        $tx->block_number = HexDec2($v['blockNumber']);
        $tx->gas_price = bcdiv(HexDec2($v['gasPrice']) ,gmp_pow(10,18),18);
        $tx->amount = bcdiv(HexDec2($v['value']), gmp_pow(10, 18), 18);
        $tx->created_at = $timestamp;
        $tx->tx_status = $tx_status;
        $tx->save();

        //保存该地址的qki和cct余额
        $this->updateQkiBalance($v['from']);
        $this->updateQkiBalance($v['to']);

        //记录地址、保存通证
        $this->saveAddress($v['from']);
        if($v['to'])
        {
            $this->saveAddress($v['to']);
        }
        //input可能为空
        $input = $v['input'] ?? '';

        // 通证转账
        if (substr($input, 0, 10) === '0xa9059cbb') {
            //保存通证交易
            $token_tx =  new TransactionInputTransfer($input);
            $tx->payee = $token_tx->payee;
            $tx->save();
            //保存通证接收方地址
            $this->saveAddress($token_tx->payee);
            //实例化通证
            $url_arr = parse_url(env("RPC_HOST"));
            $geth = new EthereumRPC($url_arr['host'], $url_arr['port']);
            $erc20 = new ERC20($geth);
            $token = $erc20->token($v['to']);
            $decimals = $token->decimals();
            $token_tx_amount = bcdiv(HexDec2($token_tx->amount),gmp_pow(10, $decimals),18);
//            dump($v['to'],$v['from'],$token_tx->payee);
            $this->saveTokenTx($this->token[$v['to']],float_format($token_tx_amount),$this->address[$v['from']],$this->address[$token_tx->payee],$tx->id,$timestamp,$tx_status);

            $this->updateTokenBalance($v['from'], $v['to']);
            $this->updateTokenBalance($token_tx->payee, $v['to']);
        }
        return $tx;
    }

    /**
     * 定时任务是否锁定
     */
    protected function isLock($key)
    {
        return file_exists(storage_path($key)) ? true : false;
    }

    /**
     * 锁定定时任务
     */
    protected function lock($key)
    {
        file_put_contents(storage_path($key), '1');
    }

    /**
     * 解锁定时任务
     */
    protected function unlock($key)
    {
        if ($this->isLock($key)) {
            unlink(storage_path($key));
        }
    }

    public function updateQkiBalance($address)
    {
        $rpc = new RpcService();
        $rs = $rpc->rpc('eth_getBalance', [[$address,"latest"]]);
        if(!isset($rs[0]['result']))
            return;
        $rs = isset($rs[0])?$rs[0]:array();
        $qki = bcdiv(gmp_strval($rs['result']) ,gmp_pow(10,18),8);
        $address = Address::firstOrCreate(['address' => $address]);
        Balances::updateOrInsert(['address_id'=>$address->id, 'name' => 'qki'], ['amount' => $qki]);
    }

    public function updateTokenBalance($address, $token_address)
    {
        $addr = $token_address;
        $url_arr = parse_url(env("RPC_HOST"));
        $geth = new EthereumRPC($url_arr['host'], $url_arr['port']);
        $erc20 = new ERC20($geth);
        $token = $erc20->token($addr);
        $amount = $token->balanceOf($address);
        $address = Address::firstOrCreate(['address' => $address]);
        Balances::updateOrInsert(['address_id'=>$address->id, 'name' => $token->name()], ['amount' => $amount]);
    }


}
