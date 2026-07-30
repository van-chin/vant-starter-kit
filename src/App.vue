<template>
  <van-config-provider :theme="vantTheme">
    <router-view></router-view>
  </van-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDark } from '@vueuse/core';

const isDark = useDark();
const vantTheme = computed(() => (isDark.value ? 'dark' : 'light'));
</script>
