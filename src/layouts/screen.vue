<template>
  <div class="relative h-[100dvh] w-screen overflow-hidden bg-gray-950 text-white">
    <ScreenHeader />
    <main class="relative h-[calc(100dvh-7rem)] p-4">
      <router-view />
    </main>
    <ScreenFooter />
  </div>
</template>

<script setup lang="ts">
import ScreenHeader from './screen/components/header.vue';
import ScreenFooter from './screen/components/footer.vue';

defineOptions({ name: 'LayoutScreen' });
</script>
