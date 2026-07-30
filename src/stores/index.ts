import type { App } from 'vue';

import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';

let pinia: ReturnType<typeof createPinia> | null = null;

/**
 * 初始化 Pinia 状态管理
 * 支持 SSR 场景下每次创建新实例，配置 localStorage 持久化
 */
export function setupStore(app: App<Element>) {
  pinia = createPinia();
  pinia.use(
    createPersistedState({
      storage: localStorage,
      key: (id) => `vsk__${id}`,
    }),
  );
  app.use(pinia);
}

/** 获取 Pinia 实例（用于非组件内访问 store） */
export function usePinia() {
  if (!pinia) {
    throw new Error('[Pinia] Pinia has not been initialized. Call setupStore() first.');
  }
  return pinia;
}
