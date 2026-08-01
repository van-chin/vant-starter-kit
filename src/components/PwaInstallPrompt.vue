<template>
  <!--
    PWA 安装提示 — Vant FloatingPanel 底部面板

    交互设计：
      - 折叠态：紧凑安装条（图标 + 文案 + 安装按钮 + 关闭）
      - 上拉：展开显示亮点（单行，跟在图标后面）+ 大按钮
      - 下滑：关闭面板（7 天内不再提示）
      - X / 暂不安装：同下滑关闭

    高度策略：展开内容常驻渲染，通过 offsetHeight 测量真实内容高度，
    面板最高点 = 内容高度 + 头部 + 底部 8px 留白，内容自适应不浪费空间。
  -->
  <Transition name="pwa-panel">
    <van-floating-panel
      v-if="showPrompt"
      v-model:height="panelHeight"
      :anchors="anchors"
      :duration="0.25"
      class="shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:shadow-none"
      @touchstart.passive="onTouchStart"
      @touchend="onTouchEnd"
    >
      <!-- 面板内容 -->
      <div class="pwa-content">
        <!-- 折叠态：紧凑安装条 -->
        <div class="flex items-center gap-2 px-4 pt-1 pb-3">
          <img
            src="/pwa-64x64.png"
            alt="App Icon"
            class="h-10 w-10 flex-shrink-0 rounded-lg"
            width="40"
            height="40"
          />
          <div class="min-w-0 flex-1">
            <div class="truncate text-sm font-semibold text-gray-900 dark:text-gray-100">
              vant-starter-kit
            </div>
            <div class="truncate text-xs text-gray-500 dark:text-gray-400">
              添加到主屏幕，获得更好的体验
            </div>
          </div>
          <van-button size="small" type="primary" :loading="installing" @click="install()">
            {{ installing ? '安装中' : '安装' }}
          </van-button>
          <!-- 关闭按钮：放在安装按钮后面，正常流布局 -->
          <button class="flex-shrink-0 p-1 text-gray-400" aria-label="关闭" @click="dismiss">
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>

        <!-- 展开内容：2×2 亮点网格 + 安装按钮（常驻渲染） -->
        <div class="px-4 pb-4">
          <!-- 亮点：2×2 卡片，每卡两行（第1行 emoji+标题，第2行介绍） -->
          <div class="grid grid-cols-2 gap-3">
            <div
              v-for="benefit in BENEFITS"
              :key="benefit.title"
              class="rounded-xl bg-gray-50 p-3 dark:bg-gray-800"
            >
              <div class="flex items-center gap-1.5">
                <span class="text-base leading-none">{{ benefit.icon }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {{ benefit.title }}
                </span>
              </div>
              <div class="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                {{ benefit.desc }}
              </div>
            </div>
          </div>

          <!-- 安装按钮 -->
          <div class="pt-3">
            <van-button type="primary" block size="large" :loading="installing" @click="install()">
              {{ installing ? '正在安装…' : '立即安装' }}
            </van-button>
          </div>
          <div class="mt-2 text-center">
            <span class="cursor-pointer text-xs text-gray-400" @click="dismiss"> 暂不安装 </span>
          </div>
        </div>
      </div>
    </van-floating-panel>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { usePwaInstall } from '@/composables/usePwaInstall';

const { showPrompt, installing, install, dismiss } = usePwaInstall();

/** 折叠态高度：头部 + 紧凑安装条 */
const COLLAPSED_HEIGHT = 90;

/** 展开态高度：65% 视口（底部留白由视口高度自然产生） */
const EXPANDED_HEIGHT = typeof window !== 'undefined' ? Math.round(window.innerHeight * 0.65) : 600;

/** 面板锚点：折叠 ↔ 展开 */
const anchors = [COLLAPSED_HEIGHT, EXPANDED_HEIGHT];

/** 当前面板高度（v-model:height） */
const panelHeight = ref(COLLAPSED_HEIGHT);

/** 安装亮点数据（2×2 卡片：emoji + 标题 + 完整介绍） */
const BENEFITS = [
  { icon: '⚡', title: '秒开启动', desc: '安装后从桌面直接打开，无需等待浏览器加载' },
  { icon: '📴', title: '离线可用', desc: 'Service Worker 缓存资源，断网也能正常访问' },
  { icon: '🏠', title: '桌面图标', desc: '和原生 App 一样出现在主屏幕，一键直达' },
  { icon: '🖥️', title: '沉浸体验', desc: '全屏展示无浏览器工具栏，更专注更流畅' },
] as const;

// ─── 下滑关闭检测 ──────────────────────────────────────────────
let touchStartY = 0;
let touchStartTime = 0;

function onTouchStart(e: TouchEvent): void {
  touchStartY = e.touches[0]?.clientY ?? 0;
  touchStartTime = Date.now();
}

function onTouchEnd(e: TouchEvent): void {
  const endY = e.changedTouches[0]?.clientY ?? touchStartY;
  const deltaY = endY - touchStartY;
  const duration = Date.now() - touchStartTime;

  // 面板在折叠态 + 快速向下滑动（>80px 且 <500ms）→ 关闭
  const atCollapsed = panelHeight.value <= COLLAPSED_HEIGHT + 10;
  if (atCollapsed && deltaY > 80 && duration < 500) {
    dismiss();
  }
}

// 面板重新出现时重置为折叠态
watch(showPrompt, (val) => {
  if (val) {
    panelHeight.value = COLLAPSED_HEIGHT;
  }
});
</script>

<style scoped>
/* 面板进出动画（仅透明度，transform 由 Vant 控制） */
.pwa-panel-enter-active,
.pwa-panel-leave-active {
  transition: opacity 0.2s ease;
}
.pwa-panel-enter-from,
.pwa-panel-leave-to {
  opacity: 0;
}
</style>
