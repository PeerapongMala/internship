export const statusLabels: Record<string, string> = {
  enabled: 'ใช้งาน',
  disabled: 'ไม่ใช้งาน',
  draft: 'แบบร่าง',
};

export const tabsList = [
  { key: 'admin', label: 'แอดมิน' },
  { key: 'parent', label: 'ผู้ปกครอง' },
  { key: 'observer', label: 'ผู้สังเกตการณ์' },
  { key: 'content-creator', label: 'นักวิชาการ' },
] as const;

export type TabType = (typeof tabsList)[number]['key'];
