import { Tag } from 'antd';
import type { OrderStatus, DeliveryStatus } from '../types';
import { STATUS_COLORS, DELIVERY_STATUS_COLORS } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import type { TranslationKey } from '../i18n/en';

interface Props {
  status: OrderStatus | DeliveryStatus;
  type?: 'order' | 'delivery';
}

export default function StatusBadge({ status, type = 'order' }: Props) {
  const { t } = useLanguage();
  const colorMap = type === 'order' ? STATUS_COLORS : DELIVERY_STATUS_COLORS;
  const color = (colorMap as Record<string, string>)[status] || 'default';

  return <Tag color={color}>{t(status as TranslationKey)}</Tag>;
}
