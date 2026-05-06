import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Order, Delivery, Invoice, ActionLog, OrderStatus, POSSyncStatus } from '../types';
import { seedData } from '../mock/seedData';
import dayjs from 'dayjs';

const DRIVER_NAMES = ['สมศักดิ์ ขับดี', 'ประยุทธ์ รถเร็ว'];

interface OmsState {
  orders: Order[];
  deliveries: Delivery[];
  invoices: Invoice[];
  logs: ActionLog[];
  // Actions
  updateOrderStatus: (orderId: string, status: OrderStatus, user?: string) => void;
  addOrder: (order: Order) => void;
  updateDelivery: (deliveryId: string, updates: Partial<Delivery>) => void;
  addDelivery: (delivery: Delivery) => void;
  addInvoice: (invoice: Invoice) => void;
  markInvoiceSent: (invoiceId: string) => void;
  addLog: (log: ActionLog) => void;
  setSyncStatus: (orderId: string, status: POSSyncStatus) => void;
  markOrderPaid: (orderId: string) => void;
  resetData: () => void;
}

export const useOmsStore = create<OmsState>()(
  persist(
    (set) => ({
      orders: seedData.orders,
      deliveries: seedData.deliveries,
      invoices: seedData.invoices,
      logs: seedData.logs,

      updateOrderStatus: (orderId, status, user) => {
        const now = dayjs().toISOString();
        const newLog: ActionLog = {
          id: `log-${Date.now()}`,
          action: `Status changed to ${status}`,
          orderId,
          timestamp: now,
          user: user || 'admin',
        };

        set((state) => {
          let newDeliveries = state.deliveries;
          if (status === 'OutForDelivery') {
            const alreadyHasDelivery = state.deliveries.some((d) => d.orderId === orderId);
            if (!alreadyHasDelivery) {
              const newDelivery: Delivery = {
                id: `del-${Date.now()}`,
                orderId,
                driverName: DRIVER_NAMES[Math.floor(Math.random() * DRIVER_NAMES.length)],
                status: 'Assigned',
                signatureBase64: null,
                deliveredAt: null,
                assignedAt: now,
              };
              newDeliveries = [...state.deliveries, newDelivery];
            }
          }

          return {
            orders: state.orders.map((o) =>
              o.id === orderId ? { ...o, status, updatedAt: now } : o,
            ),
            deliveries: newDeliveries,
            logs: [...state.logs, newLog],
          };
        });
      },

      addOrder: (order) => {
        set((state) => ({
          orders: [...state.orders, order],
          logs: [
            ...state.logs,
            {
              id: `log-${Date.now()}`,
              action: 'Order created',
              orderId: order.id,
              timestamp: dayjs().toISOString(),
              user: 'pos-user',
            },
          ],
        }));
      },

      updateDelivery: (deliveryId, updates) => {
        set((state) => ({
          deliveries: state.deliveries.map((d) =>
            d.id === deliveryId ? { ...d, ...updates } : d,
          ),
        }));
      },

      addDelivery: (delivery) => {
        set((state) => ({ deliveries: [...state.deliveries, delivery] }));
      },

      addInvoice: (invoice) => {
        set((state) => ({ invoices: [...state.invoices, invoice] }));
      },

      markInvoiceSent: (invoiceId) => {
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === invoiceId
              ? { ...inv, sentToInet: true, sentAt: dayjs().toISOString() }
              : inv,
          ),
        }));
      },

      addLog: (log) => {
        set((state) => ({ logs: [...state.logs, log] }));
      },

      setSyncStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId ? { ...o, posSyncStatus: status } : o,
          ),
        }));
      },

      markOrderPaid: (orderId) => {
        const now = dayjs().toISOString();
        const receiptId = `RCP-${dayjs().format('YYYYMMDD')}-${Date.now().toString().slice(-4)}`;
        set((state) => ({
          orders: state.orders.map((o) =>
            o.id === orderId
              ? { ...o, paymentStatus: 'paid' as const, receiptId, paidAt: now, paymentMethod: 'Cash', updatedAt: now }
              : o,
          ),
          logs: [
            ...state.logs,
            {
              id: `log-${Date.now()}`,
              action: 'Payment received',
              orderId,
              timestamp: now,
              user: 'admin',
            },
          ],
        }));
      },

      resetData: () => {
        const fresh = structuredClone(seedData);
        set({
          orders: fresh.orders,
          deliveries: fresh.deliveries,
          invoices: fresh.invoices,
          logs: fresh.logs,
        });
      },
    }),
    { name: 'oms_session' },
  ),
);
