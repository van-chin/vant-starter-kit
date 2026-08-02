<template>
  <div class="pull-refresh-page size-full">
    <van-notice-bar left-icon="info-o" wrapable :scrollable="false">
      PullRefresh 下拉刷新：下拉页面触发刷新，配合 List 可实现完整的加载流程。
    </van-notice-bar>

    <van-pull-refresh
      v-model="loading"
      :success-text="`刷新成功，已刷新 ${count} 次`"
      @refresh="onRefresh"
    >
      <div class="space-y-3 p-4">
        <div
          v-for="item in items"
          :key="item.id"
          class="flex items-center gap-3 rounded-xl bg-[var(--color-bg-surface)] p-3 shadow-sm"
        >
          <div
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-2xl"
            :class="item.bg"
          >
            {{ item.icon }}
          </div>
          <div class="min-w-0 flex-1">
            <div class="truncate text-sm font-medium text-[var(--color-text-primary)]">
              {{ item.title }}
            </div>
            <div class="mt-0.5 truncate text-xs text-[var(--color-text-secondary)]">
              {{ item.desc }}
            </div>
          </div>
          <span class="shrink-0 text-xs text-[var(--color-text-tertiary)]">{{ item.time }}</span>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface FeedItem {
  id: string;
  icon: string;
  bg: string;
  title: string;
  desc: string;
  time: string;
}

definePage({
  meta: {
    title: '下拉刷新',
    showHeader: true,
    showFooter: true,
  },
});

const seeds: FeedItem[] = [
  {
    id: '1',
    icon: '🧘',
    bg: 'bg-purple-100',
    title: '晨间瑜伽打卡',
    desc: '第 21 天，肩颈轻松了很多',
    time: '12 分钟前',
  },
  {
    id: '2',
    icon: '🏃',
    bg: 'bg-sky-100',
    title: '5km 晨跑完成',
    desc: '配速 5分40秒，状态不错',
    time: '45 分钟前',
  },
  {
    id: '3',
    icon: '🥗',
    bg: 'bg-green-100',
    title: '快手轻食分享',
    desc: '牛油果鸡蛋吐司 + 希腊酸奶',
    time: '2 小时前',
  },
  {
    id: '4',
    icon: '🌙',
    bg: 'bg-amber-100',
    title: '4-7-8 呼吸法',
    desc: '坚持一周，焦虑少了很多',
    time: '昨天',
  },
];

const count = ref(0);
const loading = ref(false);
const items = ref<FeedItem[]>([...seeds]);

const onRefresh = () => {
  setTimeout(() => {
    count.value += 1;
    // 模拟新数据：把最后一条移到最前
    const last = items.value.pop();
    if (last) {
      items.value.unshift({ ...last, time: '刚刚' });
    }
    loading.value = false;
  }, 1000);
};
</script>
