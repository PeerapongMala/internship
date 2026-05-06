import type { ServiceResult } from './api.types';
import { delay } from './api.types';
import type { PassportData, VATRefundApplication } from '../types/epvp10';
import { MOCK_PASSPORTS } from '../mock/epvp10Mock';
import { useEpvp10Store } from '../stores/epvp10Store';
import dayjs from 'dayjs';

export const epvp10Service = {
  async scanPassport(_imageData: string): Promise<ServiceResult<PassportData>> {
    await delay(2000);
    const passport = MOCK_PASSPORTS[Math.floor(Math.random() * MOCK_PASSPORTS.length)];
    return { data: passport, success: true };
  },

  async submitRefundApplication(data: {
    passportData: PassportData;
    purchaseAmount: number;
    vatAmount: number;
    refundAmount: number;
    receiptIds: string[];
  }): Promise<ServiceResult<VATRefundApplication>> {
    await delay(1000);
    const app: VATRefundApplication = {
      id: `pvp-${Date.now()}`,
      ...data,
      status: 'passport_scanned',
      submittedAt: dayjs().toISOString(),
      updatedAt: dayjs().toISOString(),
      isOfflineCached: false,
    };
    useEpvp10Store.getState().addApplication(app);
    return { data: app, success: true };
  },

  async checkImmigrationStatus(applicationId: string): Promise<ServiceResult<VATRefundApplication>> {
    await delay(3000);
    const store = useEpvp10Store.getState();
    const app = store.applications.find((a) => a.id === applicationId);
    if (!app) {
      return { data: null as unknown as VATRefundApplication, success: false, error: 'Application not found' };
    }
    // 95% approval rate
    const approved = Math.random() < 0.95;
    const newStatus = approved ? 'immigration_approved' : 'immigration_rejected';
    store.updateApplication(applicationId, { status: newStatus, updatedAt: dayjs().toISOString() });
    const updated = useEpvp10Store.getState().applications.find((a) => a.id === applicationId)!;
    return { data: updated, success: true };
  },

  async checkKTBStatus(applicationId: string): Promise<ServiceResult<VATRefundApplication>> {
    await delay(3000);
    const store = useEpvp10Store.getState();
    const app = store.applications.find((a) => a.id === applicationId);
    if (!app) {
      return { data: null as unknown as VATRefundApplication, success: false, error: 'Application not found' };
    }
    // 90% approval rate
    const approved = Math.random() < 0.9;
    const newStatus = approved ? 'ktb_approved' : 'ktb_rejected';
    store.updateApplication(applicationId, { status: newStatus, updatedAt: dayjs().toISOString() });
    const updated = useEpvp10Store.getState().applications.find((a) => a.id === applicationId)!;
    return { data: updated, success: true };
  },

  async syncOfflineCache(): Promise<ServiceResult<{ synced: number }>> {
    await delay(2000);
    const store = useEpvp10Store.getState();
    const count = store.offlineQueue.length;
    store.syncOffline();
    return { data: { synced: count }, success: true };
  },
};
