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
      // 预缓存构建产物（JS/CSS/HTML/图片）。
      // 注意：woff2 字体文件不进入预缓存 —— Noto Sans SC Variable 有 101 个
      // unicode-range 分片（约 4.5MB），全部预缓存会拖慢 SW 安装。
      // 由下方 font-cache 运行时规则 CacheFirst 按需缓存（首次访问只下载
      // 当前页面用到的分片，命中后永久缓存，视觉一致性不受影响）。
      globPatterns: ['**/*.{js,css,html,ico,png,svg}'],

      // 清理旧版本的预缓存（配合 registerType: 'autoUpdate' 避免缓存膨胀）
      cleanupOutdatedCaches: true,

      // 单页应用导航回退：任意未匹配路由回退到 index.html（App Shell）
      // 排除 API / 外部 API 代理 / 版本检测等不应回退的路径
      navigateFallback: '/index.html',
      navigateFallbackDenylist: [
        /^\/api\//i,
        /^\/api-external-/i,
        /^\/version\.json/i,
        /^\/_headers/i,
      ],

      // 单文件上限 4MB，避免异常大文件撑爆预缓存
      maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,

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
            // 只缓存正常响应（0 = opaque 响应，200 = 成功），避免缓存错误页
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          // 图片资源：缓存优先（静态图片不可变，命中缓存零请求）
          urlPattern: /\.(?:png|jpe?g|svg|gif|webp|ico|avif)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'static-image-cache',
            expiration: {
              maxEntries: 60,
              maxAgeSeconds: 30 * 24 * 60 * 60, // 30 天
            },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
        {
          // 字体资源：缓存优先（字体文件带版本号/指纹，基本不可变）
          urlPattern: /\.(?:woff2?|eot|ttf|otf)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'font-cache',
            expiration: {
              maxEntries: 20,
              maxAgeSeconds: 365 * 24 * 60 * 60, // 1 年
            },
            cacheableResponse: { statuses: [0, 200] },
          },
        },
      ],
    },

    // Web App Manifest
    manifest: {
      // 唯一标识符：Chrome 使用 id 来唯一确定 PWA 身份，避免与同源其他 PWA 冲突
      id: '/',
      name: 'vant-starter-kit',
      short_name: 'VSK',
      description: '基于 Vue 3 + Vant 4 的移动端启动模板',
      // 状态栏颜色：PWA 启动时（splash screen）使用此值作为初始状态栏颜色，
      // 页面加载后由 useStatusBar 通过 <meta name="theme-color"> 动态切换。
      // 设为 #ffffff（浅色默认值），深色用户在启动瞬间有短暂白闪，
      // 但 JS 加载后立即通过 meta 标签切换为深色。权衡后选择优先保障
      // 浅色模式体验（大多数用户的默认），深色用户通过 useStatusBar 接管。
      // 注意：已安装的 PWA 需要重新安装才会读取新的 manifest 值。
      theme_color: '#ffffff',
      background_color: '#f5f5f5',
      display: 'standalone',
      display_override: ['standalone', 'minimal-ui'],
      categories: ['utilities', 'productivity'],
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
      // TODO: 添加产品截图（建议 3-5 张，1280x720 或 1920x1080，展示核心功能页面）
      // screenshots: [
      //   {
      //     src: 'screenshots/home.png',
      //     sizes: '1280x720',
      //     type: 'image/png',
      //     form_factor: 'narrow',
      //     label: '首页 - 商品浏览',
      //   },
      // ],
    },
  });
}
