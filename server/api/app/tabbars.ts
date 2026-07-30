import { defineHandler } from 'nitro';
import type { ApiResponse, AppTabBarItem } from '#types';

export default defineHandler(async (): Promise<ApiResponse<AppTabBarItem[]>> => {
  const tabItems: AppTabBarItem[] = [
    { name: 'home', label: '首页', icon: 'home-o', path: '/', dot: false, badge: 0 },
    {
      name: 'category',
      label: '分类',
      icon: 'list-switching',
      path: '/categories',
      dot: false,
      badge: 0,
    },
    { name: 'seed', label: '种草', icon: 'fire-o', path: '/seed', dot: false, badge: 5 },
    { name: 'cart', label: '购物车', icon: 'cart-o', path: '/cart', dot: false, badge: 20 },
    { name: 'my', label: '我的', icon: 'contact-o', path: '/my', dot: false, badge: 6 },
  ];

  return {
    code: 0,
    message: 'success!',
    data: tabItems,
  };
});
