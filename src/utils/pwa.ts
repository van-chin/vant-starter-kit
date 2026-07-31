/**
 * PWA Service Worker 注册监控 + 安装事件处理
 *
 * 支持多个订阅者同时监听 PWA 事件（main.ts 的 Toast + usePwaInstall 的 UI）。
 *
 * Chrome Android PWA 安装流程：
 *   用户点"添加到主屏幕" → Chrome 显示"正在安装…"（~2s）
 *   → 返回浏览器 → Google Play Services 后台创建 WebAPK（10-60s）
 *   → 桌面出现图标 → 触发 appinstalled 事件
 */

// ─── 事件订阅 ────────────────────────────────────────────────────

type EventCallback = () => void;
const installableCallbacks: EventCallback[] = [];
const installedCallbacks: EventCallback[] = [];

let installPromptEvent: BeforeInstallPromptEvent | null = null;
let eventsInitialized = false;

/** 订阅 beforeinstallprompt 事件 */
export function onPwaInstallable(cb: EventCallback): () => void {
  installableCallbacks.push(cb);
  return () => {
    const idx = installableCallbacks.indexOf(cb);
    if (idx >= 0) installableCallbacks.splice(idx, 1);
  };
}

/** 订阅 appinstalled 事件 */
export function onPwaInstalled(cb: EventCallback): () => void {
  installedCallbacks.push(cb);
  return () => {
    const idx = installedCallbacks.indexOf(cb);
    if (idx >= 0) installedCallbacks.splice(idx, 1);
  };
}

// ─── 初始化（main.ts 调用一次） ───────────────────────────────────

/**
 * 初始化全局 PWA 事件监听（应在 main.ts 中调用一次）
 */
export function initPwaEvents(): void {
  if (eventsInitialized) return;
  eventsInitialized = true;

  // appinstalled: PWA 安装成功
  window.addEventListener('appinstalled', () => {
    console.log('[PWA] ✅ PWA 安装成功！应用已添加到桌面');
    installedCallbacks.forEach((cb) => cb());
  });

  // beforeinstallprompt: 浏览器判定站点可安装
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('[PWA] 📢 beforeinstallprompt 触发，站点满足 PWA 安装条件');
    e.preventDefault();
    installPromptEvent = e as BeforeInstallPromptEvent;
    installableCallbacks.forEach((cb) => cb());
  });

  // SW 注册诊断
  monitorServiceWorker();
}

// ─── 安装 API ────────────────────────────────────────────────────

/** 手动触发 PWA 安装对话框 */
export async function promptInstall(): Promise<boolean> {
  if (!installPromptEvent) {
    console.warn('[PWA] ⚠️ beforeinstallprompt 尚未触发，无法手动安装');
    return false;
  }
  try {
    await installPromptEvent.prompt();
    const result = await installPromptEvent.userChoice;
    console.log('[PWA] 用户选择:', result.outcome);
    installPromptEvent = null;
    return result.outcome === 'accepted';
  } catch (err) {
    console.error('[PWA] 安装失败:', err);
    installPromptEvent = null;
    return false;
  }
}

/** 站点是否满足 PWA 安装条件 */
export function isInstallable(): boolean {
  return installPromptEvent !== null;
}

// ─── SW 诊断 ─────────────────────────────────────────────────────

function monitorServiceWorker(): void {
  if (!('serviceWorker' in navigator)) {
    console.warn('[PWA] 当前浏览器不支持 Service Worker');
    return;
  }

  navigator.serviceWorker
    .getRegistration()
    .then((reg) => {
      if (reg) {
        console.log('[PWA] ✅ SW 已注册:', {
          scope: reg.scope,
          state: reg.active?.state ?? reg.waiting?.state ?? reg.installing?.state ?? 'unknown',
        });

        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          if (newWorker) {
            console.log('[PWA] 🔄 发现新 SW 版本');
            newWorker.addEventListener('statechange', () => {
              console.log('[PWA] SW 状态变更 →', newWorker.state);
            });
          }
        });
      } else {
        console.warn('[PWA] ⚠️ 未找到已注册的 Service Worker');
        console.warn('[PWA] 可能原因:');
        console.warn('  1. registerSW.js 脚本未加载');
        console.warn('  2. /sw.js 返回了非 200 状态码');
        console.warn('  3. SW 注册被浏览器安全策略阻止');
        console.warn('  4. SW 文件存在语法错误');
      }
    })
    .catch((err) => {
      console.error('[PWA] ❌ 获取 SW 注册失败:', err);
    });
}
