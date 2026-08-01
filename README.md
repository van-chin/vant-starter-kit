# vant-starter-kit

> 基于 **Vue 3 + Vant 4 + Vite+** 的移动端 H5 / PWA 极速启动模板

[![Deploy](https://img.shields.io/badge/deploy-Cloudflare%20Workers-orange)](https://vant.starter.kit.inlin.com.cn)

---

## 📦 这是什么？

一个**开箱即用**的移动端 Web 应用启动模板。克隆项目 → 安装依赖 → 启动开发 → 开始写业务代码，立刻拥有：

- 🏗️ **App Shell** 视口锁定布局（彻底解决移动端下拉刷新/橡皮筋/头脚消失）
- 🌓 **深色模式** 三路协同（CSS / Vant / 系统状态栏）
- 📲 **PWA** 完整集成（离线可用 + 添加到主屏幕 + 安装引导 + 版本更新提示）
- 🌐 **国际化** 中英文双语
- 🔍 **SEO** 动态 title + 静态 OG/Twitter Card
- 🐛 **vConsole** 手机调试面板（生产环境也可用）
- 🚀 **Cloudflare Workers** 一键部署

---

## ✨ 核心亮点

### 🏗️ App Shell 布局系统

移动端 H5/PWA 的三大噩梦——**下拉刷新导致导航消失**、**底部 Tabbar 被键盘顶飞**、**iOS 橡皮筋抖动**——全部根治。

```
body 焊死(overflow:hidden) → main 唯一滚动 → header/footer 钉死
```

- **弹性 Footer**：任意高度自定义 Footer，主内容区自动适配，无需 `padding-bottom`
- **4 层显隐控制**：URL 参数 > 页面 meta > 全局默认 > 权限限制
- **组件替换**：任一页面可注入自定义 Header/Footer，卸载自动恢复

📖 详见 [Layout 布局架构](./docs/layout-architecture.md)

### 🌓 深色模式

VueUse `useDark()` 单例驱动，三路并行：

| 机制                           | 影响范围              |
| ------------------------------ | --------------------- |
| Tailwind `dark:` 前缀          | 页面所有元素          |
| `<van-config-provider :theme>` | Vant 组件内部         |
| `<meta name="theme-color">`    | 浏览器/PWA 系统状态栏 |

📖 详见 [深色模式架构](./docs/dark-mode-architecture.md)

### 📲 PWA 完整方案

- **Service Worker**（Workbox）：离线可用 + API 网络优先 + 自动更新
- **Vant FloatingPanel 安装引导**：折叠态紧凑安装条 → 上拉展开 2×2 亮点卡片 → 下滑关闭
- **三重防重复**：PWA 模式检测 + localStorage 已安装标记 + 7 天关闭冷却
- **版本更新提示**：轮询 `version.json`，新版本发布后顶部弹出更新提示条

### 🧩 开发者体验

| 能力         | 工具/方案                                                  |
| ------------ | ---------------------------------------------------------- |
| 自动导入     | Vue/VueRouter/Pinia API + Vant 组件 + composables + stores |
| 文件系统路由 | `src/pages/` 目录结构即路由，支持 HMR                      |
| 布局系统     | 3 套开箱布局（default / admin / screen），声明式切换       |
| 移动端调试   | vConsole 生产可用 + `?vconsole` 按需开启                   |
| 统一 HTTP    | Alova + Axios + 业务码拦截 + Toast 通知                    |
| 类型安全     | TypeScript 严格模式 + `noUncheckedIndexedAccess`           |

---

## 🚀 快速开始

### 环境要求

- **Node.js** >= 24（推荐 24.18.0）
- **pnpm** >= 11.18.0（`corepack enable` 自动安装）

### 克隆 & 启动

```bash
# 1. 克隆项目
git clone <your-repo-url> my-app
cd my-app

# 2. 安装依赖
vp install

# 3. 复制环境变量
cp .env.example .env

# 4. 启动开发
vpr dev
# 浏览器打开 http://localhost:3000
```

### 使用 HTTPS（可选，PWA 开发需要）

```bash
# 停止 443 端口的其他服务（如 Docker openresty）
docker stop openresty

# sudo 启动（443 是特权端口）
sudo vpr dev
# 通过 https://vant.starter.kit.inlin.test 访问
```

### 生产构建

```bash
vpr build      # 类型检查 + 构建
vpr preview    # 本地预览生产版本
```

---

## 🎨 定制你的应用

### 修改应用名称

1. 编辑 `.env`、`.env.development`、`.env.production` 中的 `VITE_APP_TITLE`
2. 编辑 `index.html` 中的 `<title>` 和 `<meta name="description">` 为你的应用描述
3. 编辑 `build/plugins/pwa.ts` 中 manifest 的 `name`、`short_name`、`description`
4. 编辑 `src/components/PwaInstallPrompt.vue` 中的标题和文案

### 替换 Logo 和图标

**文件替换后就生效，无需改代码：**

| 文件                                  | 用途                | 尺寸        |
| ------------------------------------- | ------------------- | ----------- |
| `public/logo.svg`                     | 项目 Logo（参考用） | SVG         |
| `public/pwa-icon.svg`                 | PWA 图标源文件      | 512×512 SVG |
| `public/favicon.ico`                  | 浏览器标签页图标    | 48×48       |
| `public/apple-touch-icon-180x180.png` | iOS 桌面图标        | 180×180     |

修改 `public/pwa-icon.svg` 后重新生成 PWA 整套图标：

```bash
vpr pwa:assets:generator
```

### 环境变量说明

| 变量                       | 说明                            | 默认值                              |
| -------------------------- | ------------------------------- | ----------------------------------- |
| `VITE_API_BASE_URL`        | API 基础路径                    | `/api`                              |
| `VITE_APP_TITLE`           | 应用标题（浏览器标签 + PWA 名） | `vant-starter-kit`                  |
| `VITE_PUBLIC_PATH`         | 应用基础路径                    | `/`                                 |
| `VITE_ENV_NAME`            | 环境名称                        | `development`                       |
| `VITE_ENABLE_VCONSOLE`     | vConsole 调试面板               | `true`（dev）/ `false`（prod 推荐） |
| `VITE_EXTERNAL_API_<NAME>` | 外部 API（可配置多个，见下方）  | 空                                  |
| `VITE_TCC_APP_ID`          | 腾讯云 IM 应用 ID               | 空                                  |
| `VITE_ALLOWED_HOST`        | 允许的 Host 域名                | 空                                  |
| `VITE_PROXY_TARGET`        | HTTPS 代理目标域名              | 空                                  |
| `VITE_DEV_SERVER_HOST`     | Dev Server 地址                 | `0.0.0.0`                           |

模板文件：

- `.env.example` — 所有变量的完整模板
- `.env.development.example` — 开发环境推荐值
- `.env.production.example` — 生产环境推荐值
- `.env.local` — 本地覆盖（不提交 Git）

**⚠️ 新增/删除环境变量时，必须同步以下 3 个文件：**

```
env.d.ts                    ← TypeScript 类型声明（ImportMetaEnv 接口）
src/composables/useEnv.ts   ← 类型安全访问器 + 默认值
.env.example               ← 变量文档模板
```

---

## 📖 开发指南

### 添加新页面

在 `src/pages/` 下创建 `.vue` 文件，路由自动生成：

```vue
<!-- src/pages/my-page.vue -->
<template>
  <div>My Page</div>
</template>

<script setup lang="ts">
definePage({
  meta: {
    layout: 'default',
    title: '我的页面',
    showHeader: true,
    showFooter: true,
  },
});
</script>
```

| meta 字段      | 类型      | 说明                                                     |
| -------------- | --------- | -------------------------------------------------------- |
| `layout`       | `string`  | 布局名：`default` / `admin` / `screen`（默认 `default`） |
| `title`        | `string`  | 页面标题（Header 导航栏 + 浏览器 title）                 |
| `showHeader`   | `boolean` | 是否显示 Header（默认 `true`）                           |
| `showFooter`   | `boolean` | 是否显示 Footer（默认 `true`）                           |
| `requiresAuth` | `boolean` | 是否需要登录（默认 `false`）                             |

### 添加 API 接口

**内置 API**（`server/api/`，同域，无需跨域处理）：

```ts
// server/api/hello.ts
import { defineHandler } from 'nitro';

export default defineHandler(async () => {
  return { code: 0, message: 'ok', data: { hello: 'world' } };
});
```

**客户端**（`src/api/methods/`）：

```ts
// src/api/methods/hello.ts
import { baseAlova } from '@/api';

export const getHello = () => baseAlova.Get<{ hello: string }>('/hello');
```

**页面使用**：

```ts
import { useRequest } from 'alova/client';
import { getHello } from '@/api/methods/hello';

const { data, loading } = useRequest(getHello());
```

**外部 API**（支持多个后端，开发环境自动代理跨域）：

1. 配置 `.env.development`：

```bash
# 命名规范：VITE_EXTERNAL_API_<NAME>=<URL>
# 可添加任意数量，Vite 自动为每个生成代理规则
VITE_EXTERNAL_API_OTHER=http://www.xxx.com/api
VITE_EXTERNAL_API_THIRD=http://www.yyy.com/v1
```

2. 在代码中使用：

```ts
import { getExternalAlova } from '@/api/external';

const otherApi = getExternalAlova('other');
const { data } = useRequest(otherApi.Get('/users'));

const thirdApi = getExternalAlova('third');
const { data: data2 } = useRequest(thirdApi.Get('/orders'));
```

> **工作原理**：
>
> - 开发环境：请求 `/api-external-other/users` → Vite proxy → `http://www.xxx.com/api/users`
> - 生产环境：直接请求 `http://www.xxx.com/api/users`
> - **零跨域**：开发环境由 Vite dev server 自动转发，生产环境需外部 API 配置 CORS

> **新增外部 API**：只需在 `.env.development` / `.env.production` 中添加
> `VITE_EXTERNAL_API_<NAME>=<URL>` 即可，Vite 代理自动生效，无需改其他代码。

### 添加 Store

```ts
// src/stores/my-store.ts
import { defineStore } from 'pinia';

export const useMyStore = defineStore('my-store', () => {
  const count = ref(0);
  const increment = () => count.value++;
  return { count, increment };
});

// 如需持久化：store ID 设置为 'my-store' 即可，pinia-plugin-persistedstate 自动接管
```

### 添加 Composable

```ts
// src/composables/useMyFeature.ts
export function useMyFeature() {
  const state = ref(0);
  // ... logic
  return { state };
}
```

Composables 在 `src/composables/` 下**自动导入**，无需手动 `import`。

### 自定义 Header/Footer

任一页面可注入自定义组件：

```ts
import MyFooter from './components/MyFooter.vue';
useCustomFooter(MyFooter); // 同步

useCustomHeader(() => import('./MyHeader.vue')); // 异步 Code Split
```

页面卸载时自动恢复默认。

### 国际化

```ts
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
t('login.submit'); // 输出: "登录" / "Login"
```

文案在 `src/locales/zh-CN.ts` 和 `en.ts` 维护。

### 配置 env 变量

```bash
# .env
VITE_API_BASE_URL=/api
VITE_APP_TITLE=我的应用
VITE_ENABLE_VCONSOLE=true   # 手机调试面板
```

完整变量列表见 [.env.example](./.env.example)。

---

## 🚀 部署

### Cloudflare Workers（推荐）

```bash
# 首次：登录 + 部署
vp dlx wrangler login
vpr wrangler:deploy

# 后续：推送 main 分支自动部署（GitHub Actions）
git push origin main
```

> `.github/workflows/deploy.yml` 已配置：push `main` → 自动构建 → Cloudflare Workers 部署。

### 部署前检查

```bash
vp check          # 格式化 + Lint + 类型检查
vp test           # 运行测试（11 tests）
```

### 自定义域名

1. Cloudflare Dashboard → Workers → 添加自定义域名/路由
2. 更新 `.env.production` 中的 `VITE_APP_TITLE`

---

## 📁 项目结构

```
src/
├── api/              # HTTP 请求层（Alova + Axios）
│   ├── index.ts      #   实例配置（拦截器/错误处理）
│   └── methods/      #   接口方法模块
├── components/       # 全局组件
│   ├── AppUpdatePrompt.vue      #   版本更新提示条
│   ├── PwaInstallPrompt.vue     #   PWA 安装引导面板
│   └── businesses/              #   业务组件
├── composables/      # 组合式函数（自动导入）
│   ├── useAppUpdate.ts          #   版本检测轮询
│   ├── useEnv.ts                #   环境变量访问
│   ├── useLayoutConfig.ts       #   布局显隐控制
│   ├── useLayoutCustomization.ts #  组件替换系统
│   ├── useLoading.ts            #   全局 Loading
│   ├── useNetworkStatus.ts      #   离线检测
│   ├── usePwaInstall.ts         #   PWA 安装状态
│   └── useStatusBar.ts          #   状态栏颜色控制
├── layouts/          # 布局（3 套）
│   ├── default.vue               #   移动端 App Shell
│   ├── admin.vue                 #   管理后台（侧边栏）
│   └── screen.vue                #   数据大屏（深色全屏）
├── locales/          # 国际化文案（zh-CN / en）
├── pages/            # 文件系统路由
├── plugins/          # 应用级插件
│   ├── dayjs.ts      #   日期工具
│   ├── head.ts       #   SEO Head 管理
│   ├── i18n.ts       #   国际化实例
│   └── vconsole.ts   #   调试面板
├── stores/           # Pinia 状态管理
├── utils/            # 工具函数
│   └── pwa.ts        #   PWA 事件系统
└── styles/           # 全局样式
    └── index.css      #   Tailwind CSS v4 + App Shell
```

---

## 🛠️ 技术栈

| 类别     | 技术                                       |
| -------- | ------------------------------------------ |
| 框架     | Vue 3 (Composition API + `<script setup>`) |
| UI 库    | Vant 4（移动端）                           |
| 构建     | Vite+ v0.2.7                               |
| CSS      | Tailwind CSS v4                            |
| 状态管理 | Pinia + persist 插件                       |
| 路由     | Vue Router（文件系统路由 + 布局系统）      |
| HTTP     | Alova + Axios                              |
| 服务端   | Nitro（全栈 SSR）                          |
| 国际化   | Vue I18n v11                               |
| SEO      | @unhead/vue v3                             |
| PWA      | vite-plugin-pwa（Workbox）                 |
| 测试     | Vitest + Vue Test Utils                    |
| 部署     | Cloudflare Workers                         |

---

## 📚 文档

| 文档                                               | 内容                                        |
| -------------------------------------------------- | ------------------------------------------- |
| [Layout 布局架构](./docs/layout-architecture.md)   | App Shell 原理 + 显隐控制 + 组件替换 ★ 亮点 |
| [深色模式架构](./docs/dark-mode-architecture.md)   | CSS/Vant/状态栏三路协同                     |
| [PWA 集成方案](./docs/pwa-integration.md)          | Service Worker + Manifest + 图标 + 部署     |
| [功能缺口分析](./docs/starter-kit-gap-analysis.md) | 已完成功能清单 + 优先级路线图               |

---

## 🤝 贡献

欢迎 Issue / Pull Request。开发前请阅读 [AGENTS.md](./AGENTS.md) 了解项目约定。

---

## 📄 许可证

[MIT](./LICENSE) © 2026 Van Chin

