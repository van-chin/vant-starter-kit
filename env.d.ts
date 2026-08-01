/// <reference types="vite-plus/client" />
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, unknown>;
  export default component;
}

export {};

interface ImportMetaEnv {
  /** API 基础路径 */
  readonly VITE_API_BASE_URL: string;
  /** 腾讯云 IM 应用 ID */
  readonly VITE_TCC_APP_ID: string;
  /** 允许的 Host 域名 */
  readonly VITE_ALLOWED_HOST: string;
  /** HTTPS 反向代理目标域名 */
  readonly VITE_PROXY_TARGET: string;
  /** 应用基础路径 */
  readonly VITE_PUBLIC_PATH: string;
  /** 环境名称 */
  readonly VITE_ENV_NAME: string;
  /** Dev Server 主机地址 */
  readonly VITE_DEV_SERVER_HOST: string;
  /** 应用标题（浏览器标签页 + PWA 名称） */
  readonly VITE_APP_TITLE: string;
  /** 是否启用 vConsole 调试面板（true=始终启用，空=通过 ?vconsole 按需启用） */
  readonly VITE_ENABLE_VCONSOLE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
