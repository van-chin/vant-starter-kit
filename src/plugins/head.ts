import { createHead } from '@unhead/vue/client';

/**
 * Unhead 实例 — 管理 `<head>` 标签（title / meta / link / script）
 *
 * 在 main.ts 中通过 `app.use(head)` 注册后，
 * 各页面/布局可通过 `useHead()` / `useSeoMeta()` 动态设置 SEO 信息。
 *
 * 默认标签在 index.html 中硬编码作为静态兜底，
 * 运行时由 Unhead 接管并动态覆盖。
 */
export const head = createHead();
