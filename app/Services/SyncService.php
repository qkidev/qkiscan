<?php

namespace App\Services;


use App\Models\Address;
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
        if ($this->isLock('create')) {
            return;
        }
        $this->lock('create');
        ini_set('max_execution_time', 60);
        $end_time = time() + 55;
        while (true)
        {
            if($end_time <= time())
            {
                break;
            }
            if(!$this->syncTx())
            {
                sleep(1);
            }
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
        $last_block_number = $real_last_block[0]['result']['number'] ?? 0;
        $num = 500;
        if($last_block_number)
        {
            if(bccomp($last_block_number,$lastBlock,0) < 10)
            {
                $num = 10;
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
                        //保存出块方地址、保存通证
                        $this->saveAddress($block['result']['miner']);
                        $transactions = $block['result']['transactions'];
                        //如果此区块有交易
                        if(isset($transactions) && count($transactions) > 0)
                        {
                            $timestamp = date("Y-m-d H:i:s",base_convert($block['result']['timestamp'],16,10));
                            foreach($transactions as $tx)
                            {
                                $this->saveTx($tx, $timestamp);
                            }
                        }

                        $block_height = bcadd(base_convert($block['result']['number'],16,10),1,0);
                    }
                    else
                    {
                        Settings::where('key','last_block_height')->update(['value' => $block_height]);
                        DB::commit();
                        echo "同步成功，当前高度:$block_height\n";
                        return false;
                    }
                }

            }

            //记录下一个要同步的区块高度
            Settings::where('key','last_block_height')->update(['value' => $block_height]);
            DB::commit();
            echo "同步成功，当前高度:$block_height\n";
            return true;
        } catch (\Exception $e) {
            DB::rollback();
            echo $e->getMessage();
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
                $this->token[$address] = $token->id;
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
            $tx_status = base_convert($receipt[0]['result']['status'], 16, 10);
        }else{
            $tx_status = 0;
        }
        $tx = new Transactions();
        $tx->from = $v['from'];
        $tx->to = $v['to'] ?? '';
        $tx->hash = $v['hash'];
        $tx->block_hash = $v['blockHash'];
        $tx->block_number = base_convert($v['blockNumber'], 16, 10);
        $tx->gas_price = 0;
        $tx->amount = bcdiv(base_convert($v['value'], 16, 10), gmp_pow(10, 18), 18);
        $tx->created_at = $timestamp;
        $tx->tx_status = $tx_status;
        $tx->save();

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
            //保存通证接收方地址
            $this->saveAddress($token_tx->payee,$this->checkAddressType($token_tx->payee));
            $token_tx_amount = bcdiv(base_convert($token_tx->amount,16,10),1000000000000000000,8);
            $this->saveTokenTx($this->token[$v['to']],$token_tx_amount,$this->address[$v['from']],$this->address[$token_tx->payee],$tx->id,$timestamp,$tx_status);
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
}
