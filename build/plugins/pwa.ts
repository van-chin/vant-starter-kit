import type { PluginOption } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * PWA 插件（生产构建时启用 Service Worker 和 manifest）
 *
 * 注意：Nitro 使用 Vite 6 Environments 机制，client 构建输出到
 * .output/public/，但 vite-plugin-pwa 默认读取 Vite 默认环境的
 * outDir（dist/），导致 sw.js 写入到错误目录。
 *
 * 通过在插件配置中显式指定 outDir 为 .output/public/ 解决此问题。
 *
 * @returns PluginOption
 */
export function createPwaPlugin(): PluginOption {
  return VitePWA({
    // 显式指定输出目录，对齐 Nitro client 环境的 publicDir
    outDir: '.output/public',

    // 自动更新 Service Worker，无需用户手动确认
    registerType: 'autoUpdate',

    workbox: {
      // 预缓存构建产物（JS/CSS/HTML/图片/字体）
      globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],

      // 运行时缓存策略
      runtimeCaching: [
        {
          // API 请求：优先网络，离线时使用缓存兜底
          urlPattern: /^\/api\/.*/i,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            networkTimeoutSeconds: 5,
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24, // 1 天
            },
          },
        },
      ],
    },

    // Web App Manifest
    manifest: {
      name: 'vant-starter-kit',
      short_name: 'VSK',
      description: '基于 Vue 3 + Vant 4 的移动端启动模板',
      // 状态栏颜色由运行时 JS 动态控制（见 src/composables/useStatusBar.ts），
      // manifest 设一个中间值兜底，避免极端情况下出现纯白/纯黑的割裂感
      theme_color: '#f5f5f5',
      background_color: '#f5f5f5',
      display: 'standalone',
      icons: [
        { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
        { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        {
          src: 'maskable-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
  });
}
