import type { Ref } from 'vue';
import { watch } from 'vue';

/**
 * 根据深色模式动态切换浏览器/PWA 状态栏颜色
 *
 * 浏览器兼容性说明：
 * - Chrome Android: 完整支持，动态更新即时生效
 * - Edge Android (Chromium): `<meta name="theme-color">` 在 caniuse 上标注为 Not Supported，
 *   经实际测试 Chrome 150 正常而 Edge 150 不响应。推测 Edge fork 可能禁用了此特性，
 *   或仅在 HTTPS 下生效。以下采用多种策略尽力兼容。
 * - iOS Safari / PWA: `apple-mobile-web-app-status-bar-style` 读取 `black-translucent`
 *
 * 策略层次（按优先级）：
 * 1. 原地更新原始 meta — Chrome 正常响应
 * 2. 同步 DOM 抖动（removeChild → insertBefore）— 尝试触发 Edge 重新评估
 * 3. 双写 IDL 属性 + HTML 属性 — 覆盖不同浏览器的读取路径
 *
 * @param isDark 共享的深色模式布尔 ref（来自 App.vue 的 `useDark()`）
 */
export function useStatusBar(isDark: Ref<boolean>): void {
  const LIGHT_COLOR = '#ffffff';
  const DARK_COLOR = '#111111';

  // 初始化：保留第一个 meta[name="theme-color"]，移除其余（包括带 media 的）
  const allMetas = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]');

  // 清除多余的 meta（index.html 中带 media 的那一份）
  allMetas.forEach((meta, i) => {
    if (i > 0) meta.remove();
  });

  // 获取（或创建）唯一的 theme-color meta
  let themeMeta = allMetas[0] as HTMLMetaElement | undefined;
  if (!themeMeta) {
    themeMeta = document.createElement('meta');
    themeMeta.name = 'theme-color';
    document.head.appendChild(themeMeta);
  }

  // 确保原始 meta 上没有 media 属性（JS 已接管）
  themeMeta.removeAttribute('media');

  /**
   * 同步 DOM 抖动：将 meta 从 DOM 中短暂移除后立即插回原位。
   *
   * 整个操作在同一 JS 帧内同步完成，不会产生视觉闪烁，
   * 但会触发浏览器的 DOM mutation 处理流程，可能让某些
   * "不响应 setAttribute" 的浏览器重新评估 theme-color。
   */
  function applyThemeColor(dark: boolean): void {
    const color = dark ? DARK_COLOR : LIGHT_COLOR;

    if (!themeMeta) return;

    // 策略 2: 同步 DOM 抖动
    const parent = themeMeta.parentNode;
    const next = themeMeta.nextSibling;
    if (parent) {
      parent.removeChild(themeMeta);
      // 立即插回原位（同步，无闪烁）
      parent.insertBefore(themeMeta, next);
    }

    // 策略 3: 双写 IDL 属性 + HTML 属性
    themeMeta.content = color;
    themeMeta.setAttribute('content', color);
  }

  // 首次同步
  applyThemeColor(isDark.value);

  // 监听深色模式切换
  watch(isDark, (dark) => {
    applyThemeColor(dark);
  });
}
