<template>
  <header class="sticky top-0 z-50 bg-white dark:bg-gray-950">
    <van-nav-bar :title="pageTitle" :left-arrow="showBack" @click-left="onClickLeft" />
  </header>
</template>

<script>
/**
 * 模块级基准：应用 JS 首次加载时捕获一次，跨组件重建存活。
 *
 * ⚠️ 不能放在 <script setup> 内 —— vite-plugin-vue-layouts-next 为每个页面
 * 生成独立的布局包装，页面间跳转会导致布局（含 header）卸载重建。
 * 若在组件 setup 中捕获，重建时会重新取到已 +1 的 history.length，
 * 导致 `history.length > 基准` 永远为 false，返回箭头永不显示。
 */
const initialHistoryLength = typeof window !== 'undefined' ? window.history.length : 1;
</script>

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
 * 是否需要显示返回箭头：非 tabbar 页面 且 存在 SPA 导航历史。
 *
 * 场景覆盖：
 *   - Tabbar 页内导航到详情页 → history.length > 基准 → 显示返回 ✓
 *   - WebView / 小程序直接打开详情页 → history.length = 基准 → 不显示 ✓
 *   - 用户在详情页刷新 → 模块重载，基准 = 当前长度 → 不显示 ✓
 */
const showBack = computed(() => {
  if (TABBAR_PATHS.has(route.path)) return false;
  return window.history.length > initialHistoryLength;
});

/** 点击返回：回退到上一个 SPA 页面 */
function onClickLeft(): void {
  router.back();
}
</script>
