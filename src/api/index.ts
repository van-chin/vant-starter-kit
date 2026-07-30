import { createAlova } from 'alova';
import VueHook from 'alova/vue';
import { axiosRequestAdapter } from '@alova/adapter-axios';

import { useEnv } from '@/composables/useEnv';
import type { ApiResponse } from '#types';
import { BizCode } from '#types';

const { apiURL } = useEnv(import.meta.env);

/** Alova 请求实例 */
export const baseAlova = createAlova({
  baseURL: apiURL,
  timeout: 60000,
  statesHook: VueHook,
  requestAdapter: axiosRequestAdapter(),

  beforeRequest: async (method) => {
    method.config.headers['Content-Type'] = 'application/json';
  },

  responded: {
    onSuccess: async (response) => {
      const { status, data: responseData } = response;
      const { code, message, data } = responseData as ApiResponse;

      if (status !== 200) {
        const { showToast } = await import('vant');
        showToast(`请求失败：HTTP ${status}`);
        throw new Error(`请求失败：HTTP ${status}`);
      }

      switch (code) {
        case BizCode.ERROR:
          {
            const { showToast } = await import('vant');
            showToast(message || '请求失败');
          }
          throw new Error(message);

        case BizCode.UNAUTHORIZED:
          {
            const { showToast } = await import('vant');
            showToast('登录已过期，请重新登录');
            // 动态 import 避免循环依赖
            const { useAuthStore } = await import('@/stores/auth');
            useAuthStore().logout();
            const { default: router } = await import('@/router');
            void router.push('/login');
          }
          throw new Error('未授权');

        default:
          return data;
      }
    },

    onError: async (error) => {
      const { showToast } = await import('vant');
      showToast('网络异常，请稍后重试');
      console.error('[API] 请求异常：', error);
      throw error;
    },
  },
});
