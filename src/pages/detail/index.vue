<template>
  <div class="detail-page">
    <div class="bg-[var(--color-bg-surface)] px-4 py-4">
      <!-- 标题 -->
      <h1 class="text-xl leading-7 font-bold text-[var(--color-text-primary)]">
        {{ article.title }}
      </h1>

      <!-- 作者行 -->
      <div class="mt-3 flex items-center gap-2">
        <van-image
          width="32"
          height="32"
          round
          src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
        />
        <div class="flex-1">
          <div class="text-sm font-medium text-[var(--color-text-primary)]">
            {{ article.author }}
          </div>
          <div class="text-xs text-[var(--color-text-tertiary)]">
            {{ article.time }} · {{ article.views }} 阅读
          </div>
        </div>
        <van-button size="small" type="primary" round plain>+ 关注</van-button>
      </div>
    </div>

    <!-- 正文 -->
    <div class="bg-[var(--color-bg-surface)] px-4 py-4">
      <div class="space-y-4 text-[15px] leading-7 text-[var(--color-text-primary)]">
        <p v-for="(para, i) in article.paragraphs" :key="i">
          {{ para }}
        </p>
      </div>

      <!-- 标签 -->
      <div class="mt-6 flex flex-wrap gap-2">
        <van-tag v-for="tag in article.tags" :key="tag" type="primary" plain>{{ tag }}</van-tag>
      </div>
    </div>

    <!-- 操作区 -->
    <div class="px-4 py-6">
      <div
        class="flex items-center justify-around rounded-xl bg-[var(--color-bg-surface)] py-3 shadow-sm"
      >
        <button
          class="flex flex-col items-center gap-1 text-xs"
          :class="liked ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-secondary)]'"
          @click="liked = !liked"
        >
          <van-icon :name="liked ? 'like' : 'like-o'" size="22" />
          {{ article.likes + (liked ? 1 : 0) }}
        </button>
        <button
          class="flex flex-col items-center gap-1 text-xs text-[var(--color-text-secondary)]"
          @click="onComment"
        >
          <van-icon name="chat-o" size="22" />
          {{ article.comments }}
        </button>
        <button
          class="flex flex-col items-center gap-1 text-xs"
          :class="collected ? 'text-amber-500' : 'text-[var(--color-text-secondary)]'"
          @click="collected = !collected"
        >
          <van-icon :name="collected ? 'star' : 'star-o'" size="22" />
          {{ collected ? '已收藏' : '收藏' }}
        </button>
        <button
          class="flex flex-col items-center gap-1 text-xs text-[var(--color-text-secondary)]"
          @click="onShare"
        >
          <van-icon name="share-o" size="22" />
          分享
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { showToast } from 'vant';
import MyFooter from './components/MyFooter.vue';

definePage({
  meta: {
    title: '文章详情',
    showHeader: true,
    showFooter: true,
  },
});

useCustomFooter(MyFooter);

const liked = ref(false);
const collected = ref(false);

const article = {
  title: 'Vue 3.6 正式版发布：Vapor Mode 性能实测',
  author: 'Vite+ 社区',
  time: '2026-08-02 10:30',
  views: '1.2万',
  likes: 342,
  comments: 58,
  tags: ['Vue 3.6', 'Vapor Mode', '性能优化'],
  paragraphs: [
    'Vue 3.6 带来了备受期待的 Vapor Mode——一个移除 Virtual DOM 运行时的编译模式。它把组件编译为更直接的原生 JavaScript，渲染性能对标 Solid 和 Svelte 5。',
    '本文用 10000 节点的动态列表做了实测：Vapor 模式首次渲染耗时约为标准模式的 63%，更新 1000 行数据耗时约为 55%，内存占用下降约 20%。对于移动端低端设备，收益会更加明显。',
    '需要说明的是，Vapor Mode 目前按组件逐级 opt-in，UI 组件库（如 Vant）尚未完全适配。因此当前阶段更推荐保持标准 VDOM 模式开发，但保持代码风格与 Vapor 兼容（Composition API + script setup）。',
    '对于 starter-kit 类项目，这意味着：架构上不需要做任何破坏性调整，未来组件库就绪后可以平滑迁移到 Vapor 模式。',
  ],
};

const onComment = () => showToast('评论功能示例');
const onShare = () => showToast('分享功能示例');
</script>
