import { describe, it, expect, beforeEach } from 'vite-plus/test';
import { setActivePinia, createPinia } from 'pinia';
import { useCartStore } from '../cart';

describe('cart store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('starts empty', () => {
    const cart = useCartStore();
    expect(cart.isEmpty).toBe(true);
    expect(cart.totalCount).toBe(0);
    expect(cart.items).toHaveLength(0);
  });

  it('adds a new item', () => {
    const cart = useCartStore();
    cart.add({ id: '1', name: 'Test', price: 10, count: 2 });
    expect(cart.items).toHaveLength(1);
    expect(cart.totalCount).toBe(2);
    expect(cart.totalPrice).toBe(20);
  });

  it('increments count when adding existing item', () => {
    const cart = useCartStore();
    cart.add({ id: '1', name: 'Test', price: 10, count: 1 });
    cart.add({ id: '1', name: 'Test', price: 10, count: 1 });
    expect(cart.items).toHaveLength(1);
    expect(cart.totalCount).toBe(2);
  });

  it('updates item count', () => {
    const cart = useCartStore();
    cart.add({ id: '1', name: 'Test', price: 10, count: 1 });
    cart.updateCount('1', 5);
    expect(cart.totalCount).toBe(5);
  });

  it('removes item when count goes to zero', () => {
    const cart = useCartStore();
    cart.add({ id: '1', name: 'Test', price: 10, count: 1 });
    cart.updateCount('1', 0);
    expect(cart.isEmpty).toBe(true);
  });

  it('removes item by id', () => {
    const cart = useCartStore();
    cart.add({ id: '1', name: 'A', price: 10, count: 1 });
    cart.add({ id: '2', name: 'B', price: 10, count: 1 });
    cart.remove('1');
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0]?.id).toBe('2');
  });

  it('clears all items', () => {
    const cart = useCartStore();
    cart.add({ id: '1', name: 'A', price: 10, count: 1 });
    cart.add({ id: '2', name: 'B', price: 10, count: 1 });
    cart.clear();
    expect(cart.isEmpty).toBe(true);
  });
});
