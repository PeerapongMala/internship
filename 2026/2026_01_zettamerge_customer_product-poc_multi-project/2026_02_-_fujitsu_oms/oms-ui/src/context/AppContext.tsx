import React, { createContext, useContext, type ReactNode } from 'react';
import type { SessionState, Order, Delivery, Invoice, ActionLog, OrderStatus } from '../types';
import { useOmsStore } from '../stores/omsStore';

// --- Action types (kept for backward compat) ---
type Action =
  | { type: 'INIT'; payload: SessionState }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: OrderStatus; user?: string } }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_DELIVERY'; payload: { deliveryId: string; updates: Partial<Delivery> } }
  | { type: 'ADD_DELIVERY'; payload: Delivery }
  | { type: 'ADD_INVOICE'; payload: Invoice }
  | { type: 'MARK_INVOICE_SENT'; payload: { invoiceId: string } }
  | { type: 'ADD_LOG'; payload: ActionLog }
  | { type: 'MARK_ORDER_PAID'; payload: { orderId: string } }
  | { type: 'RESET_DATA' };

// --- Context (bridge to Zustand) ---
interface AppContextValue {
  state: SessionState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const store = useOmsStore();

  const state: SessionState = {
    orders: store.orders,
    deliveries: store.deliveries,
    invoices: store.invoices,
    logs: store.logs,
  };

  const dispatch = (action: Action) => {
    switch (action.type) {
      case 'INIT':
        break;
      case 'UPDATE_ORDER_STATUS':
        store.updateOrderStatus(action.payload.orderId, action.payload.status, action.payload.user);
        break;
      case 'ADD_ORDER':
        store.addOrder(action.payload);
        break;
      case 'UPDATE_DELIVERY':
        store.updateDelivery(action.payload.deliveryId, action.payload.updates);
        break;
      case 'ADD_DELIVERY':
        store.addDelivery(action.payload);
        break;
      case 'ADD_INVOICE':
        store.addInvoice(action.payload);
        break;
      case 'MARK_INVOICE_SENT':
        store.markInvoiceSent(action.payload.invoiceId);
        break;
      case 'ADD_LOG':
        store.addLog(action.payload);
        break;
      case 'MARK_ORDER_PAID':
        store.markOrderPaid(action.payload.orderId);
        break;
      case 'RESET_DATA':
        store.resetData();
        break;
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

export type { Action };
