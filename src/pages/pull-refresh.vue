<template>
  <div class="index size-full">
    <van-pull-refresh class="size-full" v-model="loading" @refresh="onRefresh">
      <p>刷新次数: {{ count }}</p>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
definePage({
  meta: {
    // layout: 'default',
    title: '下拉刷新',
    showHeader: true,
    showFooter: true,
  },
});

const count = ref(0);
const loading = ref(false);
const onRefresh = () => {
  setTimeout(() => {
    showToast('刷新成功');
    loading.value = false;
    count.value++;
  }, 1000);
};
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
