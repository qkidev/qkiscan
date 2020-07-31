@extends('layout.app')
@section('content')

    <div class="vcontainer page">
        <div data-v-cd5b40a0="" class="header d-block d-lg-flex">
            <span data-v-cd5b40a0="" class="block">节点详情</span>
        </div>
        <div data-v-cd5b40a0="" class="main">
            <div data-v-cd5b40a0="" class="baseinfo">
                <div data-v-cd5b40a0="" class="title font-info-title">基本信息</div>
                <div data-v-cd5b40a0="" class="vshadow d-block d-lg-flex">
                    <div data-v-cd5b40a0="" class="left" style="width:100%;padding-right:20px;">
                        <ul data-v-cd5b40a0="" class="vsection">
                            <li data-v-cd5b40a0="" class="item">
                                <span data-v-cd5b40a0="" class="vcolor-192330 strong">节点ID</span>
                                <div data-v-cd5b40a0="">
                                    <span data-v-cd5b40a0="" class="vcolor-192330">{{$node_id}}</span>
                                </div>
                            </li>
                            <li data-v-cd5b40a0="" class="item">
                                <span data-v-cd5b40a0="" class="vcolor-192330 strong">IP</span>
                                <div data-v-cd5b40a0="">
                                    <span data-v-cd5b40a0="" class="vcolor-192330">{{$ip}}</span>
                                </div>
                            </li>
                            <li data-v-cd5b40a0="" class="item">
                                <span data-v-cd5b40a0="" class="vcolor-192330 strong">端口</span>
                                <div data-v-cd5b40a0="">
                                    <span data-v-cd5b40a0="" class="vcolor-192330">{{$port}}</span>
                                </div>
                            </li>
                            <li data-v-cd5b40a0="" class="item">
                                <span data-v-cd5b40a0="" class="vcolor-192330 strong">操作系统</span>
                                <div data-v-cd5b40a0="">
                                    <span data-v-cd5b40a0="" class="vcolor-192330">{{$os}}</span>
                                </div>
                            </li>
                            <li data-v-cd5b40a0="" class="item">
                                <span data-v-cd5b40a0="" class="vcolor-192330 strong">当前同步的高度</span>
                                <div data-v-cd5b40a0="">
                                    <span data-v-cd5b40a0="" class="vcolor-192330">{{$currentBlock}}</span>
                                </div>
                            </li>
                            <li data-v-cd5b40a0="" class="item">
                                <span data-v-cd5b40a0="" class="vcolor-192330 strong">协议版本</span>
                                <div data-v-cd5b40a0="">
                                    <span data-v-cd5b40a0="" class="vcolor-192330">{{$protocol_version}} </span>
                                </div>
                            </li>
                            <li data-v-cd5b40a0="" class="item">
                                <span data-v-cd5b40a0="" class="vcolor-192330 strong">首次发现时间</span>
                                <div data-v-cd5b40a0="">
                                    <span data-v-cd5b40a0="" class="vcolor-192330">{{$created_at}}</span>
                                </div>
                            </li>
                            <li data-v-cd5b40a0="" class="item">
                                <span data-v-cd5b40a0="" class="vcolor-192330 strong">最近发现时间</span>
                                <div data-v-cd5b40a0="">
                                    <span data-v-cd5b40a0="" class="vcolor-192330">{{$updated_at}}</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>
    </div>

@stop
