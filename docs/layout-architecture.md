# Layout 布局架构

> 文档日期：2026-08-01
> 合并自 `layout-architecture.md` + `layout-control.md`，统一讲述 App Shell、显隐控制、组件替换三大主题。

---

## 一、App Shell 架构

### 1.1 核心理念

所有布局采用 **「容器固定视口，main 内部滚动」** 模式：

```
┌─────────────────────────────────┐
│  <component :is="activeHeader">  │  ← flex-none 钉死在顶部
├─────────────────────────────────┤
│                                 │
│  <main class="flex-1             │  ← flex-1 + min-h-0
│         overflow-y-auto">       │     唯一滚动区域
│    <router-view />              │
│                                 │
├─────────────────────────────────┤
│  <component :is="activeFooter">  │  ← flex-none 钉死在底部
└─────────────────────────────────┘

    容器: vh-full flex-col overflow-hidden
```

**关键 CSS 类**（定义在 `src/styles/index.css`）：

| 类名 | 作用 |
|------|------|
| `vh-full` | 视口高度 `var(--app-height, 100dvh)`，由 JS 精确测量 |
| `flex-col` | 纵向 flex 容器 |
| `flex-none` | header/footer 不伸缩 |
| `flex-1` | main 吃掉剩余空间 |
| `min-h-0` | ★ 允许收缩到比内容矮（默认 `min-height: auto` 会撑破外壳） |
| `overflow-y-auto` | 只有 main 出滚动条 |
| `overflow-hidden` | 外壳自身不滚 |

### 1.2 布局演进（为什么这样设计）

**阶段 1 — 文档流滚动**：整个页面滚动，header 会滚走，tabbar 用 `position:fixed` 脱离文档流，需 `padding-bottom` hack 补偿。

**阶段 2 — 内部滚动 + fixed tabbar**：引入 `vh-full` 固定视口，但 tabbar 仍然是 `fixed`，需硬编码 `padding-bottom`，自定义 footer 高度不匹配。

**阶段 3 — flex 自然流（当前 ✅）**：tabbar 设 `:fixed="false"` 回归文档流，flex `flex-1` 自动计算 main 高度。任意高度的自定义 footer 都无需手动补偿：

```
DefaultFooter (高 50px)          CustomFooter (高 80px)          showFooter=false
vh-full                          vh-full                        vh-full
├── header     46px              ├── header     46px            ├── header     46px
├── main       calc(100%-96px)   ├── main       calc(100%-126px)└── main       calc(100%-46px)
└── footer     50px              └── footer     80px
```

---

## 二、显隐控制：`useLayoutConfig`

### 2.1 四层优先级

页面 Header/Footer 的显隐由以下四层按优先级决定：

```
URL query (?showHeader=0&showFooter=0)    ← 最高，WebView 嵌入
    ↓ 覆盖
definePage meta ({ showHeader: false })   ← 页面声明默认值
    ↓ 降级
composable 默认值 ({ defaultHeader: true }) ← 全局兜底
    ↓ 限制
permissionCheck                            ← 只减不增（已隐藏的不能越权显示）
```

| 层级 | 来源 | 场景 | 特点 |
|------|------|------|------|
| 1 | URL query | WebView 嵌入 | 宿主通过 URL 参数控制 |
| 2 | `definePage meta` | 内部导航 | 页面声明的默认行为 |
| 3 | composable 默认值 | 全局兜底 | 未声明时的 fallback |
| 4 | permissionCheck | 权限限制 | 只减不增，安全兜底 |

### 2.2 页面声明

```ts
// src/pages/good.vue — 商品详情页不需要默认 Header
definePage({
  meta: {
    showHeader: false,
    showFooter: true,
  },
});
```

### 2.3 WebView 嵌入

宿主 APP 通过 URL query 控制，layout 自动响应：

```
/good?showHeader=0&showFooter=0   → 完全隐藏（沉浸式 WebView）
/good?showHeader=1&showFooter=0   → 只显示 Header
```

### 2.4 权限扩展

`permissionCheck` 回调作为扩展点保留在 `useLayoutConfig` 的类型定义和实现中。当前 `default.vue` 未接入（调用 `useLayoutConfig()` 不传参数），需要时可按如下方式接线：

```ts
// src/layouts/default.vue
const { showHeader, showFooter } = useLayoutConfig({
  permissionCheck: (component) => {
    const auth = useAuthStore();
    if (component === 'footer') return auth.isLoggedIn;
    return true;
  },
});
```

### 2.5 实现原理

```ts
// src/composables/useLayoutConfig.ts（核心逻辑）
export function useLayoutConfig(options = {}) {
  const route = useRoute();

  // 1. definePage meta
  const metaShowHeader = computed(() => route.meta.showHeader ?? true);
  // 2. Query 覆盖（WebView）
  const queryShowHeader = computed(() => {
    if (route.query.showHeader === '1') return true;
    if (route.query.showHeader === '0') return false;
    return undefined; // 未设置 → 走下层
  });
  // 3. 合并：query > meta > default
  const resolved = computed(() => queryShowHeader.value ?? metaShowHeader.value);
  // 4. 权限限制
  const showHeader = computed(() => {
    if (!resolved.value) return false;
    if (permissionCheck && !permissionCheck('header')) return false;
    return true;
  });

  return { showHeader, showFooter };
}
```

所有值都是 `computed` — query 变化时自动响应，无需手动刷新。

---

## 三、组件替换：`useLayoutCustomization`

### 3.1 数据流

Layout 通过 `provide` 暴露注册函数，页面通过 `useCustomHeader` / `useCustomFooter` 注入自定义组件：

```
Layout (default.vue)
  provide('layout:register-header', setCustomHeader)
  provide('layout:register-footer', setCustomFooter)
  │
  ├── <component :is="activeHeader" />
  ├── <router-view />
  │     └── Page
  │           useCustomFooter(MyFooter)
  │           → inject 获取 register
  │           → register(markRaw(MyFooter))
  │           → activeFooter 变为 MyFooter
  │           → 页面卸载时自动 register(null) → 恢复默认
  └── <component :is="activeFooter" />
```

### 3.2 页面使用

**同步组件**：
```ts
import MyFooter from './components/MyFooter.vue';
useCustomFooter(MyFooter);
```

**异步 import（自动 code splitting）**：
```ts
useCustomHeader(() => import('./components/ArticleHeader.vue'));
```

**同时替换**：
```ts
useCustomHeader(CustomHeader);
useCustomFooter(CustomFooter);
```

### 3.3 替换 + 显隐的交互

| 状态 | 行为 |
|------|------|
| `showFooter=true` + 未替换 | 显示默认 `DefaultFooter` |
| `showFooter=true` + 已替换 | 显示自定义组件 |
| `showFooter=false` | **不显示任何内容**（无论是否替换） |
| 页面卸载 | 自动恢复默认 |

### 3.4 为什么用 Provide/Inject 而非 Pinia

| 方式 | 问题 |
|------|------|
| ✅ Provide/Inject | 自动绑定到组件树，Layout 恰好是页面祖先，卸载自动清理 |
| ❌ Pinia store | 需手动清理，多页面并发时状态污染 |
| ❌ Module-level ref | 跨路由持久化，必须手动 reset |
| ❌ Route meta | meta 需可序列化，不能存组件引用 |

---

## 四、使用指南

### 4.1 添加新布局

复制 `default.vue` → 修改名称为 `myLayout.vue` → 在页面中指定：

```ts
definePage({ meta: { layout: 'myLayout' } });
```

项目内置三种布局：
- `default` — 移动端 App Shell
- `screen` — 数据大屏（深色全屏）
- `admin` — 管理后台（侧边栏）

### 4.2 测试

访问 `/test` 页面：
- Header 被 `TestHeader` 替换（返回按钮 + 标题）
- Footer 被 `TestFooter` 替换（含切换按钮）
- 点击按钮可动态修改 `?showHeader=0&showFooter=0`
- 修改 TestFooter 高度，main 自动适配，无需改任何代码

---

## 五、架构优势

| 优势 | 传统做法 | 本方案 |
|------|---------|--------|
| **Tabbar 定位** | `position:fixed` + `padding-bottom` hack | `:fixed="false"` 回归自然流，flex 自动分配 |
| **自定义 Footer** | 不同高度需不同 `padding-bottom` | 无需任何补偿，flex-1 自动计算 |
| **WebView 嵌入** | 需要后端配合或单独部署版本 | URL query 一行搞定 |
| **页面级控制** | 每个页面手动 `v-if` | `definePage meta` 声明式 |
| **组件替换** | 全局状态管理，跨页面污染 | Provide/Inject，页面卸载自动清理 |
| **响应式** | 需手动监听 route 变化 | computed 自动响应 query/meta 变化 |
| **权限扩展** | 散落在各页面 | `permissionCheck` 集中管理，只减不增 |

---

## 六、相关文件

| 文件 | 作用 |
|------|------|
| `src/layouts/default.vue` | 默认布局：App Shell 容器 + 动态 Header/Footer |
| `src/layouts/default/components/header.vue` | 默认 Header（van-nav-bar + 智能返回） |
| `src/layouts/default/components/footer.vue` | 默认 Footer（van-tabbar，`:fixed="false"`） |
| `src/composables/useLayoutConfig.ts` | 显隐控制 composable（四层优先级） |
| `src/composables/useLayoutCustomization.ts` | 组件替换 composable（Provide/Inject） |
| `types/router.d.ts` | RouteMeta 类型扩展（`showHeader`/`showFooter`） |
| `src/styles/index.css` | App Shell CSS（`vh-full`/body 焊死/PWA overscroll） |
| `src/pages/test.vue` | 测试页面（验证替换 + 显隐） |
| `src/pages/test/components/` | 测试用自定义 Header/Footer |
| `docs/mobile-app-shell-architecture.md` | App Shell 底层原理（视口锁定、overscroll、iOS 兼容） |
