<template>
  <div class="p-4 pb-8">
    <h2 class="mb-4 text-lg font-bold">Vant 组件示例</h2>

    <!-- Popup 弹出层 -->
    <van-cell-group inset class="mb-4">
      <van-cell title="Popup 弹出层" is-link @click="showPopup = true" />
    </van-cell-group>
    <van-popup v-model:show="showPopup" round position="bottom" :style="{ height: '40%' }">
      <div class="p-6">
        <h3 class="mb-2 text-base font-bold">底部弹出面板</h3>
        <p class="text-sm text-gray-500">常用于操作菜单、筛选条件、表单填写等场景。</p>
        <van-button class="mt-4" block @click="showPopup = false">关闭</van-button>
      </div>
    </van-popup>

    <!-- SwipeCell 滑动操作 -->
    <van-cell-group inset class="mb-4">
      <van-swipe-cell v-for="(item, idx) in swipeItems" :key="idx">
        <van-cell :title="item" value="左滑试试" />
        <template #right>
          <van-button square type="danger" class="h-full" @click="onDelete(idx)">删除</van-button>
        </template>
      </van-swipe-cell>
    </van-cell-group>

    <!-- Skeleton 骨架屏 -->
    <van-cell-group inset class="mb-4">
      <div v-if="skeletonLoading" class="px-4 py-2">
        <van-skeleton title avatar :row="2" />
        <van-skeleton title avatar :row="2" class="mt-3" />
      </div>
      <van-cell v-else title="骨架屏示例" label="骨架加载已完成" @click="reloadSkeleton" />
    </van-cell-group>

    <!-- Empty 空状态 -->
    <van-cell-group inset class="mb-4">
      <div class="py-4">
        <van-empty description="暂无数据">
          <van-button round type="primary" class="mt-4" size="small" @click="reloadSkeleton">
            重新加载
          </van-button>
        </van-empty>
      </div>
    </van-cell-group>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { showToast } from 'vant';

definePage({
  meta: {
    title: '组件示例',
    showHeader: true,
    showFooter: true,
  },
});

const showPopup = ref(false);
const skeletonLoading = ref(true);
const swipeItems = ref(['滑动项 A', '滑动项 B', '滑动项 C']);

const onDelete = (idx: number) => {
  showToast(`已删除: ${swipeItems.value[idx]}`);
  swipeItems.value.splice(idx, 1);
};

const reloadSkeleton = () => {
  skeletonLoading.value = true;
  setTimeout(() => {
    skeletonLoading.value = false;
  }, 1500);
};
</script>
