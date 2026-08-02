<template>
  <div class="feedback-demo-page px-4 py-4 pb-8">
    <van-notice-bar left-icon="info-o" wrapable :scrollable="false">
      反馈组件示例：Toast / Dialog / Notify / ActionSheet / ShareSheet / Popup。
    </van-notice-bar>

    <van-cell-group inset class="mt-4">
      <van-cell title="Toast 轻提示" label="成功 / 失败 / 加载中" is-link @click="onToast" />
      <van-cell title="Dialog 对话框" label="确认 / 提示 / 自定义按钮" is-link @click="onDialog" />
      <van-cell title="Notify 通知" label="顶部横幅通知" is-link @click="onNotify" />
      <van-cell
        title="ActionSheet 动作面板"
        label="底部操作菜单"
        is-link
        @click="showActionSheet = true"
      />
      <van-cell
        title="ShareSheet 分享面板"
        label="社交分享菜单"
        is-link
        @click="showShareSheet = true"
      />
      <van-cell
        title="Popup + Field 弹层"
        label="组合示例：编辑昵称"
        is-link
        @click="showPopup = true"
      />
    </van-cell-group>

    <van-action-sheet
      v-model:show="showActionSheet"
      :actions="actions"
      cancel-text="取消"
      description="选择操作"
      @select="onSelectAction"
    />

    <van-share-sheet
      v-model:show="showShareSheet"
      title="立即分享给好友"
      :options="shareOptions"
      @select="onShare"
    />

    <van-popup v-model:show="showPopup" position="bottom" round :style="{ padding: '24px 16px' }">
      <h3 class="mb-4 text-base font-bold">编辑昵称</h3>
      <van-field
        v-model="nickname"
        placeholder="请输入新昵称"
        clearable
        class="rounded-lg bg-[var(--color-bg-page)]"
      />
      <van-button round block type="primary" class="mt-4" @click="onSaveNickname">保存</van-button>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { showConfirmDialog, showDialog, showNotify, showSuccessToast, showToast } from 'vant';

definePage({
  meta: {
    title: '反馈组件示例',
    showHeader: true,
    showFooter: true,
  },
});

const showActionSheet = ref(false);
const showShareSheet = ref(false);
const showPopup = ref(false);
const nickname = ref('');

const actions = [
  { name: '编辑资料', subname: '修改头像与昵称' },
  { name: '设置隐私', subname: '管理可见范围' },
  { name: '退出登录', color: '#ee0a24' },
];

const shareOptions = [
  { name: '微信', icon: 'wechat' },
  { name: '朋友圈', icon: 'wechat-moments' },
  { name: 'QQ', icon: 'qq' },
  { name: '微博', icon: 'weibo' },
  { name: '复制链接', icon: 'link' },
];

const onToast = () => {
  showSuccessToast('操作成功');
  setTimeout(() => showToast({ type: 'fail', message: '演示：失败提示' }), 300);
};

const onDialog = async () => {
  await showConfirmDialog({
    title: '确认删除',
    message: '删除后不可恢复，确定继续吗？',
    confirmButtonColor: '#ee0a24',
  });
  showSuccessToast('已确认');
};

const onNotify = () => {
  showNotify({ type: 'primary', message: '演示：顶部通知横幅', duration: 1500 });
};

const onSelectAction = (action: { name: string }) => {
  showToast(`选择了：${action.name}`);
};

const onShare = (option: { name: string }) => {
  showToast(`分享到：${option.name}`);
  showShareSheet.value = false;
};

const onSaveNickname = () => {
  if (!nickname.value.trim()) {
    showToast('昵称不能为空');
    return;
  }
  showPopup.value = false;
  showSuccessToast(`昵称已更新为：${nickname.value}`);
  nickname.value = '';
};

// 确保 showDialog 引用（仅用于演示按钮完整性）
void showDialog;
</script>
