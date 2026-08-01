# 深色模式 & 状态栏颜色 — 架构文档

> 文档日期：2026-08-01

---

## 一、架构总览

```
                    ┌─ localStorage ('vueuse-color-scheme') ─┐
                    │         ↕ StorageEvent 同步             │
                    ▼                                         ▼
  ┌──────────────────────────┐                  ┌──────────────────────────┐
  │  App.vue                 │                  │  my.vue                  │
  │  const isDark = useDark()│                  │  const isDark = useDark()│
  │                          │                  │  toggleDark = useToggle  │
  │  ┌─────────────────────┐ │                  │                          │
  │  │ van-config-provider │ │                  │  <van-switch             │
  │  │   :theme="vantTheme"│ │                  │    @click="toggleDark()" │
  │  └─────────────────────┘ │                  └──────────────────────────┘
  │                          │
  │  useStatusBar(isDark) ───┼──► meta[name="theme-color"]
  └──────────────────────────┘         ├── Unhead (useHead)
                                       └── DOM 直接赋值 (meta.content)
```

三路并行生效：

| 路         | 机制                                                                               | 影响范围                  |
| ---------- | ---------------------------------------------------------------------------------- | ------------------------- |
| **CSS**    | VueUse `useDark()` → `html.dark` class → Tailwind `dark:` variant + 全局 CSS       | 页面所有元素              |
| **Vant**   | `computed(() => isDark.value ? 'dark' : 'light')` → `<van-config-provider :theme>` | Vant 组件内部样式         |
| **状态栏** | `useStatusBar(isDark)` → `<meta name="theme-color">`                               | 浏览器工具栏 / 系统状态栏 |

---

## 二、状态管理

### 2.1 单一数据源

使用 VueUse 的 `useDark()`，底层基于 `useColorMode()` + `useStorage('vueuse-color-scheme')`：

```ts
// App.vue
const isDark = useDark();

// my.vue（同一个 localStorage key，StorageEvent 自动同步）
const isDark = useDark();
const toggleDark = useToggle(isDark);
```

**关键点**：多个 `useDark()` 调用共享同一个 localStorage key `vueuse-color-scheme`。VueUse 内部通过 `window.dispatchEvent(new StorageEvent(...))` 在同一标签页内同步状态，所以 `App.vue` 和 `my.vue` 各自调用 `useDark()` 是正确的，不需要额外共享。

### 2.2 useDark() 内部机制

```
useDark()
  └─► useColorMode({
        storageKey: 'vueuse-color-scheme',   // 默认值
        initialValue: 'auto',                 // 首次访问跟随系统
        attribute: 'class',                   // 操作 html 的 class
        modes: { dark: 'dark', light: '' },   // dark → add 'dark', light → remove 'dark'
      })
        └─► useStorage('vueuse-color-scheme', 'auto', localStorage)
              ├── 读取 localStorage
              ├── 写 localStorage 时 dispatchEvent(StorageEvent) → 同标签页其他实例同步
              └── watch(system preference) → store.value 为 'auto' 时跟随系统
```

### 2.3 状态值含义

| `store.value` | `isDark.value`                  | 含义           |
| ------------- | ------------------------------- | -------------- |
| `'auto'`      | 跟随系统 `prefers-color-scheme` | 初次访问默认值 |
| `'dark'`      | `true`                          | 用户手动选深色 |
| `'light'`     | `false`                         | 用户手动选浅色 |

---

## 三、CSS 层面

### 3.1 Tailwind dark: 前缀

`src/styles/index.css` 中配置：

```css
@custom-variant dark (&:where(.dark, .dark *));
```

使用方式：`class="bg-white dark:bg-gray-800 dark:text-gray-100"`

### 3.2 全局 Body 样式

```css
html,
body {
  background-color: #fff; /* 浅色默认 */
  color: #333;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.dark body,
body.dark,
.dark {
  background-color: #111; /* 深色 */
  color: #eee;
}
```

### 3.3 PWA overscroll

```css
@media (display-mode: standalone) {
  html,
  body {
    overscroll-behavior: contain; /* PWA 禁用下拉刷新 */
  }
}
```

---

## 四、Vant 组件层面

`App.vue` 中通过 `van-config-provider` 传递主题：

```vue
<van-config-provider :theme="vantTheme">
  <router-view />
</van-config-provider>
```

```ts
const vantTheme = computed(() => (isDark.value ? 'dark' : 'light'));
```

Vant 4 内部使用 CSS 自定义属性切换主题：

- 浅色：`--van-background-2: #fff`、`--van-text-color: #323233`
- 深色：`--van-background-2: #1c1c1e`、`--van-text-color: #f5f5f5`

---

## 五、状态栏颜色

### 5.1 HTML 静态兜底

```html
<!-- index.html — JS 加载前的初始颜色 -->
<meta name="theme-color" content="#ffffff" />
```

### 5.2 PWA Manifest（仅启动瞬间）

```js
// build/plugins/pwa.ts
manifest: {
  theme_color: '#ffffff',  // PWA splash screen 状态栏颜色
}
```

### 5.3 useStatusBar（运行时动态切换）

```ts
// src/composables/useStatusBar.ts
export function useStatusBar(isDark: Ref<boolean>): void {
  const themeColor = computed(() => (isDark.value ? '#1c1c1e' : '#ffffff'));

  // 策略 1：Unhead 管理
  useHead({
    meta: [{ name: 'theme-color', content: themeColor }],
  });

  // 策略 2：直接 DOM 赋值（PWA 硬兜底）
  watch(
    themeColor,
    (color) => {
      setTimeout(() => {
        document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
          meta.content = color;
        });
      }, 0);
    },
    { immediate: true },
  );
}
```

**为什么需要两个策略？**

| 策略                      | 机制                                                            | 适用场景                                                             |
| ------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------- |
| Unhead `useHead`          | 管理 `<head>` 标签，与 router 的 `head.push` 共用一个 head 实例 | 正常浏览器模式，SSR 友好                                             |
| 直接 DOM `meta.content =` | 直接操作 DOM 属性                                               | PWA standalone 模式，部分 Android 版本 Unhead 更新后不触发状态栏重绘 |

### 5.4 颜色值选择

| 模式 | 状态栏颜色 | 说明                                                     |
| ---- | ---------- | -------------------------------------------------------- |
| 浅色 | `#ffffff`  | 纯白，与浅色导航栏 (`--van-background-2: #fff`) 一致     |
| 深色 | `#1c1c1e`  | Vant 深色背景色 (`--van-background-2`)，与导航栏融为一体 |

---

## 六、浏览器兼容性矩阵

| 场景                  | Chrome Android |      Edge Android       | iOS Safari / PWA |
| --------------------- | :------------: | :---------------------: | :--------------: |
| 浏览器 - 浅色切换     |       ✅       | ❌ (不支持 theme-color) |        ✅        |
| 浏览器 - 深色切换     |       ✅       |           ❌            |        ✅        |
| PWA - 浅色切换        |       ✅       |            —            |        ✅        |
| PWA - 深色切换        |       ✅       |            —            |        ✅        |
| 系统深色 + App 切浅色 | ✅ 状态栏变浅  |            —            |        ✅        |
| 系统浅色 + App 切深色 | ✅ 状态栏变深  |            —            |        ✅        |

> Edge Android 对 `<meta name="theme-color">` 不支持（caniuse 数据确认），属于浏览器限制，非代码问题。

---

## 七、代码评估 — 可优化点

### 7.1 🟡 `setTimeout(0)` → `nextTick()`

`useStatusBar` 中：

```ts
// 当前
setTimeout(() => {
  metas.forEach((meta) => {
    meta.content = color;
  });
}, 0);

// 建议
// nextTick 在 DOM 更新后、浏览器绘制前执行，比 setTimeout(0) 更精确
import { nextTick } from 'vue';
watch(
  themeColor,
  (color) => {
    nextTick(() => {
      metas.forEach((meta) => {
        meta.content = color;
      });
    });
  },
  { immediate: true },
);
```

**影响**：微小。`setTimeout(0)` 和 `nextTick()` 在大多数情况下行为一致，但 `nextTick` 语义更准确。

### 7.2 🟡 Body 背景色与 Vant 不一致

`index.css` 中 body 深色背景为 `#111`，而 Vant 深色 `--van-background-2` 为 `#1c1c1e`：

```css
/* 当前 */
.dark {
  background-color: #111;
}

/* 建议：与 Vant 背景色对齐 */
.dark {
  background-color: #1c1c1e;
}
```

**影响**：页面最外层背景与 Vant 组件背景存在微小色差，肉眼不易察觉但不够精确。

### 7.3 🟢 多个 `useDark()` 调用 — 当前已是正确实践

`App.vue` 和 `my.vue` 各自调用 `useDark()` 是 VueUse 的标准用法，通过 StorageEvent 在同一标签页内同步。`useStatusBar` 接收外部 ref 而非内部调用，是正确的优化。当前状态良好，无需改动。

### 7.4 🟢 Extracting to Pinia Store — 不推荐

将 `isDark` 放入 Pinia store 会增加不必要的间接层。VueUse `useDark()` 已经提供了：

- 全局单例状态
- localStorage 持久化
- 系统偏好跟随
- 跨标签页同步

Pinia 不会提供额外价值，保持当前实现即可。

---

## 八、相关文件索引

| 文件                              | 职责                                                                |
| --------------------------------- | ------------------------------------------------------------------- |
| `src/App.vue`                     | `useDark()` 初始化 + `van-config-provider` + `useStatusBar(isDark)` |
| `src/pages/my.vue`                | 深色模式开关 UI (`van-switch` + `useToggle`)                        |
| `src/composables/useStatusBar.ts` | `<meta name="theme-color">` 双策略更新                              |
| `src/styles/index.css`            | `@custom-variant dark` + body 全局样式 + PWA overscroll             |
| `build/plugins/pwa.ts`            | manifest `theme_color` (PWA splash screen)                          |
| `index.html`                      | 静态 `<meta name="theme-color">` 兜底                               |
