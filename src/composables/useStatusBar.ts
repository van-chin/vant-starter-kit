import type { Ref } from 'vue';
import { computed, nextTick, watch } from 'vue';
import { useHead } from '@unhead/vue';

/**
 * 根据深色模式动态切换浏览器/PWA 状态栏颜色
 *
 * 策略：
 *   1. 通过 Unhead（useHead）管理 <meta name="theme-color">，确保与 router
 *      afterEach 的 head.push() 共享同一 head 实例，不会互相覆盖。
 *   2. 同时直接写 DOM 的 meta.content 属性作为硬兜底 —— PWA standalone 模式下
 *      部分 Android 版本在 Unhead 更新 meta 后不重新渲染状态栏，直接 DOM 赋值
 *      能强制触发系统重新读取。
 *
 * 浏览器兼容性：
 * - Chrome Android (browser): 完整支持，动态更新即时生效
 * - Chrome Android (PWA): meta 可覆盖 manifest theme_color，直接 DOM 赋值最可靠
 * - Edge Android: 对 theme-color 响应异常（非本组件可控）
 *
 * @param isDark 共享的深色模式布尔 ref（来自 App.vue 的 `useDark()`）
 */
export function useStatusBar(isDark: Ref<boolean>): void {
  const themeColor = computed(() => (isDark.value ? '#1c1c1e' : '#ffffff'));

  // 策略 1：Unhead 管理（正常途径，SSR 友好）
  useHead({
    meta: [{ name: 'theme-color', content: themeColor }],
  });

  // 策略 2：直接 DOM 赋值（PWA 硬兜底）
  // 部分 Android PWA 在 Unhead 更新 meta attribute 后不触发状态栏重绘，
  // 直接设置 meta.content IDL 属性可以强制系统重新读取。
  watch(
    themeColor,
    (color) => {
      // nextTick 确保 Unhead 已更新 DOM 后再直接赋值
      void nextTick(() => {
        const metas = document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]');
        metas.forEach((meta) => {
          meta.content = color;
        });
      });
    },
    { immediate: true },
  );
}
