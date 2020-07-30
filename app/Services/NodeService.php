<?php

namespace App\Services;


use App\Models\NodeStatistics;

class NodeService
{
    public function changeNode()
    {
        $rpcService = new RpcService();
        $rpc_data = $rpcService->rpc1('admin_peers', []);


        if (isset($rpc_data['result'])) {
            foreach ($rpc_data['result'] as $key => $val) {

                //操作系统
                $os = array_slice(explode('/', $val['name']), -2, 1)[0];
                //处理节点ID
                $node_id = current(explode('@', str_replace('enode://', '', $val['enode'])));
                //获取IP和端口
                $network = explode(':', $val['network']['remoteAddress']);
                $ip = current($network);
                $port = end($network);

                $currentBlock = 0;
                if (isset($val['protocols']['eth']['head'])) {
                    //用hash获取高度
                    $blockInfo = $rpcService->getBlockByHash($val['protocols']['eth']['head'])['result'];
                    $currentBlock = HexDec2($blockInfo['number']);
                }
                //数据库操作
                try {
                    NodeStatistics::updateOrCreate(
                        ['node_id' => $node_id],
                        [
                            'ip' => $ip,
                            'port' => $port,
                            'os' => $os,
                            'protocol' => $val['caps'],
                            'network_id' => "20181205",
                            'currentBlock' => $currentBlock,
                            'genesis_block_hash' => '',
                            'Synced' => '',
                            'protocol_version' => $val['protocols']['eth']['version']
                        ]
                    );
                } catch (\Exception $e) {
                }
            }
            return ['code' => 0, 'message' => 'ok'];
        }
        return $rpc_data['error'];
    }

}
