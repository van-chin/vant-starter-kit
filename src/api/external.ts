import { createAlova } from 'alova';
import VueHook from 'alova/vue';
import { axiosRequestAdapter } from '@alova/adapter-axios';

/**
 * 外部 API — 多后端支持（命名规范 VITE_EXTERNAL_API_<NAME>=<URL>）
 *
 * ============================================================
 * 一、完整使用流程
 * ============================================================
 *
 * 1. 在 .env.development / .env.production 中配置：
 *
 *    VITE_EXTERNAL_API_PAY=http://pay.xxx.com/api     # 支付接口
 *    VITE_EXTERNAL_API_CRM=http://crm.xxx.com/v1      # 客户管理接口
 *
 * 2. 在项目中封装请求方法（推荐在 src/api/external-methods/ 下按模块拆分）：
 *
 *    // src/api/external-methods/pay.ts
 *    import { getExternalAlova } from '@/api/external';
 *    const payApi = getExternalAlova('pay');       // 获取单例实例
 *    export const getOrders = () => payApi.Get<Order[]>('/orders');
 *    export const createOrder = (data: any) => payApi.Post('/orders', data);
 *
 * 3. 在页面/组件中使用：
 *
 *    import { useRequest } from 'alova/client';
 *    import { getOrders } from '@/api/external-methods/pay';
 *    const { data, loading } = useRequest(getOrders);
 *
 * ============================================================
 * 二、工作原理
 * ============================================================
 *
 * 开发环境（vp dev）：
 *   前端请求: /api-external-pay/orders
 *       ↓ Vite proxy（vite.config.ts 动态扫描 VITE_EXTERNAL_API_* 生成）
 *   后端接收: http://pay.xxx.com/api/orders
 *   ✅ 零跨域问题
 *
 * 生产环境（vp build）：
 *   前端请求: http://pay.xxx.com/api/orders
 *   ⚠️ 需外部 API 配置 CORS，或同域部署
 *
 * ============================================================
 * 三、环境变量说明
 * ============================================================
 *
 *   VITE_EXTERNAL_API_<NAME>=<URL>
 *     <NAME> — 自定义名称，用于 getExternalAlova(name)
 *     <URL>  — 外部 API 的基础路径
 *
 *   vite.config.ts 的 buildExternalProxyRules() 会自动扫描 process.env，
 *   为所有配置的外部 API 生成对应的开发代理规则。
 *
 *   如需在 env.d.ts 中获得类型提示，添加：
 *     readonly VITE_EXTERNAL_API_PAY: string;
 */

/** 缓存已创建的实例（按 name 索引） */
const instances = new Map<string, ReturnType<typeof createAlovaInstance>>();

function createAlovaInstance(baseURL: string) {
  return createAlova({
    baseURL,
    timeout: 30000,
    statesHook: VueHook,
    requestAdapter: axiosRequestAdapter(),
    beforeRequest: async (method) => {
      method.config.headers['Content-Type'] = 'application/json';
    },
    responded: {
      onSuccess: async (response) => {
        const { status, data } = response;
        if (status !== 200) {
          throw new Error(`[外部 API] 请求失败：HTTP ${status}`);
        }
        return data;
      },
      onError: async (error) => {
        throw error;
      },
    },
  });
}

/**
 * 获取外部 API 实例（单例，按名称缓存）
 *
 * @param name — 对应 VITE_EXTERNAL_API_<NAME> 中 <NAME> 的小写形式
 * @returns Alova 实例（可直接调用 .Get/.Post/.Put/.Delete）
 * @throws 如果对应的环境变量未配置
 */
export function getExternalAlova(name: string) {
  const envKey = `VITE_EXTERNAL_API_${name.toUpperCase()}`;
  const rawURL = (import.meta.env as Record<string, string | undefined>)[envKey];

  if (!rawURL) {
    throw new Error(`[外部 API] "${name}" 未配置。请在 .env 中添加 ${envKey}=<URL>`);
  }

  if (!instances.has(name)) {
    // 开发环境走 Vite 代理，生产环境直连
    const baseURL = import.meta.env.DEV ? `/api-external-${name}` : rawURL;
    instances.set(name, createAlovaInstance(baseURL));
  }

  return instances.get(name)!;
}
