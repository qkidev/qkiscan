<!DOCTYPE HTML>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <title>API在线文档</title>
    <link href="/css/api.css" rel="stylesheet" type="text/css" />
    <script language="javascript" src="/js/jquery.min.js"></script>
    <script language="javascript" src="/js/jquery.dimensions.js"></script>
</head>
<style>
    .le em{
        font-size: 20px;
    }
    .api-tips{
        color: green;
    }
    .tips-red{
        color: red;
    }
</style>
<body>
<div class="tit">
    <div id="titcont">
        API文档
    </div>
</div>
<div id="cont">
    <div class='fun'>
        <span class='le'><em>1.获取通证余额接口</em> <b>描述:获取通证余额接口</b></span>
        <span class='ri'>方式:<em> GET</em></span>
        <span class='ri'>示例URL:<em> <a href='/api/get-token-balance?address=0x16543062385673b637d7ce16efb0dd56a1a832bc&contract_address=0xf20a1b8f61a186f8485a037549149079c0f3b493' target='_blank'>http://new-block-browser.quarkblockchain.cn/api/get-token-balance?address=0x16543062385673b637d7ce16efb0dd56a1a832bc&contract_address=0xf20a1b8f61a186f8485a037549149079c0f3b493</a> </em></span>
        <div class='says'>传参说明：1.address（钱包地址，<span class="tips-red">必选</span>），2.contract_address（合约地址，<span class="tips-red">必选</span>）</div>
        <div class='says'>返回结构示例：
            <pre class="intersays">
{
    code: 0,
    message: "OK",
    data: "499.000000000000000000"
}
            </pre>
        </div>

        <span class='le'><em>2.qki余额接口</em> <b>描述:qki余额接口</b> </span>
        <span class='ri'>方式:<em> GET</em></span>
        <span class='ri'>示例URL:<em> <a href='/api/get-qki-balance?address=0x16543062385673b637d7ce16efb0dd56a1a832bc' target='_blank'>http://new-block-browser.quarkblockchain.cn/api/get-qki-balance?address=0x16543062385673b637d7ce16efb0dd56a1a832bc</a> </em></span>
        <div class='says'>传参说明：1.address（钱包地址，<span class="tips-red">必选</span>）</div>
        <div class='says'>返回结构示例：
            <pre class="intersays">
{
    code: 0,
    message: "OK",
    data: 815.9659506824692
}
</pre>
        </div>

        <span class='le'><em>3.获取通证转账记录接口</em> <b>描述:获取通证转账记录接口</b> </span>
        <span class='ri'>方式:<em> GET</em></span>
        <span class='ri'>示例URL:<em> <a href='/api/get-token-tx?address=0x16543062385673b637d7ce16efb0dd56a1a832bc&contract_address=0xf20a1b8f61a186f8485a037549149079c0f3b493&page=1&pageSize=20' target='_blank'>http://new-block-browser.quarkblockchain.cn/api/get-token-tx?address=0x16543062385673b637d7ce16efb0dd56a1a832bc&contract_address=0xf20a1b8f61a186f8485a037549149079c0f3b493&page=1&pageSize=20</a> </em></span>
        <div class='says'>传参说明：1.address（钱包地址，<span class="tips-red">必选</span>），2.contract_address（合约地址，<span class="tips-red">必选</span>），3.page（分页，<span class="api-tips">可选，默认1</span>），4.pageSize（每页数量，<span class="api-tips">可选，默认20</span>）</div>
        <div class='says'>返回结构示例：
            <pre class="intersays">
{
    code: 0,
    message: "OK",
    data: [
        {
            amount: "-500.00000000",<span class="api-tips">//数量，正为转入，负为转出</span>
            created_at: "2018-11-02 06:07:37",<span class="api-tips">//转账时间</span>
            hash: "0x1e85805466fbdaa001caffa0a0e3c0e806db7264f01d16cff650a55cab4700c2"<span class="api-tips">//hash</span>
            tx_status:"1"<span class="api-tips">交易状态，1成功，0失败</span>
        },
        {
            amount: "1000.00000000",
            created_at: "2018-10-24 02:57:57",
            hash: "0x77d939383c2fcd180488ed16465e806626d03ad1d4d7ec25ea61584c94edaaae",
            tx_status:"1"
        }
    ]
}
</pre>
        </div>

        <span class='le'><em>4.获取QKI转账记录接口</em> <b>描述:获取QKI转账记录接口</b> </span>
        <span class='ri'>方式:<em> GET</em></span>
        <span class='ri'>示例URL:<em> <a href='/api/get-qki-tx?address=0x16543062385673b637d7ce16efb0dd56a1a832bc&page=1&pageSize=20' target='_blank'>http://new-block-browser.quarkblockchain.cn/api/get-qki-tx?address=0x16543062385673b637d7ce16efb0dd56a1a832bc&page=1&pageSize=20</a> </em></span>
        <div class='says'>传参说明：1.address（钱包地址，<span class="tips-red">必选</span>），2.page（分页，<span class="api-tips">可选，默认1</span>），3.pageSize（每页数量，<span class="api-tips">可选，默认20</span>）</div>
        <div class='says'>返回结构示例：
            <pre class="intersays">
{
code: 0,
message: "OK",
data: [
        {
            amount: "0.000000000000000000", <span class="api-tips">//数量，正为转入，负为转出</span>
            created_at: "2018-11-02 06:07:37", <span class="api-tips">//转账时间</span>
            hash: "0x1e85805466fbdaa001caffa0a0e3c0e806db7264f01d16cff650a55cab4700c2" <span class="api-tips">//hash</span>
            tx_status: "1" <span class="api-tips">交易状态，1成功，0失败</span>
            from: "0xf82a68006dff2e326f5815fb0d020215283e4144dcdfeac659b2e9e73e0bb11f" <span class="api-tips">转出地址</span>
            to: "0xf82a68006dff2e326f5815fb0d020215283e4144dcdfeac659b2e9e73e0bb11f" <span class="api-tips">转入地址</span>
        },
        {
            amount: "1.123456780000000000",
            created_at: "2018-10-26 08:05:23",
            hash: "0x708101347d561bd16213d4d66f03e3ea4207abbe250147ba237af8e4b8149ac1",
            tx_status: "1",
            from: "0xf82a68006dff2e326f5815fb0d020215283e4144dcdfeac659b2e9e73e0bb11f",
            to: "0xf82a68006dff2e326f5815fb0d020215283e4144dcdfeac659b2e9e73e0bb11f"
        },
        {
            amount: "1.000000000000000000",
            created_at: "2018-10-26 08:02:38",
            hash: "0x2de69364e23689edb610303ab4731d10b842d42c8da3523e7f9c78bda69f0837",
            tx_status: "1",
            from: "0xf82a68006dff2e326f5815fb0d020215283e4144dcdfeac659b2e9e73e0bb11f",
            to: "0xf82a68006dff2e326f5815fb0d020215283e4144dcdfeac659b2e9e73e0bb11f"
        },
        {
            amount: "0.000000000000001018",
            created_at: "2018-10-26 08:02:12",
            hash: "0xbcb991fc5ea7657dd8fb3f1ed3a36185931ee9ab53b5e2cba666e2d526cd0a0b",
            tx_status: "1",
            from: "0xf82a68006dff2e326f5815fb0d020215283e4144dcdfeac659b2e9e73e0bb11f",
            to: "0xf82a68006dff2e326f5815fb0d020215283e4144dcdfeac659b2e9e73e0bb11f"
        },
        ......
    ]
}
</pre>
        </div>

        <span class='le'><em>4.获取区块列表接口</em> <b>描述:获取区块列表接口</b> </span>
        <span class='ri'>方式:<em> GET</em></span>
        <span class='ri'>示例URL:<em> <a href='/api/get-block?page=1' target='_blank'>http://new-block-browser.quarkblockchain.cn/api/get-block?page=1</a> </em></span>
        <div class='says'>传参说明：1.page（分页，<span class="api-tips">可选，默认1</span>）</div>
        <div class='says'>返回结构示例：
            <pre class="intersays">
{
code: 0,
message: "OK",
data: [
        {
            height: "291527",<span class="api-tips">//区块高度</span>
            created_at: "2018-11-06 10:48:47",<span class="api-tips">//出块时间</span>
            tx_count: 0,<span class="api-tips">//交易笔数</span>
            hash : "0xf5afec27a7876c5226a81c1822abc8f67e6e2c4149e11067caaea38fdfd1e87a"<span class="api-tips">//区块hash</span>
        },
        {
            height: "291526",
            created_at: "2018-11-06 10:48:27",
            tx_count: 0,
            hash : "0x3f075b23442165a80bb0b896c5bfb37d5d85bbe8a7f74da0d4b41a633d6e91ac"
        },
        {
            height: "291525",
            created_at: "2018-11-06 10:47:46",
            tx_count: 0,
            hash : "0xdd3549eac6b08d0b18e08b62fb6389b6a0ac9df6532c7d4f9d9fdc90d39d5b61"
        },
        ......
    ]
}
</pre>
        </div>

        <span class='le'><em>5.获取区块详情接口</em> <b>描述:获取区块详情接口</b> </span>
        <span class='ri'>方式:<em> GET</em></span>
        <span class='ri'>示例URL:<em> <a href='/api/block?hash=0xc45a12819557c954e3edd0c8b72a387097c7b164fca2fe5a95a949367e862fad' target='_blank'>http://new-block-browser.quarkblockchain.cn/api/block?hash=0xc45a12819557c954e3edd0c8b72a387097c7b164fca2fe5a95a949367e862fad</a> </em></span>
        <div class='says'>传参说明：1.hash（区块hash，<span class="tips-red">必选</span>）</div>
        <div class='says'>返回结构示例：
            <pre class="intersays">
{
code: 0,
message: "OK",
data: [
        hash: "0xc45a12819557c954e3edd0c8b72a387097c7b164fca2fe5a95a949367e862fad",<span class="api-tips">//区块hash</span>
        height: "261632",<span class="api-tips">//区块高度</span>
        created_at: "2018-11-02 14:13:01",<span class="api-tips">//出块时间</span>
        tx_count: 1,<span class="api-tips">//交易笔数</span>
        size: "0.720",<span class="api-tips">//区块大小，单位kb</span>
        miner: "0xb4f506094d257e0855cacb6f96a74d96a0c6e8a7",<span class="api-tips">//出块方</span>
        difficulty: "15254173",<span class="api-tips">//难度</span>
        transactions: [<span class="api-tips">//交易</span>
            {
                hash: "0x092c690c60ca346206fe97786e02c740a655b24a2dcb25686ccc7cc8a7f5e77a",<span class="api-tips">//交易hash</span>
                created_at: "2018-11-02 14:13:01",<span class="api-tips">//时间</span>
                amount: "0.000000000000000000"<span class="api-tips">//交易数量</span>
            },
            ......
        ]
    ]
}
</pre>
        </div>


        <span class='le'><em>6.获取通证交易详情接口</em> <b>描述:获取通证交易详情接口</b> </span>
        <span class='ri'>方式:<em> GET</em></span>
        <span class='ri'>示例URL:<em> <a href='/api/token-tx-info?hash=0x77d939383c2fcd180488ed16465e806626d03ad1d4d7ec25ea61584c94edaaae' target='_blank'>http://new-block-browser.quarkblockchain.cn/api/token-tx-info?hash=0x77d939383c2fcd180488ed16465e806626d03ad1d4d7ec25ea61584c94edaaae</a> </em></span>
        <div class='says'>传参说明：1.hash（交易hash，<span class="tips-red">必选</span>）</div>
        <div class='says'>返回结构示例：
            <pre class="intersays">
{
code: 0,
message: "OK",
data: {
        from: "0x52f2b729fceb39a9d3411107c394658a455c45c5",<span class="api-tips">//来源</span>
        to: "0x16543062385673b637d7ce16efb0dd56a1a832bc",<span class="api-tips">//接收</span>
        gas_price: "0.000053388",<span class="api-tips">//矿工费，单位QKI</span>
        token_name: "erc_mm",<span class="api-tips">//通证名称</span>
        token_symbol: "erc_mm",<span class="api-tips">//通证符号</span>
        contract_address: "0xf20a1b8f61a186f8485a037549149079c0f3b493",<span class="api-tips">//合约地址</span>
        amount: "1000.00000000",<span class="api-tips">//交易数量</span>
        height: 207103,<span class="api-tips">//区块高度</span>
        created_at: "2018-10-24 02:57:57"<span class="api-tips">//交易时间</span>
    }
}
</pre>
        </div>
        <span class='le'><em>7.获取交易详情接口</em> <b>描述:获取交易详情接口</b> </span>
        <span class='ri'>方式:<em> GET</em></span>
        <span class='ri'>示例URL:<em> <a href='/api/get-tx?hash=0x3d3cb7333f5e39e0707dc0489fe6a629dd18b04f8c3ade15e7bcfda2628386f9' target='_blank'>https://new-block-browser.quarkblockchain.cn/api/get-tx?hash=0x3d3cb7333f5e39e0707dc0489fe6a629dd18b04f8c3ade15e7bcfda2628386f9</a> </em></span>
        <div class='says'>传参说明：1.hash（交易hash，<span class="tips-red">必选</span>）</div>
        <div class='says'>返回结构示例：
            <pre class="intersays">
{
code: 0,
message: "OK",
data: {
        blockHash: "0x56b6c865ecf81d59da70a678f057341e6195aa7fd493a4e9d60e2ed0675e49ec",<span class="api-tips">//区块Hash</span>
        blockNumber: "652477",<span class="api-tips">//高度</span>
        from: "0xbe15892b305d1a21ce018073eee95205c5a58441",<span class="api-tips">//来源</span>
        gas: "52417",<span class="api-tips">//使用gas</span>
        gasPrice: "0.000000001",<span class="api-tips">//gas价格</span>
        hash: "0x3d3cb7333f5e39e0707dc0489fe6a629dd18b04f8c3ade15e7bcfda2628386f9",<span class="api-tips">//交易Hash</span>
        input: "0xa9059cbb000000000000000000000000a25911fdcd939d2d7c8456dd3d5886808afbd3e40000000000000000000000000000000000000000000000000000000022de6433",<span class="api-tips">//input</span>
        nonce: 16,<span class="api-tips">//nonce</span>
        to: "0x4175aa5d372015b67ef58514414086f0f36caa7a",<span class="api-tips">//接收</span>
        transactionIndex: "0x0",
        value: "0",<span class="api-tips">//金额</span>
        v: "0x267e1ce",
        r: "0xfdaca1fda979e8d78040f5f257480055bfccc9c942420ff5b91eb1e289b2c2eb",
        s: "0x41806f0008a33cb7143b52fb7a76dab4051f75c09f87015db641f3003c75e666",
        created_at: "2019-03-28 15:58:06",<span class="api-tips">//交易时间</span>
        tx_status: "交易成功",<span class="api-tips">//状态</span>
        contract_address: "",<span class="api-tips">//合约地址</span>
        is_token_tx: true<span class="api-tips">//是否为合约交易</span>
    }
}
</pre>
        </div>
        <span class='le'><em>8.获取地址详情</em> <b>描述:获取地址详情接口</b> </span>
        <span class='ri'>方式:<em> GET</em></span>
        <span class='ri'>示例URL:<em> <a href='/api/get-address-info?address=0xbe15892b305d1a21ce018073eee95205c5a58441' target='_blank'>https://new-block-browser.quarkblockchain.cn/api/get-address-info?address=0xbe15892b305d1a21ce018073eee95205c5a58441</a> </em></span>
        <div class='says'>传参说明：1.address（地址，<span class="tips-red">必选</span>）</div>
        <div class='says'>返回结构示例：
            <pre class="intersays">
{
code: 0,
message: "OK",
data: {
    jsonrpc: "2.0",
    id: 76,
    result: "9.999130721",<span class="api-tips">//QKI余额</span>
    address: "0xbe15892b305d1a21ce018073eee95205c5a58441",<span class="api-tips">//地址</span>
    transactions: {
        current_page: 1,
        data: [
            {
                id: 16696,
                from: "0xbe15892b305d1a21ce018073eee95205c5a58441",<span class="api-tips">//来源</span>
                to: "0x4175aa5d372015b67ef58514414086f0f36caa7a",<span class="api-tips">//接收</span>
                hash: "0xd29d85d0a4d4c4acb93cab01a231774021ee118252be74248b15bbc866b1b11e",<span class="api-tips">//交易hash</span>
                block_hash: "0xc5e586c8c6205c519e55dfa704a9c990d8eaf2fe144963dbac11631c0418ce4c",<span class="api-tips">//区块hash</span>
                block_number: 656439,<span class="api-tips">//高度</span>
                gas_price: "0.000000001",<span class="api-tips">//矿工费</span>
                amount: "0.000000000000000000",<span class="api-tips">//交易数量</span>
                created_at: "2019-03-29 08:28:36",
                updated_at: "2019-03-29 08:30:05",
                tx_status: 1
            },
            ],
            first_page_url: "https://new-block-browser.quarkblockchain.cn/api/get-address-info?page=1",
            from: 1,
            last_page: 1,
            last_page_url: "https://new-block-browser.quarkblockchain.cn/api/get-address-info?page=1",
            next_page_url: null,
            path: "https://new-block-browser.quarkblockchain.cn/api/get-address-info",
            per_page: 20,
            prev_page_url: null,
            to: 19,
            total: 19
            }
        }
    }
}
</pre>
        </div>
        <span class='le'><em>9.获取合约地址详情</em> <b>描述:获取合约地址详情接口</b> </span>
        <span class='ri'>方式:<em> GET</em></span>
        <span class='ri'>示例URL:<em> <a href='/api/get-contract-address-info?address=0x4175aa5d372015b67ef58514414086f0f36caa7a' target='_blank'>https://new-block-browser.quarkblockchain.cn/api/get-contract-address-info?address=0x4175aa5d372015b67ef58514414086f0f36caa7a</a> </em></span>
        <div class='says'>传参说明：1.address（地址，<span class="tips-red">必选</span>）</div>
        <div class='says'>返回结构示例：
            <pre class="intersays">
{
    code: 0,
    message: "OK",
    data: {
        token: {
                id: 3,
                token_name: "cct",<span class="api-tips">//通证名称</span>
                token_symbol: "cct",<span class="api-tips">//通证符号</span>
                contract_address: "0x4175aa5d372015b67ef58514414086f0f36caa7a",<span class="api-tips">//合约地址</span>
                created_at: "2019-03-27 10:10:35",
                updated_at: "2019-03-27 10:10:35"
            },
        decimals: 8,<span class="api-tips">//小数位数</span>
        result: "1000000000",<span class="api-tips">//通证总量</span>
        address: "0x4175aa5d372015b67ef58514414086f0f36caa7a",
        tx: {
            current_page: 1,
            data: [
            {
                id: 77,
                token_id: 3,
                to_address_id: 768,
                amount: "5.84999987",<span class="api-tips">//交易数量</span>
                tx_id: 16696,
                created_at: "2019-03-29 08:28:36",
                updated_at: "2019-03-29 08:30:05",
                from_address_id: 755,
                tx_status: 1,
                contract_address: "0x4175aa5d372015b67ef58514414086f0f36caa7a",
                token_symbol: "cct",
                from_address: "0xbe15892b305d1a21ce018073eee95205c5a58441",<span class="api-tips">//来源</span>
                to_address: "0x062be095a45acc1f7ec8ba9b7156a98b66ad3ea2",<span class="api-tips">//接收</span>
                hash: "0xd29d85d0a4d4c4acb93cab01a231774021ee118252be74248b15bbc866b1b11e"<span class="api-tips">//交易Hash</span>
            },
            ],
            first_page_url: "https://new-block-browser.quarkblockchain.cn/api/get-address-info?page=1",
            from: 1,
            last_page: 1,
            last_page_url: "https://new-block-browser.quarkblockchain.cn/api/get-address-info?page=1",
            next_page_url: null,
            path: "https://new-block-browser.quarkblockchain.cn/api/get-address-info",
            per_page: 20,
            prev_page_url: null,
            to: 19,
            total: 19
        }
    }
}
</pre>
        </div>
        <span class='le'><em>10.搜索接口</em> <b>描述:搜索接口</b> </span>
        <span class='ri'>方式:<em> GET</em></span>
        <span class='ri'>示例URL:<em> <a href='/api/search?keyword=0x4175aa5d372015b67ef58514414086f0f36caa7a' target='_blank'>https://new-block-browser.quarkblockchain.cn/api/search?keyword=0x4175aa5d372015b67ef58514414086f0f36caa7a</a> </em></span>
        <div class='says'>传参说明：1.keyword（关键词，<span class="tips-red">必选</span>）</div>
        <div class='says'>返回结构示例：
            <pre class="intersays">
{
    code: 0,
    msg: "OK",
    data: {
            type: address,<span class="api-tips">//类型</span>
            hash: "0x4175aa5d372015b67ef58514414086f0f36caa7a",<span class="api-tips">//hash</span>
        }
    }
}
</pre>
        </div>
    </div>
</div>
<div id="foot">
    © 2018 quarkblockchain.com
</div>


<!--浮动接口导航栏-->
<div id="floatMenu">
    <ul class="menu"></ul>
</div>
</body>
</html>
