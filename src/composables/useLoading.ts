import { ref, computed } from 'vue';

/**
 * 全局加载态管理。
 *
 * 用法（自动导入，无需手动 import）：
 * ```ts
 * const { loading, withLoading } = useLoading();
 * await withLoading(async () => { ... });
 * ```
 */
export function useLoading() {
  /** 当前正在进行的请求计数 */
  const pendingCount = ref(0);

  /** 是否有请求在进行中 */
  const loading = computed(() => pendingCount.value > 0);

  /**
   * 包裹一个异步函数，自动管理 pending 计数。
   * 成功或失败后自动减计数。
   */
  const withLoading = async <T>(fn: () => Promise<T>): Promise<T> => {
    pendingCount.value++;
    try {
      return await fn();
    } finally {
      pendingCount.value--;
    }
  };

  return { loading, withLoading };
}
