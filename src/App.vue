<template>
  <van-config-provider :theme="vantTheme">
    <router-view></router-view>
  </van-config-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDark } from '@vueuse/core';
import { useStatusBar } from '@/composables/useStatusBar';

const isDark = useDark();
const vantTheme = computed(() => (isDark.value ? 'dark' : 'light'));

// 深色模式切换时，同步更新浏览器/PWA 状态栏颜色
// 传入共享的 isDark ref，避免多实例 useDark() 状态不同步
useStatusBar(isDark);
</script>
