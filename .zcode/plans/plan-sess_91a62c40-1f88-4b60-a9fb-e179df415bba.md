## 登录页 Figma 设计还原方案

### 目标

将 `src/pages/login.vue` 按照 Figma 设计稿 "Yoga App - Login" 进行像素级还原。

---

### 📁 涉及文件

| 文件                            | 操作     | 说明                               |
| ------------------------------- | -------- | ---------------------------------- |
| `src/pages/login.vue`           | **重写** | 核心：模板 + 样式 + 逻辑改造       |
| `src/styles/index.css`          | **修改** | 添加 Poppins 字体、渐变按钮工具类  |
| `index.html`                    | **修改** | 添加 Google Fonts 预加载 (Poppins) |
| `public/images/chakra-logo.svg` | **新增** | 从 Figma 下载 Chakra 瑜伽 Logo     |
| `src/locales/zh-CN.ts`          | **不改** | i18n key 已齐全                    |
| `src/locales/en.ts`             | **不改** | 同上                               |

---

### 🔄 逐模块改造对照

#### 1. 整体布局

- **当前**: flex column 居中，背景 `#f8f9fa`
- **目标**: 保持 App Shell 结构，页面内垂直布局：Logo → 标题 → 表单 → 分隔线 → 社交登录 → 底部注册链接

#### 2. Chakra Logo（新增）

- 从 Figma 节点 `103:234` 下载 SVG
- 位置：页面顶部居中，`198×198` 尺寸
- 实现：`<img>` 标签引用 `/images/chakra-logo.svg`

#### 3. 标题区域

- **当前**: `text-2xl font-bold` + `text-sm text-gray-500`
- **目标**:
  - "Welcome Back!" → Poppins Medium 24px, color `#1F1F1F`
  - "Continue your Yoga journey." → Poppins Regular 16px, color `#757575`
  - 间距：标题与副标题间距 8px，副标题与表单间距加大

#### 4. 输入框（重大改造）

- **当前**: `van-field` + `left-icon`（user-o / lock-o）+ 系统默认密码切换
- **目标**:
  - **移除 left-icon**（Figma 设计无左侧图标）
  - 圆角 16px（`rounded-2xl`），白色背景
  - 阴影：`0px 1px 2px rgba(0,0,0,0.1)`
  - 内边距 18px（`van-field` 自定义 padding）
  - 密码框右侧：**自定义 eye-off 图标**（从 Figma 下载），点击切换密码可见性
  - placeholder: `#757575`, Poppins Regular 12px

#### 5. 忘记密码链接

- **当前**: 右对齐 `text-blue-500`
- **目标**: 右对齐，颜色 `#3883FF`，Poppins Medium 12px，添加点击事件预留

#### 6. 登录按钮（重大改造）

- **当前**: `van-button round block type="primary"`（蓝色圆角胶囊）
- **目标**:
  - 自定义按钮（不用 Vant van-button 默认样式）
  - 背景：`linear-gradient(25deg, #89C6FF 0%, #BC91D3 100%)` 紫蓝渐变
  - 圆角：16px（`rounded-2xl`）
  - 阴影：`0px 2px 4px rgba(0,0,0,0.15)`
  - 文字：Poppins SemiBold 16px，白色
  - 高度 52px，全宽
  - Loading 状态保持

#### 7. OR 分隔线

- **当前**: 实线灰色横线
- **目标**:
  - 左右两条渐变线：`linear-gradient(90deg, #8B8B8B → transparent)`（左侧）/ `linear-gradient(90deg, transparent → #8B8B8B)`（右侧）
  - 中间文字 "or continue with"：Inter Regular 12px, `#757575`

#### 8. 社交登录按钮（重大改造）

- **当前**: 三个灰色圆形图标按钮
- **目标**:
  - 三个**矩形卡片按钮**：`padding: 12px 26px`，圆角 8px
  - 白色背景 + `1px` 边框 + `0px 1px 1px rgba(0,0,0,0.05)` 阴影
  - 图标居中（复用现有内联 SVG）
  - 横向排列，gap: 42px

#### 9. 底部注册链接

- **当前**: 灰/蓝文字拼接
- **目标**: 匹配 Figma 样式，"New here?" 灰色 + "Sign Up" `#3883FF` 蓝色

---

### 🎨 设计 Token 映射

| Figma Token        | CSS/实现                                      |
| ------------------ | --------------------------------------------- |
| `#F8F9FA` 背景     | `bg-[#F8F9FA]`                                |
| `#1F1F1F` 标题黑   | `text-[#1F1F1F]`                              |
| `#757575` 副文本灰 | `text-[#757575]`                              |
| `#3883FF` 链接蓝   | `text-[#3883FF]`                              |
| 渐变按钮           | `bg-[linear-gradient(25deg,#89C6FF,#BC91D3)]` |
| 输入框阴影         | `shadow-[0px_1px_2px_rgba(0,0,0,0.1)]`        |
| 按钮阴影           | `shadow-[0px_2px_4px_rgba(0,0,0,0.15)]`       |
| 圆角 16px          | `rounded-2xl`                                 |
| 圆角 8px           | `rounded-lg`                                  |
| Poppins 字体       | Google Fonts 加载 + Tailwind `font-poppins`   |

---

### 🌓 深色模式适配

- 背景：`bg-[#F8F9FA] dark:bg-gray-950`
- 输入框：`bg-white dark:bg-gray-800`
- 文字：`text-[#1F1F1F] dark:text-gray-100`
- 社交按钮：`bg-[#F8F9FA] dark:bg-gray-800` + `border-white dark:border-gray-700`
- 渐变按钮在暗色模式下保持不变（按 Figma 原设计）

---

### 📝 实现步骤

1. 下载 Figma 资源（Chakra logo SVG + eye-off 图标）
2. 修改 `index.html` 添加 Poppins 字体
3. 修改 `src/styles/index.css` 添加 Poppins font-family 工具类
4. 重写 `src/pages/login.vue`（模板 + 样式 + 密码可见性逻辑）
5. 运行 `vp check` 确保格式/类型检查通过
6. 运行 `vp dev` 手动验证视觉效果
