<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

# vant-starter-kit — 项目开发指南

## 🚨 提交与推送规范（Commit & Push Policy，最高优先级）

**本项目要求：每次代码/文档改动完成后，必须自动执行 `git commit` 并 `git push` 到远程仓库，禁止询问用户"是否提交"。**

此规则对所有 agent 工具、AI 模型、电脑环境一致生效——只要在本仓库内工作（vibe coding / 换 agent / 换模型 / 换电脑），都必须遵守，无需再次征求用户确认。

### 强制流程

1. **改动完成后先验证**：运行 `vp check` 和 `vp test`（必要时 `vp run build`），确保改动通过后再提交。
2. **提交所有相关改动**：`git add` 本次任务涉及的全部文件（包括 AGENTS.md、文档、配置、lockfile 等），不要遗漏，也不要夹带与任务无关的改动。
3. **提交信息遵循 Conventional Commits**：
   - 格式：`<type>(<scope>): <subject>`，如 `feat(cart): 支持批量删除`
   - type 常用值：`feat` / `fix` / `refactor` / `perf` / `docs` / `style` / `test` / `build` / `ci` / `chore`
   - subject 用祈使句、首字母小写、不超过 50 字符、结尾不加句号
   - 正文（可选）说明"改了什么、为什么"，每行不超过 72 字符，用中文撰写
4. **推送**：`git push` 到当前分支对应的远程仓库。
5. **推送冲突时**：先 `git pull --rebase` 拉取远程最新，解决冲突后重新提交并推送。
6. **用户已有未提交改动**：保留并纳入提交（除非明确属于其他任务，则保留不动并在提交说明中注明）。

> 违反示例：改完代码不提交就结束任务、提交前问"需要提交吗"、push 失败后静默跳过。

## 技术栈

- **构建工具**: Vite+ (v0.2.9) — 基于 Vite 的统一工具链
- **框架**: **Vue 3.6** (Composition API, `<script setup>`)
- **UI 库**: Vant 4 (移动端组件库，自动导入)
- **工具库**: VueUse (useDark, useToggle 等)
- **状态管理**: Pinia + pinia-plugin-persistedstate
- **路由**: Vue Router 5 + 文件系统路由 + 布局系统
- **HTTP 请求**: Alova + Axios 适配器
- **CSS**: Tailwind CSS v4
- **服务端**: Nitro (全栈 / SSR)
- **国际化**: Vue I18n v11 (zh-CN / en)
- **SEO**: @unhead/vue v3 (动态 title / meta / OG)
- **调试**: vConsole (移动端控制台)
- **日期**: Day.js (中文 locale 配置)
- **包管理**: pnpm 11.x (catalog 协议统一版本)
- **语言**: TypeScript, 严格模式 (`noUncheckedIndexedAccess`)

## Starter Kit 核心能力

作为移动端 H5 / PWA 快速启动模板，本项目的核心能力：

| 能力              | 实现方案                                                | 对应文档                                                      |
| ----------------- | ------------------------------------------------------- | ------------------------------------------------------------- |
| 🏗️ App Shell 布局 | body 焊死 + main 唯一滚动 + flex 自然流                 | [layout-architecture.md](./docs/layout-architecture.md)       |
| 🌓 深色模式       | VueUse `useDark()` → Tailwind + Vant + 状态栏三路协同   | [dark-mode-architecture.md](./docs/dark-mode-architecture.md) |
| 📲 PWA            | vite-plugin-pwa (Workbox) + 安装引导面板 + 版本更新检测 | [pwa-integration.md](./docs/pwa-integration.md)               |
| 🧭 智能导航栏     | Tabbar 页面隐藏返回 → 非 Tabbar 显示返回（三信号判定）  | `src/layouts/default/components/header.vue`                   |
| 🎨 布局控制       | 4 层显隐控制 + Provide/Inject 组件替换                  | `src/composables/useLayoutConfig.ts`                          |
| 🌐 国际化         | vue-i18n v11 (zh-CN / en)                               | `src/locales/`                                                |
| 🔍 SEO            | @unhead/vue v3 动态 title + OG/Twitter Card             | `src/plugins/head.ts`                                         |
| 🐛 移动端调试     | vConsole 生产可用 + `?vconsole` 按需开启                | `src/plugins/vconsole.ts`                                     |
| 🔄 版本更新提示   | version.json 轮询 + Cloudflare no-store 缓存策略        | `src/composables/useAppUpdate.ts`                             |
| 🚀 一键部署       | Cloudflare Workers (GitHub Actions)                     | `.github/workflows/deploy.yml`                                |

## 项目结构

```
├── build/                  # Vite+ 插件组合
│   ├── index.ts           # 插件入口，按环境条件组合
│   └── plugins/
│       ├── vue.ts         # Vue 核心 (vue/jsx/devtools/auto-import/components/router/layouts)
│       ├── nitro.ts       # Nitro 服务端集成
│       ├── tailwindcss.ts # Tailwind CSS v4
│       ├── pwa.ts         # PWA 插件 (vite-plugin-pwa)
│       ├── version.ts     # version.json 生成 (前端版本检测)
│       └── https-reverse-proxy.ts  # 开发 HTTPS 反向代理
├── server/                 # Nitro 服务端 API
│   └── api/
│       ├── app/tabbars.ts # 底部标签栏数据
│       ├── tab-items.ts   # Tab 列表数据
│       └── users.ts       # 用户数据 (SQLite)
├── src/
│   ├── api/               # 客户端 HTTP 请求层 (Alova)
│   │   ├── index.ts       # Alova 实例 (统一错误处理、业务码拦截)
│   │   └── methods/       # API 方法模块
│   │       ├── app.ts     # 应用配置 (tabbars 方法)
│   │       ├── auth.ts    # 认证
│   │       ├── im.ts      # 腾讯云 IM
│   │       ├── oss.ts     # 阿里云 OSS
│   │       └── tabs.ts    # Tab 列表
│   ├── components/        # 组件
│   │   ├── AppUpdatePrompt.vue  # 版本更新提示条
│   │   ├── PwaInstallPrompt.vue # PWA 安装提示条
│   │   └── businesses/    # 业务组件
│   ├── composables/       # 组合式函数 (自动导入)
│   │   ├── useAppUpdate.ts      # 版本检测（轮询 version.json）
│   │   ├── useEnv.ts            # 环境变量类型安全访问
│   │   ├── useLayoutConfig.ts   # 布局头尾显隐控制
│   │   ├── useLayoutCustomization.ts  # 布局组件替换 (provide/inject)
│   │   ├── useLoading.ts       # 全局 Loading 状态
│   │   ├── useNetworkStatus.ts # 网络在线/离线检测
│   │   ├── usePwaInstall.ts    # PWA 安装状态管理
│   │   └── useStatusBar.ts     # 状态栏颜色控制 (深色模式适配)
│   ├── layouts/           # 布局 (vite-plugin-vue-layouts-next)
│   │   ├── default.vue    # 移动端默认布局 (App Shell)
│   │   ├── screen.vue     # 数据大屏布局 (深色主题 + 全屏)
│   │   ├── admin.vue      # 管理后台布局 (可折叠侧边栏)
│   │   ├── default/components/  # header/footer 等子组件
│   │   ├── screen/components/   # header/footer/fullscreen 等
│   │   └── admin/components/    # sidebar/navbar 等
│   ├── locales/           # 国际化文案
│   │   ├── zh-CN.ts       # 简体中文
│   │   └── en.ts          # 英文
│   ├── pages/             # 文件系统路由页面
│   ├── plugins/           # 插件配置
│   │   ├── dayjs.ts       # Day.js 配置 (中文 locale、相对时间、UTC/时区)
│   │   ├── head.ts        # @unhead/vue 实例 (SEO title/meta/OG)
│   │   ├── i18n.ts        # Vue I18n 实例
│   │   └── vconsole.ts    # vConsole 调试面板 (条件初始化)
│   ├── stores/            # Pinia 状态管理
│   │   ├── index.ts       # Pinia 初始化 (SSR 兼容 + persist)
│   │   ├── app.ts         # 应用全局状态 (locale/isFirstLaunch)
│   │   ├── auth.ts        # 认证 Store (登录/登出/JWT)
│   │   └── cart.ts        # 购物车 Store (增删改查/总价)
│   ├── utils/             # 工具模块
│   │   └── pwa.ts         # PWA 事件系统 (pub/sub + SW 诊断)
│   └── styles/            # 全局样式
│       └── index.css      # Tailwind CSS v4 入口 + App Shell + 深色模式
├── types/                 # 类型定义 (路径别名 #types)
│   ├── index.ts           # 统一导出
│   ├── api/               # API 类型 (response/auth/tab-items/app/tabbars)
│   └── automatics/        # 自动生成类型 (auto-imports/components/typed-router)
├── vite.config.ts         # Vite+ 配置
├── nitro.config.ts        # Nitro 配置 (SQLite)
└── pnpm-workspace.yaml    # pnpm catalog 依赖版本定义
```

## 开发命令

```bash
vp install     # 安装依赖
vpr dev        # 启动开发服务器（执行 package.json dev 脚本）
vpr build      # 生产构建（执行 package.json build 脚本）
vpr preview    # 预览生产构建（执行 package.json preview 脚本）
vp check       # 格式化 + 代码检查 + 类型检查
vp test        # 运行测试
vpr <script>   # 运行 package.json 中的脚本（v0.2.7+，等价于 vp run <script>）
vp env doctor  # 诊断环境问题
```

> **v0.2.7 起**：`vpr` 是 `vp run` 的快捷方式，专门执行 `package.json` 中定义的脚本。
> 例如 `vpr dev` 会运行 `package.json` 的 `"dev"` 脚本，而 `vp dev` 始终运行 Vite+ 内置的 dev 命令。
> 当两者同名时，`vp` 会提示改用 `vpr`。

---

## 🏗️ App Shell 架构

这是本项目的核心架构决策。所有布局统一采用此架构。

### 设计原则

```
html/body: overflow:hidden + position:fixed    ← 焊死，永不滚动
└── shell: vh-full / flex-col                  ← 视口高度，三段式
    ├── header (flex:none)                     ← 钉死在顶部
    ├── main (flex:1 + min-h:0 + overflow:auto) ← 唯一滚动区域
    └── footer (flex:none)                     ← 钉死在底部
```

### 关键 CSS 类

| 类名              | 作用                                                                  |
| ----------------- | --------------------------------------------------------------------- |
| `vh-full`         | 视口高度：`var(--app-height, 100dvh)`，由 JS 精确测量                 |
| `min-vh-full`     | 最小视口高度                                                          |
| `flex-none`       | header/footer 不伸缩                                                  |
| `flex-1`          | main 吃掉剩余空间                                                     |
| `min-h-0`         | ★ 允许 main 收缩到比内容矮（flex 默认 `min-height: auto` 会撑破外壳） |
| `overflow-y-auto` | 只有 main 出滚动条                                                    |
| `overflow-hidden` | 外壳自身不滚                                                          |

### overscroll 策略

| 模式   | `overscroll-behavior`               | 下拉刷新                                         |
| ------ | ----------------------------------- | ------------------------------------------------ |
| 浏览器 | 默认 (auto)                         | ✅ 保留，body 焊死后越界手势触发 Pull-to-Refresh |
| PWA    | `contain` (via `@media standalone`) | ❌ 禁用，提供类原生 App 沉浸感                   |

### --app-height 三层回退

```
1. --app-height (JS: window.innerHeight)   ← 最精确
2. 100dvh (dynamic viewport height)        ← 浏览器原生
3. 100svh (small viewport height)          ← 旧浏览器兜底
```

### iOS 兼容

- `position: fixed; inset: 0` 锁住 body 防橡皮筋
- `safe-area-inset-bottom` 适配齐刘海
- 完整文档：[docs/layout-architecture.md](./docs/layout-architecture.md)

---

## 🌓 深色模式

三方协同实现，状态由 VueUse `useDark()` 单例管理（默认跟随系统，手动切换时以用户为准）：

```
useDark() 单例 (localStorage 持久化)
      │
  ┌───┼───────────────┐
  ▼                   ▼
html.dark        isDark Ref
  │                   │
  ▼                   ▼
Tailwind          van-config-provider
dark:* 类          :theme="vantTheme"
  │                   │
  ▼                   ▼
布局背景/文字暗色   Vant 组件暗色主题
```

### 实现要点

| 层级     | 技术                                             | 文件                   |
| -------- | ------------------------------------------------ | ---------------------- |
| 状态     | `useDark()` + `useToggle()`                      | `src/pages/my.vue`     |
| Vant     | `<van-config-provider :theme>`                   | `src/App.vue`          |
| Tailwind | `@custom-variant dark (&:where(.dark, .dark *))` | `src/styles/index.css` |
| 布局     | `dark:bg-*` / `dark:text-*`                      | 各 layout 文件         |

### 使用方式

```vue
<!-- 切换开关 -->
<van-switch :model-value="isDark" @click="toggleDark()" />

<!-- 推荐：使用全局颜色令牌（自动适配深色模式，无需手写 dark: 前缀） -->
<div class="bg-[var(--color-bg-page)] text-[var(--color-text-primary)]">

<!-- 也可用 Tailwind dark: 前缀处理特殊场景 -->
<div class="bg-white dark:bg-gray-950 dark:text-gray-100">
```

### 全局颜色令牌（Design Tokens）

定义在 `src/styles/index.css` 中，`:root` 浅色 / `.dark` 深色两组值自动切换。
**新页面优先使用令牌**，避免逐页面手写 `dark:` 覆盖：

| 令牌                     | 浅色              | 深色                    | 用途            |
| ------------------------ | ----------------- | ----------------------- | --------------- |
| `--color-bg-page`        | `#F8F9FA`         | `#1c1c1e`               | 页面底色        |
| `--color-bg-surface`     | `#fff`            | `#2c2c2e`               | 卡片/输入框表面 |
| `--color-bg-elevated`    | `#fff`            | `#3a3a3c`               | 悬浮态表面      |
| `--color-text-primary`   | `#1F1F1F`         | `#f5f5f5`               | 主文字          |
| `--color-text-secondary` | `#757575`         | `#8e8e93`               | 辅助文字        |
| `--color-text-tertiary`  | `#525252`         | `#a1a1a6`               | 三级文字        |
| `--color-accent`         | `#3883FF`         | `#6eb4ff`               | 链接/强调色     |
| `--color-border-subtle`  | `rgba(0,0,0,.05)` | `rgba(255,255,255,.08)` | 浅色分割线      |

> 用法：`<div class="bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)]">`
> Tailwind v4 任意值语法支持 CSS 变量，自动跟随主题切换。

---

## 👀 Vapor Mode 前瞻

Vue 3.6 引入了 Vapor Mode，移除 Virtual DOM 运行时，性能对标 Solid / Svelte 5，逐组件 opt-in。

### 当前阶段策略

项目已安装 `vue@3.6.0-rc.4`，Vapor 运行时已内置。**目前保持 VDOM 标准模式开发**：

1. **Vue 3.6 仍为 RC 阶段** — 正式版发布前可能有行为调整
2. **UI 组件库尚未就绪** — Vant 4 等尚未正式支持 Vapor Mode
3. **保持代码兼容** — Composition API + `<script setup>` 是 Vapor 的核心 API 子集

### 启用方式（参考，暂不启用）

```vue
<script setup vapor lang="ts">
const count = ref(0);
</script>
```

---

## 🤖 Skills 使用规范（高优先级）

任何任务前必须先检查相关 Skills，不能以"简单问题"为由跳过。

### 必须使用的 Skills

| Skill                                        | 触发场景             |
| -------------------------------------------- | -------------------- |
| `vue-best-practices`                         | Vue 组件 / SFC 开发  |
| `vue-router-best-practices`                  | 路由配置、导航守卫   |
| `pinia`                                      | Store 设计、状态管理 |
| `vue-testing-best-practices`                 | 编写测试             |
| `vite`                                       | Vite 配置、插件开发  |
| `vitest`                                     | 测试配置与运行       |
| `pnpm`                                       | 依赖管理、workspace  |
| `vueuse-functions`                           | VueUse composables   |
| `web-design-guidelines`                      | UI 审查、可访问性    |
| `superpowers:brainstorming`                  | 新功能需求分析       |
| `superpowers:systematic-debugging`           | Bug / 测试失败       |
| `superpowers:test-driven-development`        | 实现前先写测试       |
| `superpowers:requesting-code-review`         | 任务完成自审         |
| `superpowers:verification-before-completion` | 验证后再声明完成     |

### 开发工作流

```
用户需求
   │
   ├→ 新功能 / 复杂修改? → brainstorming skill
   ├→ Bug / 异常?       → systematic-debugging skill
   ├→ Vue 组件?          → vue-best-practices skill
   ├→ 路由?              → vue-router-best-practices skill
   ├→ Store?             → pinia skill
   └→ 完成, 提交前?      → requesting-code-review + verification-before-completion
```

---

## 关键约定

1. **路径别名**: `@/` → `src/`, `#types` → `types/`
2. **布局使用**: 页面通过 `definePage({ meta: { layout: 'xxx' } })` 指定布局
3. **自动导入**: Vue / Vue Router / Pinia API、Vant 组件、`src/composables/` 自动导入
4. **HTTP 请求**: 统一使用 `src/api/index.ts` 中的 `baseAlova` 实例，自带业务码拦截
5. **API 方法**: 放在 `src/api/methods/` 下，按模块拆分，方法返回 Method 实例供 `useRequest` 直接使用
6. **状态管理**: 使用 Pinia + Composition API 风格 `defineStore('name', () => { ... })`，`app`/`cart` store 使用 `pinia-plugin-persistedstate` 持久化
7. **环境变量**: 通过 `useEnv()` composable 类型安全访问，`.env.example` 为模板文件
8. **服务端**: API 使用 Nitro `defineHandler`，类型通过 `#types` 与客户端共享
9. **依赖版本**: 使用 pnpm catalog 在 `pnpm-workspace.yaml` 统一管理
10. **App Shell**: 所有布局继承此架构，新布局模板从 default/screen/admin 参考
11. **深色模式**: 通过 VueUse `useDark()` 管理状态（默认跟随系统，手动切换时以用户为准），Vant `ConfigProvider` 同步组件主题，**优先使用全局颜色令牌** `var(--color-xxx)` 自动适配深色模式，特殊场景才用 Tailwind `dark:` 前缀，`useStatusBar(isDark)` 同步状态栏颜色
12. **SEO**: 通过 `@unhead/vue` 管理 `<head>` 标签，router `afterEach` 自动更新 `<title>`，`index.html` 中有 OG/Twitter Card 静态兜底
13. **PWA 安装**: 使用 `PwaInstallPrompt` 组件提供页面内安装入口，三重检测避免重复提示
14. **版本更新**: `useAppUpdate` 轮询 `version.json`，检测新版本后通过 `AppUpdatePrompt` 提示刷新
15. **移动端调试**: vConsole 在 prod/dev 环境默认启用，也可通过 `?vconsole` URL 参数按需开启
16. **国际化**: 使用 `vue-i18n` v11 Composition API，文案在 `src/locales/` 维护
