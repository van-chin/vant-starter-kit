<template>
  <!--
    PWA 安装提示条

    当浏览器判定站点满足 PWA 安装条件时自动出现，
    用户可点击"安装"直接在页面上触发安装，无需去浏览器菜单中查找。

    参考：https://vite-pwa-org.netlify.app/
  -->
  <Transition name="pwa-prompt">
    <div
      v-if="showPrompt"
      class="fixed right-0 bottom-0 left-0 z-50 flex items-center gap-3 bg-white px-4 py-3 shadow-[0_-2px_12px_rgba(0,0,0,0.1)] dark:bg-gray-900 dark:text-gray-100"
      :style="{ paddingBottom: `calc(12px + ${safeAreaBottom})` }"
    >
      <!-- App 图标 -->
      <div class="flex-shrink-0">
        <img
          src="/pwa-64x64.png"
          alt="App Icon"
          class="h-10 w-10 rounded-xl"
          width="40"
          height="40"
        />
      </div>

      <!-- 文字区域 -->
      <div class="min-w-0 flex-1">
        <div class="truncate text-sm font-semibold">vant-starter-kit</div>
        <div class="truncate text-xs text-gray-500 dark:text-gray-400">
          添加到主屏幕，获得更好的体验
        </div>
      </div>

      <!-- 安装按钮 -->
      <button
        class="flex-shrink-0 rounded-lg bg-blue-500 px-4 py-1.5 text-sm font-medium text-white transition-colors active:bg-blue-600 disabled:opacity-50"
        :disabled="installing"
        @click="handleInstall"
      >
        {{ installing ? '安装中…' : '安装' }}
      </button>

      <!-- 关闭按钮 -->
      <button
        class="-mr-1 flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        aria-label="关闭"
        @click="dismiss"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { usePwaInstall } from '@/composables/usePwaInstall';

const { showPrompt, installing, install, dismiss } = usePwaInstall();

/** iOS safe-area 底部间距 */
const safeAreaBottom = computed(() => {
  // 仅在客户端计算
  if (typeof window === 'undefined') return '0px';
  return (
    getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom') || '0px'
  );
});

async function handleInstall(): Promise<void> {
  await install();
}
</script>

<style scoped>
/* 进入/离开动画 */
.pwa-prompt-enter-active {
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.3s ease;
}
.pwa-prompt-leave-active {
  transition:
    transform 0.2s ease-in,
    opacity 0.2s ease;
}
.pwa-prompt-enter-from {
  transform: translateY(100%);
  opacity: 0;
}
.pwa-prompt-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
