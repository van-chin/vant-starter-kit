# Starter-Kit 功能缺口分析

> 文档日期：2026-07-30
> 分析范围：全项目，含 pages / stores / router / API / build / tests / docs

---

## 总览

本项目作为移动端 H5 / PWA 快速启动模板，**架构层面比较完善**（App Shell、布局系统、PWA 集成、深色模式、类型系统），但在**功能完整度**和**工程化完备性**上存在明显缺口。

以下按严重程度排序，分为三档：🔴 必须补齐 / 🟡 强烈建议 / 🟢 锦上添花。

---

## 一、🔴 必须补齐（影响起步体验）

### 1.1 认证流程断裂

| 问题                | 现状                                                                                           | 影响                               |
| ------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------- |
| Router 无守卫       | `src/router/index.ts` 无 `beforeEach`，无权限路由                                              | 任何页面均可直接访问，登录形同虚设 |
| Login 页无提交逻辑  | `src/pages/login.vue` 只有一个 `van-field`，无按钮、无 `login()` 调用                          | 登录页只是一个占位 UI              |
| Auth Store 未被调用 | `auth.ts` 的 `login()`、`logout()`、`setAuth()` 在项目零引用                                   | 认证模块完全闲置                   |
| API 拦截器只有 TODO | `BizCode.UNAUTHORIZED` 处理是 `console.error` + `throw`，注释写着 "TODO: 替换为实际的路由跳转" | 未授权请求无自动跳转登录           |

**建议**：

- Router 添加 `beforeEach`：未登录重定向到 `/login`，已登录放行
- `login.vue` 补全表单（手机号+验证码或密码）、提交逻辑
- API 拦截器在 401 时 `router.push('/login')` 并清空 token
- 新增 `RouteMeta.requiresAuth` 字段，按页面声明

### 1.2 零错误处理

| 问题              | 现状                                               | 影响                             |
| ----------------- | -------------------------------------------------- | -------------------------------- |
| 零 try/catch      | 整个 `src/` 无任何 try/catch                       | 任何运行时异常都会变成未捕获错误 |
| 无全局错误边界    | 无 `onErrorCaptured`、无 `app.config.errorHandler` | 用户看不到任何错误提示           |
| 无 Toast 错误通知 | `showToast` 只在 2 个文件用于成功提示              | API 失败后用户无感知             |

**建议**：

- `main.ts` 注册 `app.config.errorHandler`
- 封装一个 `useErrorHandler` composable，用于 try/catch + toast 通知
- API 方法层的 `onError` 接入 toast

### 1.3 零测试

| 问题          | 现状                                                              | 影响                           |
| ------------- | ----------------------------------------------------------------- | ------------------------------ |
| 无测试文件    | `src/composables/__tests__/` 和 `src/api/methods/__tests__/` 为空 | Vite+ 的项目模板默认应该带测试 |
| vitest 未安装 | `package.json` 无 vitest，但 `tsconfig.vitest.json` 存在          | CI 或新手运行 `vp test` 会报错 |

**建议**：

- 安装 `vitest` + `@vue/test-utils`
- 为 `useLayoutConfig`、`useLayoutCustomization`、`useEnv` 写基础测试
- 为 auth store 写 `login`/`logout` 行为测试

### 1.4 表单验证缺失

| 问题       | 现状                                  | 影响                             |
| ---------- | ------------------------------------- | -------------------------------- |
| 无表单验证 | 全项目无 `van-form` `rules`、无验证库 | 登录页表单无校验，提交空值无提示 |

**建议**：

- 选用 `vee-validate` + `@vee-validate/rules` 或 Vant 内置 `van-form` rules
- 在 login 页做示范

### 1.5 加载态管理缺失

| 问题           | 现状                                  | 影响                   |
| -------------- | ------------------------------------- | ---------------------- |
| 无全局 loading | 无请求队列追踪、无 loading composable | 网络请求期间无视觉反馈 |
| 无 Skeleton    | `van-skeleton` 从未使用               | 首屏加载无骨架屏       |

**建议**：

- 封装 `useLoading` composable（pending 计数 + 全局 loading overlay）
- 首页添加 Skeleton 示例

---

## 二、🟡 强烈建议

### 2.1 页面多为占位

| 页面             | 状态                    | 建议                              |
| ---------------- | ----------------------- | --------------------------------- |
| `index.vue`      | 占位                    | 补充 banner + 商品列表示例        |
| `cart.vue`       | 占位（标题写错 "seed"） | 补全购物车逻辑 + Pinia cart store |
| `categories.vue` | 占位                    | 补全分类树                        |
| `seed.vue`       | 占位                    | 补全社区/种草内容                 |
| `my.vue`         | 部分完整                | 补全"退出登录"按钮逻辑            |
| `login.vue`      | 残缺                    | 补全表单及提交                    |
| `admin.vue`      | 仅测试文字              | 补全管理面板                      |
| `screen.vue`     | 纯静态数字              | 接入真实数据                      |

**建议**：至少让 index / cart / login 三个页面功能完整，其余可保留占位但加 `TODO` 注释。

### 2.2 Store 缺失

| 缺失 Store        | 用途                             |
| ----------------- | -------------------------------- |
| `app.ts`          | 全局设置（主题、语言、网络状态） |
| `cart.ts`         | 购物车状态                       |
| `loading.ts`      | 全局加载态                       |
| `notification.ts` | 消息通知 / badge 计数            |

### 2.3 网络状态 / 离线检测

`@vueuse/core` 已安装，但没使用 `useNetwork`。PWA 已配置但无离线 UI。

**建议**：

- 用 `useNetwork` composable 监听在线/离线
- 离线时在布局顶部显示 "当前无网络" banner
- `van-empty` 作为离线兜底页

### 2.4 i18n 缺失

项目大量中文 UI（导航栏标题、tabbar 标签、页面文字），但无国际化基础设施。

**建议**：

- 安装 `vue-i18n`，配合 `@intlify/unplugin-vue-i18n` 在 Vite 编译期注入
- 先用中文做默认 locale，英文做第二语言

### 2.5 Router 缺失 ScrollBehavior

多次页面跳转后返回上一页，滚动位置丢失。

**建议**：

- `createRouter` 添加 `scrollBehavior` 配置
- 保存/恢复滚动位置

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

### 3.3 SEO / Meta 标签

`index.html` 缺少：

- `<meta name="description">`
- Open Graph 标签
- `<link rel="apple-touch-icon">`
- 动态 title（`@unhead/vue` 已在 workspace catalog，未安装使用）

### 3.4 监控/埋点

- 无 Sentry / 错误上报
- 无 Google Analytics / 百度统计

### 3.5 无障碍 (a11y)

- 无 ARIA 属性
- 无 focus 管理
- 无 skip-to-content

### 3.6 env 文件

缺失：

- `.env.production`（生产环境模板）
- `.env.test`（测试环境模板）
- 建议的 env 变量：`VITE_APP_TITLE`、`VITE_APP_VERSION`、`VITE_ENABLE_MOCK`

### 3.7 Dayjs 插件

已装：`relativeTime`、`duration`、`utc`、`timezone`
建议加：`customParseFormat`、`calendar`、`isToday`/`isYesterday`

### 3.8 PWA Service Worker

- 无 `navigationFallback`（离线不应显示浏览器错误页）
- 无 `cleanupOutdatedCaches`
- 无图片/字体缓存策略
- 无 `CacheableResponsePlugin`（状态码过滤）

### 3.9 常用移动端组件

项目中未使用的 Vant 高频组件：

- `van-swipe-cell`（滑动操作）
- `van-popup`（弹出层）
- `van-uploader`（图片上传）
- `van-skeleton`（骨架屏）
- `van-empty`（空状态）
- `van-calendar`（日期选择）
- `van-number-keyboard`（数字键盘）

**建议**：至少为 `popup`、`swipe-cell`、`empty`、`skeleton` 提供使用示例。

---

## 四、优先级路线图建议

```
第一阶段（本周）：补齐 🔴 致命缺口
  ├── Router 守卫 + Login 闭环
  ├── app.config.errorHandler + Toast 错误通知
  ├── vitest + 核心 composable 测试
  ├── useLoading composable + Skeleton 示例
  └── 补全 index / cart / login 页面功能

第二阶段（本月）：补齐 🟡 重要缺口
  ├── pinia-plugin-persistedstate + cart/app store
  ├── vue-i18n + @intlify/unplugin-vue-i18n
  ├── useNetwork + 离线 UI
  ├── router scrollBehavior
  └── env 文件补全

第三阶段（后续）：🟢 完善项
  ├── CI/CD + Build 优化
  ├── SEO meta + @unhead/vue
  ├── Sentry / Analytics
  ├── Dayjs 插件补全
  ├── PWA SW 策略增强
  └── a11y 基础改造
```

---

## 五、排查信息汇总

| 维度       | 得分       | 说明                                             |
| ---------- | ---------- | ------------------------------------------------ |
| 架构完整性 | ⭐⭐⭐⭐⭐ | App Shell / 布局系统 / PWA / 深色模式 / 类型系统 |
| 页面完整度 | ⭐⭐       | 12 页中 10 页为占位                              |
| 认证闭环   | ⭐         | Store 存在但无路由守卫、无页面调用               |
| 错误处理   | ⭐         | 零 try/catch、零错误边界                         |
| 测试覆盖   | ☆          | 零测试文件                                       |
| 工程化     | ⭐⭐       | 无 CI/CD、无 build 优化                          |
| 国际化     | ☆          | 无 i18n                                          |
| 无障碍     | ☆          | 无 a11y                                          |
| 文档       | ⭐⭐⭐⭐   | 4 份架构文档，质量高                             |
