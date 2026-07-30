import type { App } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { setupLayouts } from 'virtual:generated-layouts';
import { createRouter, createWebHistory } from 'vue-router';
import { routes, handleHotUpdate } from 'vue-router/auto-routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
  scrollBehavior: () => ({ top: 0, left: 0 }),
});

if (import.meta.hot) {
  handleHotUpdate(router, (newRoutes: RouteRecordRaw[]) => {
    router.clearRoutes();
    for (const route of setupLayouts(newRoutes)) {
      router.addRoute(route);
    }
  });
}

// ─── 认证守卫 ─────────────────────────────────────────────────────
// 使用动态 import 避免循环依赖：auth store → API methods → router
router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    const { useAuthStore } = await import('@/stores/auth');
    const authStore = useAuthStore();
    if (!authStore.isLoggedIn) {
      return { path: '/login', query: { redirect: to.fullPath } };
    }
  }
});

export const setupRouter = (app: App<Element>) => {
  app.use(router);
};

export default router;
