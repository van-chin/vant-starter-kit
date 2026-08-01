/**
 * 环境变量类型安全的访问 composable
 *
 * 集中管理所有环境变量，提供类型推断和默认值。
 *
 * ⚠️ 新增/删除环境变量时需要同步修改：
 *   1. env.d.ts — TypeScript 类型声明
 *   2. .env.example — 变量文档模板
 *   3. 本 composable — 添加访问器
 */
export function useEnv(env: ImportMetaEnv) {
  return {
    /** API 基础路径 */
    apiURL: env.VITE_API_BASE_URL || '/api',
    /** 腾讯云 IM 应用 ID */
    tccAppId: Number(env.VITE_TCC_APP_ID) || 0,
    /** 允许的 Host */
    allowedHost: env.VITE_ALLOWED_HOST || '',
    /** HTTPS 反向代理目标 */
    proxyTarget: env.VITE_PROXY_TARGET || '',
    /** 应用基础路径 */
    publicPath: env.VITE_PUBLIC_PATH || '/',
    /** 环境名称 */
    envName: env.VITE_ENV_NAME || 'development',
    /** 应用标题 */
    appTitle: env.VITE_APP_TITLE || 'vant-starter-kit',
    /** 是否启用 vConsole 调试面板 */
    enableVConsole: env.VITE_ENABLE_VCONSOLE === 'true',
    /**
     * 获取所有已配置的外部 API（VITE_EXTERNAL_API_<NAME>=<URL>）
     * @see src/api/external.ts 中的 getExternalAlova(name)
     */
    getExternalApis: () =>
      Object.keys(env)
        .filter((k) => k.startsWith('VITE_EXTERNAL_API_'))
        .map((k) => ({
          name: k.replace('VITE_EXTERNAL_API_', '').toLowerCase(),
          url: String(env[k as keyof ImportMetaEnv] || ''),
        })),
  } as const;
}

/** 环境变量返回类型，便于其他模块引用 */
export type EnvConfig = ReturnType<typeof useEnv>;
