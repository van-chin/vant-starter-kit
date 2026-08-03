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
        <van-cell title="深色模式">
          <template #right-icon>
            <van-switch :model-value="isDark" size="18px" @click="toggleDark()" />
          </template>
        </van-cell>
        <van-cell title="多语文" is-link value="简体中文" @click="onSwitchLocale" />
      </van-cell-group>
    </div>
    <div class="py-2">
      <van-cell-group inset>
        <van-cell title="示例中心" value="18+ 示例页面" is-link to="/examples" />
        <van-cell title="登录页 (Figma 还原)" value="/login-oths" is-link to="/login-oths" />
        <van-cell title="商品详情示例" is-link to="/good" />
        <van-cell title="表单示例" is-link to="/examples/form" />
        <van-cell title="反馈组件示例" is-link to="/examples/feedback" />
      </van-cell-group>
    </div>

    <div class="py-2">
      <van-cell-group inset>
        <van-cell title="下拉刷新" value="🔄" is-link to="/pull-refresh" />
        <van-cell title="列表" value="示例" is-link to="/list" />
        <van-cell title="Vant 组件示例" value="🧩" is-link to="/components-demo" />
        <van-cell title="数据大屏vvvv" value="📊" is-link to="/screen" />
        <van-cell title="管理后台-123" value="🛠️" is-link to="/admin" />
      </van-cell-group>
    </div>

    <div class="p-4">
      <van-button type="default" block @click="onLogout">退出登录</van-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { showToast } from 'vant';

definePage({
  meta: {
    // layout: 'default',
    title: '我的',
    showHeader: true,
    showFooter: true,
  },
});

const isDark = useDark();
const toggleDark = useToggle(isDark);
const router = useRouter();
const authStore = useAuthStore();
const appStore = useAppStore();
const { locale, t } = useI18n();

const onSwitchLocale = () => {
  const next = locale.value === 'zh-CN' ? 'en' : 'zh-CN';
  appStore.setLocale(next);
  locale.value = next;
  showToast(t('my.language'));
};

const onLogout = () => {
  authStore.logout();
  showToast('已退出登录');
  router.push('/login');
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
