import type { ServiceResult } from './api.types';
import { delay } from './api.types';
import type { Order, ShippingProvider } from '../types';
import { MOCK_MARKETPLACE_ADDRESSES, generateTrackingNumber } from '../mock/reservationMock';

export interface ShippingLabelData {
  provider: 'flash' | 'dhl';
  trackingNumber: string;
  senderName: string;
  senderAddress: string;
  recipientName: string;
  recipientAddress: string;
  createdAt: string;
}

export const reservationService = {
  async fetchAddressFromMarketplace(
    _orderId: string,
  ): Promise<ServiceResult<{ address: string; coordinates: { lat: number; lng: number } }>> {
    await delay(800);
    const addr = MOCK_MARKETPLACE_ADDRESSES[Math.floor(Math.random() * MOCK_MARKETPLACE_ADDRESSES.length)];
    return { data: addr, success: true };
  },

  async generateShippingLabel(
    provider: Exclude<ShippingProvider, 'self-delivery'>,
    order: Pick<Order, 'customer' | 'branch'>,
  ): Promise<ServiceResult<ShippingLabelData>> {
    await delay(1200);
    const label: ShippingLabelData = {
      provider,
      trackingNumber: generateTrackingNumber(provider),
      senderName: `Fujitsu Retail — ${order.branch}`,
      senderAddress: '999 Rama 1 Rd, Pathum Wan, Bangkok 10330',
      recipientName: order.customer.name,
      recipientAddress: order.customer.address,
      createdAt: new Date().toISOString(),
    };
    return { data: label, success: true };
  },
};
