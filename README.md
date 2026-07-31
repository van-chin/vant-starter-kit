# vant-starter-kit

基于 **Vite+** 工具链的现代化移动端 H5 / PWA 应用快速启动模板。集成 Vue 3.6、Vant 4、Tailwind CSS v4、Pinia、Alova、Nitro 全栈能力，开箱即用。

> 👀 **Vue 3.6 RC** — 已升级至 `3.6.0-rc.2`，Vapor Mode 作为前瞻特性可用，等待正式版发布和生态成熟后全面启用。

## ✨ 特性

- 🏗️ **App Shell 架构** — 移动端视口锁定方案，body 焊死永不滚动，头/脚钉死，只有 main 内部滚动。浏览器保留下拉刷新，PWA 模式提供类原生 App 体验
- 🌓 **深色模式** — VueUse `useDark` + Tailwind CSS v4 `@custom-variant` + Vant `ConfigProvider` 三方协同，一键切换
- 📱 **Vant 4** — 移动端 UI 组件库，自动导入组件，支持深色模式
- 🎨 **Tailwind CSS v4** — 原子化 CSS，`@custom-variant` 扩展能力
- 🗂️ **文件系统路由** — `vue-router/auto-routes` + `vite-plugin-vue-layouts-next` 布局系统
- 🧩 **可组合式布局** — Header/Footer 显隐控制（`useLayoutConfig`）+ 页面级组件替换（`useLayoutCustomization`），提供开放 API 供业务层扩展
- 📡 **Alova 请求策略** — 统一业务码拦截、method 级缓存策略（`useRequest` composable）
- 🏪 **Pinia 状态管理** — Composition API 风格的 Store，SSR 兼容
- 🌐 **Nitro 全栈** — 内置 Nitro 服务端，支持 SQLite 数据库开发 API
- 📅 **Day.js** — 国际化日期处理，预配中文 locale
- 🔐 **认证体系** — 登录/登出、JWT Token 管理、未授权拦截
- 📐 **三种布局** — 移动端默认布局、数据大屏布局、管理后台布局
- 🔧 **TypeScript 严格模式** — `noUncheckedIndexedAccess` 增强安全性

## 技术栈

| 类别      | 技术                                                                                             |
| --------- | ------------------------------------------------------------------------------------------------ |
| 构建工具  | [Vite+](https://viteplus.dev/) (v0.2.6)                                                          |
| 框架      | [Vue 3.6 RC](https://vuejs.org/)（Composition API, `<script setup>`）                            |
| 编译模式  | VDOM（标准）— [Vapor Mode](https://vuejs.org/guide/extras/vapor-mode) 已就绪，等待生态成熟后启用 |
| UI 库     | [Vant 4](https://vant-ui.github.io/)                                                             |
| 工具库    | [VueUse](https://vueuse.org/) (useDark, useToggle)                                               |
| 状态管理  | [Pinia](https://pinia.vuejs.org/)                                                                |
| 路由      | [Vue Router 5](https://router.vuejs.org/) + 文件系统路由                                         |
| HTTP 请求 | [Alova](https://alova.js.org/) + Axios 适配器                                                    |
| CSS       | [Tailwind CSS v4](https://tailwindcss.com/)                                                      |
| 服务端    | [Nitro](https://nitro.unjs.io/) (全栈/SSR)                                                       |
| 日期处理  | [Day.js](https://day.js.org/)                                                                    |
| 语言      | [TypeScript](https://www.typescriptlang.org/) 6.x                                                |
| 包管理    | [pnpm](https://pnpm.io/) 11.x                                                                    |

## 快速开始

### 前置要求

- Node.js >= 24.18.0
- pnpm >= 11.14.0

### 安装与启动

```bash
git clone <repo-url> vant-starter-kit
cd vant-starter-kit

# 安装依赖（使用 Vite+ 统一 CLI）
vp install

# 复制环境变量
cp .env.example .env

# 启动开发服务器
vp dev
```

### 生产构建

```bash
vp build
vp preview
```

## 项目结构

```
├── build/                       # Vite+ 插件组合
│   ├── index.ts                # 插件入口，按环境条件组合
│   └── plugins/
│       ├── vue.ts              # Vue 生态插件组
│       ├── nitro.ts            # Nitro 服务端集成
│       ├── tailwindcss.ts      # Tailwind CSS v4
│       ├── pwa.ts              # PWA 插件 (vite-plugin-pwa)
│       └── https-reverse-proxy.ts # 开发环境 HTTPS 反向代理
├── server/                      # Nitro 服务端 API
│   └── api/
│       ├── app/tabbars.ts      # 底部标签栏数据
│       ├── tab-items.ts        # Tab 列表数据
│       └── users.ts            # 用户数据 (SQLite)
├── src/
│   ├── api/                    # HTTP 请求层 (Alova)
│   │   ├── index.ts            # Alova 实例 (统一错误处理、业务码拦截)
│   │   └── methods/
│   │       ├── app.ts          # 应用配置 (tabbars 等)
│   │       ├── auth.ts         # 认证
│   │       ├── im.ts           # 腾讯云 IM
│   │       ├── oss.ts          # 阿里云 OSS
│   │       └── tabs.ts         # Tab 列表
│   ├── components/             # 组件
│   │   └── businesses/         # 业务组件
│   ├── composables/            # 组合式函数 (自动导入)
│   │   ├── useEnv.ts           # 环境变量类型安全访问
│   │   ├── useLayoutConfig.ts  # Header/Footer 显隐控制
│   │   └── useLayoutCustomization.ts # 布局组件替换 (provide/inject)
│   ├── layouts/                # 布局系统
│   │   ├── default.vue         # 移动端默认布局 (App Shell)
│   │   ├── screen.vue          # 数据大屏布局 (深色主题)
│   │   ├── admin.vue           # 管理后台布局 (可折叠侧边栏)
│   │   ├── default/components/ # 默认布局子组件
│   │   ├── screen/components/  # 大屏布局子组件
│   │   └── admin/components/   # 管理后台子组件
│   ├── pages/                  # 文件系统路由页面
│   │   ├── index.vue           # 首页 (/)
│   │   ├── my.vue              # 我的 (/my) — 含深色模式开关
│   │   ├── login.vue           # 登录 (/login)
│   │   ├── good.vue            # 商品详情 (/good) — 布局元素显隐示例
│   │   ├── admin.vue           # 管理后台 (/admin)
│   │   ├── screen.vue          # 数据大屏 (/screen)
│   │   ├── test.vue            # 布局自定义测试 (/test)
│   │   ├── list.vue            # 列表示例 (/list)
│   │   ├── pull-refresh.vue    # 下拉刷新示例 (/pull-refresh)
│   │   ├── cart.vue            # 购物车 (/cart)
│   │   ├── categories.vue      # 分类 (/categories)
│   │   └── seed.vue            # 种草 (/seed)
│   ├── plugins/                # 插件配置
│   │   └── dayjs.ts            # Day.js 中文 locale + 插件
│   ├── stores/                 # Pinia 状态管理
│   │   ├── index.ts            # Pinia 初始化 (SSR 兼容)
│   │   └── auth.ts             # 认证 Store (登录/登出/JWT)
│   └── styles/                 # 全局样式
│       └── index.css           # Tailwind CSS v4 入口 + App Shell + 深色模式
├── types/                      # 类型定义 (#types)
│   ├── index.ts                # 统一导出
│   ├── api/                    # API 类型
│   │   ├── response.ts         # 通用响应类型
│   │   ├── auth.ts             # 认证类型
│   │   ├── tab-items.ts        # Tab 类型
│   │   └── app/tabbars.ts      # 标签栏类型
│   └── automatics/             # 自动生成类型 (gitignored)
├── docs/                       # 项目文档
│   ├── mobile-app-shell-architecture.md  # App Shell 架构文档 ★ 亮点
│   ├── layout-architecture.md            # 布局架构演进
│   ├── layout-control.md                 # 显隐控制 + 组件替换方案
│   └── pwa-integration.md                # PWA 集成方案
├── vite.config.ts              # Vite+ 配置
├── nitro.config.ts             # Nitro 配置 (SQLite)
└── pnpm-workspace.yaml         # pnpm catalog 依赖版本
```

## 可用命令

| 命令              | 说明                          |
| ----------------- | ----------------------------- |
| `vp dev`          | 启动开发服务器                |
| `vp build`        | 生产构建（`tsc && vp build`） |
| `vp preview`      | 预览生产构建                  |
| `vp check`        | 格式化 + 代码检查 + 类型检查  |
| `vp test`         | 运行测试                      |
| `vp install`      | 安装依赖                      |
| `vp run <script>` | 运行 `package.json` 中的脚本  |
| `vp env doctor`   | 诊断环境问题                  |

## 核心架构

### App Shell（移动端视口锁定）

本 Starter Kit 的核心亮点——彻底解决移动端 PWA / 浏览器中"下拉刷新导致 header/footer 消失""滚动到顶部/底部布局跳动"等长期痛点。

```
html/body: overflow:hidden + position:fixed    ← 焊死，永不滚动
└── shell: vh-full / flex-col                  ← 视口高度，三段式
    ├── header (flex:none)                     ← 钉死在顶部
    ├── main (flex:1 + min-h:0 + overflow:auto) ← 唯一滚动区域
    └── footer (flex:none)                     ← 钉死在底部
```

- 浏览器模式保留原生下拉刷新
- PWA 模式抑制 overscroll，提供类原生 App 体验
- 完整文档：[docs/mobile-app-shell-architecture.md](./docs/mobile-app-shell-architecture.md)

### 深色模式

VueUse `useDark` + Tailwind CSS v4 `@custom-variant` + Vant `ConfigProvider` 三方协同：

- **状态管理**：`useDark()` 单例，`localStorage` 持久化
- **Tailwind**：`@custom-variant dark` 启用 class-based dark mode，`dark:bg-*` / `dark:text-*` 变量
- **Vant**：`<van-config-provider :theme="vantTheme">` 在 App.vue 中全局包裹，Vant 组件自动切暗色
- **切换入口**：`my.vue` 中的 `van-switch`

### 布局系统

三种布局，通过 `definePage` 指定：

```vue
<script setup lang="ts">
definePage({
  meta: {
    layout: 'default', // 或 'screen'、'admin'
    showHeader: false, // 可选：隐藏 Header
    showFooter: true, // 可选：显示 Footer
  },
});
</script>
```

| 布局      | 用途      | 特点                        |
| --------- | --------- | --------------------------- |
| `default` | 移动端 H5 | App Shell + 导航栏 + Tabbar |
| `screen`  | 数据大屏  | 深色主题 + 全屏 + 实时时钟  |
| `admin`   | 管理后台  | 可折叠侧边栏 + 顶部导航     |

同时支持页面级 Header/Footer 组件替换（`useCustomHeader` / `useCustomFooter`），详见 [layout-architecture.md](./docs/layout-architecture.md)。

### HTTP 请求

```typescript
// API 方法定义 (src/api/methods/app.ts)
export function tabbarsMethod() {
  return baseAlova.Get<AppTabBarItem[]>('/app/tabbars', {
    cacheFor: { mode: 'restore', expire: 300_000 },
  });
}

// 组件中使用 (自动导入 Alova useRequest)
const { data: tabItems } = useRequest(tabbarsMethod, { initialData: [] });
```

## 环境变量

| 变量                | 说明               | 默认值        |
| ------------------- | ------------------ | ------------- |
| `VITE_API_BASE_URL` | API 基础路径       | `/api`        |
| `VITE_TCC_APP_ID`   | 腾讯云 IM 应用 ID  | —             |
| `VITE_ALLOWED_HOST` | 允许的 Host 域名   | —             |
| `VITE_PROXY_TARGET` | HTTPS 反向代理目标 | —             |
| `VITE_PUBLIC_PATH`  | 应用基础路径       | `/`           |
| `VITE_ENV_NAME`     | 环境名称           | `development` |

## CI/CD 自动部署（Cloudflare Workers）

推送 `main` 分支后，GitHub Actions 自动构建并部署到 Cloudflare Workers，无需手动执行 `vp run wrangler:deploy`：

```
git push origin main
      │
      ▼
GitHub Actions (ubuntu-latest)
  ├─ pnpm install --frozen-lockfile   (pnpm 11.18.0 / Node 24)
  ├─ pnpm build                       (tsc && vp build)
  └─ wrangler deploy                  (工作目录 .output/server，wrangler 4.116.0)
      │
      ▼
Cloudflare Workers (van-chin-vant-starter-kit)
```

### 首次配置（一次性）

在 GitHub 仓库 **Settings → Secrets and variables → Actions** 添加两个 secrets：

| Secret                    | 获取方式                                                                                       |
| ------------------------- | ---------------------------------------------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`    | Cloudflare 控制台 → 右上角头像 → **My Profile → API Tokens → Create Token**，选择 *Edit Cloudflare Workers* 模板 |
| `CLOUDFLARE_ACCOUNT_ID`   | Cloudflare 控制台 → **Workers & Pages** 右侧栏的 Account ID                                    |

> ⚠️ **先配置 secrets，再推送 workflow 文件**，否则首次运行会因缺少 token 失败。

### 触发方式

- **自动**：推送 `main` 分支
- **手动**：GitHub Actions 页面 → Deploy to Cloudflare Workers → **Run workflow**

### 构建期环境变量

CI 构建默认注入 `VITE_ENV_NAME=production`。如需其他 `VITE_*` 变量（如 `VITE_TCC_APP_ID`），在 `.github/workflows/deploy.yml` 的 Build 步骤按注释追加（也可存为 Actions secret 后引用，如 `${{ secrets.VITE_TCC_APP_ID }}`）。

## 服务端 API

项目使用 [Nitro](https://nitro.unjs.io/) 提供服务端能力，支持 SQLite 数据库开箱即用：

```typescript
// server/api/users.ts
export default defineHandler(async () => {
  const db = useDatabase();
  const { rows } = await db.sql`SELECT * FROM users`;
  return { code: 0, message: 'success!', data: rows };
});
```

## 许可证

[MIT](LICENSE)
