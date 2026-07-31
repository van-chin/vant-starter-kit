<template>
  <header class="sticky top-0 z-50 bg-white dark:bg-gray-950">
    <van-nav-bar :title="pageTitle" />
  </header>
</template>

<script setup lang="ts">
defineOptions({ name: 'DefaultHeader' });

const route = useRoute();
const pageTitle = computed(() => route.meta.title ?? '');
</script>
