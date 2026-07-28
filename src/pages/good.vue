<template>
  <page>
    <template #header>
      <van-nav-bar
        left-text="返回"
        right-text="分享"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
      >
        <template #title>
          <van-tabs>
            <van-tab title="详情11"></van-tab>
            <van-tab title="参数"></van-tab>
            <van-tab title="评论"></van-tab>
          </van-tabs>
        </template>
      </van-nav-bar>
    </template>

    <div>
      <div class="bd-red">sss</div>
      <div>
        <van-button type="primary">主要按钮</van-button>
        <van-button type="success">成功按钮</van-button>
      </div>
      <div class="px-2">
        <div class="bd-red h-1000">ss</div>
      </div>

      <div class="bd-red">sss</div>
    </div>

    <template #footer>
      <van-action-bar placeholder>
        <van-action-bar-icon icon="chat-o" text="客服" @click="onClickIcon" />
        <van-action-bar-icon icon="cart-o" text="购物车" @click="onClickIcon" />
        <van-action-bar-icon icon="shop-o" text="店铺" @click="onClickIcon" />
        <van-action-bar-button type="danger" text="立即购买" @click="onClickButton" />
      </van-action-bar>
    </template>
  </page>
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

const active = ref(0);

const onClickIcon = () => showToast('点击图标');
const onClickButton = () => showToast('点击按钮');
const onClickRight = () => showToast('按钮');
const onClickLeft = () => history.back();
</script>

<style scoped></style>
