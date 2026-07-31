<template>
  <div class="index">
    <!-- Banner -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for="n in 4" :key="n">{{ n }}</van-swipe-item>
    </van-swipe>

    <!-- Skeleton 加载演示 -->
    <div v-if="loading" class="p-4">
      <van-skeleton title avatar :row="3" />
      <van-skeleton title avatar :row="3" class="mt-4" />
      <van-skeleton title avatar :row="3" class="mt-4" />
    </div>

    <!-- 商品列表 -->
    <div v-else class="grid grid-cols-2 gap-2 p-2">
      <div
        v-for="product in products"
        :key="product.id"
        class="overflow-hidden rounded-lg bg-white p-2 shadow-sm dark:bg-gray-800"
      >
        <div
          class="mb-2 flex h-32 items-center justify-center rounded bg-gray-100 text-3xl text-gray-400 dark:bg-gray-700 dark:text-gray-500"
        >
          {{ product.emoji }}
        </div>
        <div class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ product.name }}</div>
        <div class="mt-1 flex items-center justify-between">
          <span class="text-sm font-bold text-red-500 dark:text-red-400"
            >&yen;{{ product.price }}</span
          >
          <van-button size="small" type="primary" @click="addToCart(product)"> 加购 </van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { showToast } from 'vant';
import type { CartItem } from '@/stores/cart';

definePage({
  meta: {
    showHeader: false,
    showFooter: true,
  },
});

const cartStore = useCartStore();
const { loading, withLoading } = useLoading();

/** 演示用商品数据 */
interface Product {
  id: string;
  name: string;
  price: number;
  emoji: string;
}

const products = ref<Product[]>([]);

const addToCart = (product: Product) => {
  cartStore.add({ id: product.id, name: product.name, price: product.price, count: 1 });
};

// 模拟首次加载
withLoading(async () => {
  await new Promise((r) => setTimeout(r, 2000));
  products.value = [
    { id: '1', name: 'iPhone 16 Pro', price: 7999, emoji: '📱' },
    { id: '2', name: 'MacBook Air M4', price: 8999, emoji: '💻' },
    { id: '3', name: 'AirPods Pro 3', price: 1999, emoji: '🎧' },
    { id: '4', name: 'Apple Watch Ultra', price: 5999, emoji: '⌚' },
    { id: '5', name: 'iPad Pro M4', price: 6799, emoji: '📲' },
    { id: '6', name: 'Vision Pro', price: 29999, emoji: '🥽' },
  ];
});
</script>

<style scoped>
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  line-height: 150px;
  text-align: center;
  background-color: #39a9ed;
}
</style>
