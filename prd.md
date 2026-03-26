# 给 Cursor 的项目实现文档

## 1. 项目名称

自研区块浏览器前端（Blockscout API 驱动版）

---

## 2. 项目背景

现有链浏览器后端/索引能力使用 Blockscout，数据库与索引服务已经存在，但 Blockscout 官方前端不满足以下需求：

* 不方便做多语言
* 编译和定制成本高
* 页面风格与交互无法按需重构
* 后续希望逐步形成自有浏览器前端体系

因此，本项目目标是：

**保留 Blockscout 作为后端数据源，独立开发一个新的前端项目。**

当前阶段：

* **不新增 Go 中间层**
* **前端直接调用 Blockscout API**
* 使用反向代理把 `/api`、`/socket` 等路径转到 Blockscout 后端
* 所有 UI、多语言、路由、页面结构、组件体系全部自研

Blockscout 文档说明 REST API 本身就是给新版 UI 渲染使用的，每个实例还可以通过自身的 `api-docs` 查看 schema；同时官方推荐在前后端之间加一层 web proxy，并将 `/api`、`/socket`、`/sitemap.xml` 等路径转发到后端。其 REST API 采用 keyset pagination，默认每页 50 条，需要使用返回体里的 `next_page_params` 继续翻页。([Blockscout 文档][1])

---

## 3. 当前阶段的明确目标

本期只实现一个可上线的 MVP 前端，要求：

1. 能替代 Blockscout 官方前端的核心查看能力
2. 兼容原有无语言前缀的链接
3. 支持多语言
4. 支持基础搜索
5. 支持区块、交易、地址等核心详情页
6. 支持移动端适配
7. 代码结构清晰，后续方便增加 Go BFF 层
8. 不把页面组件直接绑定到 Blockscout 原始 API 响应结构

---

## 4. 当前阶段明确不做

以下内容本期不做，或者只预留结构：

* 不新增 Go API/BFF
* 不直接读数据库
* 不实现复杂登录/用户中心
* 不实现完整合约源码验证流程
* 不实现全量 NFT 深度页面
* 不实现复杂图表分析中心
* 不实现站内后台管理系统
* 不实现新的链索引器
* 不强依赖 SEO SSR
* 不强制将所有路由改造成 `/en/...` 或 `/zh/...`

---

## 5. 总体技术路线

### 5.1 架构

采用以下架构：

**Browser → 自研前端 → `/api` 同域反代 → Blockscout 后端**

说明：

* 浏览器只访问前端站点域名
* 前端发起的 API 请求统一访问相对路径 `/api/...`
* Nginx/Caddy/网关负责把 `/api`、`/socket` 等路径反代到 Blockscout
* 前端项目内部必须封装独立 API SDK，不允许在页面中到处手写 `fetch('/api/...')`

官方代理建议中，`/api`、`/socket`、`/sitemap.xml`、认证相关路径都应路由到后端，其余 URL 路由到前端。([Blockscout 文档][2])

### 5.2 为什么当前不写 Go

当前优先级是快速上线新前端，Go BFF 暂时不是必须。
后续满足以下任一条件时，再补 Go：

* 需要聚合多个接口降低前端请求数
* 需要服务端缓存
* 需要把 Blockscout API 和自定义业务数据统一输出
* 需要对外开放自有稳定 API
* 需要屏蔽 Blockscout 接口变动

---

## 6. 技术选型

### 6.1 前端框架

使用：

* React 19
* Vite
* TypeScript

### 6.2 路由

使用：

* React Router

### 6.3 状态管理

使用轻量方案：

* Zustand 或 React Context + hooks

要求：

* 页面级远程数据状态尽量交给 query 层管理
* 全局只保存语言、主题、搜索历史、简单 UI 状态

### 6.4 远程数据请求

使用：

* TanStack Query
* fetch 或 axios，二选一
* 推荐 axios + 统一实例

### 6.5 多语言

使用：

* react-i18next
* i18next
* JSON 语言包

### 6.6 样式

推荐以下之一：

* Tailwind CSS
* 或 CSS Modules + 自定义 design tokens

优先推荐 Tailwind CSS，因为实现速度快。

### 6.7 日期/格式化

使用：

* dayjs

### 6.8 数值处理

使用：

* viem 或 ethers 的工具函数处理 wei / 地址
* 大数展示不要用原生 number 直接算金额

---

## 7. 部署与代理要求

### 7.1 域名访问模型

前端最终对外路径示例：

* `/`
* `/blocks`
* `/blocks/:heightOrHash`
* `/tx/:hash`
* `/address/:address`
* `/tokens`
* `/token/:address`
* `/search?q=...`

API 访问路径统一为：

* `/api/...`

### 7.2 代理要求

反向代理至少处理以下路径：

* `/api`
* `/socket`
* `/sitemap.xml`

其它路径走前端静态站点。

这是为了：

* 避免 CORS 问题
* 让前端始终使用相对路径访问 API
* 未来更容易在 `/api` 后接入 Go BFF
* 保持部署结构清晰

官方 frontend migration 文档就是这样建议的。([Blockscout 文档][2])

### 7.3 API 限流认知

Blockscout 文档当前写明默认无 API key 是 **5 req/sec**，默认 IP 限制为 **300 req/min**；此外还提示 per-instance API access 未来会弃用。前端因此必须：

* 控制首页并发数量
* 对列表页翻页、搜索做节流
* 做统一 API 适配层
* 未来允许从 Blockscout per-instance API 平滑迁移到别的 API 来源 ([Blockscout 文档][3])

---

## 8. 多语言方案

## 8.1 语言列表

本期支持：

* `en`
* `zh-CN`
* `zh-TW`

## 8.2 路由兼容策略

必须兼容原有链接，不强制所有页面都改成语言前缀路径。

继续保留旧路由，例如：

* `/`
* `/blocks`
* `/blocks/123`
* `/tx/0x...`
* `/address/0x...`

## 8.3 语言判定优先级

页面初始化语言优先级如下：

1. URL 查询参数 `lang`
2. `localStorage` 中用户上次手动选择的语言
3. `navigator.language`
4. 默认语言（建议 `en`）

即：

* `/tx/0xabc?lang=zh-CN` → 强制中文简体
* `/tx/0xabc` 且本地存的是 `zh-TW` → 用繁体
* `/tx/0xabc` 没有本地存储 → 按浏览器语言
* 都没有 → 默认 `en`

## 8.4 语言切换行为

语言切换器要求：

1. 点击切换语言时立即切换 UI 文案
2. 将用户选择保存到 `localStorage`
3. 默认同步更新当前 URL 的 `lang` 参数
4. 保持当前 pathname 和其他 query 参数不丢失

示例：

* 当前：`/tx/0x123?tab=logs`
* 切换到 `zh-CN`
* 变成：`/tx/0x123?tab=logs&lang=zh-CN`

## 8.5 为什么选择 query 参数而不是强制语言前缀

当前项目更看重：

* 兼容原链接
* 低改动成本
* 快速上线
* 同一路由内容主体不因语言变化而变化

因此采用：

* **旧路径不变**
* **`?lang=` 显式覆盖**
* **浏览器语言 / 本地缓存自动选择**

## 8.6 语言包结构

建议：

```txt
src/locales/
  en/
    common.json
    home.json
    block.json
    tx.json
    address.json
    token.json
    search.json
  zh-CN/
    common.json
    home.json
    block.json
    tx.json
    address.json
    token.json
    search.json
  zh-TW/
    common.json
    home.json
    block.json
    tx.json
    address.json
    token.json
    search.json
```

要求：

* 所有文案必须使用 key
* 不允许在页面内硬编码多语言字符串
* 业务字段值不翻译时，也要通过格式化函数统一处理

---

## 9. 页面范围

## 9.1 第一阶段必须完成的页面

### 首页 `/`

展示：

* 链名称
* 最新区块高度
* 总交易数/近期交易概览
* 最新区块列表
* 最新交易列表
* 搜索框
* 可选：TPS / 平均出块时间 / 原生币价格（如果接口可取）

### 区块列表 `/blocks`

展示：

* 区块高度
* 区块哈希
* 出块时间
* 交易数
* gas 使用情况
* 验证者 / 矿工地址（如果有）

### 区块详情 `/blocks/:heightOrHash`

展示：

* 高度
* 哈希
* 时间
* 父区块
* 交易数量
* gas limit / gas used
* base fee / priority fee（如果链与接口支持）
* validator / miner
* 区块内交易列表

### 交易列表 `/txs`

展示：

* 交易哈希
* 方法名 / 类型（如果接口提供）
* 状态
* 区块号
* 时间
* from / to
* 值
* 手续费

### 交易详情 `/tx/:hash`

展示：

* hash
* 状态
* 区块号
* 时间
* nonce
* from / to
* value
* gas price / gas used / max fee / max priority fee
* transaction fee
* input data
* token transfers
* logs
* internal transactions（如果接口支持）
* state changes（如果接口支持）
* raw trace（如果接口支持）

### 地址详情 `/address/:address`

展示：

* 地址
* 标签 / 名称（若接口有）
* 原生币余额
* 交易数量
* token balances
* tabs:

  * transactions
  * token transfers
  * internal txs
  * logs
  * tokens

### 搜索结果

支持输入：

* 地址
* 交易哈希
* 区块高度
* 区块哈希
* token 合约地址

### Token 列表 `/tokens`

展示：

* token 名称
* symbol
* holders
* transfers
* total supply

### Token 详情 `/token/:address`

展示：

* 名称
* symbol
* decimals
* total supply
* holder count
* transfer count
* holders list
* transfers list

---

## 10. 页面信息架构与路由

建议路由：

```txt
/
#/ 可选不使用 hash router，默认 browser router

/blocks
/blocks/:heightOrHash

/txs
/tx/:hash

/address/:address

/tokens
/token/:address

/search
```

可选支持：

```txt
?q=...
?tab=...
?lang=...
```

不要求本期实现：

```txt
/en/...
/zh-CN/...
/zh-TW/...
```

但代码结构上要为未来可能加语言前缀留空间。

---

## 11. API 设计原则（前端侧）

## 11.1 强制要求：做 API 适配层

禁止在页面组件中直接写：

```ts
fetch('/api/v2/transactions')
```

必须统一封装为 SDK：

```txt
src/api/
  client.ts
  blocks.ts
  transactions.ts
  addresses.ts
  tokens.ts
  search.ts
  types.ts
  mappers/
```

## 11.2 原则

页面只依赖“前端视图模型”，不直接依赖 Blockscout 原始响应。

例如：

* `BlockscoutTransactionRaw`
* `ExplorerTransactionVM`

通过 mapper 转换：

* 原始 API 字段 → 统一 VM
* 页面只用 VM

## 11.3 为什么必须这么做

因为 Blockscout 官方当前已经把 PRO API 作为主方向，并提示 per-instance API access 未来会弃用。现在虽然仍可直接使用每个实例的 API，但本项目必须把 API 来源与页面展示解耦。([Blockscout 文档][1])

---

## 12. API 模块建议

建议至少实现以下模块。

## 12.1 client.ts

职责：

* 创建 axios/fetch 统一实例
* baseURL 设为 `/api`
* 统一 timeout
* 统一错误处理
* 统一 query 序列化
* 统一 debug log（仅开发环境）

## 12.2 blocks.ts

提供：

* `getMainPageBlocks()`
* `getBlocks(params)`
* `getBlock(id)`
* `getBlockTransactions(id, params)`

## 12.3 transactions.ts

提供：

* `getMainPageTransactions()`
* `getTransactions(params)`
* `getTransaction(hash)`
* `getTransactionTokenTransfers(hash, params)`
* `getTransactionLogs(hash, params)`
* `getTransactionInternalTxs(hash, params)`
* `getTransactionStateChanges(hash, params)`

## 12.4 addresses.ts

提供：

* `getAddress(address)`
* `getAddressCounters(address)`
* `getAddressTransactions(address, params)`
* `getAddressTokenTransfers(address, params)`
* `getAddressInternalTxs(address, params)`
* `getAddressLogs(address, params)`
* `getAddressTokenBalances(address, params)`

## 12.5 tokens.ts

提供：

* `getTokens(params)`
* `getToken(address)`
* `getTokenTransfers(address, params)`
* `getTokenHolders(address, params)`

## 12.6 search.ts

提供：

* `search(query)`

## 12.7 stats.ts

提供：

* `getStatsCounters()`
* 可选：`getNativeCoinPrice()`

---

## 13. 分页处理要求

Blockscout REST API 使用 keyset pagination，默认首批返回 50 条，继续翻页要带上响应中的 `next_page_params`。本项目所有列表页必须兼容这种模式，不要假设是传统的 `page=1&page_size=20` 偏移分页。([Blockscout 文档][1])

实现要求：

1. 为每种列表页定义独立分页类型
2. 保留 `next_page_params`
3. 支持“加载更多”或“下一页”
4. 不要求服务端总页数
5. 如果接口没有 `next_page_params`，视为无更多数据

建议前端产品形态：

* 首页：固定条数
* 列表页：分页按钮或加载更多
* 详情页子列表：优先加载更多

---

## 14. 目录结构建议

```txt
src/
  app/
    router.tsx
    providers.tsx
    App.tsx

  api/
    client.ts
    types.ts
    blocks.ts
    transactions.ts
    addresses.ts
    tokens.ts
    stats.ts
    search.ts
    mappers/
      blocks.ts
      transactions.ts
      addresses.ts
      tokens.ts

  components/
    layout/
      AppLayout.tsx
      Header.tsx
      Footer.tsx
      LanguageSwitcher.tsx
      SearchBar.tsx
    common/
      Loading.tsx
      ErrorState.tsx
      EmptyState.tsx
      CopyButton.tsx
      AddressLink.tsx
      HashText.tsx
      Timestamp.tsx
      Amount.tsx
      StatusBadge.tsx
      PaginationControls.tsx
    blocks/
    transactions/
    addresses/
    tokens/

  hooks/
    useLanguage.ts
    useSearch.ts
    useExplorerQuery.ts

  pages/
    home/
      HomePage.tsx
    blocks/
      BlocksPage.tsx
      BlockDetailPage.tsx
    transactions/
      TransactionsPage.tsx
      TransactionDetailPage.tsx
    addresses/
      AddressDetailPage.tsx
    tokens/
      TokensPage.tsx
      TokenDetailPage.tsx
    search/
      SearchPage.tsx
    not-found/
      NotFoundPage.tsx

  store/
    appStore.ts
    preferenceStore.ts

  i18n/
    index.ts
    detectLanguage.ts
    syncLanguageToUrl.ts

  locales/
    en/
    zh-CN/
    zh-TW/

  utils/
    format.ts
    address.ts
    hash.ts
    number.ts
    query.ts
    time.ts
    validators.ts

  styles/
    globals.css
```

---

## 15. UI/UX 要求

## 15.1 整体风格

要求：

* 简洁、清晰、偏专业数据产品
* 类似成熟区块浏览器，但视觉更现代
* 支持桌面和手机
* 不照搬 Blockscout 官方样式

## 15.2 Header

包含：

* Logo / 链名称
* 搜索框
* 导航入口
* 语言切换
* 可选主题切换

## 15.3 首页

要求：

* 首屏可快速看到最新区块和最新交易
* 搜索框显著
* 支持统计卡片
* 卡片布局移动端自动换行

## 15.4 列表页

要求：

* 表头固定清晰
* 移动端可切换为卡片形式
* hash 和地址支持缩略显示
* 提供 copy 按钮
* 时间显示支持 tooltip/相对时间

## 15.5 详情页

要求：

* 头部展示主信息
* 中部展示详情字段
* 下方 tab 展示相关列表
* 加载中和错误态明确
* 空数据也要有空态

---

## 16. 数据格式化规则

所有以下内容必须统一通过工具函数处理，不允许页面到处复制逻辑：

### 地址

* 默认短格式：`0x1234...abcd`
* 可复制
* 可跳转

### 交易哈希

* 默认短格式
* 支持完整展开或复制

### 时间

* 列表显示相对时间
* hover 或旁边显示绝对时间

### 金额

* 原生币金额统一格式化
* token 金额考虑 decimals
* 很大的数支持千分位
* 很小的数避免全 0，必要时科学计数或最小保留

### 状态

* 成功 / 失败 / 待确认统一 Badge 组件

---

## 17. 搜索行为设计

搜索框允许用户输入任意内容，前端判断并跳转：

### 输入是地址

跳到：

* `/address/:address`

### 输入像交易哈希

跳到：

* `/tx/:hash`

### 输入是纯数字

先尝试作为区块高度：

* `/blocks/:height`

### 输入其它字符串

跳到：

* `/search?q=...`

### 搜索页

展示：

* 识别结果
* 若 Blockscout 搜索 API 支持，则显示候选列表

---

## 18. 缓存与请求策略

在前端使用 TanStack Query：

### 首页

* 可设置短缓存，如 10~30 秒
* 页面回到前台可刷新

### 列表页

* queryKey 带上筛选条件和分页参数
* 支持缓存前一页结果

### 详情页

* 地址、区块、交易详情可以短时间缓存
* 切 tab 不要重复把基础详情重新请求多次

### 错误处理

* 统一错误 toast 或错误态组件
* 404 和普通失败要区分

---

## 19. 性能要求

由于默认限流存在，前端必须控制请求。Blockscout 文档写明无 API key 默认 5 req/sec、300 req/min，所以首页不要一次性并发过多请求。([Blockscout 文档][3])

实现要求：

1. 首页首屏接口数量尽量控制
2. 详情页子 tab 按需加载
3. 用户切换 tab 时再请求 tab 数据
4. 搜索输入做 debounce
5. 不要在列表页面无限自动预取太多页
6. 对重复数据请求做 query 层去重

---

## 20. 错误处理与兜底

必须处理以下情况：

### 20.1 API 失败

展示错误组件，可点击重试

### 20.2 资源不存在

显示 404 风格页面或“未找到”

### 20.3 限流

如果遇到 429：

* 给出友好提示
* 不疯狂重试
* 支持用户手动刷新

### 20.4 部分字段缺失

Blockscout 某些链或某些接口不一定所有字段都有，页面必须容错：

* 无值显示 `-`
* 不可因为某个字段缺失导致整个页面崩溃

---

## 21. 代码规范

要求 Cursor 严格遵守：

1. 全项目使用 TypeScript
2. 尽量不使用 `any`
3. API raw types 与 view model types 分离
4. 组件拆分合理，不要巨型单文件
5. hooks 命名规范
6. 工具函数单独放到 `utils`
7. 所有 magic string 尽量抽常量
8. 所有多语言文案必须走 i18n
9. 不允许在页面文件里直接拼装复杂 API query
10. 每个页面必须有 loading / error / empty 三态

---

## 22. 测试要求

至少完成：

### 单元测试

* 格式化函数
* 语言判定函数
* query 参数同步函数
* mapper 转换函数

### 关键交互测试

* 初次访问根据浏览器语言选择语言
* `?lang=` 可以覆盖语言
* 切换语言会保留当前路径和已有 query 参数
* 搜索地址/交易/区块跳转正确
* 列表翻页时正确带上 `next_page_params`

---

## 23. 环境变量要求

前端支持以下环境变量：

```txt
VITE_APP_CHAIN_NAME=
VITE_APP_DEFAULT_LANG=en
VITE_APP_ENABLE_THEME=false
VITE_APP_ENABLE_PRICE=true
VITE_APP_API_BASE=/api
```

注意：

* 默认 `VITE_APP_API_BASE=/api`
* 不要直接把某个 Blockscout 域名写死到源码里

---

## 24. 未来预留

项目结构必须为未来这些能力预留空间：

1. 增加 Go BFF
2. 增加自定义地址标签系统
3. 增加代币价格聚合
4. 增加 SEO/SSR
5. 增加 `/en/...` 这种显式语言路由
6. 增加链切换
7. 增加自定义统计图表中心

实现上要求做到：

* 页面只依赖前端 VM
* API 访问统一通过 `src/api`
* 语言系统独立
* 路由参数与语言策略解耦

---

## 25. 实现顺序要求

请按以下顺序实现，不要一开始就把所有页面堆进去。

### 第一阶段

* 初始化 React + Vite + TS 项目
* 配置路由
* 配置 i18n
* 配置 API client
* 配置 query provider
* 做基础布局和 Header
* 做语言切换器
* 实现 `lang` 参数同步逻辑
* 实现首页

### 第二阶段

* 区块列表
* 区块详情
* 交易列表
* 交易详情

### 第三阶段

* 地址详情
* Token 列表
* Token 详情
* 搜索页

### 第四阶段

* 样式统一优化
* 移动端适配
* 错误态优化
* 单元测试补齐

---

## 26. 交付要求

最终要交付：

1. 完整可运行前端项目
2. 清晰目录结构
3. README
4. `.env.example`
5. 多语言语言包
6. 可切换语言的页面
7. 基础测试
8. 开发环境运行说明
9. 生产构建说明
10. 代理配置示例（Nginx 或 Caddy 二选一）

---

## 27. README 必须包含的内容

README 至少包含：

* 项目简介
* 技术栈
* 本地开发启动方式
* 环境变量说明
* 代理配置说明
* 多语言规则说明
* 路由说明
* Blockscout API 适配层说明
* 后续如何接 Go BFF

---

## 28. 代理配置说明要求

README 中必须说明：

前端访问：

* `/` → 前端静态文件
* `/api/*` → Blockscout 后端
* `/socket/*` → Blockscout 后端 websocket

并说明这是为了：

* 避免 CORS
* 与官方推荐部署方式一致
* 后续方便替换 `/api` 背后的实现

官方 frontend migration 文档中已经明确给出了这类 proxy routing 建议。([Blockscout 文档][2])

---

## 29. 对 Cursor 的额外约束

请严格遵守以下约束：

* 不要引入 Next.js
* 不要引入服务端渲染
* 不要直接连接数据库
* 不要新增 Go 后端
* 不要把页面写成和 Blockscout 原前端耦合的结构
* 不要把 API raw response 直接在 UI 中到处使用
* 不要在多个页面重复写同样的格式化逻辑
* 不要忽略移动端
* 不要忽略 loading / error / empty 态
* 不要把语言逻辑写死在某个页面
* 不要只支持 `en` 和 `zh` 两种，必须支持 `en` / `zh-CN` / `zh-TW`

---

## 30. 成功标准

以下全部满足，视为本期成功：

1. 前端可独立运行
2. 能通过 `/api` 正常调用 Blockscout
3. 首页、区块、交易、地址、token 页面可用
4. 多语言生效
5. 旧链接可继续访问
6. `?lang=` 可覆盖语言
7. 浏览器语言可作为默认语言来源
8. 代码结构清晰
9. 后续接 Go BFF 时不需要大改页面层

---

## 31. 可以直接开始编码的最终指令

请基于以上文档，直接实现一个完整的可运行项目。
要求先完成基础工程、路由、i18n、API 适配层和首页，再按实现顺序逐步补齐其它页面。
所有代码必须以“长期可维护”为前提，不要为了快速堆功能而牺牲结构。


[1]: https://docs.blockscout.com/devs/apis/rest "REST API Endpoints - Blockscout"
[2]: https://docs.blockscout.com/setup/deployment/frontend-migration/proxy-setup "Proxy Setup - Blockscout"
[3]: https://docs.blockscout.com/devs/apis/requests-and-limits "Requests & Limits - Blockscout"
