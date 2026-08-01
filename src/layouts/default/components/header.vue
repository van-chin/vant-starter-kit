<template>
  <header class="sticky top-0 z-50 bg-white dark:bg-gray-950">
    <van-nav-bar :title="pageTitle" :left-arrow="showBack" @click-left="onClickLeft" />
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

defineOptions({ name: 'DefaultHeader' });

const route = useRoute();
const router = useRouter();

const pageTitle = computed(() => route.meta.title ?? '');

/** Tabbar 根页面路径 — 这些页面不显示返回箭头 */
const TABBAR_PATHS = new Set(['/', '/categories', '/seed', '/cart', '/my']);

/**
 * 页面首次加载时的 history 长度，作为"入口基准"。
 *
 * 后续 SPA 内每次 router.push() 都会使 window.history.length +1，
 * 只要当前长度 > 入口基准，说明存在可回退的 SPA 历史。
 *
 * 场景覆盖：
 *   - Tabbar 页内导航到详情页 → history.length > 基准 → 显示返回 ✓
 *   - WebView / 小程序直接打开详情页 → history.length = 基准 → 不显示 ✓
 *   - 用户在详情页刷新 → header 重新挂载，基准 = 当前长度 → 不显示 ✓
 */
const initialHistoryLength = typeof window !== 'undefined' ? window.history.length : 1;

/** 是否需要显示返回箭头：非 tabbar 页面 且 存在 SPA 导航历史 */
const showBack = computed(() => {
  if (TABBAR_PATHS.has(route.path)) return false;
  return window.history.length > initialHistoryLength;
});

/** 点击返回：回退到上一个 SPA 页面 */
function onClickLeft(): void {
  router.back();
}
</script>
