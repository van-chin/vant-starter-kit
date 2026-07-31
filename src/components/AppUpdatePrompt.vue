<template>
  <!--
    版本更新提示条 — 深色/浅色自适应

    检测到新版本时从顶部滑入，使用 Vant 组件确保跨主题可见性。
  -->
  <Transition name="update-prompt">
    <div
      v-if="hasUpdate"
      class="fixed top-0 right-0 left-0 z-50 flex items-center gap-3 px-4 py-3 shadow-lg"
      :style="barStyle"
    >
      <!-- 图标 -->
      <svg class="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
          clip-rule="evenodd"
        />
      </svg>

      <!-- 文字 -->
      <div class="min-w-0 flex-1">
        <div class="text-sm font-medium">发现新版本</div>
        <div class="text-xs" style="color: rgba(255, 255, 255, 0.8)">刷新页面即可体验最新功能</div>
      </div>

      <!-- 按钮：Vant Button plain 模式，白底蓝字，深色模式自动适配 -->
      <van-button size="small" round plain color="#2563eb" @click="applyUpdate">
        立即更新
      </van-button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDark } from '@vueuse/core';
import { useAppUpdate } from '@/composables/useAppUpdate';

const { hasUpdate, applyUpdate } = useAppUpdate();

const isDark = useDark();

/** iOS safe-area 顶部间距 */
const safeAreaTop = computed(() => {
  if (typeof window === 'undefined') return '0px';
  return (
    getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top') || '0px'
  );
});

/** 提示条背景色：浅色亮蓝 / 深色暗蓝 */
const barStyle = computed(() => ({
  paddingTop: `calc(12px + ${safeAreaTop.value})`,
  backgroundColor: isDark.value ? '#1e3a8a' : '#3b82f6',
  color: '#fff',
}));
</script>

<style scoped>
.update-prompt-enter-active {
  transition:
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.3s ease;
}
.update-prompt-leave-active {
  transition:
    transform 0.2s ease-in,
    opacity 0.2s ease;
}
.update-prompt-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}
.update-prompt-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
