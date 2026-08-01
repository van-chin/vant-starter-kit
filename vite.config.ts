import { fileURLToPath, URL } from 'node:url';
import { defineConfig, lazyPlugins } from 'vite-plus';

/** fmt / lint 共用的忽略模式 */
const ignorePatterns = [
  'dist/**',
  '.data/**',
  '.output/**',
  '.github/**',
  '.qwen/**',
  '.agents/**',
  '.claude/**',
  '.codebuddy/**',
  '.qoder/**',
];

export default defineConfig({
  server: {
    host: process.env.VITE_DEV_SERVER_HOST,
    allowedHosts: process.env.VITE_ALLOWED_HOST ? [process.env.VITE_ALLOWED_HOST] : [],
    // 开发环境代理：将 /api-other 请求转发到外部 API 以解决跨域
    // 配置 VITE_OTHER_API_BASE_URL 后自动启用
    proxy: process.env.VITE_OTHER_API_BASE_URL
      ? {
          '/api-other': {
            target: process.env.VITE_OTHER_API_BASE_URL,
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api-other/, ''),
          },
        }
      : undefined,
  },
  staged: {
    '*.{ts,tsx,vue,js}': 'vp check --fix',
  },
  // ← 静态导出，vp check/fmt/lint 可直接读取
  fmt: {
    ignorePatterns,
    sortPackageJson: {
      sortScripts: true,
    },
    sortTailwindcss: {
      functions: ['clsx', 'cn'],
      preserveWhitespace: true,
    },
    semi: true,
    singleQuote: true,
  },
  lint: {
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
    options: { typeAware: true, typeCheck: false },
  },
  plugins: lazyPlugins(async () => {
    // 仅在 dev/build/test/preview 时执行
    // 实现条件逻辑：根据环境动态返回不同插件集
    const { createVitePlugins } = await import('#build');
    return createVitePlugins(process.env.NODE_ENV === 'production', process.env.VITE_PROXY_TARGET);
  }),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '#types': fileURLToPath(new URL('./types', import.meta.url)),
    },
  },
  define: {},
});
