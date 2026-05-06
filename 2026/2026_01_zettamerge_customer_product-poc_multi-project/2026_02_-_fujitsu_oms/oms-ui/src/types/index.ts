export type OrderStatus = 'Pending' | 'Picking' | 'ReadyToShip' | 'OutForDelivery' | 'Delivered' | 'Failed';
export type OrderType = 'online' | 'reservation';
export type DeliveryStatus = 'Assigned' | 'InTransit' | 'Delivered' | 'Failed';

// New architecture types
export type MarketplaceSource = 'lazada' | 'shopee' | 'tiktok' | 'walk-in' | 'phone';
export type ShippingProvider = 'flash' | 'dhl' | 'self-delivery';
export type POSSyncStatus = 'idle' | 'syncing' | 'success' | 'error';
export type ReservationMode = 'online' | 'offline';

export interface OrderItem {
  sku: string;
  name: string;
  qty: number;
  price: number;
}

export interface Customer {
  name: string;
  phone: string;
  address: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  type: OrderType;
  status: OrderStatus;
  branch: string;
  customer: Customer;
  items: OrderItem[];
  totalAmount: number;
  pdpaConsent: boolean;
  slaDeadline: string;
  createdAt: string;
  updatedAt: string;
  // Pluggable architecture fields (optional for backward compat)
  marketplace?: MarketplaceSource;
  shippingProvider?: ShippingProvider;
  trackingNumber?: string;
  posSyncStatus?: POSSyncStatus;
  coordinates?: { lat: number; lng: number };
  // Payment / Receipt
  paymentStatus?: 'unpaid' | 'paid';
  receiptId?: string;
  paidAt?: string;
  paymentMethod?: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  driverName: string;
  status: DeliveryStatus;
  signatureBase64: string | null;
  deliveredAt: string | null;
  assignedAt: string;
}

export interface Invoice {
  id: string;
  orderId: string;
  invoiceNumber: string;
  xmlContent: string;
  sentToInet: boolean;
  sentAt: string | null;
  createdAt: string;
}

export interface ActionLog {
  id: string;
  action: string;
  orderId: string;
  timestamp: string;
  user: string;
}

export interface SessionState {
  orders: Order[];
  deliveries: Delivery[];
  invoices: Invoice[];
  logs: ActionLog[];
}

// Status state machine
export const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  Pending: ['Picking', 'Failed'],
  Picking: ['ReadyToShip', 'Failed'],
  ReadyToShip: ['OutForDelivery', 'Failed'],
  OutForDelivery: ['Failed'],
  Delivered: [],
  Failed: ['Pending'],
};

export const STATUS_COLORS: Record<OrderStatus, string> = {
  Pending: 'orange',
  Picking: 'blue',
  ReadyToShip: 'cyan',
  OutForDelivery: 'geekblue',
  Delivered: 'green',
  Failed: 'red',
};

export const DELIVERY_STATUS_COLORS: Record<DeliveryStatus, string> = {
  Assigned: 'blue',
  InTransit: 'geekblue',
  Delivered: 'green',
  Failed: 'red',
};

export const BRANCHES = [
  'Siam Paragon',
  'CentralWorld',
  'EmQuartier',
  'ICON Siam',
  'The Mall Bangkapi',
];

export const MARKETPLACE_COLORS: Record<MarketplaceSource, string> = {
  lazada: '#0f146d',
  shopee: '#ee4d2d',
  tiktok: '#000000',
  'walk-in': '#6b7280',
  phone: '#8b5cf6',
};

export const SHIPPING_PROVIDER_COLORS: Record<ShippingProvider, string> = {
  flash: '#fbbf24',
  dhl: '#d40511',
  'self-delivery': '#6b7280',
};
