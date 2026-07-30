<template>
  <!--
    App Shell 三段式布局：

      header (flex-none) — 钉死在顶部
      main   (flex-1 min-h-0) — 唯一的滚动区域
      footer (flex-none) — 钉死在底部

    vh-full: 由 JS --app-height 驱动，100dvh → 100svh 递进回退。
    overscroll-contain: main 滚到头/底时手势不接力给 body。
    min-h-0: ★ 允许 main 收缩到比内容矮——没有这行 flex 子项默认
             min-height: auto，内容一多会撑破外壳，tabbar 被挤出屏外。
  -->
  <div class="layout-default vh-full flex flex-col overflow-hidden bg-gray-50">
    <!-- header: 不伸缩，钉在顶部 -->
    <component :is="activeHeader" class="flex-none" v-if="activeHeader" />
    <!-- main: 唯一滚动容器，min-h-0 防止内容撑破外壳 -->
    <main class="min-h-0 flex-1 overflow-y-auto overscroll-contain">
      <router-view />
    </main>
    <!-- footer: 不伸缩，钉在底部 -->
    <component :is="activeFooter" class="flex-none" v-if="activeFooter" />
  </div>
</template>

<script setup lang="ts">
import DefaultHeader from './default/components/header.vue';
import DefaultFooter from './default/components/footer.vue';

defineOptions({ name: 'LayoutDefault' });

const { showHeader, showFooter } = useLayoutConfig();
const { activeHeader, activeFooter } = useLayoutProvider(DefaultHeader, DefaultFooter, {
  showHeader,
  showFooter,
});
</script>
