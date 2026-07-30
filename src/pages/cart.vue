<template>
  <div class="cart-page p-4">
    <!-- 购物车为空 -->
    <van-empty v-if="cartStore.isEmpty" description="购物车是空的">
      <van-button round type="primary" to="/" class="mt-4">去逛逛</van-button>
    </van-empty>

    <!-- 购物车列表 -->
    <template v-else>
      <van-swipe-cell v-for="item in cartStore.items" :key="item.id">
        <div class="flex items-center gap-3 border-b border-gray-100 p-3">
          <div class="h-16 w-16 rounded bg-gray-200"></div>
          <div class="flex-1">
            <div class="text-sm font-medium">{{ item.name }}</div>
            <div class="mt-1 text-xs text-gray-500">&yen;{{ item.price }}</div>
          </div>
          <div class="flex items-center gap-2">
            <van-button size="small" @click="cartStore.updateCount(item.id, item.count - 1)"
              >-</van-button
            >
            <span class="w-6 text-center text-sm">{{ item.count }}</span>
            <van-button size="small" @click="cartStore.updateCount(item.id, item.count + 1)"
              >+</van-button
            >
          </div>
        </div>
        <template #right>
          <van-button square type="danger" class="h-full" @click="cartStore.remove(item.id)"
            >删除</van-button
          >
        </template>
      </van-swipe-cell>

      <!-- 底部结算栏 -->
      <van-submit-bar :price="cartStore.totalPrice * 100" button-text="去结算" @submit="onCheckout">
        <van-checkbox v-model="checked">全选</van-checkbox>
      </van-submit-bar>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { showToast } from 'vant';

definePage({
  meta: {
    title: '购物车',
    showHeader: true,
    showFooter: true,
  },
});

const cartStore = useCartStore();
const checked = ref(true);

const onCheckout = () => {
  showToast('结算功能开发中');
};
</script>
