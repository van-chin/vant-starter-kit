import { ref, onMounted } from 'vue';

/**
 * PWA 模式下的刷新工具。
 *
 * 浏览器模式（有地址栏）: 用户可直接使用原生下拉刷新，无需额外能力。
 * PWA 模式（display: standalone）: 浏览器的 Pull-to-Refresh 已被 CSS 禁用
 * （见 src/styles/index.css 中的 @media display-mode: standalone 规则），
 * 用户需要通过此 composable 提供的手动刷新能力获取最新内容。
 *
 * 用法（自动导入，无需手动 import）：
 * ```ts
 * const { isPwa, pwaRefresh } = usePwaRefresh();
 * ```
 *
 * 模板中使用：
 * ```vue
 * <button v-if="isPwa" @click="pwaRefresh">刷新</button>
 * ```
 */
export function usePwaRefresh() {
  /** 当前是否运行在 PWA 独立窗口模式 */
  const isPwa = ref(false);

  /** 是否有等待激活的 Service Worker（新版本已下载但未激活） */
  const hasUpdate = ref(false);

  onMounted(() => {
    // 检测 display-mode
    isPwa.value = window.matchMedia('(display-mode: standalone)').matches;

    // 监听 display-mode 变化（极少发生，但以防万一）
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handler = (e: MediaQueryListEvent) => {
      isPwa.value = e.matches;
    };
    mediaQuery.addEventListener('change', handler);

    // 如果 vite-plugin-pwa 注入了 Service Worker，监听更新等待事件
    const handleSWUpdate = () => {
      hasUpdate.value = true;
    };
    window.addEventListener('sw:waiting', handleSWUpdate);

    // 清理
    onScopeDispose(() => {
      mediaQuery.removeEventListener('change', handler);
      window.removeEventListener('sw:waiting', handleSWUpdate);
    });
  });

  /**
   * 执行页面刷新。
   * 在 PWA 模式下通过 window.location.reload() 实现。
   */
  const pwaRefresh = () => {
    window.location.reload();
  };

  return {
    /** 是否运行在 PWA 独立窗口模式 */
    isPwa,
    /** 是否有等待激活的 Service Worker 新版本 */
    hasUpdate,
    /** 执行页面刷新 */
    pwaRefresh,
  };
}
