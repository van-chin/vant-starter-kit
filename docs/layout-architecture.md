# Layout 布局架构

> 文档日期：2026-08-01
> 合并自 `mobile-app-shell-architecture.md` + `layout-architecture.md`，涵盖 App Shell 的完整方案：从问题根因到 CSS/JS 底层原理，再到 Vue 组件层的显隐控制与组件替换。

---

## 一、问题定义

### 1.1 三张"脸"

移动端 PWA / 浏览器全屏应用中，存在以下三类连锁异常：

| #   | 现象                                    | 触发条件                  |
| --- | --------------------------------------- | ------------------------- |
| ①   | **下拉触发整页刷新**（Pull-to-Refresh） | 页面滚动到顶部后继续下拉  |
| ②   | **Header / Footer 不在视窗内**          | 页面刷新后向上/下滚动     |
| ③   | **边界橡皮筋 / 滚动链**                 | 滚动到最顶/底部后继续拖拽 |

三类现象**总是同时出现**，刷新只是扳机，真正的病灶在页面刷新前后高度变化时暴露。

### 1.2 因果链

```
刷新前：内容少 / 骨架态
外壳高度 ≈ 视口，body 勉强不滚
         │
用户下拉 → 浏览器：页面在顶 + 越界下拉 → 【脸①】下拉刷新
         │
         ▼ 刷新触发，JS 重跑、真实数据/图片/字体进来
刷新后：内容把容器撑高了几像素
外壳高度 > 视口 → body 变成"可滚动" ★病灶爆发★
         │
   ┌─────┼─────┐
   ▼     ▼     ▼
往下滑   滚到顶继续拽   滚到底继续拽
header   越界下拉       越界上拉
被滚出   = 又触发刷新   = 橡皮筋/滚动链
视口顶   = 【脸③-顶】   = 【脸③-底】
= 【脸②】
```

### 1.3 同一病根

**病根只有一个：本该固定的"外壳"（body / shell）变成了可滚的画布。**

| 脸谱         | 直接原因                                                 |
| ------------ | -------------------------------------------------------- |
| ① 下拉刷新   | body 可滚 → 顶部越界下拉被浏览器解释为刷新手势           |
| ② 头/脚消失  | header/footer 躺在文档流中，body 一滚就跟着跑            |
| ③ 边界橡皮筋 | body 内层滚动到边界后，手势"接力"到 body → 越界 → 橡皮筋 |

### 1.4 四个元凶（按危害排序）

| 优先级 | 元凶                   | 说明                                                                        |
| ------ | ---------------------- | --------------------------------------------------------------------------- |
| ★★★★★  | **`min-height: auto`** | flex 子项默认 `min-height: auto`，拒绝收缩到比内容矮。内容一多就把外壳撑破  |
| ★★★★   | **`100vh` 含栏高度**   | 移动端 `100vh` 包含工具栏空间，工具栏展开/收起时与实际可视区域不匹配        |
| ★★★    | **异步内容 reflow**    | 图片/字体/动态组件刷新后渲染，总高"+1px"就把 body 推过临界线                |
| ★★     | **sticky 粘错容器**    | `position: sticky` 以最近的可滚动祖先为参考系，祖先若为 body 则跟着 body 跑 |

---

## 二、解决方案：App Shell Architecture

### 2.1 三句话钉死方案

```
1. body 焊死，永不滚动（overflow: hidden）
2. 滚动唯一发生在 main 内部（overflow-y: auto）
3. 头/脚钉在 main 之外（flex: none）

结果：刷新前后内容高度怎么变，都再也波及不到头和脚
```

### 2.2 前后对比

```
 病灶布局（修复前）                   App Shell（修复后）
 ┌──────────────┐               ┌──────────────┐
 │ header ← 跟滚 │               │ header  钉死 │ flex:none
 ├──────────────┤               ├──────────────┤
 │              │               │              │
 │   content    │ body 在滚     │   main       │ ← 唯一滚动
 │              │               │   min-h:0   │   overflow:auto
 ├──────────────┤               │              │
 │ footer ← 跟滚 │               ├──────────────┤
 └──────────────┘               │ footer  钉死 │ flex:none
  body: 可滚 ❌                  └──────────────┘
                                 body: hidden ✅  外壳: 100dvh
```

左侧：body 是滚动主角，头脚是陪跑的。右侧：body 焊死，滚动关进 main 笼子，头脚在笼子外永远看得见。

### 2.3 关键技术决策

#### 2.3.1 视口高度 — 三层递进回退

```css
/* 第一层：JS 精确测量（最准）*/
--app-height = window.innerHeight + 'px'   // main.ts 挂载前设置

/* 第二层：100dvh（动态视口，工具栏变化时实时跟随）*/
/* 第三层：100svh（小视口高度，旧浏览器兜底）*/
height: var(--app-height, 100dvh);
```

**为什么不直接用 `100vh`？**

移动端 `100vh` 是"全屏高度"，包含工具栏空间。工具栏展开时 `100vh` 比实际可视区域大，导致布局溢出。`100dvh` 实时跟随工具栏变化，`--app-height`（由 `window.innerHeight` 赋值）作为最精确的兜底。

#### 2.3.2 `min-height: 0` — 为什么不能省

CSS Flexbox 规范中，flex 子项的 `min-height` 默认为 `auto`：

```
min-height: auto（默认 ── ✗）          min-height: 0（修复 ── ✓）
┌──────────────────────┐               ┌──────────────────────┐
│ header               │               │ header               │
├──────────────────────┤               ├──────────────────────┤
│                      │               │ ┌──────────────────┐ │
│ 内容 900px 撑破外壳   │               │ │ 内容 900px       │ │ ← overflow-y:auto
│ 总高 > 100dvh ❌     │               │ │ 内部滚动条       │ │
│ body 可滚            │               │ └──────────────────┘ │
├──────────────────────┤               ├──────────────────────┤
│ footer               │               │ footer               │
└──────────────────────┘               └──────────────────────┘
                                          总高 = 100dvh ✅
                                          body 焊死
```

#### 2.3.3 overscroll-behavior 分层策略

```css
/* 浏览器模式：不拦截，保留原生下拉刷新 */

/* PWA 模式：禁用页面级越界，防止浏览器拦截手势 */
@media (display-mode: standalone) {
  html,
  body {
    overscroll-behavior: contain;
  }
}

/* main 容器：内部滚动到边界即止，不接力给 body */
.main {
  overscroll-behavior: contain;
}
```

#### 2.3.4 浏览器 vs PWA 模式差异

| 维度     | 浏览器模式              | PWA 模式                                |
| -------- | ----------------------- | --------------------------------------- |
| 地址栏   | 有，工具栏动态展开/收起 | 无浏览器 UI                             |
| 视口     | `100dvh` 适配即可       | 需 JS `--app-height` 精确测量           |
| 下拉刷新 | ✅ 保留原生体验         | ❌ 禁用（破坏布局），导航栏提供手动刷新 |
| 版本更新 | 轮询 `/version.json`    | SW 自动更新 + version.json 双重保障     |

### 2.4 实现代码

**全局样式** — `src/styles/index.css`：

```css
html {
  overflow-x: hidden;
}
html,
body {
  height: var(--app-height, 100dvh);
  margin: 0;
  position: fixed; /* iOS 防橡皮筋 */
  inset: 0;
}
@media (display-mode: standalone) {
  html,
  body {
    overscroll-behavior: contain;
  }
}
```

**JS 测量** — `src/main.ts`（Vue 挂载前执行）：

```ts
const setAppHeight = () => {
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
};
setAppHeight();
window.addEventListener('resize', setAppHeight);
```

**布局模板** — `src/layouts/default.vue`：

```html
<div class="layout-default flex vh-full flex-col overflow-hidden">
  <component :is="activeHeader" class="flex-none" v-if="activeHeader" />
  <main class="flex-1 min-h-0 overflow-y-auto overscroll-contain">
    <router-view />
  </main>
  <component :is="activeFooter" class="flex-none" v-if="activeFooter" />
</div>
```

关键 CSS 类（定义在 `src/styles/index.css`）：

| 类名              | 作用                                 |
| ----------------- | ------------------------------------ |
| `vh-full`         | `height: var(--app-height, 100dvh)`  |
| `flex-none`       | header/footer 不伸缩，高度由内容决定 |
| `flex-1`          | main 吃掉剩余空间                    |
| `min-h-0`         | ★ 允许 main 收缩到比内容矮           |
| `overflow-y-auto` | 只有 main 出滚动条                   |
| `overflow-hidden` | 外壳自身不滚                         |

### 2.5 布局演进史

本项目的布局经历三个阶段，最终收敛到当前方案：

**阶段 1** — 文档流滚动：整个页面滚动，`van-tabbar` 用 `position:fixed` 脱离流，需 `padding-bottom` hack 补偿。

**阶段 2** — 内部滚动 + fixed tabbar：`vh-full` 固定视口，但 tabbar 仍是 `fixed`。自定义 Footer 高度不同时 padding 不匹配。

**阶段 3（当前）** — flex 自然流：tabbar 设 `:fixed="false"` 回归文档流，flex `flex-1` 自动计算 main 高度。任意高度的自定义 footer 都无需手动补偿：

```
DefaultFooter (高 50px)          CustomFooter (高 80px)          showFooter=false
vh-full                          vh-full                        vh-full
├── header     46px              ├── header     46px            ├── header     46px
├── main       calc(100%-96px)   ├── main       calc(100%-126px)└── main       calc(100%-46px)
└── footer     50px              └── footer     80px
```

---

## 三、显隐控制：`useLayoutConfig`

### 3.1 四层优先级

```
URL query (?showHeader=0&showFooter=0)    ← 最高，WebView 嵌入
    ↓ 覆盖
definePage meta ({ showHeader: false })   ← 页面声明默认值
    ↓ 降级
composable 默认值 ({ defaultHeader: true }) ← 全局兜底
    ↓ 限制
permissionCheck                            ← 只减不增
```

| 层级 | 来源              | 场景                 |
| ---- | ----------------- | -------------------- |
| 1    | URL query         | WebView 嵌入         |
| 2    | `definePage meta` | 页面声明默认值       |
| 3    | composable 默认值 | 全局兜底             |
| 4    | permissionCheck   | 权限限制（只减不增） |

### 3.2 页面声明

```ts
// src/pages/good.vue
definePage({
  meta: { showHeader: false, showFooter: true },
});
```

### 3.3 WebView 嵌入

```
/good?showHeader=0&showFooter=0   → 完全隐藏（沉浸式 WebView）
```

宿主 APP 通过 URL query 控制，layout 自动响应。所有值都是 `computed`，query 变化时无需手动刷新。

### 3.4 权限扩展（预留）

`permissionCheck` 回调保留在 `useLayoutConfig` 实现中，当前 `default.vue` 尚未接入（调用时不传参）。需要时：

```ts
const { showHeader, showFooter } = useLayoutConfig({
  permissionCheck: (component) => {
    if (component === 'footer') return useAuthStore().isLoggedIn;
    return true;
  },
});
```

---

## 四、组件替换：`useLayoutCustomization`

### 4.1 数据流

Layout 通过 `provide` 暴露注册函数，页面通过 `useCustomHeader` / `useCustomFooter` 注入自定义组件：

```
Layout (default.vue)
  provide('layout:register-header', setCustomHeader)
  provide('layout:register-footer', setCustomFooter)
  │
  ├── <component :is="activeHeader" />
  ├── <router-view />
  │     └── Page
  │           useCustomFooter(MyFooter)        → inject 获取 register
  │           → register(markRaw(MyFooter))    → activeFooter 变为 MyFooter
  │           → 页面卸载时自动 register(null)  → 恢复默认
  └── <component :is="activeFooter" />
```

### 4.2 使用方式

```ts
// 同步组件
import MyFooter from './components/MyFooter.vue';
useCustomFooter(MyFooter);

// 异步 import（自动 code splitting）
useCustomHeader(() => import('./components/ArticleHeader.vue'));
```

### 4.3 替换 + 显隐的交互

| 状态                       | 行为                               |
| -------------------------- | ---------------------------------- |
| `showFooter=true` + 未替换 | 显示默认 `DefaultFooter`           |
| `showFooter=true` + 已替换 | 显示自定义组件                     |
| `showFooter=false`         | **不显示任何内容**（无论是否替换） |
| 页面卸载                   | 自动恢复默认                       |

### 4.4 为什么用 Provide/Inject

| 方式                | 问题                           |
| ------------------- | ------------------------------ |
| ✅ Provide/Inject   | 自动绑定组件树，卸载自动清理   |
| ❌ Pinia store      | 需手动清理，多页面并发状态污染 |
| ❌ Module-level ref | 跨路由持久化，必须手动 reset   |
| ❌ Route meta       | 需可序列化，不能存组件引用     |

---

## 五、PWA 增强

### 5.1 版本更新检测（`useAppUpdate`）

轮询 `/version.json`，检测新版本部署后提示用户刷新。适用于 H5 和 PWA：

```
每 5 分钟 + 切回标签页 → fetch /version.json → 比对版本号
    → 不一致 → 顶部滑入蓝色提示条 → 用户点"立即更新" → location.reload()
```

### 5.2 PWA 安装引导（`usePwaInstall`）

三重检测避免重复提示：

1. `display-mode: standalone` → 已在 PWA 中运行 → 永不提示
2. `localStorage pwa-installed` → 已安装过 → 永不提示
3. `localStorage pwa-dismissed` → 7 天内关闭过 → 不提示

满足安装条件时底部滑入提示条，用户可直接在页面内安装，无需去浏览器菜单。

---

## 六、五层防御体系

```
第1层  html,body { overflow:hidden }
       → body 焊死，从根本上消灭"页面级可滚动"

第2层  main { min-height:0 }
       → 允许 main 收缩，内容撑不破外壳

第3层  main { overflow-y:auto }
       → 滚动唯一发生在 main 内部

第4层  { overscroll-behavior: contain }
       → PWA 模式下越界手势不传播

第5层  --app-height (JS) + 100dvh (CSS)
       → 视口高度始终精确，工具栏变化不抖动

额外    position:fixed + safe-area-inset-bottom
       → iOS 系统级锁体 + 齐刘海安全区
```

### 验证清单

| #   | 验证项         | 方法                                           | 预期结果                              |
| --- | -------------- | ---------------------------------------------- | ------------------------------------- |
| 1   | body 焊死      | `document.scrollingElement.scrollTop` 始终为 0 | ✅ 不滚动                             |
| 2   | 内容撑不破外壳 | 在 main 中塞超长内容                           | ✅ 只有 main 出滚动条                 |
| 3   | 下拉刷新       | 页面顶部用力下拉                               | ✅ 浏览器模式触发刷新；PWA 模式不触发 |
| 4   | 边界无橡皮筋   | main 滚到顶/底继续拽                           | ✅ 手势不传给 body                    |
| 5   | 工具栏变化     | 旋转屏幕 / 弹出键盘                            | ✅ 头脚位置不变                       |

---

## 七、浏览器兼容性

| 特性                          | Chrome Android | Safari iOS | Firefox Android |
| ----------------------------- | :------------: | :--------: | :-------------: |
| `100dvh`                      |    108+ ✅     |  15.4+ ✅  |     101+ ✅     |
| `overscroll-behavior`         |     63+ ✅     |   16+ ⚠️   |     59+ ✅      |
| `env(safe-area-inset-bottom)` |     69+ ✅     |   11+ ✅   |     64+ ✅      |
| `position: fixed` iOS 锁体    |       —        | 全版本 ✅  |        —        |

> iOS 注意：`overscroll-behavior` 在 iOS 上支持较晚且不彻底。`position: fixed; inset: 0` 是 iOS 上锁住页面的有效手段，已包含在方案中。

---

## 八、架构优势总结

| 维度             | 传统做法                                 | 本方案                             |
| ---------------- | ---------------------------------------- | ---------------------------------- |
| **视口锁定**     | `100vh` 硬编码，工具栏变化时溢出         | `--app-height` + `100dvh` 三层回退 |
| **滚动隔离**     | body 滚动，头脚跟着跑                    | body 焊死，main 唯一滚动           |
| **Tabbar 定位**  | `position:fixed` + `padding-bottom` hack | `:fixed="false"` 回归自然流        |
| **WebView 嵌入** | 需后端配合或单独部署                     | URL query 一行控制                 |
| **页面级控制**   | 每个页面手动 `v-if`                      | `definePage meta` 声明式           |
| **组件替换**     | 全局状态，跨页面污染                     | Provide/Inject，卸载自动清理       |
| **版本更新**     | 无感知                                   | 轮询 + 提示条，H5/PWA 通用         |
| **PWA 安装**     | 依赖浏览器菜单                           | 页面内引导，三重防重复             |

---

## 九、相关文件

| 文件                                        | 作用                                                |
| ------------------------------------------- | --------------------------------------------------- |
| `src/layouts/default.vue`                   | 默认布局：App Shell 容器 + 动态 Header/Footer       |
| `src/layouts/default/components/header.vue` | 默认 Header（van-nav-bar + 智能返回）               |
| `src/layouts/default/components/footer.vue` | 默认 Footer（van-tabbar，`:fixed="false"`）         |
| `src/composables/useLayoutConfig.ts`        | 显隐控制 composable（四层优先级）                   |
| `src/composables/useLayoutCustomization.ts` | 组件替换 composable（Provide/Inject）               |
| `src/composables/useAppUpdate.ts`           | 版本检测 composable（轮询 /version.json）           |
| `src/composables/usePwaInstall.ts`          | PWA 安装引导 composable                             |
| `src/components/AppUpdatePrompt.vue`        | 版本更新提示条 UI                                   |
| `src/components/PwaInstallPrompt.vue`       | PWA 安装提示条 UI                                   |
| `src/styles/index.css`                      | App Shell CSS（`vh-full` / body 焊死 / overscroll） |
| `src/main.ts`                               | `--app-height` 精确测量                             |
| `types/router.d.ts`                         | RouteMeta 类型扩展                                  |
| `docs/dark-mode-architecture.md`            | 深色模式 & 状态栏颜色架构                           |
