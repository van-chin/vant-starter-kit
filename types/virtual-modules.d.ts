/**
 * 声明 vite-plugin-vue-layouts-next 的虚拟模块。
 *
 * 该插件自带 client.d.ts，但通过 tsconfig `types` 数组加载的环境声明
 * 在 `tsc --build` / `vue-tsc --build` 模式下不可靠（模块名含 `virtual:`，
 * 会被模块解析当作绝对 URI 跳过）。这里在 types/ 的 include 范围内再声明一份，
 * 保证类型检查（vue-tsc --build / vp check）在任何模式下都能解析。
 */
declare module 'virtual:generated-layouts' {
  import type { RouteRecordRaw } from 'vue-router';

  export function setupLayouts(routes: readonly RouteRecordRaw[]): RouteRecordRaw[];
}
