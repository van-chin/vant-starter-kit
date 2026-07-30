import { watch } from 'vue';
import { useDark } from '@vueuse/core';

/**
 * 根据深色模式动态切换浏览器/PWA 状态栏颜色
 *
 * - Android Chrome / PWA: 动态更新 `<meta name="theme-color">`（运行时优先级高于 manifest）
 * - iOS PWA: `<meta name="apple-mobile-web-app-status-bar-style">` 仅启动时读取一次，
 *   动态修改无效，因此统一使用 `black-translucent`（内容延伸到状态栏下方，CSS
 *   safe-area-inset-top 兜底）
 *
 * 在 App.vue 的 `<script setup>` 中调用一次即可全局生效。
 */
export function useStatusBar(): void {
  const isDark = useDark({
    // 与 App.vue、pages/my.vue 共用同一个 storage key，保证状态同步
    storageKey: 'vueuse-color-scheme',
  });

  const LIGHT_COLOR = '#ffffff';
  const DARK_COLOR = '#111111';

  // 首次同步（在 watch immediate 触发前就设置，减少闪烁）
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', isDark.value ? DARK_COLOR : LIGHT_COLOR);
  }

  // 监听深色模式切换，实时更新 status bar 颜色
  watch(isDark, (dark) => {
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute('content', dark ? DARK_COLOR : LIGHT_COLOR);
    }
  });
}
