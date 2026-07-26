<template>
  <header class="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
    <van-nav-bar :title="pageTitle" />
  </header>
</template>

<script setup lang="ts">
defineOptions({ name: 'DefaultHeader' });

const route = useRoute();
const pageTitle = computed(() => route.meta.title ?? '');
</script>
