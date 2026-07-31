import { ref, onMounted, onUnmounted } from 'vue';

/**
 * 应用版本更新检测
 *
 * 原理：
 *   1. 应用启动时 fetch /version.json，缓存当前版本号
 *   2. 每 N 分钟轮询 /version.json，比对版本号
 *   3. 用户切回标签页时（visibilitychange）主动检查一次
 *   4. 版本号不一致 → hasUpdate = true → 显示更新提示
 *
 * 适用于 H5 和 PWA：
 *   - H5: 轮询 version.json 检测部署更新
 *   - PWA: SW update + version.json 双重保障
 */

/**
 * 轮询间隔（毫秒），默认 1 分钟
 *
 * 与 CI 部署节奏匹配：部署完成后 ~1 分钟内弹出更新提示。
 * 请求体极小（~50B no-store），频率成本可忽略；
 * 更短间隔（如 30s）无感知提升，徒增移动端耗电。
 */
const POLL_INTERVAL = 2 * 60 * 1000;

/** 当前缓存的版本号 */
let currentVersion = '';

/** 是否已初始化 */
let initialized = false;

export function useAppUpdate() {
  /** 是否有新版本可用 */
  const hasUpdate = ref(false);

  /** 从服务器获取最新版本号 */
  async function fetchVersion(): Promise<string> {
    try {
      // _t 随机数跳过浏览器缓存，_headers 规则禁止 CDN 缓存
      const resp = await fetch(`/version.json?_t=${Math.random()}`, {
        cache: 'no-store',
      });
      if (!resp.ok) return '';
      const data = (await resp.json()) as { v?: string };
      return data.v || '';
    } catch {
      return '';
    }
  }

  /** 检查版本是否变化 */
  async function checkUpdate(): Promise<void> {
    const latest = await fetchVersion();
    if (latest && currentVersion && latest !== currentVersion) {
      hasUpdate.value = true;
    }
    // 首次获取时缓存
    if (!currentVersion && latest) {
      currentVersion = latest;
    }
  }

  let pollTimer: ReturnType<typeof setInterval> | null = null;

  /** 用户切回页面时检查（处理后台标签页唤醒） */
  function onVisibilityChange(): void {
    if (document.visibilityState === 'visible') {
      checkUpdate();
    }
  }

  onMounted(() => {
    if (initialized) return;
    initialized = true;

    // 首次检查
    checkUpdate();

    // 定时轮询
    pollTimer = setInterval(checkUpdate, POLL_INTERVAL);

    // 页面可见性变化时检查
    document.addEventListener('visibilitychange', onVisibilityChange);
  });

  onUnmounted(() => {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
    document.removeEventListener('visibilitychange', onVisibilityChange);
  });

  /** 用户确认更新：刷新页面 */
  function applyUpdate(): void {
    // 对于 PWA，刷新会加载新的 SW + 新资源
    // 对于 H5，强刷跳过浏览器缓存
    window.location.reload();
  }

  return {
    hasUpdate,
    applyUpdate,
  };
}
