/**
 * Vue Router 类型扩展
 *
 * 扩展 RouteMeta 接口，为 definePage({ meta: { ... } }) 提供类型安全。
 */

export {};

declare module 'vue-router' {
  interface RouteMeta {
    /** 页面标题，显示在布局 header 的导航栏中 */
    title?: string;
    /** 布局名称 */
    layout?: string;
    /** 是否显示 header */
    showHeader?: boolean;
    /** 是否显示 footer */
    showFooter?: boolean;
    /** 是否需要登录（路由守卫未登录则跳转 /login） */
    requiresAuth?: boolean;
  }
}
