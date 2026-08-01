# PWA 集成方案

> 文档日期：2026-07-31

---

## 一、背景与目标

PWA（Progressive Web App）让 Web 应用具备类似原生 App 的体验：**离线访问**、**添加到主屏幕**、**推送通知**、**后台同步**。对于本移动端启动模板而言，PWA 可以显著提升用户留存率和弱网环境下的体验。

### 核心收益

| 能力         | 说明                                                   |
| ------------ | ------------------------------------------------------ |
| 离线可用     | Service Worker 缓存静态资源，断网也能打开页面          |
| 添加到主屏幕 | 通过 Web App Manifest 实现，用户可将网站添加到手机桌面 |
| 类原生体验   | `display: standalone` 隐藏浏览器 UI，全屏沉浸          |
| 自动更新     | Service Worker 检测到新版本后自动更新，无需用户操作    |
| 缓存策略     | 精细控制不同资源（API / 静态资源 / 图片）的缓存行为    |

---

## 二、技术选型

### 方案对比

| 方案                           | 优势                                                                      | 劣势                                   | 适用场景            |
| ------------------------------ | ------------------------------------------------------------------------- | -------------------------------------- | ------------------- |
| **vite-plugin-pwa** ✅         | Vite 原生集成，零配置可用，基于 Workbox，自动注入 manifest 和 SW 注册代码 | 深度自定义受限                         | Vite 项目的标准选择 |
| Workbox 原生                   | Google 官方，完全可控，灵活度最高                                         | 需手写 SW 文件，手动注册，无 Vite 集成 | 复杂缓存策略需求    |
| @vueuse/core (PWA composables) | 轻量，Vue 组合式 API 风格                                                 | 非完整方案，仅提供工具函数             | 辅助使用            |

### 选择结论

> **采用 `vite-plugin-pwa` v1.3.0**，原因：
>
> 1. **Vite 一等公民** — 直接作为 Vite 插件使用，与本项目 `build/plugins/` 架构无缝融合
> 2. **Workbox 底层** — 继承 Google Workbox 的全部能力（precaching / runtimeCaching / 策略配置）
> 3. **自动注册** — 无需手写 `navigator.serviceWorker.register()`，插件自动注入
> 4. **生态成熟** — npm 周下载量 200k+，Vue/Vite 社区的事实标准
> 5. **SSR 兼容** — 与本项目 Nitro 服务端渲染无冲突

---

## 三、安装与配置

### 3.1 添加依赖

**Step 1** — 在 `pnpm-workspace.yaml` 的 `catalog:` 下添加版本声明：

```yaml
catalog:
  # ... 已有依赖 ...
  vite-plugin-pwa: '^1.3.0'
  workbox-build: '^7.4.1'
  workbox-window: '^7.4.1'
```

`workbox-build` 和 `workbox-window` 是 `vite-plugin-pwa` 的 peer dependencies，pnpm 严格模式下需要显式声明。

**Step 2** — 在 `package.json` 的 `devDependencies` 下添加依赖引用：

```json
{
  "devDependencies": {
    "vite-plugin-pwa": "catalog:",
    "workbox-build": "catalog:",
    "workbox-window": "catalog:"
  }
}
```

**Step 3** — 安装依赖：

```bash
vp install
```

### 3.2 依赖版本一览

| 包名              | 版本     | 角色                             |
| ----------------- | -------- | -------------------------------- |
| `vite-plugin-pwa` | `^1.3.0` | Vite PWA 插件核心                |
| `workbox-build`   | `^7.4.1` | 构建时生成 Service Worker        |
| `workbox-window`  | `^7.4.1` | 运行时 Service Worker 注册与更新 |

---

## 四、插件架构设计

### 4.1 设计原则

遵循本项目 `build/plugins/` 目录下的统一插件模式：

- **工厂函数命名** — `create` 前缀，如 `createPwaPlugin()`
- **返回类型** — `PluginOption`（单个插件）或 `PluginOption[]`（插件数组）
- **命名导出** — 仅 `export function`，无 default export
- **按需启用** — 通过参数控制条件加载

### 4.2 插件源码

`build/plugins/pwa.ts`：

```ts
import type { PluginOption } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * PWA 插件（生产构建时启用 Service Worker 和 manifest）
 * @returns PluginOption
 */
export function createPwaPlugin(): PluginOption {
  return VitePWA({
    registerType: 'autoUpdate',
    workbox: {
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      runtimeCaching: [
        {
          urlPattern: /^\/api\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            networkTimeoutSeconds: 5,
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24,
            },
          },
        },
      ],
    },
    manifest: {
      id: '/',
      name: 'vant-starter-kit',
      short_name: 'VSK',
      description: '基于 Vue 3 + Vant 4 的移动端启动模板',
      theme_color: '#f5f5f5',
      background_color: '#f5f5f5',
      display: 'standalone',
      display_override: ['standalone', 'minimal-ui'],
      categories: ['utilities', 'productivity'],
      icons: [
        { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
        { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        {
          src: 'maskable-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
  });
}
```

### 4.3 插件注册

在 `build/index.ts` 中按条件注册（仅生产构建）：

```ts
// PWA（仅生产构建启用 Service Worker）
if (isBuild) {
  plugins.push(createPwaPlugin());
}
```

```
createVitePlugins(isBuild)
│
├── ...createVuePlugin(isBuild)     // Vue 核心插件组
├── createTailwindcssPlugin()       // Tailwind CSS v4
├── createNitroPlugin()             // Nitro 服务端
│
├── [if !isBuild] createHttpsReverseProxyPlugin()  // 开发代理
└── [if isBuild]  createPwaPlugin()                 // PWA（本次新增）
```

---

## 五、PWA 配置详解

### 5.1 Service Worker 注册策略

| 策略              | `registerType` | 行为                                               | 适用场景           |
| ----------------- | -------------- | -------------------------------------------------- | ------------------ |
| **autoUpdate** ✅ | `'autoUpdate'` | 检测到新版本后自动下载并激活，用户下次访问即用新版 | 移动端、内容型应用 |
| prompt            | `'prompt'`     | 检测到新版本后弹出提示，由用户决定何时更新         | 编辑器、金融类应用 |
| inline            | `'inline'`     | 手动注册 SW，完全自定义                            | 高级定制           |

本模板选择 `autoUpdate`，适合移动端快捷体验。

### 5.2 缓存策略

Workbox 提供 5 种标准缓存策略：

| 策略                 | 行为                           | 本模板用途           |
| -------------------- | ------------------------------ | -------------------- |
| **NetworkFirst**     | 优先网络，超时/失败时读缓存    | API 请求（`/api/*`） |
| CacheFirst           | 优先缓存，缓存未命中才请求网络 | 版本号固定的静态资源 |
| StaleWhileRevalidate | 返回缓存同时后台更新           | 不追求实时性的资源   |
| NetworkOnly          | 始终请求网络                   | 支付、实时数据       |
| CacheOnly            | 仅从缓存读取                   | 预缓存的 App Shell   |

### 5.3 Web App Manifest 核心字段

| 字段               | 值                                     | 说明                               |
| ------------------ | -------------------------------------- | ---------------------------------- |
| `id`               | `/`                                    | 唯一标识符，避免同源 PWA 冲突      |
| `name`             | `vant-starter-kit`                     | 完整应用名称（安装提示中显示）     |
| `short_name`       | `VSK`                                  | 桌面快捷方式下的短名称（≤12 字符） |
| `description`      | `基于 Vue 3 + Vant 4 的移动端启动模板` | 应用描述                           |
| `theme_color`      | `#f5f5f5`                              | 工具栏/状态栏颜色                  |
| `background_color` | `#f5f5f5`                              | 启动闪屏背景色                     |
| `display`          | `standalone`                           | 隐藏浏览器 UI，全屏展示            |
| `display_override` | `['standalone', 'minimal-ui']`         | 声明支持的显示模式降级链           |
| `categories`       | `['utilities', 'productivity']`        | 应用商店分类（Chrome Web Store）   |

### 5.4 PWA 图标规格

需要在 `public/` 目录下放置以下图标文件（由 `@vite-pwa/assets-generator` 从 `public/pwa-icon.svg` 自动生成）：

| 文件                           | 尺寸    | 用途                           |
| ------------------------------ | ------- | ------------------------------ |
| `pwa-64x64.png`                | 64×64   | 小尺寸主屏幕图标               |
| `pwa-192x192.png`              | 192×192 | 主屏幕图标（Android）          |
| `pwa-512x512.png`              | 512×512 | 大尺寸启动图标                 |
| `maskable-icon-512x512.png`    | 512×512 | 遮罩适配图标（Android 自适应） |
| `apple-touch-icon-180x180.png` | 180×180 | iOS Safari 主屏幕图标          |
| `favicon.ico`                  | 48×48   | 浏览器标签页图标               |

---

## 六、移动端专项优化

### 6.1 iOS Safari 兼容

iOS 对 PWA 的支持不如 Android 完善，需特别注意：

| 问题                 | 解决方案                                                                                                                           |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 独立模式下状态栏样式 | `manifest` 中配置 `display: standalone` + `<meta name="apple-mobile-web-app-capable" content="yes">`（`vite-plugin-pwa` 自动注入） |
| 图标支持             | 提供 `apple-touch-icon` 图标（180×180 PNG）                                                                                        |
| 存储限制             | iOS Safari 给 PWA 的 Cache Storage 上限约 50MB，注意缓存条目上限                                                                   |
| Service Worker 更新  | iOS 强制 24 小时内不重复检查 SW 更新，`autoUpdate` 策略不受此限制                                                                  |

### 6.2 Vant UI 组件缓存策略

Vant 组件的 CSS/JS 已由 Vite 打包进构建产物，通过 `globPatterns` 的 `**/*.{js,css}` 自动纳入 precache。无需额外配置 CDN 缓存。

### 6.3 App Shell 架构

本模板天然符合 App Shell 模式：

```
index.html                          ← Shell（静态 HTML 骨架）
  └── <div id="app">
        └── App.vue                 ← 应用根组件
              ├── layout (header)   ← 布局头部（粘性定位）
              ├── <router-view>     ← 动态页面内容
              └── layout (tabbar)   ← 底部导航栏
```

- **Shell 部分**（index.html + 布局框架）通过 Workbox precache 缓存，实现离线秒开
- **动态内容**（页面 + API 数据）通过 runtimeCaching 策略管理

### 6.4 离线体验优化

- **API 降级** — `NetworkFirst` 策略确保有网时拿最新数据，离线时展示缓存内容
- **离线提示** — 建议在布局中增加网络状态监听，弱网/离线时展示轻提示（可用 `@vueuse/core` 的 `useNetwork`）
- **页面兜底** — 确保关键页面（首页、设置）在离线时可正常渲染

---

## 七、开发调试

### 7.1 浏览器 DevTools 验证

1. 构建并预览：

```bash
vp build
vp preview
```

2. 打开 Chrome DevTools → **Application** 标签页：
   - **Manifest** — 检查 manifest 字段是否正确
   - **Service Workers** — 确认 SW 已注册且状态为 `activated`
   - **Cache Storage** — 查看预缓存和运行时缓存的条目

### 7.2 Lighthouse 审计

Chrome DevTools → **Lighthouse** 标签页，勾选 PWA 类目，运行审计：

- ✅ `installable` — manifest + SW 满足条件
- ✅ `splash screen` — 背景色 + 图标就绪
- ✅ `离线可用` — SW 返回 200
- ⚠️ `HTTPS` — 生产环境必须 HTTPS（本地 `localhost` 豁免）

### 7.3 Dev 模式启用 PWA（可选）

开发模式下 SW 会影响 HMR 热更新体验，默认关闭。如需调试 PWA 功能，可修改 `build/index.ts`：

```ts
// 开发时也启用 PWA（调试用，调试完请还原）
plugins.push(createPwaPlugin());
```

---

## 八、生产部署注意事项

### 8.1 HTTPS 强制要求

Service Worker 仅在 HTTPS 或 `localhost` 环境下生效。部署到生产环境时确保：

- 使用 HTTPS 证书（Cloudflare / Let's Encrypt 等）
- 如部署到 Cloudflare Workers，HTTPS 默认开启

### 8.2 自定义更新提示

当前使用 `registerType: 'autoUpdate'` 自动更新。如需更精细的控制（如弹窗提示用户刷新），可改为 `'prompt'` 模式并在 `main.ts` 中添加：

```ts
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    // 弹出更新提示
    if (confirm('有新版本可用，是否刷新？')) {
      updateSW();
    }
  },
});
```

### 8.3 Scope 配置

默认 scope 为 `/`，即整个站点范围。如果应用部署在子路径（如 `https://example.com/app/`），需在 manifest 和 Service Worker 注册中配置 scope：

```ts
VitePWA({
  manifest: {
    scope: '/app/',
    start_url: '/app/',
  },
});
```

同时 `vite.config.ts` 中需设置 `base: '/app/'`。

---

## 九、相关文件

| 文件                                  | 作用                                                                 |
| ------------------------------------- | -------------------------------------------------------------------- |
| `pnpm-workspace.yaml`                 | PWA 依赖版本声明（vite-plugin-pwa / workbox-build / workbox-window） |
| `package.json`                        | PWA 依赖引用（devDependencies）+ `pwa:assets:generator` 脚本         |
| `build/plugins/pwa.ts`                | PWA 插件工厂函数，配置 manifest + workbox 策略                       |
| `build/index.ts`                      | 插件注册入口，条件加载 PWA 插件（生产构建）                          |
| `pwa-assets.config.ts`                | `@vite-pwa/assets-generator` 配置，从 `pwa-icon.svg` 生成所有图标    |
| `public/pwa-icon.svg`                 | PWA 图标源文件（512×512 SVG），供 assets-generator 渲染导出          |
| `public/pwa-64x64.png`                | PWA 图标 64×64                                                       |
| `public/pwa-192x192.png`              | PWA 图标 192×192                                                     |
| `public/pwa-512x512.png`              | PWA 图标 512×512                                                     |
| `public/maskable-icon-512x512.png`    | PWA 遮罩适配图标 512×512                                             |
| `public/apple-touch-icon-180x180.png` | iOS Safari 图标 180×180                                              |
| `public/favicon.ico`                  | 浏览器标签页图标                                                     |

---

## 十、Nitro + Vite 6 Environments 兼容问题（已解决）

### 问题描述

部署到 Cloudflare 后，浏览器请求 `sw.js` 返回 HTML（MIME 类型错误），PWA 无法注册。排查发现：

1. `sw.js` 和 `workbox-*.js` 生成在 `dist/` 而非 `.output/public/`
2. Nitro 服务端的 `public-assets-data` 清单中没有 `sw.js`
3. 浏览器请求 `/sw.js` 穿透到 SPA fallback → 返回 `index.html`

### 根因

Nitro 使用 **Vite 6 Environments** 机制，创建了独立的 `client` 环境（`outDir: '.output/public/'`）和 `nitro` 环境。但 `vite-plugin-pwa` 的 `configResolved` / `closeBundle` 钩子运行在默认环境（`outDir: 'dist'`），导致 `sw.js` 写入到错误目录。

```
Vite 6 构建流程
├── 默认环境 (outDir: dist/)
│   └── vite-plugin-pwa 在此生成 sw.js → dist/sw.js ❌
├── client 环境 (outDir: .output/public/)
│   └── 客户端资源构建 → .output/public/assets/*
└── nitro 环境 (ssr)
    └── 服务端构建 → .output/server/
```

### 解决方案

在 `vite-plugin-pwa` 插件配置中**显式指定 `outDir`**，将其对齐到 Nitro client 环境的 publicDir：

```ts
// build/plugins/pwa.ts
export function createPwaPlugin(): PluginOption {
  return VitePWA({
    // 显式指定输出目录，绕过 Vite 6 Environments 的环境隔离
    outDir: '.output/public',
    // ... 其他配置
  });
}
```

### 图标生成

所有 PWA 图标均以 `public/pwa-icon.svg` 为源文件生成。

使用 `@vite-pwa/assets-generator` 自动生成：

```bash
# 执行图标生成命令
pnpm pwa:assets:generator
```

配置文件 `pwa-assets.config.ts`：

```ts
import { defineConfig, minimal2023Preset as preset } from '@vite-pwa/assets-generator/config';

export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset,
  images: ['public/pwa-icon.svg'],
});
```

该命令会根据 `pwa-assets.config.ts` 配置，从 `public/pwa-icon.svg` 自动渲染生成以下图标：

| 目标文件                              | 尺寸    | 生成方式                                       |
| ------------------------------------- | ------- | ---------------------------------------------- |
| `public/favicon.ico`                  | 48×48   | `@vite-pwa/assets-generator` 渲染 ICO          |
| `public/pwa-64x64.png`                | 64×64   | `@vite-pwa/assets-generator` 渲染 PNG          |
| `public/pwa-192x192.png`              | 192×192 | `@vite-pwa/assets-generator` 渲染 PNG          |
| `public/pwa-512x512.png`              | 512×512 | `@vite-pwa/assets-generator` 渲染 PNG          |
| `public/maskable-icon-512x512.png`    | 512×512 | `@vite-pwa/assets-generator` 渲染 maskable PNG |
| `public/apple-touch-icon-180x180.png` | 180×180 | `@vite-pwa/assets-generator` 渲染 Apple 图标   |
