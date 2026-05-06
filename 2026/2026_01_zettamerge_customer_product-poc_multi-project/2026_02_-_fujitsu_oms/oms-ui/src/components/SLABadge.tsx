import { useEffect, useState } from 'react';
import { Tag } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  deadline: string;
}

export default function SLABadge({ deadline }: Props) {
  const { t } = useLanguage();
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const target = dayjs(deadline);
  const diffMs = target.diff(dayjs());

  if (diffMs <= 0) {
    return (
      <Tag color="red" icon={<ClockCircleOutlined />} style={{ animation: 'pulse 1s infinite' }}>
        {t('overdue')}
      </Tag>
    );
  }

  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  let color: string;
  if (totalMinutes > 120) color = 'green';
  else if (totalMinutes > 30) color = 'orange';
  else color = 'red';

  const label = hours > 0 ? `${hours}h ${minutes}m ${t('remaining')}` : `${minutes}m ${t('remaining')}`;

  return (
    <Tag color={color} icon={<ClockCircleOutlined />}>
      {label}
    </Tag>
  );
}
