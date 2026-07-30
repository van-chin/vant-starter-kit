import { createApp } from 'vue';

import '@/styles/index.css';

// 全局 Day.js 配置（必须在其他模块之前执行）
import '@/plugins/dayjs';

import App from './App.vue';

import { i18n } from '@/plugins/i18n';
import { setupRouter } from '@/router';

import { setupStore } from '@/stores';

/*
 * ─── 精确视口高度测量 ──────────────────────────────────────────
 *
 * 移动端布局使用 vh-full / min-vh-full 工具类（定义在 index.css），
 * 其高度由 CSS 变量 --app-height 驱动，100dvh 兜底。
 *
 * 此处用 window.innerHeight 在 Vue 挂载前精确测量实际可视高度并写入变量。
 * 同时监听 resize 事件，在工具栏展开/收起时动态更新。
 *
 * 为什么不用纯 CSS 100dvh？
 * - 浏览器模式下 100dvh 能正确区分工具栏状态，没有问题。
 * - PWA 模式（display-mode: standalone）下 100dvh 可能包含系统状态栏，
 *   导致计算高度 > 实际可用空间，tabbar 被挤出屏外。
 * - JS 的 window.innerHeight 在所有模式下都返回真实的可用视口高度。
 */
const setAppHeight = () => {
  document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
};
setAppHeight();
window.addEventListener('resize', setAppHeight);

const initApplication = async () => {
  const app = createApp(App);

  // ─── 全局错误捕获 ──────────────────────────────────────────
  app.config.errorHandler = async (err) => {
    const { showToast } = await import('vant');
    showToast(err instanceof Error ? err.message : '应用发生未知错误');
    console.error('[App Error]', err);
  };

  // 设置国际化
  app.use(i18n);

  // 设置状态管理
  setupStore(app);

  // 设置路由
  setupRouter(app);

  app.mount('#app');
};

await initApplication();
