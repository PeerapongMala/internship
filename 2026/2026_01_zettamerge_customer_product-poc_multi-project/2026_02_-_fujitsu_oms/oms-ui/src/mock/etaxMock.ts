import type { QRScanResult, CustomerVerification } from '../types/etax';

export const MOCK_QR_RESULTS: QRScanResult[] = [
  { receiptId: 'RCP-20260226-001', orderId: 'ord-010', amount: 2990, scannedAt: '' },
  { receiptId: 'RCP-20260226-002', orderId: 'ord-011', amount: 4780, scannedAt: '' },
  { receiptId: 'RCP-20260226-003', orderId: 'ord-006', amount: 41190, scannedAt: '' },
  { receiptId: 'RCP-20260226-004', orderId: 'ord-007', amount: 22900, scannedAt: '' },
];

export const MOCK_CUSTOMER_VERIFICATIONS: CustomerVerification[] = [
  {
    receiptId: 'RCP-20260226-001',
    customerName: 'มนัส พิทักษ์',
    taxId: '1-1234-56789-01-2',
    address: '901 ถ.รามคำแหง แขวงหัวหมาก เขตบางกะปิ กรุงเทพฯ 10240',
    verified: true,
  },
  {
    receiptId: 'RCP-20260226-002',
    customerName: 'จิราภรณ์ สุขเจริญ',
    taxId: '1-9876-54321-09-8',
    address: '135 ถ.สีลม แขวงสุริยวงศ์ เขตบางรัก กรุงเทพฯ 10500',
    verified: true,
  },
  {
    receiptId: 'RCP-20260226-003',
    customerName: 'กัญญา แสงทอง',
    taxId: '1-5678-12345-03-4',
    address: '890 ถ.ราชดำริ แขวงลุมพินี เขตปทุมวัน กรุงเทพฯ 10330',
    verified: true,
  },
  {
    receiptId: 'RCP-20260226-004',
    customerName: 'ธนกฤต อภิชาติ',
    taxId: '1-4321-98765-07-6',
    address: '234 ถ.รัชดาภิเษก แขวงดินแดง เขตดินแดง กรุงเทพฯ 10400',
    verified: true,
  },
];
