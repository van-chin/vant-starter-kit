import { ref, computed } from 'vue';
import { showToast } from 'vant';

/** 购物车条目 */
export interface CartItem {
  /** 商品 ID */
  id: string;
  /** 商品名称 */
  name: string;
  /** 单价 */
  price: number;
  /** 数量 */
  count: number;
  /** 缩略图 */
  thumb?: string;
}

/** 购物车 Store */
export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);

  /** 总数量 */
  const totalCount = computed(() => items.value.reduce((s, i) => s + i.count, 0));

  /** 总金额 */
  const totalPrice = computed(() => items.value.reduce((s, i) => s + i.price * i.count, 0));

  /** 是否为空 */
  const isEmpty = computed(() => items.value.length === 0);

  /** 添加商品（已存在则 +1） */
  const add = (item: CartItem) => {
    const existing = items.value.find((i) => i.id === item.id);
    if (existing) {
      existing.count += item.count || 1;
    } else {
      items.value.push({ ...item, count: item.count || 1 });
    }
    showToast('已加入购物车');
  };

  /** 更新数量 */
  const updateCount = (id: string, count: number) => {
    const item = items.value.find((i) => i.id === id);
    if (item) {
      item.count = count;
      if (item.count <= 0) {
        remove(id);
      }
    }
  };

  /** 移除商品 */
  const remove = (id: string) => {
    items.value = items.value.filter((i) => i.id !== id);
  };

  /** 清空购物车 */
  const clear = () => {
    items.value = [];
  };

  return {
    items,
    totalCount,
    totalPrice,
    isEmpty,
    add,
    updateCount,
    remove,
    clear,
  };
});
