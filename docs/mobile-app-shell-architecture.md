# Mobile App Shell Architecture

> 移动端全屏应用的视口锁定与滚动隔离方案

---

## 一、问题定义

### 1.1 现象

移动端 PWA / 浏览器全屏应用中，存在以下三类连锁异常：

| # | 现象 | 触发条件 |
|---|------|---------|
| ① | **下拉触发整页刷新**（Pull-to-Refresh） | 页面滚动到顶部后继续下拉 |
| ② | **Header / Footer 不在视窗内** | 页面刷新后向上/下滚动 |
| ③ | **边界橡皮筋 / 滚动链** | 滚动到最顶/底部后继续拖拽 |

三类现象**总是同时出现**，刷新只是扳机，真正的病灶在页面刷新前后高度变化时暴露。

### 1.2 用户体验影响

- 用户下拉获取新内容 → 布局断裂 → 导航栏丢失 → 需手动滚回
- PWA 安装后表现与原生 App 差距明显
- 同一套代码在桌面端正常，移动端异常，难以调试

---

## 二、根因分析

### 2.1 一张图看懂因果链

```
                  刷新前：内容少 / 骨架态
                  外壳高度 ≈ 视口，body 勉强不滚
                            │
          用户下拉 ──► 浏览器：页面在顶+越界下拉 ──► 【脸①】下拉刷新
                            │
                            ▼  刷新触发，JS 重跑、真实数据/图片/字体进来
                  刷新后：内容把容器撑高了几像素
                  外壳高度 > 视口  ──►  body 变成"可滚动"  ★病灶爆发★
                            │
      ┌─────────────────────┼─────────────────────┐
      ▼                     ▼                     ▼
 往下滑一点            滚到顶继续拽           滚到底继续拽
 文档流里的 header      页面级越界下拉         页面级越界上拉
 被滚出视口顶部         = 又触发刷新/橡皮筋     = 橡皮筋 / 滚动链
 或 footer 滚到屏外     = 【脸③-顶】           到 body / 系统手势
 = 【脸②】头或脚消失                           = 【脸③-底】
```

### 2.2 三张脸的同一病根

**病根只有一个：本该固定的"外壳"（body / shell）变成了可滚的画布。**

| 脸谱 | 对应现象 | 直接原因 |
|------|---------|---------|
| ① 下拉刷新 | 浏览器 Pull-to-Refresh | body 可滚 → 在顶部越界下拉被浏览器解释为刷新手势 |
| ② 头/脚消失 | Header / Footer 不在视口 | header/footer 躺在文档流中，body 一滚就跟着跑 |
| ③ 边界橡皮筋 | 滚动到底部/顶部继续拽 | body 内层滚动容器到达边界后，手势"接力"到 body → 越界 → 橡皮筋 |

### 2.3 刷新为什么是扳机

刷新本身不是问题，它是触发布局崩塌的扳机：

```
刷新前 ── body 高度 ≈ 视口高度 ── body 没东西可滚 ── 相安无事
刷新后 ── 真实数据/图片渲染 ── 内容撑高外壳
       └── 外壳高度 > 视口高度
           └── body 变成可滚动
               ├── header 从顶部滚走
               ├── footer 从底部滚走
               └── 可滚动 → 可越界 → 下拉刷新+橡皮筋 全部激活
```

### 2.4 四个元凶（按危害排序）

| 优先级 | 元凶 | 说明 |
|-------|------|------|
| ★★★★★ | **`min-height: auto`** | flex 子项默认 `min-height: auto`，拒绝收缩到比内容矮。内容一多就把外壳撑破，是"刷新后高度变化"最常见的元凶 |
| ★★★★ | **`100vh` 含栏高度** | 移动端 `100vh` 包含工具栏空间，工具栏展开/收起时 `100vh` 与实际可视区域不匹配 |
| ★★★ | **异步内容 reflow** | 图片/字体/动态组件刷新后渲染，总高"+1px"就把 body 推过临界线 |
| ★★ | **sticky 粘错容器** | `position: sticky` 以最近的可滚动祖先为参考系，祖先若为 body 则跟着 body 跑 |

---

## 三、解决方案：App Shell Architecture

### 3.1 核心原则

```
┌──────────────────────────────────────────────────────────┐
│                    三句话钉死方案                          │
│                                                          │
│  1. body 焊死，永不滚动（overflow: hidden）                │
│  2. 滚动唯一发生在 main 内部（overflow-y: auto）            │
│  3. 头/脚钉在 main 之外（flex: none）                      │
│                                                          │
│  结果：刷新前后内容高度怎么变，都再也波及不到头和脚          │
└──────────────────────────────────────────────────────────┘
```

### 3.2 布局架构图

```
 病灶布局（你现在的）              App Shell（修复后）
 ┌──────────────┐               ┌──────────────┐
 │ header       │ ◄─ 跟body滚   │ header  钉死 │ flex:none
 ├──────────────┤               ├──────────────┤
 │              │               │              │
 │   content    │   body 在滚   │   main       │ ◄─ 唯一滚动
 │              │   ↑ 临界线    │   min-h:0   │    overflow:auto
 ├──────────────┤               │              │    overscroll:contain
 │ footer       │ ◄─ 跟body滚   ├──────────────┤
 └──────────────┘               │ footer  钉死 │ flex:none
  body: 可滚 ❌                  └──────────────┘
                                body: hidden ✅  外壳: 100dvh
```

**左侧**：body 是滚动主角，头脚是陪跑的，刷新一撑高就全乱。
**右侧**：body 被焊死，滚动被关进 main 一个笼子里，头脚在笼子外，永远看得见。

### 3.3 关键技术决策

#### 3.3.1 视口高度：三层递进回退

```css
/* 第一层：JS 精确测量（最准）*/
--app-height = window.innerHeight + 'px'   // main.ts 中设置

/* 第二层：100dvh（动态视口高度）*/
/* 第三层：100svh（小视口高度，旧浏览器兜底）*/
height: var(--app-height, 100dvh);
```

| 单位 | 含义 | 特点 |
|------|------|------|
| `window.innerHeight` | 运行时 JS 测量 | **始终精确**，不含系统 UI 占位 |
| `100dvh` | 动态视口高度 | 工具栏展开/收起时**实时跟随** |
| `100svh` | 小视口高度 | 工具栏展开时的高度，**最保守** |

为什么不用 `100vh`？
```
工具栏展开时:
  100vh  = 896px（全屏高度，错误 ❌）
  100dvh = 792px（当前可视区域，正确 ✅）
  
工具栏收起时:
  100vh  = 896px（全屏，正常 ✅）
  100dvh = 896px（全屏，正常 ✅）
```

#### 3.3.2 min-height: 0 的必要性

CSS Flexbox 规范中，flex 子项的 `min-height` 默认为 `auto`，意味着"我的高度至少和内容一样高"。这导致：

```css
.shell {
  display: flex;
  flex-direction: column;
  height: 100dvh;    /* 假设 = 800px */
}
.main {
  flex: 1;           /* 期望吃掉剩余空间 */
  /* ★ min-height: auto（默认）→ 内容高 900px 时拒绝收缩 */
  /* ★ 结果：.shell 被撑到 900px → 外壳溢出 → body 滚 */
}
```

加上 `min-height: 0` 后，main 允许收缩到比内容矮，溢出内容由内部滚动条处理。

```
min-height: auto（默认 ── ✗）   |   min-height: 0（修复 ── ✓）
┌──────────────────────┐        |   ┌──────────────────────┐
│ header  (50px)       │        |   │ header  (50px)       │
├──────────────────────┤        |   ├──────────────────────┤
│                      │        |   │ ┌──────────────────┐ │
│  内容 900px 撑破外壳  │        |   │ │ 内容 900px       │ │ ← overflow-y:auto
│                      │        |   │ │                  │ │   内部滚动条
│                      │        |   │ └──────────────────┘ │
├──────────────────────┤        |   ├──────────────────────┤
│ footer  (50px)       │        |   │ footer  (50px)       │
└──────────────────────┘        |   └──────────────────────┘
  总高 > 100dvh ❌              |     总高 = 100dvh ✅
  body 可滚                     |     body 焊死
```

#### 3.3.3 overscroll-behavior 分层策略

```css
/* body 层：禁止页面级越界 */
html, body {
  overscroll-behavior: none;
}

/* PWA 模式：standalone 有独立手势，需加强制止 */
@media (display-mode: standalone) {
  html, body {
    overscroll-behavior: contain;
  }
}

/* main 层：内部滚动容器到边界即止，不接力给 body */
.main {
  overscroll-behavior: contain;
}
```

#### 3.3.4 浏览器模式 vs PWA 模式差异

```
浏览器模式:  有地址栏，工具栏动态展开/收起
             → 只需 100dvh 适配 + min-height:0 防撑破
             → 原生下拉刷新保留，用户可获取最新内容

PWA 模式:   无浏览器 UI，Chrome 的 Pull-to-Refresh 在浏览器层面拦截手势
             → 100dvh 可能包含系统状态栏，需 JS 注入 --app-height
             → overscroll-behavior: contain 阻止浏览器拦截
             → 导航栏提供手动刷新按钮作为替代
```

#### 3.3.5 下拉刷新的保留与替代

```text
浏览器模式:  原生下拉刷新保留，不做任何拦截
             → 用户通过浏览器下拉即可获取最新内容

PWA 模式:   浏览器的下拉刷新被 CSS 阻止（standalone 模式下会破坏布局）
             → 导航栏右侧提供手动刷新按钮（SVG 图标）
             → usePwaRefresh() composable 检测 PWA 模式并暴露刷新方法
             → 同时 vite-plugin-pwa 的 autoUpdate 在后台自动拉取新版本
```

---

## 四、实现代码

### 4.1 全局样式

**文件：`src/styles/index.css`**

```css
/* ─── html/body 焊死 ─────────────────────────────────────── */
html {
  overflow-x: hidden;
}
html, body {
  height: var(--app-height, 100dvh);
  margin: 0;
  overscroll-behavior: none;
  position: fixed;      /* iOS 防橡皮筋 */
  inset: 0;
}

/* ─── PWA 模式 ──────────────────────────────────────────── */
@media (display-mode: standalone) {
  html, body {
    overscroll-behavior: contain;
  }
}

/* ─── 视口高度工具类 ─────────────────────────────────────── */
@utility vh-full {
  height: var(--app-height, 100dvh);
}
@utility min-vh-full {
  min-height: var(--app-height, 100dvh);
}
```

### 4.2 JS 视口测量

**文件：`src/main.ts`**

```typescript
const setAppHeight = () => {
  document.documentElement.style.setProperty(
    '--app-height',
    `${window.innerHeight}px`,
  );
};
setAppHeight();
window.addEventListener('resize', setAppHeight);
```

在 Vue 挂载前执行，确保精确测量。

### 4.3 布局模板（App Shell 三段式）

**文件：`src/layouts/default.vue`**

```html
<div class="layout-default flex vh-full flex-col overflow-hidden bg-gray-50">
  <!-- header: 钉死在顶部 -->
  <component :is="activeHeader" class="flex-none" v-if="activeHeader" />
  
  <!-- main: 唯一滚动区域 -->
  <main class="flex-1 min-h-0 overflow-y-auto overscroll-contain">
    <router-view />
  </main>
  
  <!-- footer: 钉死在底部 -->
  <component :is="activeFooter" class="flex-none" v-if="activeFooter" />
</div>
```

关键点：
- `flex-none` — 头/脚不参与伸缩，高度由内容决定
- `flex-1` — main 吃掉剩余空间
- `min-h-0` — ★ 允许 main 收缩到比内容矮
- `overflow-y: auto` — 只有 main 出滚动条
- `overscroll-contain` — main 滚到头/底时不接力给 body

### 4.4 PWA 刷新能力

**文件：`src/composables/usePwaRefresh.ts`**

```typescript
export function usePwaRefresh() {
  const isPwa = ref(false);

  onMounted(() => {
    isPwa.value = window.matchMedia('(display-mode: standalone)').matches;
  });

  const pwaRefresh = () => window.location.reload();

  return { isPwa, pwaRefresh };
}
```

自动导入，在 PWA 模式下导航栏渲染刷新按钮。

### 4.5 五层防御体系

```
┌──────────────────────────────────────────────────────────────┐
│                    五层防御，对应三张脸                        │
│                                                              │
│  第1层  html,body { overflow:hidden }                        │
│         → body 焊死，从根本上消灭"页面级可滚动"               │
│                                                              │
│  第2层  main { min-height:0 }                               │
│         → 允许 main 收缩，内容撑不破外壳                     │
│                                                              │
│  第3层  main { overflow-y:auto }                            │
│         → 滚动唯一发生在 main 内部                           │
│                                                              │
│  第4层  { overscroll-behavior: contain/none }               │
│         → 越界手势不传播、不触发浏览器行为                   │
│                                                              │
│  第5层  --app-height (JS) + 100dvh (CSS)                    │
│         → 视口高度始终精确，工具栏变化不抖动                 │
│                                                              │
│  额外    position:fixed (iOS) + safe-area-inset-bottom       │
│         → iOS 系统级锁体 + 齐刘海安全区                      │
└──────────────────────────────────────────────────────────────┘
```

---

## 五、验证清单

完成修复后，以下 5 项全部通过才算达标：

| # | 验证项 | 方法 | 预期结果 |
|---|--------|------|---------|
| 1 | body 焊死 | `document.scrollingElement.scrollTop` 始终为 0 | ✅ 不滚动 |
| 2 | 内容撑不破外壳 | 在 main 中塞超长内容 | ✅ 只有 main 出滚动条，header/footer 纹丝不动 |
| 3 | 下拉刷新 | 页面顶部用力下拉 | ✅ 浏览器模式：触发刷新；PWA 模式：不触发（用按钮替代） |
| 4 | 边界无橡皮筋 | 在 main 滚到顶/底继续拽 | ✅ 手势不传给 body，无整页弹动 |
| 5 | 工具栏变化 | 旋转屏幕 / 弹出键盘再收起 | ✅ 头脚位置不变，布局不跳 |

---

## 六、浏览器兼容性

| 特性 | Chrome Android | Safari iOS | Firefox Android |
|-----|---------------|------------|-----------------|
| `100dvh` | 108+ ✅ | 15.4+ ✅ | 101+ ✅ |
| `overscroll-behavior` | 63+ ✅ | 16+ ⚠️(晚) | 59+ ✅ |
| `env(safe-area-inset-bottom)` | 69+ ✅ | 11+ ✅ | 64+ ✅ |
| `position: fixed` iOS 锁体 | — | 全版本 ✅ | — |

> **iOS 注意**：`overscroll-behavior` 在 iOS 上支持较晚且不彻底。`position: fixed; inset: 0;` 是 iOS 上"锁住页面不让整体拽走"的有效手段，已包含在方案中。

---

## 七、延伸阅读

- [MDN: Viewport concepts](https://developer.mozilla.org/en-US/docs/Web/CSS/Viewport_concepts)
- [CSS Tricks: The Large, Small, and Dynamic Viewport Units](https://css-tricks.com/the-large-small-and-dynamic-viewport-units/)
- [web.dev: The trick to viewport units on mobile](https://web.dev/viewport-units/)
- [MDN: overscroll-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior)
- [W3C: CSS Box Sizing - min-height: auto](https://www.w3.org/TR/css-flexbox-1/#min-size-auto)

---

## 八、为什么这是本 Starter Kit 的亮点

本项目作为移动端 H5 / PWA 应用的快速启动模板，App Shell 架构是核心差异点：

1. **开箱即受益** — 所有布局模板（default / screen / admin）统一采用此架构，新页面继承布局即获得完整的视口锁定能力

2. **多层防御体系** — 不是单一手段，而是从 CSS 层（overflow / overscroll / dvh）到 JS 层（--app-height）到交互层（PWA 刷新按钮）的完整方案

3. **分场景适配** — 浏览器模式保留原生下拉刷新，PWA 模式提供手动刷新替代，不牺牲用户体验

4. **iOS / Android 双端覆盖** — `position: fixed` 锁 iOS 体、`safe-area-inset-bottom` 适配齐刘海、`dvh` 兼容双端工具栏变化

5. **可组合式** — `useLayoutConfig`（显隐控制）+ `useLayoutCustomization`（组件替换）+ `usePwaRefresh`（PWA 刷新）提供开放 API 供业务层扩展
