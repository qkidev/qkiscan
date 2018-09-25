<?php

namespace App\Services;


class RpcService
{
    protected $url = "http://localhost:8545";

    /**
     * 获得区块
     * @param $data
     * @return mixed
     */
    public function getBlockByNumber($data)
    {
        $block = json_decode($this->curlPost($data),true);
        return $block;
    }

    /**
     * 获取最后一个区块的高度
     * @return mixed
     */
    public function lastBlockHeightNumber()
    {
        $lastBlock = '{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["latest",false],"id":1}';
        $blockHeight = json_decode($this->curlPost($lastBlock),true);
        return $blockHeight['result']['number'];
    }

    /**
     * post请求
     * @param $data
     * @return mixed
     */
    public function curlPost($data)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $this->url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        // post数据
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            'Content-Type: application/json'
        ));
        // post的变量
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        $output = curl_exec($ch);
        curl_close($ch);

        return $output;
    }
}
