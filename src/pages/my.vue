<template>
  <div class="index">
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item>1</van-swipe-item>
      <van-swipe-item>2</van-swipe-item>
      <van-swipe-item>3</van-swipe-item>
      <van-swipe-item>4</van-swipe-item>
    </van-swipe>
    <div class="py-2">
      <van-cell-group inset>
        <van-cell title="单元格" value="我是新修改的内容" />
        <van-cell title="商品详细示例页面" is-link to="/good" />
      </van-cell-group>
    </div>

    <div class="py-2">
      <van-cell-group inset>
        <van-cell title="单元格" value="我是新修改的内容" />
        <van-cell title="单元格" value="xxxx" is-link to="/categories" />
      </van-cell-group>
    </div>

    <div class="p-4">
      <van-button type="default" block>退出登录</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePage({
  meta: {
    // layout: 'default',
    title: '我的',
    showHeader: true,
    showFooter: true,
  },
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
