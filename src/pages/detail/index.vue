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
          class="mb-2 box-border bg-white px-2 py-4 dark:bg-gray-800"
          v-for="item in list"
          :key="item"
          :title="item"
        >
          <!-- 标题 -->
          <div class="van-ellipsis text-lg font-bold text-gray-900 dark:text-gray-100">
            携程员工：在携程4年，月薪3万左右，基本没涨薪了。不过挺满足的，毕竟稳定，福利也不错（附Agent面试题）
          </div>

          <!-- 头像行 -->
          <div class="flex items-center py-1">
            <van-image
              width="22"
              height="22"
              round
              src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
            />
          </div>

          <!-- 正文 -->
          <div class="van-multi-ellipsis--l2 text-gray-700 dark:text-gray-300">
            在携程4年，月薪30000左右，研发岗，基本是没有涨薪了。不过这么多年还是挺满足的，毕竟稳定，福利待遇也不错。
          </div>

          <!-- 底部信息栏 -->
          <div class="flex items-center justify-between py-1">
            <div class="flex items-center text-gray-400 dark:text-gray-500">
              <van-icon name="chat-o" />
              <span class="ml-1 text-sm">34</span>
            </div>
            <div class="flex items-center text-gray-400 dark:text-gray-500">
              <van-icon name="location" size="14" />
              <span class="ml-1 text-sm">北京</span>
            </div>
          </div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
definePage({
  meta: {
    title: '文章详情页面',
    showHeader: true,
    showFooter: true,
  },
});

import MyFooter from './components/MyFooter.vue';

useCustomFooter(MyFooter);

const list = ref<number[]>([]);
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);

const onLoad = () => {
  setTimeout(() => {
    if (refreshing.value) {
      list.value = [];
      refreshing.value = false;
    }

    for (let i = 0; i < 10; i++) {
      list.value.push(list.value.length + 1);
    }
    loading.value = false;

    if (list.value.length >= 40) {
      finished.value = true;
    }
  }, 1000);
};

const onRefresh = () => {
  finished.value = false;
  loading.value = true;
  onLoad();
};
</script>
