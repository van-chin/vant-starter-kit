import { baseAlova } from '../index';
import type { AppTabBarItem } from '#types';

/** 获取标签页列表（静态数据，启用缓存） */
export function tabbarsMethod() {
  return baseAlova.Get<AppTabBarItem[]>('/app/tabbars', {
    cacheFor: {
      mode: 'restore',
      expire: 300_000, // 5 分钟
    },
  });
}
