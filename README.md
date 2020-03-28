# qki区块浏览器
浏览夸克区块链上的各种数据

## 配置
#数据库类型
DB_CONNECTION=mysql  

#数据库地址
DB_HOST=127.0.0.1 

#数据库端口
DB_PORT=3306 

#数据库库名
DB_DATABASE=qkiscan 

#数据库用户名
DB_USERNAME=root 

#数据库密码
DB_PASSWORD=root

#节点rpc地址
RPC_HOST 

# 静态文件 CDN 地址
ASSETS_HOST=

# sentry 异常捕获
SENTRY_DSN=

# 捐赠地址
DONATE_ADDRESS=

# CNZZ统计ID
CNZZ_ID=

# ICP 备案号
ICP_NUM=

## 运行
同步区块数据
```
php artisan doSync
```