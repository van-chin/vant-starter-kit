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

### 3.1 ~~CI/CD~~ ✅（2026-08-03 完成）

- 无 `.github/workflows/`，建议添加：
  - ~~`ci.yml`~~：`vp install --frozen-lockfile && vp check && vp test && vp run build`
  - ~~`deploy.yml`~~：Cloudflare Workers 部署（push main 自动构建 + wrangler deploy）

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

| 功能                                        | 状态 | 说明                                                                           |
| ------------------------------------------- | ---- | ------------------------------------------------------------------------------ |
| ~~Service Worker（Workbox）~~               | ✅   | `registerType: 'autoUpdate'`，预缓存 + API 缓存                                |
| ~~PWA 图标生成~~                            | ✅   | `@vite-pwa/assets-generator`，全套 icon（含 maskable）                         |
| ~~manifest.webmanifest~~                    | ✅   | name / short_name / icons / display / scope                                    |
| ~~manifest `id` 字段~~                      | ✅   | `id: '/'`，Chrome PWA 唯一标识（2026-07-31 新增）                              |
| `screenshots`                               | ⚠️   | manifest 中留有 TODO 占位，需要产品截图（3-5 张）                              |
| ~~`navigationFallback`~~                    | ✅   | `navigateFallback: '/index.html'` + API/version.json 等 denylist（2026-08-03） |
| ~~图片/字体缓存策略~~                       | ✅   | 图片 CacheFirst（30 天）+ 字体 CacheFirst（1 年）（2026-08-03）                |
| ~~`CacheableResponsePlugin`（状态码过滤）~~ | ✅   | API/图片/字体缓存均只缓存 `0/200` 状态码（2026-08-03）                         |
| ~~`cleanupOutdatedCaches`~~                 | ✅   | 自动清理旧版本预缓存，配合 autoUpdate（2026-08-03）                            |
| SW 注册错误监控                             | ✅   | `src/utils/pwa.ts` 提供 Console 日志诊断（2026-07-31 新增）                    |
| ~~`appinstalled` 事件处理~~                 | ✅   | 安装完成后弹出 Toast "安装成功！应用已添加到桌面"（2026-07-31）                |
| ~~`beforeinstallprompt` 事件~~              | ✅   | 监听 + `promptInstall()` 手动触发安装（2026-07-31 新增）                       |
| ~~开发环境 HTTPS 反向代理~~                 | ✅   | `unplugin-https-reverse-proxy`，但需释放 443 端口（见下方）                    |

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
  ├── Build 优化（code splitting + compression + visualizer —— manualChunks 与 Rolldown 不兼容，需按 Rolldown 方式拆分）
  └── PWA manifest `screenshots`（需要真实产品截图 3-5 张）
```

> 2026-08-03 更新：CI/CD 与 PWA SW 策略增强已完成，见下方「七、工程优化记录」。

---

## 五、当前评分

| 维度       | 得分       | 变化 | 说明                                                    |
| ---------- | ---------- | ---- | ------------------------------------------------------- |
| 架构完整性 | ⭐⭐⭐⭐⭐ | —    | App Shell / 布局系统 / PWA / 深色模式 / 类型系统        |
| 页面完整度 | ⭐⭐⭐⭐⭐ | ⬆️   | 18+ 示例页全覆盖（分类/社区/详情/大屏/后台/表单/反馈）  |
| 认证闭环   | ⭐⭐⭐⭐   | —    | Router 守卫 + Login 表单 + API 拦截器 + 登出            |
| 错误处理   | ⭐⭐⭐⭐   | —    | 全局 errorHandler + toast 通知 + API 拦截 + SW 注册诊断 |
| 测试覆盖   | ⭐⭐       | —    | 11 tests（useEnv + cart store），核心 composable 覆盖   |
| 工程化     | ⭐⭐⭐     | —    | 持久化 store + i18n + env 文件 + PWA 图标生成 + SW 监控 |
| 国际化     | ⭐⭐⭐⭐   | —    | vue-i18n v11，zh-CN/en 双语言                           |
| 文档       | ⭐⭐⭐⭐⭐ | —    | 5 份架构文档 + gap-analysis                             |

---

## 六、示例页面优化（2026-08-02）

### 6.1 背景

此前多个页面为调试占位内容（`bd-red`、`vvv-hot`、`11bottom`、`ddd` 等），
且 `list.vue` 与 `detail/index.vue` 内容几乎相同，难以吸引开发者评估 Starter Kit。

### 6.2 本次改动

| 页面                  | 改动前                 | 改动后                                     |
| --------------------- | ---------------------- | ------------------------------------------ |
| `categories.vue`      | 调试占位（按钮堆砌）   | Sidebar 分类导航 + 商品联动列表            |
| `seed.vue`            | 与分类页几乎相同       | 种草 Feed 卡片流（点赞/关注/收藏）         |
| `good.vue`            | `bd-red`/`sss` 占位    | 完整商品详情（轮播/规格/数量/ActionBar）   |
| `list.vue`            | 固定一篇"携程"文章     | 资讯列表 + 分页模拟 + 跳转详情             |
| `detail/index.vue`    | 与 list 相同           | 文章详情页（正文/点赞/收藏/自定义 Footer） |
| `admin.vue`           | 仅 `test` + Department | 管理后台仪表盘（统计/订单/用户）           |
| `screen.vue`          | 3 个简单卡片           | 完整大屏（指标卡/趋势图/环形图/实时动态）  |
| `pull-refresh.vue`    | 仅刷新计数             | Feed 示例 + 新数据置顶演示                 |
| `components-demo.vue` | 4 个组件               | 基础/反馈/表单/展示四大类 15+ 组件         |
| `test.vue`            | 残留 `bd-red` 占位     | 清理调试样式，保留布局演示功能             |
| `my.vue`              | 部分入口               | 增加示例中心/表单/反馈入口 + 语言切换      |
| `index.vue`           | 数字 Banner            | 文案化 Banner + 商品网格                   |

### 6.3 新增页面

| 页面     | 路由                 | 演示要点                                   |
| -------- | -------------------- | ------------------------------------------ |
| 示例中心 | `/examples`          | 18+ 示例页统一入口                         |
| 表单示例 | `/examples/form`     | van-form 校验 + Picker/Uploader/Radio 等   |
| 反馈组件 | `/examples/feedback` | Toast/Dialog/Notify/ActionSheet/ShareSheet |

### 6.4 文档更新

- `README.md` 新增「🗺️ 示例页面」章节，列出全部示例路由与演示要点
- `src/plugins/i18n.ts` 支持从持久化存储恢复语言，刷新不丢失

---

## 七、工程优化记录（2026-08-03）

### 7.1 类型检查修复（重要）

**问题**：`package.json` 的 build 脚本是 `tsc && vp build`，但根 `tsconfig.json`
是 solution 风格（`files: []` + references），裸 `tsc` 实际上**不检查任何文件**，
项目一直在"无类型检查"状态下构建。

**修复**：

- build 脚本改为
  `vue-tsc --noEmit -p tsconfig.app.json && vue-tsc --noEmit -p tsconfig.vitest.json && vue-tsc --noEmit -p tsconfig.node.json && vp build`
- 修复了开启检查后暴露的既有问题：
  - `vite.config.ts`：代理规则类型 `Record<string, ProxyOptions>`；`ProxyOptions` 改从 `vite-plus` 导入
  - `navbar.vue`：emit 事件名大小写不一致（`toggle-sidebar` vs `toggleSidebar`）
  - `useEnv.test.ts`：`as unknown as ImportMetaEnv` 显式双重转换
  - `tsconfig.vitest.json`：include 补上 `types/**/*`，否则测试项目看不到自动生成的
    auto-imports / typed-router / 虚拟模块声明
- 新增 `types/virtual-modules.d.ts`：声明 `virtual:generated-layouts` 虚拟模块
  （该插件的 `client.d.ts` 通过 `types` 数组加载在 build 模式下不可靠，
  且模块名含 `virtual:` 会被模块解析当作 URI 跳过）
- 版本对齐：pnpm catalog 中 `vite` 从 `vite-plus-core@0.2.6` 升到 `0.2.7`，
  与 `vite-plus@0.2.7` 一致，消除双副本类型不匹配（Excessive stack depth）

### 7.2 Lint 清理

- 移除 `external.ts` 未使用的 `Method` 导入
- 消除 4 处 `no-floating-promises`（useAppUpdate / useStatusBar / main.ts）
- 用自定义 `InstallPromptEvent` 接口替换 TS 中为 error 类型的
  `BeforeInstallPromptEvent`
- `vp check` 目前 0 error / 0 warning

### 7.3 CI/CD

- 新增 `.github/workflows/ci.yml`：`vp install --frozen-lockfile` → `vp check` →
  `vp test` → `vp run build`（与 deploy 使用同一构建脚本）
- 使用 `voidzero-dev/setup-vp@v1` 自动安装 Node.js + pnpm + 依赖缓存

### 7.4 PWA SW 策略增强（`build/plugins/pwa.ts`）

- `cleanupOutdatedCaches: true`：自动清理旧版本预缓存
- `navigateFallback: '/index.html'`：SPA 路由回退（denylist：API / 外部 API /
  version.json / _headers）
- 图片资源 CacheFirst（30 天）+ 字体资源 CacheFirst（1 年）
- 所有运行时缓存（API / 图片 / 字体）增加 `cacheableResponse` 状态码过滤（0/200）
- `maximumFileSizeToCacheInBytes: 4MB` 防异常大文件

### 7.5 其他打磨

- `index.html`：`lang="zh-CN"`
- `index.css`：定义 `--safe-area-inset-top`，让 `AppUpdatePrompt` 的顶部安全区生效
- `external-methods/pay.ts`：API 实例改为惰性获取，避免环境变量未配置时 import 即抛错
- `useNetworkStatus`：组件卸载时清理恢复提示的计时器
- `login.vue`：登录后 redirect 只允许站内相对路径，修复开放重定向隐患
- `useAppUpdate`：轮询改为单例 + 实例计数，修复"组件卸载后轮询永久停止"的生命周期 bug

### 7.6 验证结果

```text
vp check        → pass（108 files formatted / 0 error / 0 warning）
vp test         → 2 files / 11 tests passed
pnpm build      → vue-tsc 3 项目通过 + vp build 成功（PWA 126 预缓存条目）
```
