<?php

namespace App\Services;


use App\Models\Address;
use App\Models\Balances;
use App\Models\Block;
use App\Models\Settings;
use App\Models\Token;
use App\Models\TokenTx;
use App\Models\Transactions;
use Carbon\Carbon;
use ERC20\ERC20;
use ERC20\ERC20_Token;
use ERC20\Exception\ERC20Exception;
use EthereumRPC\EthereumRPC;
use EthereumRPC\Response\TransactionInputTransfer;
use Illuminate\Support\Facades\DB;

class SyncService
{
    public $address = [];
    public $token = [];

    public

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
        $end_time = time() + 580;
        while (true)
        {
            if($end_time <= time())
            {
                break;
            }
            $block_amount = $this->syncTx();
            if($block_amount < 100)
            sleep(3);
        }
        $this->unlock('create');

        echo "区块同步成功";
    }


    public function txpool_sync()
    {
        ini_set('max_execution_time', 0);
        $end_time = time() + 580;
        while (true)
        {
            if($end_time <= time())
            {
                break;
            }
            $block_amount = $this->txpool();
            sleep(1);
        }
    }

    public function txpool()
    {
        $txpool = (new RpcService())->rpc1('txpool_content',[]);
        if(isset($txpool['result']['pending']) && count($txpool['result']['pending']))
        {
            foreach ($txpool['result']['pending'] as $pending)
            {
                foreach ($pending as $tx)
                {
                    if(!Transactions::where('hash',$tx['hash'])->exists())
                    $this->saveUnpackedTx($tx);
                }
            }
        }
    }


    public function syncTx()
    {
        //获取setting表中记录的下一个要同步的区块高度
        $last_block_height = Settings::where('key','last_block_height')->first();
        if(!$last_block_height){
            $last_block_height = new Settings();
            $last_block_height->key = 'last_block_height';
            $last_block_height->value = 0;
            $last_block_height->save();
        }
        $lastBlock = $last_block_height->value;
        $blockArray = array();
        //获取最后一个高度
        $real_last_block = (new RpcService())->rpc('eth_getBlockByNumber',[['latest',true]]);
        $real_last_block = HexDec2($real_last_block[0]['result']['number']??'') ?? 0;
        $num = 100;
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
        if (!$blocks) {
            echo "获取数据失败\n";
            return false;
        } else {
            echo "获取区块" . count($blocks) . "个\n";
        }
        $block_height = $last_block_height->value;
        if ($blocks)
        {
            echo "区块获取成功 \n";
            foreach ($blocks as $block)
            {
                DB::beginTransaction();
                try {

                    if ($block['result'])
                    {
                        // 存储区块数据
                        $this->saveBlock($block['result']);
                        $block_time = HexDec2($block['result']['timestamp']);
                        $block_height = bcadd(HexDec2($block['result']['number']), 1, 0);
                        //至少需要一个区块确认
                        if ($block_height >= $real_last_block - 2) {
                            echo "区块确认数不够\n";
                            break;
                        }
                        $last_block_height->value = $block_height;

                        //保存出块方地址、保存通证
//                        $this->saveAddress($block['result']['miner']);
                        $transactions = $block['result']['transactions'];
                        //如果此区块有交易
                        if (isset($transactions) && count($transactions) > 0)
                        {
                            $timestamp = date("Y-m-d H:i:s", $block_time);
                            foreach ($transactions as $tx) {
                                $tx_db = Transactions::where('hash', $tx['hash'])->first();
                                if ($tx_db == null) {
                                    $this->saveTx($tx, $timestamp);
                                } elseif ($tx_db->block_number == 0)//更新区块信息
                                {
                                    $tx_db->block_hash = $tx['blockHash'];
                                    $tx_db->block_number = $block_height;

                                    $receipt = (new RpcService())->rpc("eth_getTransactionReceipt", [[$tx['hash']]]);
                                    if (isset($receipt[0]['result'])) {
                                        if (isset($receipt[0]['result']['root'])) {
                                            $tx_status = 1;
                                        } else {
                                            $tx_status = HexDec2($receipt[0]['result']['status']);
                                        }
                                    } else {
                                        echo "没有回执:" . $tx['hash'] . "\n";
                                        $tx_status = 0;
                                    }


                                    $tx_db->tx_status = $tx_status;

                                    $tx_db->save();
                                } elseif ($tx_db->tx_status == 1) {
                                    $receipt = (new RpcService())->rpc("eth_getTransactionReceipt", [[$tx['hash']]]);
                                    if (isset($receipt[0]['result'])) {
                                        if (isset($receipt[0]['result']['root'])) {
                                            $tx_status = 1;
                                        } else {
                                            $tx_status = HexDec2($receipt[0]['result']['status']);
                                        }
                                    } else {
                                        echo "没有回执:" . $tx['hash'] . "\n";
                                        $tx_status = 0;
                                    }

                                    if ($tx_status != $tx_db->tx_status) {
                                        echo "更新tx状态 {$tx['hash']}\n";
                                        $tx_db->tx_status = $tx_status;
                                        $tx_db->save();
                                    }
                                }
                            }
                        }
                    } else {
                        $last_block_height->save();
                        DB::commit();
                        echo "没有结果，当前高度:$block_height\n";
                        return false;
                    }

                    //记录下一个要同步的区块高度
                    $last_block_height->save();
                    DB::commit();
                    echo "同步成功，当前高度:$block_height\n";
                    return count($blocks);
                } catch (\Exception $e) {
                    DB::rollback();
                    echo "file:" . $e->getFile() . " line:" . $e->getLine() . $e->getMessage() . "\n";
                    return false;
                }
            }

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
                $token = Token::where('contract_address',$address)->first();
                if ($token){
                    $this->token[$address] = $token->id;
                } else {
                    $this->saveToken($address);
                }
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
        try {
            //实例化通证
            $tokenModel = new Token();
            $token->decimals();
            $tokenModel->token_symbol = $token->symbol();
            $tokenModel->token_name = $token->name();
            $tokenModel->contract_address = $address;
            if(strlen($tokenModel->token_name) == 0)
                return false;
            $tokenModel->save();
            $this->token[$address] = $tokenModel->id;
        } catch (\EthereumRPC\Exception\GethException $exception) {
            /**
            * 获取合约信息失败
            * -32000 to -32099	Server error. Reserved for implementation-defined server-errors.
            **/
            if ($exception->getCode() == '-32000' && $exception->getMessage() == 'execution reverted') {
                return false;
            }
        }

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

    public function saveUnpackedTx($v)
    {
        $timestamp = date("Y-m-d H:i:s");
        $tx = new Transactions();
        $tx->from = $v['from'];
        $tx->to = $v['to'] ?? '';
        $tx->hash = $v['hash'];
        $tx->block_hash = "";
        $tx->block_number = 0;
        $tx->gas_price = bcdiv(HexDec2($v['gasPrice']) ,gmp_pow(10,18),18);
        $tx->amount = bcdiv(HexDec2($v['value']), gmp_pow(10, 18), 18);
        $tx->created_at = date("Y-m-d H:i:s");
        $tx->tx_status = 0;
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
        if (substr($input, 0, 10) === '0xa9059cbb' && !empty($this->token[$v['to']])) {
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
            $this->saveTokenTx(
                $this->token[$v['to']],
                float_format($token_tx_amount),
                $this->address[$v['from']],
                $this->address[$token_tx->payee],
                $tx->id,
                $timestamp,
                0);

            $this->updateTokenBalance($v['from'], $v['to'],$token);
            $this->updateTokenBalance($token_tx->payee, $v['to'],$token);
        }
        return $tx;
    }

    /**
     * @param $v
     * @param $timestamp
     * @return Transactions
     * @throws
     */
    public function saveTx($v, $timestamp): Transactions
    {
        $tx_status = 1;
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
        $exist = Transactions::where('hash',$v['hash'])->first();
        if($exist)
            $tx = $exist;
        else
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
        if (substr($input, 0, 10) === '0xa9059cbb' && !empty($this->token[$v['to']])) {
            //保存通证交易
            $token_tx =  new TransactionInputTransfer($input);
            //保存通证接收方地址
            $this->saveAddress($token_tx->payee);
            //实例化通证
            $url_arr = parse_url(env("RPC_HOST"));
            $geth = new EthereumRPC($url_arr['host'], $url_arr['port']);
            $erc20 = new ERC20($geth);
            $token = $erc20->token($v['to']);
            try
            {
                $decimals = $token->decimals();
                $token_tx_amount = bcdiv(HexDec2($token_tx->amount),gmp_pow(10, $decimals),18);
//            dump($v['to'],$v['from'],$token_tx->payee);
                $this->saveTokenTx(
                    $this->token[$v['to']],
                    float_format($token_tx_amount),
                    $this->address[$v['from']],
                    $this->address[$token_tx->payee],
                    $tx->id,
                    $timestamp,
                    $tx_status);

                $tx->payee = $token_tx->payee;
                $tx->save();

                $this->updateTokenBalance($v['from'], $v['to'],$token);
                $this->updateTokenBalance($token_tx->payee, $v['to'],$token);
            }
            catch (ERC20Exception $ex)
            {
                echo "token异常\n";
            }
        }
        else if ($v['to'] == '0x3fb708e854041673433e708fedb9a1b43905b6f7')
        {
            $url_arr = parse_url(env("RPC_HOST"));
            $geth = new EthereumRPC($url_arr['host'], $url_arr['port']);
            $erc20 = new ERC20($geth);
            $token = $erc20->token($v['to']);

            $this->updateTokenBalance($v['from'], $v['to'],$token);
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

    public function updateTokenBalance($address, $token_address,ERC20_Token $token)
    {
        $amount = $token->balanceOf($address);
        if(strlen($amount) > 128)
            return;
        $address = Address::firstOrCreate(['address' => $address]);
        $token_db = Token::where('contract_address',$token_address)->first();
        if($token_db)
        {
            Balances::updateOrInsert(['address_id'=>$address->id,"token_id"=>$token_db->id, 'name' => $token->symbol()], ['amount' => $amount]);
        }
    }

    /**
     * 保存区块信息
     *
     * @param array $block
     *
     * @return \App\Models\Block
     */
    public function saveBlock(array $block): Block {
        return Block::firstOrCreate([
            'number' => HexDec2($block['number']),
        ], [
            'difficulty' => HexDec2($block['difficulty']),
            'extra_data' => $block['extraData'],
            'gas_limit' => HexDec2($block['gasLimit']),
            'gas_used' => HexDec2($block['gasUsed']),
            'hash' => $block['hash'],
            'logs_bloom' => $block['logsBloom'],
            'miner' => $block['miner'],
            'mix_hash' => $block['mixHash'],
            'nonce' => HexDec2($block['nonce']),
            'parent_hash' => $block['parentHash'],
            'receipts_root' => $block['receiptsRoot'],
            'sha3_uncles' => $block['sha3Uncles'],
            'size' => HexDec2($block['size']),
            'state_root' => $block['stateRoot'],
            'timestamp' => Carbon::createFromTimestamp(HexDec2($block['timestamp'])),
            'total_difficulty' => HexDec2($block['totalDifficulty']),
            'transaction_count' => count($block['transactions']),
        ]);
    }
}
