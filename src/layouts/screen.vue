<template>
  <div class="vh-full relative w-screen overflow-hidden bg-gray-950 text-white">
    <ScreenHeader />
    <main
      class="relative min-h-0 overflow-y-auto p-4"
      :style="{ height: `calc(var(--app-height, 100dvh) - 7rem)` }"
    >
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
