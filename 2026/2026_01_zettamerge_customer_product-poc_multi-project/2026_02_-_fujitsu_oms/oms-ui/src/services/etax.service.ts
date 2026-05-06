import type { ServiceResult } from './api.types';
import { delay } from './api.types';
import type { QRScanResult, CustomerVerification } from '../types/etax';
import type { Invoice } from '../types';
import { MOCK_QR_RESULTS, MOCK_CUSTOMER_VERIFICATIONS } from '../mock/etaxMock';
import { useOmsStore } from '../stores/omsStore';
import dayjs from 'dayjs';
import { generateInvoiceNumber, generateTaxXml } from '../features/etax/xmlGenerator';

export const etaxService = {
  async scanQRCode(_imageData: string): Promise<ServiceResult<QRScanResult>> {
    await delay(2000);
    // Try to return a real paid order with receipt ID
    const paidOrders = useOmsStore.getState().orders.filter((o) => o.paymentStatus === 'paid' && o.receiptId);
    if (paidOrders.length > 0) {
      const order = paidOrders[Math.floor(Math.random() * paidOrders.length)];
      return {
        data: { receiptId: order.receiptId!, orderId: order.id, amount: order.totalAmount, scannedAt: new Date().toISOString() },
        success: true,
      };
    }
    // Fall back to mock data
    const result = MOCK_QR_RESULTS[Math.floor(Math.random() * MOCK_QR_RESULTS.length)];
    return { data: { ...result, scannedAt: new Date().toISOString() }, success: true };
  },

  async lookupByReceiptId(receiptId: string): Promise<ServiceResult<QRScanResult>> {
    await delay(600);
    // Check real orders from store first
    const order = useOmsStore.getState().orders.find((o) => o.receiptId === receiptId);
    if (order) {
      return {
        data: { receiptId, orderId: order.id, amount: order.totalAmount, scannedAt: new Date().toISOString() },
        success: true,
      };
    }
    // Fall back to mock data
    const result = MOCK_QR_RESULTS.find((r) => r.receiptId === receiptId);
    if (result) {
      return { data: { ...result, scannedAt: new Date().toISOString() }, success: true };
    }
    return { data: null as unknown as QRScanResult, success: false, error: 'Receipt not found' };
  },

  async verifyCustomer(receiptId: string): Promise<ServiceResult<CustomerVerification>> {
    await delay(800);
    // Check mock verifications first
    const verification = MOCK_CUSTOMER_VERIFICATIONS.find((v) => v.receiptId === receiptId);
    if (verification) {
      return { data: verification, success: true };
    }
    // Fall back to real order data from store
    const order = useOmsStore.getState().orders.find((o) => o.receiptId === receiptId);
    if (order) {
      return {
        data: {
          receiptId,
          customerName: order.customer.name,
          taxId: '1-0000-00000-00-0',
          address: order.customer.address,
          verified: true,
        },
        success: true,
      };
    }
    return {
      data: {
        receiptId,
        customerName: 'สมชาย วงศ์สวัสดิ์',
        taxId: '1-1234-56789-01-2',
        address: '123 ถ.สุขุมวิท แขวงคลองเตย กรุงเทพฯ 10110',
        verified: true,
      },
      success: true,
    };
  },

  async generateInvoice(orderId: string): Promise<ServiceResult<Invoice>> {
    await delay(1000);
    const order = useOmsStore.getState().orders.find((o) => o.id === orderId);
    if (!order) {
      return { data: null as unknown as Invoice, success: false, error: 'Order not found' };
    }
    const now = dayjs();
    const invoiceNumber = generateInvoiceNumber();
    const invoice: Invoice = {
      id: `inv-${Date.now()}`,
      orderId,
      invoiceNumber,
      xmlContent: generateTaxXml(order, invoiceNumber),
      sentToInet: false,
      sentAt: null,
      createdAt: now.toISOString(),
    };
    useOmsStore.getState().addInvoice(invoice);
    return { data: invoice, success: true };
  },

  async sendToInet(invoiceId: string): Promise<ServiceResult<void>> {
    await delay(1500);
    useOmsStore.getState().markInvoiceSent(invoiceId);
    return { data: undefined, success: true };
  },
};
