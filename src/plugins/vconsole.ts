/**
 * vConsole 调试面板集成
 *
 * 移动端浏览器没有 DevTools，vConsole 提供控制台、网络请求、元素查看等功能。
 *
 * 启用策略（任意满足即启动）：
 *   1. 构建时   VITE_ENABLE_VCONSOLE=true → 始终启用
 *   2. 运行时   URL 中带 ?vconsole ─────→ 按需启用
 *
 * 在 main.ts 中通过动态 import 引入，避免阻塞首屏渲染。
 */

const VCONSOLE_ENABLED_BY_ENV = import.meta.env.VITE_ENABLE_VCONSOLE === 'true';

/** 检查是否需要初始化 vConsole */
function shouldEnable(): boolean {
  if (VCONSOLE_ENABLED_BY_ENV) return true;

  // URL 参数 ?vconsole / ?vconsole=1
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has('vconsole')) return true;
  } catch {
    // ignore
  }

  return false;
}

/** 异步初始化 vConsole（不影响首屏渲染） */
export async function initVConsole(): Promise<void> {
  if (!shouldEnable()) return;

  try {
    const { default: VConsole } = await import('vconsole');
    new VConsole();
    console.log('[vConsole] 调试面板已启动');
  } catch (err) {
    console.error('[vConsole] 初始化失败:', err);
  }
}
