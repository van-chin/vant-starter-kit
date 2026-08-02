<template>
  <page>
    <template #header>
      <van-nav-bar
        left-arrow
        title="商品详情"
        right-text="分享"
        @click-left="router.back()"
        @click-right="onShare"
      />
    </template>

    <div class="good-page bg-[var(--color-bg-page)]">
      <!-- 商品轮播 -->
      <van-swipe class="h-72 bg-[var(--color-bg-elevated)]" indicator-color="white">
        <van-swipe-item
          v-for="(img, i) in product.images"
          :key="i"
          class="flex items-center justify-center text-7xl"
        >
          {{ img }}
        </van-swipe-item>
      </van-swipe>

      <!-- 价格区 -->
      <div class="bg-[var(--color-bg-surface)] px-4 py-3">
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-bold text-red-500">&yen;{{ product.price }}</span>
          <span class="text-sm text-[var(--color-text-tertiary)] line-through">
            &yen;{{ product.originalPrice }}
          </span>
          <van-tag type="danger" plain class="ml-auto">限时 8 折</van-tag>
        </div>
        <h1 class="mt-2 text-base font-semibold text-[var(--color-text-primary)]">
          {{ product.name }}
        </h1>
        <p class="mt-1 text-sm text-[var(--color-text-secondary)]">{{ product.desc }}</p>
      </div>

      <!-- 规格选择 -->
      <van-cell-group inset class="mt-3">
        <van-cell title="规格" :value="selectedSpec" is-link @click="showSpec = true" />
        <van-cell title="数量" :value="`${count} 件`">
          <template #right-icon>
            <van-stepper v-model="count" min="1" max="99" />
          </template>
        </van-cell>
      </van-cell-group>

      <!-- 图文详情 -->
      <van-cell-group inset class="mt-3">
        <van-cell title="图文详情" />
      </van-cell-group>
      <div class="px-4 py-4">
        <div
          class="rounded-xl bg-[var(--color-bg-surface)] p-4 text-sm leading-6 text-[var(--color-text-secondary)]"
        >
          <p class="mb-2 text-base font-semibold text-[var(--color-text-primary)]">产品亮点</p>
          <p>· 环保材质，天然亲肤，适合敏感肌</p>
          <p>· 人体工学设计，久练不累</p>
          <p>· 附带 7 天入门训练计划</p>
          <p>· 支持 7 天无理由退换</p>
        </div>
      </div>
    </div>

    <template #footer>
      <van-action-bar placeholder>
        <van-action-bar-icon icon="chat-o" text="客服" @click="onService" />
        <van-action-bar-icon
          icon="cart-o"
          :text="`购物车 ${cartStore.totalCount}`"
          @click="router.push('/cart')"
        />
        <van-action-bar-icon icon="star-o" text="收藏" @click="onCollect" />
        <van-action-bar-button type="warning" text="加入购物车" @click="onAddCart" />
        <van-action-bar-button type="danger" text="立即购买" @click="onBuyNow" />
      </van-action-bar>
    </template>

    <!-- 规格弹层 -->
    <van-popup v-model:show="showSpec" position="bottom" round>
      <div class="p-6">
        <h3 class="mb-4 text-base font-bold text-[var(--color-text-primary)]">选择规格</h3>
        <div class="flex flex-wrap gap-2">
          <van-button
            v-for="spec in product.specs"
            :key="spec"
            :type="selectedSpec === spec ? 'primary' : 'default'"
            size="small"
            round
            plain
            @click="selectedSpec = spec"
          >
            {{ spec }}
          </van-button>
        </div>
        <van-button round block type="primary" class="mt-6" @click="showSpec = false"
          >确定</van-button
        >
      </div>
    </van-popup>
  </page>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { showToast } from 'vant';

definePage({
  meta: {
    title: '商品详情',
    showHeader: false,
    showFooter: false,
  },
});

const router = useRouter();
const cartStore = useCartStore();

const product = reactive({
  name: '超柔瑜伽垫 防滑加厚 8mm',
  desc: 'TPE 环保材质 · 双面防滑 · 附训练计划',
  price: 129,
  originalPrice: 159,
  images: ['🧘', '🌿', '✨'],
  specs: ['标准款 8mm', '加厚款 12mm', '便携款 5mm'],
});

const selectedSpec = ref(product.specs[0] ?? '标准款 8mm');
const count = ref(1);
const showSpec = ref(false);

const onShare = () => showToast('分享功能示例');
const onService = () => showToast('客服功能示例');
const onCollect = () => showToast('已加入收藏');

const onAddCart = () => {
  cartStore.add({
    id: 'good-001',
    name: `${product.name}（${selectedSpec.value}）`,
    price: product.price,
    count: count.value,
    thumb: product.images[0],
  });
};

const onBuyNow = () => {
  onAddCart();
  router.push('/cart');
};
</script>
