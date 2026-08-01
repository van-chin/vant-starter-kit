/**
 * 外部 API 请求方法 — 示例（支付接口）
 *
 * ============================================================
 * 使用步骤：
 * ============================================================
 *
 * 1. 在 .env.development 中配置：
 *    VITE_EXTERNAL_API_PAY=http://pay.xxx.com/api
 *
 * 2. 本文件中的方法即可直接使用：
 *    import { getOrders } from '@/api/external-methods/pay';
 *    const { data } = useRequest(getOrders);
 *
 * 3. 如需对接更多外部后端，复制本文件，改名称和 env 变量即可。
 *
 * ============================================================
 * 如何新增外部 API 模块：
 * ============================================================
 *
 *   cp src/api/external-methods/pay.ts src/api/external-methods/crm.ts
 *   # 在 crm.ts 中将 'pay' 改为 'crm'
 *   # 在 .env 中添加 VITE_EXTERNAL_API_CRM=http://crm.xxx.com/v1
 *
 * Vite 代理自动生效（vite.config.ts 扫描 process.env 生成规则）
 */

import { getExternalAlova } from '@/api/external';

const payApi = getExternalAlova('pay');

/** 获取订单列表 */
export const getOrders = () => payApi.Get('/orders');

/** 获取订单详情 */
export const getOrder = (id: string) => payApi.Get(`/orders/${id}`);

/** 创建订单 */
export const createOrder = (data: Record<string, unknown>) => payApi.Post('/orders', data);
