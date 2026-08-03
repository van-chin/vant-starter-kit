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
const POLL_INTERVAL = 1 * 60 * 1000;

/** 当前缓存的版本号 */
let currentVersion = '';

/** 当前挂载中的组件实例数（用于单例轮询的生命周期管理） */
let activeInstances = 0;

/** 轮询定时器（模块级单例，多个组件实例共享同一计时器） */
let pollTimer: ReturnType<typeof setInterval> | null = null;

/** 启动轮询（首次挂载时调用） */
function startPolling(checkUpdate: () => Promise<void>): void {
  if (pollTimer) return;
  void checkUpdate();
  pollTimer = setInterval(() => void checkUpdate(), POLL_INTERVAL);
}

/** 停止轮询（最后一个实例卸载时调用） */
function stopPolling(): void {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
}

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

  /** 用户切回页面时检查（处理后台标签页唤醒） */
  function onVisibilityChange(): void {
    if (document.visibilityState === 'visible') {
      void checkUpdate();
    }
  }

  onMounted(() => {
    activeInstances++;
    // 首次挂载时启动单例轮询；组件卸载后重新挂载会自动恢复
    startPolling(checkUpdate);

    // 页面可见性变化时检查
    document.addEventListener('visibilitychange', onVisibilityChange);
  });

  onUnmounted(() => {
    activeInstances = Math.max(0, activeInstances - 1);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    // 最后一个实例卸载后停止轮询，避免后台持续请求
    if (activeInstances === 0) {
      stopPolling();
    }
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
