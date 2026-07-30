# 移动端视口布局修复：100vh → 100dvh

> 文档日期：2026-07-30

---

## 一、问题描述

PWA 应用或手机浏览器访问时，存在以下异常表现：

1. **下拉会触发页面刷新**（Pull-to-Refresh）—— 这是浏览器原生功能
2. **刷新后页面高度发生变化** —— 刷新后视图可以上下滚动
3. **滚动到最顶部或最底部时，header 或 footer 不在视窗内** —— 头部导航栏和底部导航栏有一个会跑出屏幕

这三个现象叠加的结果是：用户下拉刷新后，页面布局断裂，体验极差。

---

## 二、根因分析

### 2.1 问题一：下拉刷新

```text
这是 Chrome Android / Safari iOS 的原生 Pull-to-Refresh 功能。
当用户从页面顶部下拉时，浏览器拦截触摸事件并触发整页刷新。
这是一个用户期望的功能（用于获取最新内容），不应该禁用。
```

### 2.2 问题二与三：100vh 在移动端的缺陷

这是真正的布局断裂原因。移动端浏览器有**动态工具栏**（地址栏 + 底部导航栏）：

```
工具栏展开时（页面首次加载）:
┌─────────────────────┐
│  地址栏  (~56px)    │  ← 展开状态
├─────────────────────┤
│                     │
│   可视区域          │  ← 100vh 在这里测量 = screen - toolbar
│                     │
├─────────────────────┤
│  底部栏  (~48px)    │
└─────────────────────┘

工具栏收起时（用户向下滚动）:
┌─────────────────────┐
│                     │
│                     │
│   可视区域          │  ← 100vh 在这里测量 = 全屏
│                     │
│                     │
│                     │
└─────────────────────┘
```

**关键问题：`100vh` 在工具栏展开和收起时测量的是同一个值（最大视口高度，即工具栏收起时的高度），而不是当前实际可视高度。**

```
页面首次加载（工具栏展开）:
  h-screen (100vh) = 896px（假设全屏高度）
  实际可视高度     = 896px - 56px(地址栏) - 48px(底部栏) = 792px
  → 布局高度 > 可视高度 → 页面可弹性滚动

用户向下滚动后（工具栏收起）:
  h-screen (100vh) = 896px（不变）
  实际可视高度     = 896px（全屏）
  → 布局高度 = 可视高度 → 刚好填满

用户再次下拉或滚动到顶部（工具栏再次展开）:
  h-screen (100vh) = 896px（不变）
  实际可视高度     = 792px（工具栏展开）
  → 布局高度 > 可视高度 → 超出的区域可滚动 → header/footer 偏移出屏
```

### 2.3 布局结构放大问题

本项目的三个布局都采用固定容器 + 内部滚动模式：

```html
<div class="flex h-screen flex-col overflow-hidden">  <!-- 容器固定 100vh -->
  <header />                                           <!-- 固定顶部 -->
  <main class="flex-1 overflow-y-auto">                 <!-- 内部滚动 -->
    <router-view />
  </main>
  <footer />                                           <!-- 固定底部 -->
</div>
```

当 `100vh` 大于实际可视高度时，`overflow-hidden` 裁剪了溢出部分，但 `flex-1` 让 main 填满剩余空间，此时 main 中的内容会向上"顶"，挤压 header/footer 的空间 —— 导致它们跑出视口。

---

## 三、解决方案

### 3.1 核心思路

使用 **`100dvh`（dynamic viewport height）** 替代 `100vh`：

| 单位 | 含义 | 特点 |
|------|------|------|
| `100vh` | 视口最大高度 | 固定值，工具栏收起时的高度，展开时不变化 |
| `100dvh` | 视口动态高度 | 随工具栏展开/收起**实时变化**，始终等于当前可视区域高度 |
| `100lvh` | 视口大高度 | 工具栏收起时的全屏高度 |
| `100svh` | 视口小高度 | 工具栏展开时扣除工具栏后的高度 |

`100dvh` 的行为：

```
工具栏展开时: 100dvh = 792px ✅ 刚好填满可视区域
工具栏收起时: 100dvh = 896px ✅ 刚好填满全屏
```

也就是说，无论工具栏状态如何，`100dvh` **始终精确等于当前可视区域高度**，不会多也不会少，从而消除布局溢出的根源。

### 3.2 为什么不禁用下拉刷新

- 下拉刷新是移动端用户的**本能操作**，用户部署新版本后需要用这个手势获取最新内容
- 真正的问题不是刷新本身，而是**刷新后的布局断裂**
- 用 `100dvh` 修复布局后，下拉刷新正常工作，布局也不会断裂

### 3.3 浏览器兼容性

| 浏览器 | 最低版本 | 支持情况 |
|--------|----------|----------|
| Chrome Android | 108+ | ✅ |
| Safari iOS | 15.4+ | ✅ |
| Firefox Android | 101+ | ✅ |

本项目目标为现代移动端浏览器，兼容性无需担心。

---

## 四、代码变更

### 4.1 全局样式：添加 html/body 底座

**文件：`src/styles/index.css`**

```diff
 html {
   overflow-x: hidden;
 }
+
+/*
+ * 移动端布局使用 100dvh（dynamic viewport height）替代 100vh：
+ * - 100vh 在移动端浏览器工具栏展开/收起时大小会变，导致布局溢出、header/footer 跑出屏幕
+ * - 100dvh 动态跟随当前实际可视区域，工具栏变化时布局自动适配，无需禁止下拉刷新
+ */
+html, body {
+  height: 100dvh;
+}
```

### 4.2 默认布局

**文件：`src/layouts/default.vue`**

```diff
-<div class="layout-default flex h-screen flex-col overflow-hidden bg-gray-50">
+<div class="layout-default flex h-[100dvh] flex-col overflow-hidden bg-gray-50">
```

### 4.3 数据大屏布局

**文件：`src/layouts/screen.vue`**

```diff
-<div class="relative h-screen w-screen overflow-hidden bg-gray-950 text-white">
-  <main class="relative h-[calc(100vh-7rem)] p-4">
+<div class="relative h-[100dvh] w-screen overflow-hidden bg-gray-950 text-white">
+  <main class="relative h-[calc(100dvh-7rem)] p-4">
```

### 4.4 管理后台布局

**文件：`src/layouts/admin.vue`**

```diff
-<div class="flex min-h-screen bg-gray-100">
+<div class="flex min-h-[100dvh] bg-gray-100">
```

---

## 五、验证方式

### 5.1 浏览器 DevTools 验证

1. 在 Chrome DevTools 中切换到 **移动端模式**
2. 选择一台有动态工具栏的设备（如 iPhone 12 / Pixel 7）
3. 访问页面，观察布局是否填满可视区域
4. 向下滚动页面触发工具栏收起 → 布局稳定，充满更新后的可视区域
5. 下拉触发刷新 → 页面刷新后布局依然稳定

### 5.2 CSS 输出验证

启动开发服务器后，检查生成的 CSS 是否包含 `100dvh` 类：

```bash
curl -s http://localhost:3000/src/styles/index.css | grep "dvh"
```

期望输出：

```css
.h-\[100dvh\] { height: 100dvh; }
.min-h-\[100dvh\] { min-height: 100dvh; }
.h-\[calc\(100dvh-7rem\)\] { height: calc(100dvh - 7rem); }
```

### 5.3 Tailwind CSS v4 中的任意值语法

本项目使用 Tailwind CSS v4，通过**任意值语法**（Arbitrary Value）直接使用 `100dvh`：

| Tailwind 类 | 生成的 CSS |
|-------------|-----------|
| `h-[100dvh]` | `height: 100dvh` |
| `min-h-[100dvh]` | `min-height: 100dvh` |
| `h-[calc(100dvh-7rem)]` | `height: calc(100dvh - 7rem)` |

---

## 六、相关文件

| 文件 | 作用 |
|------|------|
| `src/styles/index.css` | 全局样式，添加 `html, body { height: 100dvh }` 底座 |
| `src/layouts/default.vue` | 默认移动端布局，`h-screen` → `h-[100dvh]` |
| `src/layouts/screen.vue` | 数据大屏布局，`h-screen` → `h-[100dvh]`，calc 同步 |
| `src/layouts/admin.vue` | 管理后台布局，`min-h-screen` → `min-h-[100dvh]` |

---

## 七、参考链接

- [MDN: Viewport concepts - The large, small, and dynamic viewport](https://developer.mozilla.org/en-US/docs/Web/CSS/Viewport_concepts#the_large_small_and_dynamic_viewport)
- [CSS Tricks: The Large, Small, and Dynamic Viewport Units](https://css-tricks.com/the-large-small-and-dynamic-viewport-units/)
- [web.dev: The trick to viewport units on mobile](https://web.dev/viewport-units/)
- [Can I Use: viewport units (vh, vw, vmin, vmax) - dvh support](https://caniuse.com/viewport-units)
