<template>
  <div class="category-page flex h-full overflow-hidden bg-[var(--color-bg-page)]">
    <!-- 左侧分类导航 -->
    <van-sidebar v-model="activeIndex" class="w-[90px] shrink-0 bg-[var(--color-bg-elevated)]">
      <van-sidebar-item
        v-for="(cat, i) in categories"
        :key="cat.id"
        :title="cat.name"
        :badge="cat.badge || undefined"
        @click="onSelectCategory(i)"
      />
    </van-sidebar>

    <!-- 右侧商品列表 -->
    <div class="flex-1 overflow-y-auto">
      <div class="grid grid-cols-2 gap-2 p-2">
        <div
          v-for="product in activeProducts"
          :key="product.id"
          class="overflow-hidden rounded-lg bg-[var(--color-bg-surface)] p-2 shadow-sm"
          @click="onGoProduct"
        >
          <div
            class="mb-2 flex h-28 items-center justify-center rounded bg-[var(--color-bg-page)] text-4xl"
          >
            {{ product.emoji }}
          </div>
          <div class="truncate text-sm font-medium text-[var(--color-text-primary)]">
            {{ product.name }}
          </div>
          <div class="mt-1 flex items-center justify-between">
            <span class="text-sm font-bold text-red-500">&yen;{{ product.price }}</span>
            <van-button size="mini" type="primary" round @click.stop="addToCart(product)">
              加购
            </van-button>
          </div>
        </div>
      </div>

      <van-empty v-if="activeProducts.length === 0" description="该分类暂无商品" class="py-12" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { CartItem } from '@/stores/cart';

definePage({
  meta: {
    title: '分类',
    showHeader: true,
    showFooter: true,
  },
});

const router = useRouter();
const cartStore = useCartStore();
const activeIndex = ref(0);

interface Category {
  id: string;
  name: string;
  badge?: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  emoji: string;
  category: string;
}

const categories: Category[] = [
  { id: 'hot', name: '热门', badge: 3 },
  { id: 'yoga', name: '瑜伽' },
  { id: 'fitness', name: '健身' },
  { id: 'meditation', name: '冥想', badge: 1 },
  { id: 'diet', name: '轻食' },
  { id: 'gear', name: '装备' },
  { id: 'courses', name: '课程' },
];

const products: Product[] = [
  { id: 'p1', name: '瑜伽垫 防滑加厚', price: 129, emoji: '🧘', category: 'yoga' },
  { id: 'p2', name: '瑜伽服套装', price: 199, emoji: '👕', category: 'yoga' },
  { id: 'p3', name: '弹力带 五件套', price: 39, emoji: '🎗️', category: 'fitness' },
  { id: 'p4', name: '泡沫轴 放松筋膜', price: 59, emoji: '🛢️', category: 'fitness' },
  { id: 'p5', name: '冥想坐垫 记忆棉', price: 89, emoji: '🛋️', category: 'meditation' },
  { id: 'p6', name: '檀香线香 冥想用', price: 45, emoji: '🕯️', category: 'meditation' },
  { id: 'p7', name: '牛油果沙拉餐盒', price: 32, emoji: '🥗', category: 'diet' },
  { id: 'p8', name: '奇亚籽燕麦杯', price: 18, emoji: '🥣', category: 'diet' },
  { id: 'p9', name: '运动水壶 750ml', price: 49, emoji: '🍶', category: 'gear' },
  { id: 'p10', name: '速干毛巾 运动款', price: 29, emoji: '🧻', category: 'gear' },
  { id: 'p11', name: '新手瑜伽入门课', price: 299, emoji: '📚', category: 'courses' },
  { id: 'p12', name: '冥想 21 天挑战', price: 199, emoji: '🌙', category: 'courses' },
];

const activeProducts = computed(() => {
  const active = categories[activeIndex.value];
  if (!active) return [];
  return active.id === 'hot'
    ? products.slice(0, 6)
    : products.filter((p) => p.category === active.id);
});

const onSelectCategory = (index: number) => {
  activeIndex.value = index;
};

const addToCart = (product: Product) => {
  cartStore.add({
    id: product.id,
    name: product.name,
    price: product.price,
    count: 1,
    thumb: product.emoji,
  } satisfies CartItem);
};

const onGoProduct = () => {
  router.push('/good');
};
</script>
