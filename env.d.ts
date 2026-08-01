/// <reference types="vite-plus/client" />
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, unknown>;
  export default component;
}

export {};

/**
 * 客户端环境变量类型声明
 *
 * Vite 使用 import.meta.env 暴露环境变量，只有 VITE_ 前缀的变量会被暴露到客户端。
 *
 * ⚠️ 新增/删除环境变量时，必须同步以下文件：
 *   1. 本文件（env.d.ts）—— TypeScript 类型声明
 *   2. src/composables/useEnv.ts —— 类型安全访问 + 默认值
 *   3. .env.example —— 变量文档模板（提交到仓库）
 *   4. .env / .env.development / .env.production —— 各环境的实际值
 */
interface ImportMetaEnv {
  /** API 基础路径 */
  readonly VITE_API_BASE_URL: string;
  /** 腾讯云 IM 应用 ID（可留空） */
  readonly VITE_TCC_APP_ID: string;
  /** 允许的 Host 域名（开发环境） */
  readonly VITE_ALLOWED_HOST: string;
  /** HTTPS 反向代理目标域名（开发环境） */
  readonly VITE_PROXY_TARGET: string;
  /** 应用基础路径 */
  readonly VITE_PUBLIC_PATH: string;
  /** 环境名称（development / test / production） */
  readonly VITE_ENV_NAME: string;
  /** Dev Server 主机地址 */
  readonly VITE_DEV_SERVER_HOST: string;
  /** 应用标题（浏览器标签页 + PWA 名称） */
  readonly VITE_APP_TITLE: string;
  /** 是否启用 vConsole 调试面板（true=始终启用，空/未设置=通过 ?vconsole 按需启用） */
  readonly VITE_ENABLE_VCONSOLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
