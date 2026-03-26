# 自研区块浏览器前端（Blockscout API）

基于 Blockscout REST API 的浏览器风格前端：独立路由与 UI、多语言、`/api` 同域反代，页面只消费前端 View Model，不直接绑定 Blockscout 原始 JSON。

## 技术栈

- React 19、Vite、TypeScript
- React Router 7
- TanStack Query v5
- axios（统一 `src/api/client.ts` 实例）
- react-i18next / i18next
- Tailwind CSS 3
- dayjs（时间）
- Vitest（单元测试）

## 本地开发

```bash
npm install
cp .env.example .env
# 编辑 .env，设置 VITE_DEV_BLOCKSCOUT_ORIGIN 为你的 Blockscout 实例 origin
npm run dev
```

浏览器访问开发服务器地址（默认 `http://localhost:5173`）。请求 `/api/v2/...` 会由 Vite 代理到 `VITE_DEV_BLOCKSCOUT_ORIGIN`。

## 生产构建

```bash
npm run build
npm run preview   # 本地预览 dist
```

将 `dist/` 作为静态资源由 Nginx/Caddy 托管；`/api`、`/socket`、`/sitemap.xml` 等需反代到 Blockscout，与 [Blockscout 官方 Proxy 说明](https://docs.blockscout.com/setup/deployment/frontend-migration/proxy-setup) 一致。

## 环境变量

见仓库根目录 [`.env.example`](./.env.example)。**勿**在源码中写死某一链的 Blockscout 公网域名；通过部署时环境变量与反向代理注入。

原生币符号通过 `VITE_APP_NATIVE_SYMBOL` 配置（如 `ETH`、`BNB`）；未设置则金额组件仅显示数值，不附带默认符号。

## 反向代理说明

浏览器只访问站点域名；前端使用相对路径 `VITE_APP_API_BASE`（默认 `/api`）调用 REST，由网关转发到 Blockscout，从而：

- 避免浏览器 CORS
- 与官方推荐部署方式一致
- 日后可将 `/api` 背后替换为自研 Go BFF 而少改页面代码

### Nginx 示例

```nginx
server {
    listen 80;
    server_name explorer.example.com;

    root /var/www/qkiscan/dist;
    index index.html;

    location /api/ {
        proxy_pass https://blockscout-backend.example.com;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /socket/ {
        proxy_pass https://blockscout-backend.example.com;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    location /sitemap.xml {
        proxy_pass https://blockscout-backend.example.com;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Caddy 示例

```caddy
explorer.example.com {
    root * /var/www/qkiscan/dist
    file_server
    try_files {path} {path}/ /index.html

    handle_path /api/* {
        reverse_proxy https://blockscout-backend.example.com
    }
    handle_path /socket/* {
        reverse_proxy https://blockscout-backend.example.com
    }
    handle /sitemap.xml {
        reverse_proxy https://blockscout-backend.example.com
    }
}
```

## 多语言规则

支持 `en`、`zh-CN`、`zh-TW`。

优先级：**URL 查询参数 `lang`** > **localStorage（`explorer-lang`）** > **浏览器语言** > **环境变量默认语言**。

切换语言时保留当前路径与其它 query，并写入 `lang`（见 `src/hooks/useLanguage.ts`、`src/i18n/syncLanguageToUrl.ts`）。

## 路由（兼容旧链接）

| 路径 | 说明 |
|------|------|
| `/` | 首页 |
| `/blocks` | 区块列表 |
| `/blocks/:heightOrHash` | 区块详情 |
| `/txs` | 交易列表 |
| `/tx/:hash` | 交易详情（`?tab=` 子 Tab） |
| `/address/:address` | 地址详情（`?tab=`） |
| `/tokens` | Token 列表 |
| `/token/:address` | Token 详情（`?tab=`） |
| `/search?q=` | 搜索 |

## API 适配层

所有 HTTP 调用经 `src/api/`：`client.ts` 与各模块（`blocks.ts`、`transactions.ts` 等）拉取数据，`mappers/` 转为 `view-models.ts` 中的 VM。**禁止**在页面组件内直接 `fetch('/api/...')` 或使用原始 Blockscout 类型渲染。

分页遵循 Blockscout 的 keyset：`next_page_params` 作为下一页参数（见 `src/utils/query.ts`）。

## 后续接入 Go BFF

保持页面只依赖 VM 与 `src/api` 模块；将 `client.ts` 的 `baseURL` 仍指向 `/api`，由网关把 `/api` 切到 BFF，BFF 再聚合或缓存 Blockscout 即可。

## 测试

```bash
npm test
```

## 限流说明

Blockscout 默认对匿名请求有速率限制（参见官方文档）。首页已采用串行请求聚合首屏数据；详情页子 Tab 按需 `enabled` 查询，避免无意义并发。
