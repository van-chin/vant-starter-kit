<template>
  <div
    class="flex items-center justify-between border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-surface)] px-4 py-2"
  >
    <div class="flex items-center gap-3 text-[var(--color-text-secondary)]">
      <van-icon name="like-o" size="18" @click="onLike" />
      <van-icon name="chat-o" size="18" @click="onComment" />
      <van-icon name="star-o" size="18" @click="onCollect" />
    </div>
    <div class="flex-1 px-3">
      <div
        class="flex h-8 items-center rounded-full bg-[var(--color-bg-page)] px-3 text-xs text-[var(--color-text-tertiary)]"
      >
        说点什么...
      </div>
    </div>
    <van-button size="small" type="primary" round @click="onShare">分享</van-button>
  </div>
</template>

<script setup lang="ts">
import { showToast } from 'vant';

const onLike = () => showToast('点赞示例');
const onComment = () => showToast('评论示例');
const onCollect = () => showToast('收藏示例');
const onShare = () => showToast('分享示例');
</script>
