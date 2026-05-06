export type PVP10Status =
  | 'pending_scan'
  | 'passport_scanned'
  | 'immigration_check'
  | 'immigration_approved'
  | 'immigration_rejected'
  | 'ktb_processing'
  | 'ktb_approved'
  | 'ktb_rejected'
  | 'refund_complete';

export interface PassportData {
  passportNumber: string;
  fullName: string;
  nationality: string;
  dateOfBirth: string;
  expiryDate: string;
  photoBase64?: string;
}

export interface VATRefundApplication {
  id: string;
  passportData: PassportData;
  status: PVP10Status;
  purchaseAmount: number;
  vatAmount: number;
  refundAmount: number;
  receiptIds: string[];
  submittedAt: string;
  updatedAt: string;
  isOfflineCached: boolean;
}

export const PVP10_STATUS_COLORS: Record<PVP10Status, string> = {
  pending_scan: 'default',
  passport_scanned: 'blue',
  immigration_check: 'processing',
  immigration_approved: 'cyan',
  immigration_rejected: 'red',
  ktb_processing: 'geekblue',
  ktb_approved: 'green',
  ktb_rejected: 'red',
  refund_complete: 'green',
};

export const PVP10_STATUS_FLOW: PVP10Status[] = [
  'pending_scan',
  'passport_scanned',
  'immigration_check',
  'immigration_approved',
  'ktb_processing',
  'ktb_approved',
  'refund_complete',
];
