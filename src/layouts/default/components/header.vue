<template>
  <header class="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
    <van-nav-bar :title="pageTitle">
      <!-- PWA 模式下的手动刷新按钮 -->
      <template #right>
        <button
          v-if="isPwa"
          class="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 transition-colors hover:bg-gray-100 active:text-gray-900"
          title="刷新页面"
          @click="pwaRefresh"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
        </button>
      </template>
    </van-nav-bar>
  </header>
</template>

<script setup lang="ts">
defineOptions({ name: 'DefaultHeader' });

const route = useRoute();
const pageTitle = computed(() => route.meta.title ?? '');

// PWA 模式手动刷新（自动导入，src/composables/）
const { isPwa, pwaRefresh } = usePwaRefresh();
</script>
