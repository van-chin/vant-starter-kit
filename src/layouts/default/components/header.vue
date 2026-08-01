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
 * 是否需要显示返回箭头：非 tabbar 页面 且 浏览器存在可回退历史。
 *
 * window.history.length > 1 表示会话历史里至少有一个可返回的页面：
 *   - SPA 内跳转 /my → /list → history.length=2 → 显示返回 ✓
 *   - 刷新 /list（从 /my 跳来）→ 浏览器历史保留 → 显示返回 ✓
 *   - WebView / 直接输入 URL 打开 → history.length=1 → 不显示 ✓
 *
 * 刷新后 SPA 内部路由状态丢失，但浏览器会话历史（history.length）
 * 不会被清空 —— 返回按钮回退的是浏览器层面的上一页。
 */
const showBack = computed(() => {
  if (TABBAR_PATHS.has(route.path)) return false;
  return window.history.length > 1;
});

/** 点击返回：回退到上一个页面（浏览器历史） */
function onClickLeft(): void {
  router.back();
}
</script>
