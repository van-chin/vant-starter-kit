import { ref } from 'vue';
import { onPwaInstallable, onPwaInstalled, promptInstall, isInstallable } from '@/utils/pwa';

/**
 * PWA 安装状态管理（Vue Composable）
 *
 * 三重检测避免重复提示：
 *   1. display-mode: standalone / fullscreen → 已在 PWA 中运行，永不提示
 *   2. localStorage pwa-installed → 之前已安装过，永不提示
 *   3. localStorage pwa-dismissed → 用户关闭过，7 天内不提示
 */

const STORAGE_KEY_INSTALLED = 'pwa-installed';
const STORAGE_KEY_DISMISSED = 'pwa-prompt-dismissed';
const DISMISS_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 天

/** 当前是否已在 PWA 模式中运行（display-mode: standalone / fullscreen） */
function isPwaRunning(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches
  );
}

/** 之前是否已安装过（appinstalled 事件或用户接受安装后写入） */
function isPreviouslyInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(STORAGE_KEY_INSTALLED) === 'true';
}

/** 用户是否在有效期内手动关闭过提示 */
function isDismissedRecently(): boolean {
  if (typeof window === 'undefined') return false;
  const dismissedAt = localStorage.getItem(STORAGE_KEY_DISMISSED);
  if (!dismissedAt) return false;
  return Date.now() - Number(dismissedAt) < DISMISS_DURATION;
}

/**
 * PWA 安装状态
 *
 * 用法：
 * ```ts
 * const { showPrompt, installing, install, dismiss } = usePwaInstall()
 * ```
 */
export function usePwaInstall() {
  // 三重检测：任一命中则永不显示
  const permanentlyHidden = isPwaRunning() || isPreviouslyInstalled();

  /** 是否应该显示安装提示 */
  const showPrompt = ref(false);

  /** 用户是否已手动关闭提示（会话内 + 7 天持久化） */
  const dismissed = ref(isDismissedRecently() || permanentlyHidden);

  /** 是否正在安装中 */
  const installing = ref(false);

  // 订阅 beforeinstallprompt → 显示 UI
  onPwaInstallable(() => {
    if (!dismissed.value) {
      showPrompt.value = true;
    }
  });

  // 订阅 appinstalled → 持久化已安装 + 清理状态 + Toast
  onPwaInstalled(async () => {
    localStorage.setItem(STORAGE_KEY_INSTALLED, 'true');
    showPrompt.value = false;
    installing.value = false;
    dismissed.value = true;
    const { showToast } = await import('vant');
    showToast('安装成功！应用已添加到桌面');
  });

  /** 用户点击"安装"按钮 */
  async function install(): Promise<boolean> {
    if (!isInstallable()) return false;
    installing.value = true;
    const result = await promptInstall();
    if (result) {
      // 用户接受了安装 → 立即持久化（不等 appinstalled，因为可能还没触发用户就刷新了）
      localStorage.setItem(STORAGE_KEY_INSTALLED, 'true');
      dismissed.value = true;
    } else {
      // 用户取消了 → 恢复状态，下次刷新后仍可提示
      installing.value = false;
    }
    return result;
  }

  /** 用户手动关闭提示（持久化 7 天） */
  function dismiss(): void {
    showPrompt.value = false;
    dismissed.value = true;
    localStorage.setItem(STORAGE_KEY_DISMISSED, String(Date.now()));
  }

  return {
    showPrompt,
    installing,
    install,
    dismiss,
  };
}
