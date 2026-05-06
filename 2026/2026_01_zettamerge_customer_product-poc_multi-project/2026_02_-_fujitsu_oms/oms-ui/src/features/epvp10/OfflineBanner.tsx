import { Alert } from 'antd';
import { WifiOutlined } from '@ant-design/icons';
import { useLanguage } from '../../i18n/LanguageContext';
import { useEpvp10Store } from '../../stores/epvp10Store';
import { useGlobalStore } from '../../stores/globalStore';

export default function OfflineBanner() {
  const { t } = useLanguage();
  const isOfflineMode = useEpvp10Store((s) => s.isOfflineMode);
  const networkOnline = useGlobalStore((s) => s.networkOnline);

  if (!isOfflineMode && networkOnline) return null;

  return (
    <Alert
      type="warning"
      showIcon
      banner
      closable={false}
      icon={<WifiOutlined style={{ fontSize: 18 }} />}
      message={
        <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>
          {t('offlineModeActive')}
        </span>
      }
      description={
        <span style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
          {t('localCacheActive')}
        </span>
      }
      style={{ marginBottom: 16, borderRadius: 12 }}
    />
  );
}
