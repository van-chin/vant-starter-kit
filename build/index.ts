import type { PluginOption } from 'vite';
import { createNitroPlugin } from './plugins/nitro.ts';
import { createPwaPlugin } from './plugins/pwa.ts';
import { createTailwindcssPlugin } from './plugins/tailwindcss.ts';
import { createVuePlugin } from './plugins/vue.ts';
import { createHttpsReverseProxyPlugin } from './plugins/https-reverse-proxy.ts';

/**
 * 创建所有 Vite 插件
 * @param isBuild 是否为生产构建
 * @param proxyTarget HTTPS 反向代理目标域名
 */
export function createVitePlugins(isBuild: boolean = false, proxyTarget?: string): PluginOption[] {
  const plugins: PluginOption[] = [
    ...createVuePlugin(isBuild),

    createTailwindcssPlugin(),

    createNitroPlugin(),
  ];

  // HTTPS 反向代理（仅开发环境）
  if (!isBuild) {
    plugins.push(createHttpsReverseProxyPlugin(proxyTarget));
  }

  // PWA（仅生产构建启用 Service Worker）
  if (isBuild) {
    plugins.push(createPwaPlugin());
  }

  return plugins;
}
