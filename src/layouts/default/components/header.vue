<template>
  <header class="sticky top-0 z-50 bg-white dark:bg-gray-950">
    <van-nav-bar :title="pageTitle" :left-arrow="showBack" @click-left="onClickLeft" />
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getSpaNavigationCount } from '@/router';

defineOptions({ name: 'DefaultHeader' });

const route = useRoute();
const router = useRouter();

const pageTitle = computed(() => route.meta.title ?? '');

/** Tabbar 根页面路径 — 这些页面不显示返回箭头 */
const TABBAR_PATHS = new Set(['/', '/categories', '/seed', '/cart', '/my']);

/**
 * 本次页面加载的导航类型（PerformanceNavigationTiming）。
 * - 'reload'：页面刷新 —— 浏览器历史保留，可显示返回
 * - 'navigate'：首次进入（直接输入 URL / WebView / 外部链接）
 * - 旧浏览器兜底：performance.navigation.type === 1 表示 reload
 */
function getNavigationType(): string {
  try {
    const entries = performance.getEntriesByType('navigation');
    if (entries.length > 0) {
      return (entries[0] as PerformanceNavigationTiming).type;
    }
    // 旧浏览器兜底
    const legacy = (performance as unknown as { navigation?: { type?: number } }).navigation;
    if (legacy?.type === 1) return 'reload';
  } catch {
    // ignore
  }
  return 'navigate';
}

/** 是否为页面刷新（非首次进入） */
const isReload = typeof window !== 'undefined' && getNavigationType() === 'reload';

/**
 * 是否需要显示返回箭头，三重信号判定：
 *
 *   1. SPA 导航计数 > 0  → 应用内跳转进来的，必有返回    （/my → /list）✓
 *   2. 刷新（reload）     → SPA 计数归零，但浏览器历史保留 → 显示返回 ✓
 *   3. 首次进入（navigate）→ 直接输入 URL / WebView / 外部链接 → 不显示 ✓
 *
 * 为什么能区分"刷新"和"WebView 直接进入"？
 * 两者在 history.length 上可能一样（都是 2），但导航类型不同：
 * 刷新是 reload，WebView 跳入是 navigate。这是唯一的可靠区分信号。
 */
const showBack = computed(() => {
  if (TABBAR_PATHS.has(route.path)) return false;
  // 信号 1：本次会话 SPA 内跳转过
  if (getSpaNavigationCount() > 0) return true;
  // 信号 2：刷新后浏览器历史还有上一页
  if (isReload) return window.history.length > 1;
  // 信号 3：首次进入（含 WebView 直接跳转）→ 无返回
  return false;
});

/** 点击返回：回退到上一个页面（浏览器历史） */
function onClickLeft(): void {
  router.back();
}
</script>
