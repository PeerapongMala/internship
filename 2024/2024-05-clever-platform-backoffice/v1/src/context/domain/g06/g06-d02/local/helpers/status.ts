import { EEvaluationFormStatus } from '../enums/evaluation';

const statusBadgeClassMap: Record<EEvaluationFormStatus, string> = {
  [EEvaluationFormStatus.REPORTED]: 'badge-outline-info',
  [EEvaluationFormStatus.DRAFT]: 'badge-outline-dark',
  [EEvaluationFormStatus.REPORT_AVAILABLE]: 'badge-outline-warning',
  [EEvaluationFormStatus.IN_PROGRESS]: 'badge-outline-secondary',
  [EEvaluationFormStatus.ENABLED]: 'badge-outline-success',
  [EEvaluationFormStatus.DISABLED]: 'badge-outline-danger',
};

const statusBadgeLabelMap: Record<EEvaluationFormStatus, string> = {
  [EEvaluationFormStatus.REPORTED]: 'ออกรายงานแล้ว',
  [EEvaluationFormStatus.DRAFT]: 'แบบร่าง',
  [EEvaluationFormStatus.REPORT_AVAILABLE]: 'รอออกรายงาน',
  [EEvaluationFormStatus.IN_PROGRESS]: 'กำลังกรอกข้อมูล',
  [EEvaluationFormStatus.ENABLED]: 'เปิดใช้งาน',
  [EEvaluationFormStatus.DISABLED]: 'ไม่ใช้งาน',
};

export const getStatusBadgeClass = (status: EEvaluationFormStatus): string =>
  statusBadgeClassMap[status] ?? 'badge-outline-danger';

export const getStatusBadgeLabel = (status: EEvaluationFormStatus): string =>
  statusBadgeLabelMap[status] ?? 'ไม่ใช้งาน';
