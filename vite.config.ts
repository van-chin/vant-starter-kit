import { fileURLToPath, URL } from 'node:url';
import type { ProxyOptions } from 'vite-plus';
import { defineConfig, lazyPlugins } from 'vite-plus';

/**
 * 动态构建外部 API 代理规则
 *
 * 扫描 process.env 中所有 VITE_EXTERNAL_API_<NAME>=<URL> 变量，
 * 为每个外部 API 创建对应的 proxy 规则：
 *   /api-external-<name> → <URL>（开发环境自动处理跨域）
 */
function buildExternalProxyRules() {
  const rules: Record<string, ProxyOptions> = {};
  for (const key of Object.keys(process.env)) {
    const match = key.match(/^VITE_EXTERNAL_API_(.+)$/);
    if (match?.[1] && process.env[key]) {
      const name = match[1].toLowerCase();
      rules[`/api-external-${name}`] = {
        target: process.env[key],
        changeOrigin: true,
        rewrite: (path: string) => path.replace(new RegExp(`^/api-external-${name}`), ''),
      };
    }
  }
  return Object.keys(rules).length > 0 ? rules : undefined;
}

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
    // 外部 API 代理（自动扫描 VITE_EXTERNAL_API_* 环境变量）
    // 示例：VITE_EXTERNAL_API_OTHER=http://www.xxx.com/api
    //   → /api-external-other → http://www.xxx.com/api
    proxy: buildExternalProxyRules(),
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
    // 说明：tsgolint 的 typeCheck 目前无法解析 `*.vue` 环境声明（会误报
    // "Cannot find module './App.vue'"），因此这里保持 typeCheck: false；
    // 真正的完整类型检查由构建脚本中的 `vue-tsc --noEmit -p ...` 完成。
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
});
