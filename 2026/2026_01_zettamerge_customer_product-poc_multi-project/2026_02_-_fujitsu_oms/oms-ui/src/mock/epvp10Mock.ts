import type { PassportData, VATRefundApplication } from '../types/epvp10';
import dayjs from 'dayjs';

const now = dayjs();

export const MOCK_PASSPORTS: PassportData[] = [
  {
    passportNumber: 'AA1234567',
    fullName: 'JOHN SMITH',
    nationality: 'BRITISH',
    dateOfBirth: '1985-03-15',
    expiryDate: '2028-03-14',
  },
  {
    passportNumber: 'BB9876543',
    fullName: 'TANAKA YUKI',
    nationality: 'JAPANESE',
    dateOfBirth: '1990-07-22',
    expiryDate: '2029-07-21',
  },
  {
    passportNumber: 'CC5551234',
    fullName: 'WANG WEI',
    nationality: 'CHINESE',
    dateOfBirth: '1988-11-05',
    expiryDate: '2027-11-04',
  },
  {
    passportNumber: 'DD7778899',
    fullName: 'PARK JIHYE',
    nationality: 'KOREAN',
    dateOfBirth: '1992-01-18',
    expiryDate: '2030-01-17',
  },
  {
    passportNumber: 'EE3334567',
    fullName: 'MUELLER HANS',
    nationality: 'GERMAN',
    dateOfBirth: '1975-06-30',
    expiryDate: '2028-06-29',
  },
];

export const MOCK_APPLICATIONS: VATRefundApplication[] = [
  {
    id: 'pvp-001',
    passportData: MOCK_PASSPORTS[0],
    status: 'immigration_approved',
    purchaseAmount: 45000,
    vatAmount: 2943,
    refundAmount: 2943,
    receiptIds: ['RCP-20260226-001', 'RCP-20260226-002'],
    submittedAt: now.subtract(2, 'hour').toISOString(),
    updatedAt: now.subtract(1, 'hour').toISOString(),
    isOfflineCached: false,
  },
  {
    id: 'pvp-002',
    passportData: MOCK_PASSPORTS[1],
    status: 'ktb_approved',
    purchaseAmount: 82000,
    vatAmount: 5364,
    refundAmount: 5364,
    receiptIds: ['RCP-20260226-003'],
    submittedAt: now.subtract(1, 'day').toISOString(),
    updatedAt: now.subtract(3, 'hour').toISOString(),
    isOfflineCached: false,
  },
  {
    id: 'pvp-003',
    passportData: MOCK_PASSPORTS[2],
    status: 'pending_scan',
    purchaseAmount: 15000,
    vatAmount: 981,
    refundAmount: 981,
    receiptIds: ['RCP-20260226-004'],
    submittedAt: now.subtract(30, 'minute').toISOString(),
    updatedAt: now.subtract(30, 'minute').toISOString(),
    isOfflineCached: false,
  },
];
