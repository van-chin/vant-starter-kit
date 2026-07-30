<template>
  <!--
    App Shell 三段式布局：

      header (flex-none) — 钉死在顶部
      main   (flex-1 min-h-0) — 唯一的滚动区域
      footer (flex-none) — 钉死在底部

    vh-full: 由 JS --app-height 驱动，100dvh 兜底。
    min-h-0: ★ 允许 main 收缩到比内容矮——没有这行 flex 子项默认
             min-height: auto，内容一多会撑破外壳，tabbar 被挤出屏外。
    overscroll 放开：主内容区越界手势传给 body → body 焊死无法位移
    → 浏览器触发 Pull-to-Refresh → 用户可下拉刷新。
  -->
  <div
    class="layout-default vh-full flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-950 dark:text-gray-100"
  >
    <!-- header: 不伸缩，钉在顶部 -->
    <component :is="activeHeader" class="flex-none" v-if="activeHeader" />
    <!-- 离线提示条 -->
    <div v-if="!isOnline" class="flex-none bg-red-500 px-4 py-1 text-center text-xs text-white">
      {{ t('network.offline') }}
    </div>
    <!-- main: 唯一滚动容器，越界手势放开以支持下拉刷新 -->
    <main class="min-h-0 flex-1 overflow-y-auto">
      <router-view />
    </main>
    <!-- footer: 不伸缩，钉在底部 -->
    <component :is="activeFooter" class="flex-none" v-if="activeFooter" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import DefaultHeader from './default/components/header.vue';
import DefaultFooter from './default/components/footer.vue';

defineOptions({ name: 'LayoutDefault' });

const { t } = useI18n();
const { isOnline } = useNetworkStatus();
const { showHeader, showFooter } = useLayoutConfig();
const { activeHeader, activeFooter } = useLayoutProvider(DefaultHeader, DefaultFooter, {
  showHeader,
  showFooter,
});
</script>
