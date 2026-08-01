import { createAlova } from 'alova';
import VueHook from 'alova/vue';
import { axiosRequestAdapter } from '@alova/adapter-axios';
import { useEnv } from '@/composables/useEnv';

const { otherApiURL } = useEnv(import.meta.env);

/**
 * 外部 API Alova 实例
 *
 * - 开发环境（DEV）：请求通过 Vite proxy 转发至 /api-other → VITE_OTHER_API_BASE_URL
 *   无需担心跨域，Vite dev server 自动处理。
 * - 生产环境：直接请求 VITE_OTHER_API_BASE_URL（需服务端配置 CORS 或同域部署）
 *
 * 如果 VITE_OTHER_API_BASE_URL 未配置，此实例无法使用。
 *
 * 使用方式（在 .vue / .ts 中）：
 *   import { otherAlova } from '@/api/other';
 *   const { data } = useRequest(otherAlova.Get('/your-endpoint'));
 *
 * 如需对接更多外部 API：
 *   1. 在 env.d.ts 增加 VITE_ANOTHER_API_BASE_URL
 *   2. 在 useEnv.ts 增加 anotherApiURL
 *   3. 在 vite.config.ts 增加对应的 proxy 规则
 *   4. 新建 src/api/another.ts（复制本文件，改 baseURL）
 */
export const otherAlova = createAlova({
  // 开发环境走代理，生产环境走真实地址
  baseURL: import.meta.env.DEV && otherApiURL ? '/api-other' : otherApiURL,
  timeout: 30000,
  statesHook: VueHook,
  requestAdapter: axiosRequestAdapter(),

  beforeRequest: async (method) => {
    method.config.headers['Content-Type'] = 'application/json';
  },

  responded: {
    onSuccess: async (response) => {
      const { status, data: responseData } = response;
      if (status !== 200) {
        throw new Error(`外部 API 请求失败：HTTP ${status}`);
      }
      // 直接返回原始响应，不做业务码拦截
      // 如果外部 API 有统一的响应格式，可在此处处理
      return responseData;
    },

    onError: async (error) => {
      console.error('[外部 API] 请求异常：', error);
      throw error;
    },
  },
});
