import { computed, type Ref } from 'vue';
import { useColorMode } from '@vueuse/core';

/**
 * 应用主题状态（应用自控，不跟随系统）
 *
 * 与 useDark() 的区别：
 * - useDark 委托 useColorMode 的 auto 模式，主题初始值与变化都跟随系统 prefers-color-scheme
 * - 此处固定 initialValue，主题完全由应用/用户手动切换（localStorage 持久化），
 *   系统主题不影响应用 —— 状态栏、Vant 主题、Tailwind dark: 均以应用主题为准
 *
 * 状态栏联动：
 * - H5 浏览器模式：useStatusBar(isDark) 动态设置 <meta name="theme-color">
 * - PWA standalone：状态栏只认 manifest 静态 theme_color（#1c1c1e 深色）
 */
const colorMode = useColorMode({ initialValue: 'dark' });

// 兼容旧版 useDark 遗留的 'auto'（跟随系统）存储值：应用自控，收敛为默认主题
if (typeof window !== 'undefined' && colorMode.store.value === 'auto') {
  colorMode.store.value = 'dark';
}

/** 返回可切换的 isDark ref（含 setter，供 useToggle 使用） */
export function useTheme(): { isDark: Ref<boolean> } {
  return {
    isDark: computed<boolean>({
      get: () => colorMode.value === 'dark',
      set: (v) => {
        // 只写 'dark' / 'light'，永不写回 'auto'（避免系统重新接管）
        colorMode.value = v ? 'dark' : 'light';
      },
    }),
  };
}
