<template>
  <div class="index size-full">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <div
          v-for="item in list"
          :key="item.id"
          class="mb-2 box-border bg-[var(--color-bg-surface)] px-4 py-3 dark:bg-gray-800"
          @click="onGoDetail(item)"
        >
          <!-- 分类标签 + 时间 -->
          <div class="mb-1 flex items-center gap-2">
            <van-tag :type="item.tagType" plain>{{ item.category }}</van-tag>
            <span class="text-xs text-[var(--color-text-tertiary)]">{{ item.time }}</span>
          </div>

          <!-- 标题 -->
          <div class="van-ellipsis text-lg font-bold text-[var(--color-text-primary)]">
            {{ item.title }}
          </div>

          <!-- 正文 -->
          <div
            class="van-multi-ellipsis--l2 mt-1 text-sm leading-5 text-[var(--color-text-secondary)]"
          >
            {{ item.summary }}
          </div>

          <!-- 底部信息栏 -->
          <div class="mt-2 flex items-center justify-between">
            <div class="flex items-center gap-3 text-gray-400 dark:text-gray-500">
              <span class="flex items-center gap-1 text-sm">
                <van-icon name="eye-o" size="14" />
                {{ item.views }}
              </span>
              <span class="flex items-center gap-1 text-sm">
                <van-icon name="chat-o" size="14" />
                {{ item.comments }}
              </span>
            </div>
            <van-icon name="arrow" class="text-gray-300" />
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

interface Article {
  id: number;
  category: string;
  tagType: 'primary' | 'success' | 'warning' | 'danger';
  time: string;
  title: string;
  summary: string;
  views: number;
  comments: number;
}

definePage({
  meta: {
    title: '资讯列表',
    showHeader: true,
    showFooter: true,
  },
});

const router = useRouter();

const seedArticles: Article[] = [
  {
    id: 1,
    category: '技术',
    tagType: 'primary',
    time: '10 分钟前',
    title: 'Vue 3.6 正式版发布：Vapor Mode 性能实测',
    summary:
      'Vapor Mode 移除了 Virtual DOM 运行时，渲染性能对标 Solid / Svelte 5。本文用 10000 节点列表实测了首屏、更新与内存占用。',
    views: 12800,
    comments: 342,
  },
  {
    id: 2,
    category: '健身',
    tagType: 'success',
    time: '1 小时前',
    title: '晨间 20 分钟瑜伽序列，唤醒全身',
    summary:
      '不需要器械，只需要一张瑜伽垫。四个基础体式循环三组，坚持两周就能感受到肩颈与核心的变化。',
    views: 8600,
    comments: 187,
  },
  {
    id: 3,
    category: '设计',
    tagType: 'warning',
    time: '3 小时前',
    title: '移动端设计令牌实践：从 Figma 到代码',
    summary:
      '颜色、间距、字号统一成设计令牌后，深色模式不再需要逐页面手写覆盖。分享一套可落地的 token 方案。',
    views: 5400,
    comments: 96,
  },
  {
    id: 4,
    category: '效率',
    tagType: 'primary',
    time: '昨天',
    title: 'PWA 安装率翻倍的 3 个细节',
    summary:
      'beforeinstallprompt 时机、安装引导面板、App 图标设计——三个容易被忽略的细节，实测安装率提升 2.4 倍。',
    views: 7200,
    comments: 134,
  },
  {
    id: 5,
    category: '生活',
    tagType: 'danger',
    time: '昨天',
    title: '通勤路上的 10 分钟冥想练习',
    summary: '4-7-8 呼吸法 + 身体扫描，在地铁上也能完成的冥想。附赠适合新手的引导音频清单。',
    views: 4300,
    comments: 58,
  },
];

const list = ref<Article[]>([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const page = ref(0);

const onLoad = () => {
  setTimeout(() => {
    if (refreshing.value) {
      list.value = [];
      page.value = 0;
      refreshing.value = false;
    }

    const start = page.value * 5;
    const chunk = seedArticles.slice(start, start + 5);
    const items = chunk.map((a, i) => ({
      ...a,
      id: a.id + page.value * 100,
      title: `${a.title}（第 ${page.value + 1} 页）`,
    }));
    list.value.push(...items);
    page.value += 1;
    loading.value = false;

    if (page.value >= 3) {
      finished.value = true;
    }
  }, 800);
};

const onRefresh = () => {
  finished.value = false;
  loading.value = true;
  onLoad();
};

const onGoDetail = (item: Article) => {
  router.push({ path: '/detail', query: { id: item.id } });
};
</script>
