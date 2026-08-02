<template>
  <div class="examples-page px-4 py-4 pb-8">
    <div class="mb-4">
      <h1 class="text-xl font-bold text-[var(--color-text-primary)]">示例中心</h1>
      <p class="mt-1 text-sm text-[var(--color-text-secondary)]">
        Starter Kit 提供 18+ 个示例页面，覆盖布局、表单、反馈、请求、主题等移动端常见场景。
      </p>
    </div>

    <template v-for="group in groups" :key="group.title">
      <van-cell-group inset class="mb-4">
        <van-cell :title="group.title" class="!bg-transparent" />
        <van-cell
          v-for="item in group.items"
          :key="item.path"
          :title="item.title"
          :label="item.desc"
          is-link
          :to="item.path"
        >
          <template #icon>
            <span class="mr-2 text-lg">{{ item.icon }}</span>
          </template>
        </van-cell>
      </van-cell-group>
    </template>
  </div>
</template>

<script setup lang="ts">
interface ExampleItem {
  title: string;
  desc: string;
  path: string;
  icon: string;
}

interface ExampleGroup {
  title: string;
  items: ExampleItem[];
}

definePage({
  meta: {
    title: '示例中心',
    showHeader: true,
    showFooter: true,
  },
});

const groups: ExampleGroup[] = [
  {
    title: '📱 布局与导航',
    items: [
      {
        title: '首页（Tabbar）',
        desc: 'App Shell + 商品网格 + Skeleton + 加购',
        path: '/',
        icon: '🏠',
      },
      {
        title: '分类页',
        desc: '左侧分类导航 + 右侧商品列表',
        path: '/categories',
        icon: '🗂️',
      },
      {
        title: '种草社区',
        desc: '卡片 Feed 流 + 点赞收藏互动',
        path: '/seed',
        icon: '🌱',
      },
      {
        title: '购物车',
        desc: 'Cart Store + SwipeCell + SubmitBar',
        path: '/cart',
        icon: '🛒',
      },
      {
        title: '我的',
        desc: '深色模式切换 + 功能入口',
        path: '/my',
        icon: '👤',
      },
      {
        title: '测试页（自定义 Header/Footer）',
        desc: '布局组件替换 + 显隐控制演示',
        path: '/test',
        icon: '🧪',
      },
    ],
  },
  {
    title: '🎨 业务页面',
    items: [
      {
        title: '商品详情',
        desc: '轮播 + 规格选择 + 数量步进 + ActionBar',
        path: '/good',
        icon: '📦',
      },
      {
        title: '文章列表',
        desc: 'PullRefresh + List 无限滚动',
        path: '/list',
        icon: '📰',
      },
      {
        title: '文章详情',
        desc: '路由嵌套示例（detail/index）',
        path: '/detail',
        icon: '📄',
      },
      {
        title: '登录页',
        desc: '表单验证 + Auth Store + 路由守卫',
        path: '/login',
        icon: '🔐',
      },
      {
        title: '登录页（Figma 还原）',
        desc: 'Yoga App Login 设计稿完整还原 + 多屏适配',
        path: '/login-oths',
        icon: '🎨',
      },
      {
        title: '数据大屏',
        desc: 'Screen 布局 + 深色全屏仪表盘',
        path: '/screen',
        icon: '📊',
      },
      {
        title: '管理后台',
        desc: 'Admin 布局 + 可折叠侧边栏',
        path: '/admin',
        icon: '🛠️',
      },
    ],
  },
  {
    title: '🧩 组件与能力',
    items: [
      {
        title: 'Vant 组件示例',
        desc: 'Popup / SwipeCell / Skeleton / Empty 等',
        path: '/components-demo',
        icon: '🧩',
      },
      {
        title: '表单示例',
        desc: 'Field / Picker / Uploader / 校验规则',
        path: '/examples/form',
        icon: '📝',
      },
      {
        title: '反馈组件',
        desc: 'Toast / Dialog / ActionSheet / Notify',
        path: '/examples/feedback',
        icon: '💬',
      },
      {
        title: '下拉刷新',
        desc: 'PullRefresh 基础用法',
        path: '/pull-refresh',
        icon: '🔄',
      },
    ],
  },
];
</script>
