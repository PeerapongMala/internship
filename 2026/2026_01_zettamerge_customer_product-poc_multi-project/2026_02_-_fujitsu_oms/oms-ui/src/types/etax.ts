export type ETaxWizardStep = 'scan' | 'verify' | 'success';

export interface QRScanResult {
  receiptId: string;
  orderId: string;
  amount: number;
  scannedAt: string;
}

export interface CustomerVerification {
  receiptId: string;
  customerName: string;
  taxId: string;
  address: string;
  verified: boolean;
}
