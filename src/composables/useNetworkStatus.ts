import { useNetwork } from '@vueuse/core';

/**
 * 网络状态检测 composable。
 *
 * 封装 @vueuse/core 的 useNetwork，提供在线/离线状态和恢复通知。
 *
 * 用法（自动导入）：
 * ```ts
 * const { isOnline, wasOffline } = useNetworkStatus();
 * ```
 */
export function useNetworkStatus() {
  const { isOnline } = useNetwork();

  /** 是否刚刚从离线恢复（用于显示"已恢复连接"提示） */
  const wasOffline = ref(false);

  let recoverTimer: ReturnType<typeof setTimeout> | null = null;

  watch(isOnline, (online, prev) => {
    if (online && !prev) {
      wasOffline.value = true;
      recoverTimer = setTimeout(() => {
        wasOffline.value = false;
      }, 3000);
    }
  });

  // 组件卸载时清理计时器，避免副作用泄漏
  onScopeDispose(() => {
    if (recoverTimer) {
      clearTimeout(recoverTimer);
      recoverTimer = null;
    }
  });

  return { isOnline, wasOffline };
}
