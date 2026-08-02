<template>
  <div class="admin-page">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">仪表盘</h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">欢迎回来，今天是 {{ today }}</p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-500 dark:text-gray-400">{{ stat.label }}</span>
          <span class="text-xl">{{ stat.icon }}</span>
        </div>
        <p class="mt-2 text-2xl font-bold text-gray-800 dark:text-gray-100">
          {{ stat.value.toLocaleString() }}
        </p>
        <p class="mt-1 text-xs" :class="stat.up ? 'text-green-500' : 'text-red-500'">
          {{ stat.up ? '▲' : '▼' }} {{ stat.delta }}% 较上周
        </p>
      </div>
    </div>

    <!-- 最近订单 + 用户列表 -->
    <div class="mt-6 grid gap-6 lg:grid-cols-2">
      <!-- 最近订单 -->
      <div
        class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <h2 class="mb-3 text-base font-semibold text-gray-800 dark:text-gray-100">最近订单</h2>
        <div class="space-y-3">
          <div
            v-for="order in orders"
            :key="order.id"
            class="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-700/50"
          >
            <div>
              <div class="text-sm font-medium text-gray-700 dark:text-gray-200">
                {{ order.user }}
              </div>
              <div class="text-xs text-gray-400">{{ order.id }} · {{ order.time }}</div>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">
                &yen;{{ order.amount }}
              </span>
              <van-tag :type="order.status === '已完成' ? 'success' : 'warning'" plain>
                {{ order.status }}
              </van-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- 用户列表 -->
      <div
        class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <h2 class="mb-3 text-base font-semibold text-gray-800 dark:text-gray-100">活跃用户</h2>
        <van-cell-group>
          <van-cell v-for="user in users" :key="user.id" :title="user.name" :label="user.email">
            <template #icon>
              <div
                class="mr-2 flex h-8 w-8 items-center justify-center rounded-full text-sm"
                :class="user.bg"
              >
                {{ user.avatar }}
              </div>
            </template>
            <template #value>
              <van-tag :type="user.active ? 'success' : 'default'" plain>
                {{ user.active ? '在线' : '离线' }}
              </van-tag>
            </template>
          </van-cell>
        </van-cell-group>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';

defineOptions({ name: 'PageAdmin' });
definePage({
  meta: {
    layout: 'admin',
    title: '管理后台',
  },
});

const today = dayjs().format('YYYY-MM-DD dddd');

const stats = [
  { label: '今日订单', value: 3291, icon: '📦', up: true, delta: 12.5 },
  { label: '新增用户', value: 1247, icon: '👥', up: true, delta: 8.2 },
  { label: '销售额', value: 98200, icon: '💰', up: true, delta: 5.6 },
  { label: '退款率', value: 1.8, icon: '⚠️', up: false, delta: 0.4 },
];

const orders = [
  { id: 'ORD-20260802-001', user: '张小明', amount: 259, time: '10:32', status: '已完成' },
  { id: 'ORD-20260802-002', user: '李梅', amount: 129, time: '10:18', status: '已完成' },
  { id: 'ORD-20260802-003', user: '王强', amount: 388, time: '09:55', status: '待发货' },
  { id: 'ORD-20260802-004', user: '陈静', amount: 76, time: '09:40', status: '已完成' },
];

const users = [
  {
    id: 'u1',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    avatar: '👩‍💻',
    bg: 'bg-purple-100',
    active: true,
  },
  {
    id: 'u2',
    name: 'Linus Torvalds',
    email: 'linus@example.com',
    avatar: '🧑‍💻',
    bg: 'bg-sky-100',
    active: true,
  },
  {
    id: 'u3',
    name: 'Grace Hopper',
    email: 'grace@example.com',
    avatar: '👵',
    bg: 'bg-pink-100',
    active: false,
  },
  {
    id: 'u4',
    name: 'Ken Thompson',
    email: 'ken@example.com',
    avatar: '🧙',
    bg: 'bg-amber-100',
    active: true,
  },
];
</script>
