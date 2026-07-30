/**
 * TabItem 相关类型定义
 * 服务端 (server/) 与客户端 (src/) 共享
 */

/** 标签项 */
export interface AppTabBarItem {
  /** 标签名称，作为匹配的标识符 */
  name: number | string;
  /** 标签文本，展示标签文本 */
  label: string;
  /**
   * 标签图标，使用 Ant Design 图标库的图标名称
   */
  icon: string;
  /**
   * 标签路径，点击标签时跳转的路径
   */
  path: string;
  /** 是否显示图标右上角小红点 */
  dot: boolean;
  /** 图标右上角徽标的内容 */
  badge: number | string;
}
