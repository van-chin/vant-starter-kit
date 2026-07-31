import type { App } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { setupLayouts } from 'virtual:generated-layouts';
import { createRouter, createWebHistory } from 'vue-router';
import { routes, handleHotUpdate } from 'vue-router/auto-routes';
import { head } from '@/plugins/head';

const DEFAULT_TITLE = 'vant-starter-kit';

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

// ─── 动态页面标题 ──────────────────────────────────────────────────
// 从 route.meta.title 读取页面标题，自动更新 <title> 标签
router.afterEach((to) => {
  const pageTitle = to.meta.title as string | undefined;
  head.push({
    title: pageTitle ? `${pageTitle} — ${DEFAULT_TITLE}` : DEFAULT_TITLE,
  });
});

export const setupRouter = (app: App<Element>) => {
  app.use(router);
};

export default router;
