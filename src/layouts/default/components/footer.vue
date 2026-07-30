<template>
  <footer>
    <!--
      :fixed="false"：van-tabbar 默认 position:fixed 脱离文档流。
      当前布局为 App Shell flex-col，footer 固定在视口底部，
      无需 fixed，回归正常流让 flex 自动分配空间，清除 padding-bottom hack。
    -->
    <van-tabbar :model-value="active" :fixed="false" safe-area-inset-bottom @change="onChange">
      <van-tabbar-item
        v-for="item in tabItems"
        :key="item.name"
        :icon="item.icon"
        :name="item.name"
        :badge="item.badge || undefined"
        :dot="item.dot"
        @click="onTabClick(item)"
      >
        {{ item.label }}
      </van-tabbar-item>
    </van-tabbar>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRequest } from 'alova/client';
import { tabbarsMethod } from '@/api/methods/app';

defineOptions({ name: 'DefaultFooter' });

const route = useRoute();
const router = useRouter();

const { data: tabItems } = useRequest(tabbarsMethod, {
  initialData: [],
});

/** 根据当前路由路径匹配活跃 tab 的 name */
const active = computed(() => {
  const match = tabItems.value.find((item) => item.path === route.path);
  return match?.name ?? '';
});

/** 点击 tab：统一用 router.push，即使重复点击也导航 */
const onTabClick = (item: (typeof tabItems.value)[number]) => {
  router.push(item.path);
};

const onChange = (key: string) => {
  console.info('onChange => key', key);
};
</script>
