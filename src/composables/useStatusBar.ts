import type { Ref } from 'vue';
import { computed, watchEffect } from 'vue';
import { useHead } from '@unhead/vue';

/**
 * 根据深色模式动态切换浏览器/PWA 状态栏颜色
 *
 * 实现说明：通过 Unhead（useHead）管理 <meta name="theme-color">，
 * 而不是直接操作 DOM —— Unhead 会在导航时（router afterEach head.push）
 * 按其内部状态重新渲染 head，直接改 DOM 会被它还原，导致状态栏颜色失效。
 *
 * 浏览器兼容性：
 * - Chrome Android: 完整支持，动态更新即时生效
 * - Edge Android (Chromium): 对 theme-color 响应异常（实测不生效），非本组件可控
 *
 * @param isDark 共享的深色模式布尔 ref（来自 App.vue 的 `useDark()`）
 */
export function useStatusBar(isDark: Ref<boolean>): void {
  // 与导航栏背景一致（van-nav-bar 使用 --van-background-2：浅色 #fff / 深色 #1c1c1e）
  const themeColor = computed(() => (isDark.value ? '#1c1c1e' : '#ffffff'));

  useHead({
    meta: [{ name: 'theme-color', content: themeColor }],
  });

  // 调试埋点（仅 ?vconsole 时启用）：确认 meta 标签的实际状态
  // 用于排查 Chrome 手机端状态栏不跟随切换的问题
  if (typeof window !== 'undefined' && window.location.search.includes('vconsole')) {
    watchEffect(() => {
      const log = () => {
        const metas = document.querySelectorAll('meta[name="theme-color"]');
        const meta = metas[0];
        console.log(
          `[useStatusBar] isDark=${isDark.value} 目标=${themeColor.value} ` +
            `实际=${meta?.getAttribute('content') ?? '无meta'} 数量=${metas.length}`,
        );
      };
      log();
      // unhead 异步应用，延迟再确认一次
      setTimeout(log, 300);
    });
  }
}
