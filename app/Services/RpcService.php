<?php

namespace App\Services;


class RpcService
{


    /**
     * rpc
     * @param $method
     * @param $params
     * @return mixed
     */
    public function rpc($method,$params)
    {
        $id = rand(1,100);

        $param = [
            'jsonrpc'=>"2.0",
            "method"=>$method,
            "params"=>$params,
            "id"=>$id
            ];
        $param = json_encode($param);
        $data = json_decode($this->curlPost($param),true);
        return $data;
    }
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
        $params = ['latest','true'];
        $blockHeight = json_decode($this->rpc('eth_getBlockByNumber',$params),true);

        return $blockHeight['result']['number'];
    }

    /**
     * 获取区块字符串
     * @param $lastBlock
     * @return string
     */
    public function getBlockString($lastBlock)
    {
        $blockString = "[";
        for($i=0;$i<10;$i++)
        {
            $blockString = $blockString . '{"jsonrpc":"2.0","method":"eth_getBlockByNumber","params":["0x'.base_convert($lastBlock--,10,16).'",true],"id":1},';
        }
        $blockString = rtrim($blockString,",");
        $blockString = $blockString . "]";

        return $blockString;
    }

    /**
     * 根据hash获取区块详情
     * @param $hash
     * @return mixed
     */
    public function getBlockByHash($hash)
    {
        $method = 'eth_getBlockByHash';
        $param = [$hash,true];
        $blockInfo = $this->rpc($method,$param);
        return $blockInfo;
    }

    /**
     * post请求
     * @param $data
     * @return mixed
     */
    public function curlPost($data)
    {
        $url = env('RPC_HOST');
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
        $output = curl_exec($ch);
        curl_close($ch);

        return $output;
    }
}
