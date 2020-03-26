# qki区块浏览器
浏览夸克区块链上的各种数据

## 配置
DB_CONNECTION=mysql  #数据库类型

DB_HOST=127.0.0.1 #数据库地址

DB_PORT=3306 #数据库端口

DB_DATABASE=qkiscan #数据库库名

DB_USERNAME=root #数据库用户名

DB_PASSWORD=root #数据库密码

RPC_HOST 节点rpc地址

ICP_NUM  备案信息

## 运行
配置.env

执行迁移

同步区块数据（建议配置定时任务，每分钟一次）
```
php artisan doSync
```