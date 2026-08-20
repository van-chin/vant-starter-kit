# CHANGELOG

## v0.0.2 (2026-08-20)

### 依赖升级

- **Vite+ 0.2.7 → 0.2.9** — 新增 `vp toolchain` / `vp hooks` 命令；vite-plus-core 0.2.9（vite 8.2.1 + rolldown 1.2.3）
- **Vue 3.6.0-rc.4** / Vant 4.10.0 / pinia 4.0.3 等依赖同步升级至最新
- **pnpm 11.18 → 11.22**，**Node 24.18 → 24.19**
- 修复 rolldown native binding 加载失败（vite 别名对齐 vite-plus-core@0.2.9）

### 工程优化

- **字体自托管** — 移除 Google Fonts（Poppins），改用自托管 Noto Sans SC Variable（思源黑体，OFL 开源协议），unicode-range 按需加载，全端视觉一致，不依赖外网 CDN
- **CI 统一** — deploy.yml 迁移至 setup-vp，与 ci.yml 工具链一致；wrangler / pnpm 版本与本地 catalog 对齐
- **发布脚本** — 新增 `vpr release`（bumpp 一键版本递增 + commit + tag + push）
- `@vue/test-utils` 纳入 pnpm catalog，syncpack 门禁通过

## v0.0.1 (2026-08-01)

### 核心架构

- **App Shell 布局系统** — body 焊死 + main 唯一滚动 + header/footer 钉死，根治移动端下拉刷新/橡皮筋/头脚消失
- **视口高度三层回退** — JS `--app-height` → `100dvh` → `100svh`，工具栏变化不抖动
- **四层显隐控制** — URL query > `definePage` meta > 全局默认 > 权限限制
- **Provide/Inject 组件替换** — 任一页面可注入自定义 Header/Footer，卸载自动恢复
- **3 套开箱布局** — `default`（移动端）/ `admin`（侧边栏）/ `screen`（大屏深色）

### 深色模式

- **VueUse `useDark()` 三路协同** — Tailwind `dark:` 前缀 + Vant `<van-config-provider>` + `<meta name="theme-color">`
- **状态栏颜色动态切换** — Unhead 管理 + 直接 DOM 赋值双保险，兼容 PWA standalone 模式
- **PWA manifest `theme_color` 对齐** — 浅色模式默认 `#ffffff`，深色通过 JS 接管

### PWA

- **Service Worker（Workbox）** — `registerType: autoUpdate`，预缓存 + API NetworkFirst 运行时缓存
- **安装引导面板** — Vant FloatingPanel 三档锚点，折叠/展开/下滑关闭，三重防重复提示
- **版本更新检测** — `version.json` 轮询 + Cloudflare `_headers` 防缓存 + 顶部蓝色提示条
- **PWA 图标完整套件** — `@vite-pwa/assets-generator` 生成 6 种尺寸（含 maskable + apple-touch-icon）

### SEO & 国际化

- **@unhead/vue v3** — 动态 `<title>` + OG + Twitter Card 标签，router `afterEach` 自动更新
- **vue-i18n v11** — zh-CN / en 双语言，24 个翻译 key

### 开发体验

- **文件系统路由** — `src/pages/` 目录即路由，16 个页面含完整示例
- **自动导入** — Vue/VueRouter/Pinia API + Vant 组件 + composables + stores
- **Alova HTTP 层** — 统一拦截器 + 业务码处理 + Toast 通知
- **vConsole 手机调试** — 生产环境也支持，`?vconsole` 按需开启
- **Day.js 中文配置** — 10 个插件 + `Asia/Shanghai` 时区

### 外部 API 支持

- **多后端命名规范** — `VITE_EXTERNAL_API_<NAME>=<URL>`，支持任意数量外部 API
- **开发环境自动代理** — `vite.config.ts` 动态扫描环境变量生成代理规则，零跨域
- **Alova 实例工厂** — `getExternalAlova(name)` 单例缓存 + DEV/PROD 自动切换

### 环境变量体系

- **9 个核心变量** — 只保留代码实际使用的变量，清理 6 个未使用变量
- **TypeScript 类型安全** — `env.d.ts` + `useEnv()` composable 双保险
- **4 个环境模板** — `.env.example` / `.env.development.example` / `.env.production.example` / `.env.local.example`
- **同步规则文档** — 新增/删除变量需同步 3 个文件（`env.d.ts` + `useEnv.ts` + `.env.example`）

### 部署 & 工程化

- **Cloudflare Workers** — GitHub Actions 自动部署（push `main` 触发）
- **vite-plus v0.2.7** — `vpr` 命令 + `vp check --fix` 预提交检查
- **pnpm catalog** — 40+ 依赖版本统一管理
- **syncpack** — 依赖版本一致性检查

### 页面

- **首页** — 轮播 + 骨架屏 + 商品网格 + 加购
- **购物车** — 完整 CRUD + 滑动删除 + SubmitBar
- **登录** — 表单验证 + i18n + redirect 回跳
- **列表** — 无限滚动 + 下拉刷新
- **详情** — 文章内容 + 自定义 Footer 替换示例
- **组件示例** — Popup/SwipeCell/Skeleton/Empty 交互演示
- **测试页** — Header/Footer 替换 + query 参数动态切换
- **大屏** — 深色全屏数据面板 + 实时时钟
- **管理后台** — 可折叠侧边栏布局
