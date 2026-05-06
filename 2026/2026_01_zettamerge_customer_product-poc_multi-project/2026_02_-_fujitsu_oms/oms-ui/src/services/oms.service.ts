import type { ServiceResult } from './api.types';
import { delay } from './api.types';
import type { Order, Delivery, OrderStatus } from '../types';
import { useOmsStore } from '../stores/omsStore';

export const omsService = {
  async getOrders(filters?: {
    branch?: string;
    status?: string;
    marketplace?: string;
  }): Promise<ServiceResult<Order[]>> {
    await delay();
    let orders = useOmsStore.getState().orders;
    if (filters?.branch) orders = orders.filter((o) => o.branch === filters.branch);
    if (filters?.status) orders = orders.filter((o) => o.status === filters.status);
    if (filters?.marketplace) orders = orders.filter((o) => o.marketplace === filters.marketplace);
    return { data: orders, success: true };
  },

  async getOrderById(id: string): Promise<ServiceResult<Order | null>> {
    await delay();
    const order = useOmsStore.getState().orders.find((o) => o.id === id) ?? null;
    return { data: order, success: !!order, error: order ? undefined : 'Order not found' };
  },

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    user?: string,
  ): Promise<ServiceResult<Order | null>> {
    await delay();
    useOmsStore.getState().updateOrderStatus(orderId, status, user);
    const order = useOmsStore.getState().orders.find((o) => o.id === orderId) ?? null;
    return { data: order, success: true };
  },

  async syncToPOS(orderId: string): Promise<ServiceResult<{ syncStatus: 'success' | 'error' }>> {
    useOmsStore.getState().setSyncStatus(orderId, 'syncing');
    await delay(2000);
    // 90% success rate
    const success = Math.random() < 0.9;
    const status = success ? 'success' : 'error';
    useOmsStore.getState().setSyncStatus(orderId, status);
    return {
      data: { syncStatus: status },
      success,
      error: success ? undefined : 'POS connection timeout',
    };
  },

  async getDeliveries(): Promise<ServiceResult<Delivery[]>> {
    await delay();
    return { data: useOmsStore.getState().deliveries, success: true };
  },

  async updateDelivery(
    deliveryId: string,
    updates: Partial<Delivery>,
  ): Promise<ServiceResult<Delivery | null>> {
    await delay();
    useOmsStore.getState().updateDelivery(deliveryId, updates);
    const delivery = useOmsStore.getState().deliveries.find((d) => d.id === deliveryId) ?? null;
    return { data: delivery, success: true };
  },
};
