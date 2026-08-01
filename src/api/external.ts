import { createAlova } from 'alova';
import VueHook from 'alova/vue';
import { axiosRequestAdapter } from '@alova/adapter-axios';

/**
 * 外部 API Alova 实例工厂
 *
 * 通过命名规范 VITE_EXTERNAL_API_<NAME>=<URL> 支持多个外部后端：
 *
 *   .env.development:
 *     VITE_EXTERNAL_API_OTHER=http://www.xxx.com/api
 *     VITE_EXTERNAL_API_THIRD=http://www.yyy.com/v1
 *
 * 使用方式：
 *   import { getExternalAlova } from '@/api/external';
 *   const api = getExternalAlova('other');
 *   const { data } = useRequest(api.Get('/users'));
 *
 * 工作原理：
 *   - 开发环境：请求 /api-external-other  → Vite proxy → http://www.xxx.com/api
 *   - 生产环境：直接请求 VITE_EXTERNAL_API_OTHER 的值
 *
 * 新增外部 API 步骤：
 *   1. 在 .env.development / .env.production 中添加 VITE_EXTERNAL_API_<NAME>=<URL>
 *   2. （可选）在 env.d.ts 的 ImportMetaEnv 中添加类型声明
 *   3. 在代码中使用 getExternalAlova(<NAME>) 获取实例
 *   Vite 代理会自动生效（无需手动配置 vite.config.ts）
 */

/** 缓存已创建的实例（按 name 索引） */
const instances = new Map<string, ReturnType<typeof createAlova>>();

/**
 * 获取指定名称的外部 API Alova 实例（单例，首次调用时创建）
 *
 * @param name 外部 API 名称（对应 VITE_EXTERNAL_API_<NAME> 环境变量的 <NAME> 部分）
 * @returns Alova 实例
 * @throws 如果对应的环境变量未配置
 */
export function getExternalAlova(name: string) {
  const envKey = `VITE_EXTERNAL_API_${name.toUpperCase()}`;
  const baseURL = (import.meta.env as Record<string, string | undefined>)[envKey];

  if (!baseURL) {
    throw new Error(`[外部 API] "${name}" 未配置。请在 .env 中添加 ${envKey}=<URL>`);
  }

  if (!instances.has(name)) {
    instances.set(
      name,
      createAlova({
        // 开发环境走 Vite 代理，生产环境直连
        baseURL: import.meta.env.DEV ? `/api-external-${name}` : baseURL,
        timeout: 30000,
        statesHook: VueHook,
        requestAdapter: axiosRequestAdapter(),

        beforeRequest: async (method) => {
          method.config.headers['Content-Type'] = 'application/json';
        },

        responded: {
          onSuccess: async (response) => {
            const { status } = response;
            if (status !== 200) {
              throw new Error(`[外部 API ${name}] 请求失败：HTTP ${status}`);
            }
            return response.data;
          },
          onError: async (error) => {
            console.error(`[外部 API ${name}] 请求异常：`, error);
            throw error;
          },
        },
      }),
    );
  }

  return instances.get(name)!;
}
