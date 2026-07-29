import type { PluginOption } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * PWA 插件（生产构建时启用 Service Worker 和 manifest）
 * @returns PluginOption
 */
export function createPwaPlugin(): PluginOption {
  return VitePWA({
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
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
  });
}
