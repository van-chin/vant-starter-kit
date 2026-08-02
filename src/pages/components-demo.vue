<template>
  <div class="p-4 pb-8">
    <van-notice-bar left-icon="info-o" wrapable :scrollable="false">
      Vant 4 常用组件示例：基础、反馈、表单、展示四大类。更多场景见「示例中心」。
    </van-notice-bar>

    <!-- 基础组件 -->
    <h3 class="mt-4 mb-2 px-2 text-sm font-bold text-[var(--color-text-tertiary)]">基础组件</h3>
    <van-cell-group inset class="mb-4">
      <van-cell title="Button 按钮" label="类型 / 尺寸 / 圆角 / 加载态">
        <template #right-icon>
          <div class="flex gap-1">
            <van-button size="small" type="primary">主要</van-button>
            <van-button size="small" type="success" plain>成功</van-button>
            <van-button size="small" type="danger" plain>危险</van-button>
          </div>
        </template>
      </van-cell>
      <van-cell title="Tag 标签" label="类型 / 样式">
        <template #right-icon>
          <div class="flex gap-1">
            <van-tag type="primary">标签</van-tag>
            <van-tag type="success" plain>成功</van-tag>
            <van-tag color="#7232dd" plain>紫色</van-tag>
          </div>
        </template>
      </van-cell>
      <van-cell title="Badge 徽标" label="数字 / 红点 / 自定义内容">
        <template #right-icon>
          <div class="flex items-center gap-3">
            <van-badge :content="5"><span class="block h-6 w-6 rounded bg-gray-200" /></van-badge>
            <van-badge dot><span class="block h-6 w-6 rounded bg-gray-200" /></van-badge>
            <van-badge content="NEW"><span class="block h-6 w-6 rounded bg-gray-200" /></van-badge>
          </div>
        </template>
      </van-cell>
      <van-cell title="Icon 图标" label="内置图标库">
        <template #right-icon>
          <div class="flex gap-2">
            <van-icon name="star-o" size="18" />
            <van-icon name="fire-o" size="18" color="#ee0a24" />
            <van-icon name="chat-o" size="18" color="#1989fa" />
          </div>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 反馈组件 -->
    <h3 class="mb-2 px-2 text-sm font-bold text-[var(--color-text-tertiary)]">反馈组件</h3>
    <van-cell-group inset class="mb-4">
      <van-cell title="Toast 轻提示" is-link @click="showToast('轻提示示例')" />
      <van-cell title="Dialog 对话框" is-link @click="showDialog" />
      <van-cell title="ActionSheet 动作面板" is-link @click="showActionSheet = true" />
      <van-cell title="Popup 弹出层" is-link @click="showPopup = true" />
    </van-cell-group>

    <!-- 表单组件 -->
    <h3 class="mb-2 px-2 text-sm font-bold text-[var(--color-text-tertiary)]">表单组件</h3>
    <van-cell-group inset class="mb-4">
      <van-cell title="Switch 开关" label="布尔值切换">
        <template #right-icon>
          <van-switch v-model="demoSwitch" size="20px" />
        </template>
      </van-cell>
      <van-cell title="Stepper 步进器" label="数量增减">
        <template #right-icon>
          <van-stepper v-model="demoCount" min="0" max="99" />
        </template>
      </van-cell>
      <van-cell title="Rate 评分" label="星级评分">
        <template #right-icon>
          <van-rate v-model="demoRate" />
        </template>
      </van-cell>
      <van-cell title="Slider 滑块" label="范围选择">
        <template #right-icon>
          <div class="w-28">
            <van-slider v-model="demoSlider" :min="0" :max="100" />
          </div>
        </template>
      </van-cell>
    </van-cell-group>

    <!-- 展示组件 -->
    <h3 class="mb-2 px-2 text-sm font-bold text-[var(--color-text-tertiary)]">展示组件</h3>
    <van-cell-group inset class="mb-4">
      <van-cell title="Image 图片" label="圆形 / 懒加载 / 失败占位">
        <template #right-icon>
          <van-image
            width="40"
            height="40"
            round
            fit="cover"
            src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
          />
        </template>
      </van-cell>
      <van-cell title="Progress 进度条" label="展示进度">
        <template #right-icon>
          <div class="w-28">
            <van-progress :percentage="demoProgress" stroke-width="6" color="#1989fa" />
          </div>
        </template>
      </van-cell>
      <van-cell title="Empty 空状态" is-link @click="showEmpty = true" />
      <van-cell title="Skeleton 骨架屏" is-link @click="reloadSkeleton" />
    </van-cell-group>

    <!-- 滑动操作 -->
    <h3 class="mb-2 px-2 text-sm font-bold text-[var(--color-text-tertiary)]">滑动操作</h3>
    <van-cell-group inset class="mb-4">
      <van-swipe-cell v-for="(item, idx) in swipeItems" :key="idx">
        <van-cell :title="item" value="左滑试试" />
        <template #right>
          <van-button square type="danger" class="h-full" @click="onDelete(idx)">删除</van-button>
        </template>
      </van-swipe-cell>
    </van-cell-group>

    <!-- 骨架屏 -->
    <div v-if="skeletonLoading" class="px-4 py-2">
      <van-skeleton title avatar :row="2" />
      <van-skeleton title avatar :row="2" class="mt-3" />
    </div>

    <!-- Popup -->
    <van-popup v-model:show="showPopup" round position="bottom" :style="{ height: '40%' }">
      <div class="p-6">
        <h3 class="mb-2 text-base font-bold text-[var(--color-text-primary)]">底部弹出面板</h3>
        <p class="text-sm text-[var(--color-text-secondary)]">
          常用于操作菜单、筛选条件、表单填写等场景。
        </p>
        <van-button class="mt-4" block @click="showPopup = false">关闭</van-button>
      </div>
    </van-popup>

    <!-- ActionSheet -->
    <van-action-sheet
      v-model:show="showActionSheet"
      :actions="actions"
      cancel-text="取消"
      @select="onSelectAction"
    />

    <!-- Empty 弹层 -->
    <van-popup v-model:show="showEmpty" round>
      <div class="w-72 py-6">
        <van-empty description="暂无数据">
          <van-button round type="primary" class="mt-4" size="small" @click="reloadSkeleton">
            重新加载
          </van-button>
        </van-empty>
      </div>
    </van-popup>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { showConfirmDialog, showToast } from 'vant';

definePage({
  meta: {
    title: '组件示例',
    showHeader: true,
    showFooter: true,
  },
});

const showPopup = ref(false);
const showActionSheet = ref(false);
const showEmpty = ref(false);
const skeletonLoading = ref(true);
const swipeItems = ref(['滑动项 A', '滑动项 B', '滑动项 C']);
const demoSwitch = ref(true);
const demoCount = ref(1);
const demoRate = ref(4);
const demoSlider = ref(60);
const demoProgress = ref(72);

const actions = [
  { name: '复制链接' },
  { name: '分享给好友', subname: '通过微信 / QQ / 微博' },
  { name: '删除', color: '#ee0a24' },
];

const onDelete = (idx: number) => {
  showToast(`已删除: ${swipeItems.value[idx]}`);
  swipeItems.value.splice(idx, 1);
};

const onSelectAction = (action: { name: string }) => {
  showToast(`选择了：${action.name}`);
};

const showDialog = async () => {
  await showConfirmDialog({
    title: '标题',
    message: '这是一个 Dialog 对话框示例',
  });
  showToast('已确认');
};

const reloadSkeleton = () => {
  skeletonLoading.value = true;
  setTimeout(() => {
    skeletonLoading.value = false;
  }, 1500);
};
</script>
