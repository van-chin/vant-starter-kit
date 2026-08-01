import type { App } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { setupLayouts } from 'virtual:generated-layouts';
import { createRouter, createWebHistory } from 'vue-router';
import { routes, handleHotUpdate } from 'vue-router/auto-routes';
import { head } from '@/plugins/head';

const DEFAULT_TITLE = import.meta.env.VITE_APP_TITLE || 'vant-starter-kit';

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
router.afterEach((to, from) => {
  const pageTitle = to.meta.title as string | undefined;
  head.push({
    title: pageTitle ? `${pageTitle} — ${DEFAULT_TITLE}` : DEFAULT_TITLE,
  });

  // SPA 导航计数：首次加载（from 无匹配路由）不计入，
  // 后续每次 router.push 都 +1。用于 Header 判断是否显示返回箭头。
  // 注意：页面刷新后模块重载，计数归零 —— 刷新场景由 navigation type 兜底。
  if (from.matched.length > 0) {
    spaNavigationCount++;
  }
});

/**
 * 本次会话内的 SPA 导航次数（模块级，跨组件重建存活）。
 * Header 返回箭头判断用：>0 说明用户是在应用内跳转进来的。
 */
let spaNavigationCount = 0;
export function getSpaNavigationCount(): number {
  return spaNavigationCount;
}

export const setupRouter = (app: App<Element>) => {
  app.use(router);
};

export default router;
