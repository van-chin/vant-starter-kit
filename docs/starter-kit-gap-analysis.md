# Starter-Kit 功能缺口分析

> 文档日期：2026-07-31（持续更新）
> 分析范围：全项目，含 pages / stores / router / API / build / tests / docs

---

## 总览

本项目作为移动端 H5 / PWA 快速启动模板，**架构层面完善**（App Shell、布局系统、PWA 集成、深色模式、类型系统）。已完成 Phase 1-3 的功能补齐，以下为当前状态。

标记说明：~~已删除线~~ = 已完成

---

## 一、🔴 必须补齐 ~~（已完成）~~

### 1.1 ~~认证流程断裂~~ ✅

| 问题                    | 修复                                                                    |
| ----------------------- | ----------------------------------------------------------------------- |
| ~~Router 无守卫~~       | `beforeEach` 检查 `meta.requiresAuth`，未登录跳转 `/login?redirect=...` |
| ~~Login 页无提交逻辑~~  | 完整表单（用户名+密码+验证），`authStore.login()`，redirect             |
| ~~Auth Store 未被调用~~ | login/logout/setAuth 全部接入                                           |
| ~~API 拦截器只有 TODO~~ | `showToast` + `router.push('/login')` + `authStore.logout()`            |

### 1.2 ~~零错误处理~~ ✅

| 问题                  | 修复                                                    |
| --------------------- | ------------------------------------------------------- |
| ~~零 try/catch~~      | login 页 + API 调用层已加                               |
| ~~无全局错误边界~~    | `app.config.errorHandler` 在 `main.ts` 注册             |
| ~~无 Toast 错误通知~~ | API 拦截器 `onError` / `onSuccess` 全部接入 `showToast` |

### 1.3 ~~零测试~~ ✅

| 问题              | 修复                                       |
| ----------------- | ------------------------------------------ |
| ~~无测试文件~~    | `useEnv` (4) + `cart store` (7) = 11 tests |
| ~~vitest 未安装~~ | `vitest` + `@vue/test-utils` 已安装        |

### 1.4 ~~表单验证缺失~~ ✅

- Login 页使用 Vant `van-form` + `rules` 实现必填校验

### 1.5 ~~加载态管理缺失~~ ✅

| 问题               | 修复                                                  |
| ------------------ | ----------------------------------------------------- |
| ~~无全局 loading~~ | `useLoading` composable（pendingCount + withLoading） |
| ~~无 Skeleton~~    | 首页 + components-demo 页均有 Skeleton 示例           |

---

## 二、🟡 强烈建议 ~~（已完成）~~

### 2.1 ~~页面多为占位~~ ✅

| 页面                  | 状态                                        |
| --------------------- | ------------------------------------------- |
| ~~`index.vue` 占位~~  | 商品网格 + Skeleton + 加购                  |
| ~~`cart.vue` 占位~~   | van-empty + van-swipe-cell + van-submit-bar |
| ~~`login.vue` 残缺~~  | 完整表单 + i18n                             |
| ~~`my.vue` 部分完整~~ | 退出登录 + dark mode toggle                 |

### 2.2 ~~Store 缺失~~ ✅

| Store             | 状态                                                  |
| ----------------- | ----------------------------------------------------- |
| ~~`app.ts`~~      | locale / isFirstLaunch，persist                       |
| ~~`cart.ts`~~     | add/remove/updateCount/clear/totalPrice               |
| `loading.ts`      | 已由 `useLoading` composable 替代（非 store，更轻量） |
| `notification.ts` | 未实现（待业务需求驱动）                              |

### 2.3 ~~网络状态 / 离线检测~~ ✅

- `useNetworkStatus` composable（封装 `@vueuse/core` `useNetwork`）
- 默认布局红色 banner：离线时 "当前无网络连接"（i18n）

### 2.4 ~~i18n 缺失~~ ✅

- `vue-i18n` v11，Composition API 模式
- 2 locales（zh-CN / en），72 个翻译 key
- tabbar / login / cart / my 已接入

### 2.5 ~~Router 缺失 ScrollBehavior~~ ✅

- `scrollBehavior: () => ({ top: 0, left: 0 })`

---

## 三、🟢 锦上添花

### 3.1 CI/CD

- 无 `.github/workflows/`，建议添加：
  - `ci.yml`：`vp install && vp check && vp test`
  - `deploy.yml`：Cloudflare Pages / Workers 部署

### 3.2 Build 优化

- 无 `build.rollupOptions`（代码分割）
- 无 `vite-plugin-compression`（Brotli/gzip）
- 无 `rollup-plugin-visualizer`（包体积分析）
- 无 `@vitejs/plugin-legacy`（老旧浏览器兼容）

### 3.3 ~~SEO / Meta 标签~~ ✅

| 项目                            | 状态 | 说明                                                                       |
| ------------------------------- | ---- | -------------------------------------------------------------------------- |
| ~~`<meta name="description">`~~ | ✅   | index.html 静态兜底 + `@unhead/vue` 运行时接管（2026-07-31）               |
| ~~Open Graph 标签~~             | ✅   | `og:title/description/image/type`（2026-07-31）                            |
| ~~Twitter Card 标签~~           | ✅   | `twitter:card/title/description/image`（2026-07-31）                       |
| ~~动态 title~~                  | ✅   | `@unhead/vue` v3 + router `afterEach`，自动读取 `meta.title`（2026-07-31） |
| ~~`@unhead/vue` 安装~~          | ✅   | v3.2.3，`src/plugins/head.ts` + `main.ts` 注册（2026-07-31）               |

**实现架构**：

```
index.html (静态兜底) → @unhead/vue (运行时接管)
                           ├── router afterEach → 自动更新 <title>
                           └── 各页面 useHead() → 自定义 meta/OG 覆盖
```

### 3.4 ~~env 文件~~ ✅

- ~~`.env.production`~~ 已创建
- ~~`.env.test`~~ 已创建
- ~~建议的 env 变量 `VITE_APP_TITLE`、`VITE_APP_VERSION`、`VITE_ENABLE_MOCK`~~ 已添加

### 3.5 ~~Dayjs 插件~~ ✅

- ~~`customParseFormat`~~ 已添加
- ~~`calendar`~~ 已添加（含中文日历格式）
- ~~`isToday` / `isYesterday`~~ 已添加
- ~~`weekOfYear`~~ 已添加
- ~~时区默认 `Asia/Shanghai`~~ 已启用

### 3.6 PWA 功能状态

| 功能                                    | 状态 | 说明                                                            |
| --------------------------------------- | ---- | --------------------------------------------------------------- |
| ~~Service Worker（Workbox）~~           | ✅   | `registerType: 'autoUpdate'`，预缓存 + API 缓存                 |
| ~~PWA 图标生成~~                        | ✅   | `@vite-pwa/assets-generator`，全套 icon（含 maskable）          |
| ~~manifest.webmanifest~~                | ✅   | name / short_name / icons / display / scope                     |
| ~~manifest `id` 字段~~                  | ✅   | `id: '/'`，Chrome PWA 唯一标识（2026-07-31 新增）               |
| `screenshots`                           | ⚠️   | manifest 中留有 TODO 占位，需要产品截图（3-5 张）               |
| `navigationFallback`                    | ⚠️   | Workbox `NavigationRoute` 已配置但 precache 无 `index.html`     |
| 图片/字体缓存策略                       | ❌   | 仅缓存 API 请求，无图片/字体/外部 CDN 静态资源缓存              |
| `CacheableResponsePlugin`（状态码过滤） | ❌   | 未配置，0xx/3xx 响应也可能被缓存                                |
| SW 注册错误监控                         | ✅   | `src/utils/pwa.ts` 提供 Console 日志诊断（2026-07-31 新增）     |
| ~~`appinstalled` 事件处理~~             | ✅   | 安装完成后弹出 Toast "安装成功！应用已添加到桌面"（2026-07-31） |
| ~~`beforeinstallprompt` 事件~~          | ✅   | 监听 + `promptInstall()` 手动触发安装（2026-07-31 新增）        |
| ~~开发环境 HTTPS 反向代理~~             | ✅   | `unplugin-https-reverse-proxy`，但需释放 443 端口（见下方）     |

### 3.7 PWA 跨浏览器兼容性

| 浏览器      | PWA 安装 | 状态栏着色 (`theme-color`) | 备注                                                        |
| ----------- | -------- | -------------------------- | ----------------------------------------------------------- |
| Chrome 安卓 | ✅ 正常  | ✅ 正常                    | WebAPK 后台创建需 10-60s，`appinstalled` 事件可及时反馈用户 |
| Edge 安卓   | ✅ 正常  | ❌ 不支持                  | caniuse 标注 Edge 150 不支持 meta theme-color               |
| Safari iOS  | ✅ 正常  | ✅ 正常                    | `apple-mobile-web-app-status-bar-style`                     |

> **Chrome PWA 安装优化说明**：
> Chrome 在用户确认安装后，通过 Google Play Services 在后台创建 WebAPK
> （约 10-60 秒）。期间浏览器无任何进度提示，容易让用户以为安装失败。
>
> 已实施的优化：
>
> - `appinstalled` 事件监听 → 安装完成弹出 Toast "安装成功！应用已添加到桌面"
> - `beforeinstallprompt` 事件 → 支持自定义安装按钮流程
> - `promptInstall()` → 手动触发安装对话框
> - SW 注册诊断日志 → Console 输出 SW 状态

### 3.8 ~~常用移动端组件~~ ✅

~~建议至少为 popup、swipe-cell、empty、skeleton 提供使用示例~~

- `src/pages/components-demo.vue` — Popup / SwipeCell / Skeleton / Empty 完整示例
- `my.vue` 中有入口链接

### 3.9 ~~PWA 图标~~ ✅

- ~~`@vite-pwa/assets-generator`~~ 已配置
- ~~`public/pwa-icon.svg`~~ 为专用源文件（80% 填充率）
- ~~全套图标~~ 已生成：favicon.ico / apple-touch-icon / pwa-64/192/512 / maskable

---

## 四、优先级路线图

```
✅ 第一阶段（已完成）：补齐 🔴 致命缺口
✅ 第二阶段（已完成）：补齐 🟡 重要缺口
✅ 第三阶段（已完成）：🟢 部分完善项

⏳ 待完成（低优先级）：
  ├── CI/CD（GitHub Actions）
  ├── Build 优化（code splitting + compression + visualizer）
  └── PWA SW 策略增强（图片/字体缓存 + CacheableResponsePlugin + navigationFallback + screenshots）
```

---

## 五、当前评分

| 维度       | 得分       | 变化 | 说明                                                            |
| ---------- | ---------- | ---- | --------------------------------------------------------------- |
| 架构完整性 | ⭐⭐⭐⭐⭐ | —    | App Shell / 布局系统 / PWA / 深色模式 / 类型系统                |
| 页面完整度 | ⭐⭐⭐     | —    | 12 页中 4 页核心功能完整（index/cart/login/my），新增组件示例页 |
| 认证闭环   | ⭐⭐⭐⭐   | —    | Router 守卫 + Login 表单 + API 拦截器 + 登出                    |
| 错误处理   | ⭐⭐⭐⭐   | —    | 全局 errorHandler + toast 通知 + API 拦截 + SW 注册诊断         |
| 测试覆盖   | ⭐⭐       | —    | 11 tests（useEnv + cart store），核心 composable 覆盖           |
| 工程化     | ⭐⭐⭐     | —    | 持久化 store + i18n + env 文件 + PWA 图标生成 + SW 监控         |
| 国际化     | ⭐⭐⭐⭐   | —    | vue-i18n v11，zh-CN/en 双语言                                   |
| 文档       | ⭐⭐⭐⭐⭐ | —    | 5 份架构文档 + gap-analysis                                     |
