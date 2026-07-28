<template>
  <div class="page flex size-full flex-col overflow-hidden">
    <div class="page-header" v-if="$slots.header">
      <slot name="header"></slot>
    </div>
    <div class="page-content min-h-0 flex-1 overflow-y-auto">
      <slot></slot>
    </div>
    <div class="page-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'Page' });
</script>

<style scoped></style>
