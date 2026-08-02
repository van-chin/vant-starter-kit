<template>
  <div class="screen-page">
    <!-- 指标卡 -->
    <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-lg border border-gray-700 bg-gray-900 p-4"
      >
        <h3 class="text-sm text-gray-400">{{ stat.label }}</h3>
        <p class="mt-2 text-3xl font-bold" :class="stat.color">{{ stat.value }}</p>
        <p class="mt-1 text-xs text-gray-500">{{ stat.note }}</p>
      </div>
    </div>

    <!-- 图表区 -->
    <div class="mt-4 grid gap-4 lg:grid-cols-3">
      <!-- 趋势折线（CSS 模拟） -->
      <div class="rounded-lg border border-gray-700 bg-gray-900 p-4 lg:col-span-2">
        <h3 class="mb-3 text-sm text-gray-400">近 7 日访问趋势</h3>
        <div class="flex h-40 items-end gap-2">
          <div v-for="(bar, i) in trend" :key="i" class="flex flex-1 flex-col items-center gap-1">
            <span class="text-xs text-gray-500">{{ bar.value }}k</span>
            <div
              class="w-full rounded-t bg-gradient-to-t from-cyan-600 to-cyan-400"
              :style="{ height: `${bar.height}%` }"
            />
            <span class="text-xs text-gray-500">{{ bar.day }}</span>
          </div>
        </div>
      </div>

      <!-- 环形占比（CSS 模拟） -->
      <div class="rounded-lg border border-gray-700 bg-gray-900 p-4">
        <h3 class="mb-3 text-sm text-gray-400">流量来源</h3>
        <div class="flex items-center justify-center">
          <div class="relative flex h-32 w-32 items-center justify-center">
            <div
              class="absolute inset-0 rounded-full"
              style="
                background: conic-gradient(
                  #22d3ee 0 45%,
                  #a78bfa 45% 73%,
                  #34d399 73% 90%,
                  #fbbf24 90% 100%
                );
              "
            ></div>
            <div
              class="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-gray-900"
            >
              <span class="text-xl font-bold text-white">100%</span>
              <span class="text-xs text-gray-500">总计</span>
            </div>
          </div>
        </div>
        <div class="mt-4 space-y-2">
          <div v-for="src in sources" :key="src.name" class="flex items-center gap-2 text-sm">
            <span class="h-2 w-2 rounded-full" :style="{ background: src.color }"></span>
            <span class="text-gray-400">{{ src.name }}</span>
            <span class="ml-auto text-gray-300">{{ src.value }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 实时列表 -->
    <div class="mt-4 rounded-lg border border-gray-700 bg-gray-900 p-4">
      <h3 class="mb-3 text-sm text-gray-400">实时动态</h3>
      <div class="space-y-2">
        <div v-for="(log, i) in logs" :key="i" class="flex items-center gap-3 text-sm">
          <span class="w-16 shrink-0 text-xs text-gray-500">{{ log.time }}</span>
          <span class="truncate text-gray-300">{{ log.text }}</span>
          <van-tag :type="log.type" plain class="ml-auto shrink-0">{{ log.tag }}</van-tag>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'PageScreen' });
definePage({
  meta: {
    layout: 'screen',
  },
});

const stats = [
  { label: '在线用户', value: '12,847', color: 'text-cyan-400', note: '峰值 15,320' },
  { label: '今日订单', value: '3,291', color: 'text-green-400', note: '较昨日 +8.2%' },
  { label: '系统负载', value: '67%', color: 'text-amber-400', note: 'CPU 4 核平均' },
  { label: '接口成功率', value: '99.98%', color: 'text-blue-400', note: '近 1 小时' },
];

const trend = [
  { day: '周一', value: 12, height: 45 },
  { day: '周二', value: 18, height: 60 },
  { day: '周三', value: 15, height: 52 },
  { day: '周四', value: 22, height: 72 },
  { day: '周五', value: 28, height: 88 },
  { day: '周六', value: 25, height: 80 },
  { day: '周日', value: 30, height: 96 },
];

const sources = [
  { name: '自然搜索', value: 45, color: '#22d3ee' },
  { name: '直接访问', value: 28, color: '#a78bfa' },
  { name: '社交媒体', value: 17, color: '#34d399' },
  { name: '外部链接', value: 10, color: '#fbbf24' },
];

interface LogItem {
  time: string;
  text: string;
  type: 'success' | 'primary' | 'warning';
  tag: string;
}

const logs: LogItem[] = [
  { time: '23:29:01', text: '用户 926827391 完成支付 ¥259', type: 'success', tag: '支付' },
  { time: '23:28:47', text: '订单 ORD-20260802-003 状态变更', type: 'primary', tag: '订单' },
  { time: '23:28:12', text: '新增注册用户 3 名', type: 'success', tag: '用户' },
  { time: '23:27:55', text: 'Node 实例自动扩容完成', type: 'warning', tag: '告警' },
  { time: '23:27:30', text: '数据库备份任务已触发', type: 'primary', tag: '任务' },
];
</script>
