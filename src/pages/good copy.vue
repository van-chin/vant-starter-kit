<template>
  <van-sticky>
    <van-nav-bar title="标题" left-arrow @click-left="onClickLeft" />
  </van-sticky>
  <van-button type="primary">主要按钮</van-button>
  <van-button type="success">成功按钮</van-button>

  <div class="bd-red h-1000">good 234</div>

  <Department></Department>
  <div class="px-2">
    <div class="bd-red">bottom</div>
  </div>

  <van-action-bar>
    <van-action-bar-icon icon="chat-o" text="客服" @click="onClickIcon" />
    <van-action-bar-icon icon="cart-o" text="购物车" @click="onClickIcon" />
    <van-action-bar-icon icon="shop-o" text="店铺" @click="onClickIcon" />
    <van-action-bar-button type="danger" text="立即购买" @click="onClickButton" />
  </van-action-bar>
</template>

<script setup lang="ts">
// import { showToast } from 'vant';
definePage({
  meta: {
    layout: 'default',
    title: '商品明细',
    showHeader: false,
    showFooter: false,
  },
});

const onClickIcon = () => showToast('点击图标');
const onClickButton = () => showToast('点击按钮');
const onClickLeft = () => history.back();
</script>

<style scoped></style>
