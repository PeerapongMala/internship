import { Typography } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import { useLanguage } from '../../i18n/LanguageContext';

interface Props {
  coordinates?: { lat: number; lng: number };
  interactive?: boolean;
  onPick?: (coords: { lat: number; lng: number }) => void;
}

export default function MapPickerMock({ coordinates, interactive, onPick }: Props) {
  const { t } = useLanguage();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !onPick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    // Map to Bangkok bounds: lat 13.5-13.95, lng 100.35-100.75
    const lat = 13.95 - y * 0.45;
    const lng = 100.35 + x * 0.4;
    onPick({ lat: +lat.toFixed(4), lng: +lng.toFixed(4) });
  };

  return (
    <div
      onClick={handleClick}
      style={{
        height: 180,
        border: '2px dashed var(--border-light)',
        borderRadius: 12,
        background: 'var(--surface-secondary)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: interactive ? 'crosshair' : 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Grid lines for mock map feel */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.08 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={`h${i}`} style={{ position: 'absolute', top: `${i * 20}%`, left: 0, right: 0, height: 1, background: 'var(--text-primary)' }} />
        ))}
        {[1, 2, 3, 4].map((i) => (
          <div key={`v${i}`} style={{ position: 'absolute', left: `${i * 20}%`, top: 0, bottom: 0, width: 1, background: 'var(--text-primary)' }} />
        ))}
      </div>

      <EnvironmentOutlined style={{ fontSize: 32, color: '#ee4d2d', marginBottom: 8 }} />

      {coordinates ? (
        <Typography.Text style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
        </Typography.Text>
      ) : (
        <Typography.Text type="secondary" style={{ fontSize: 14 }}>
          {interactive ? t('clickToPin' as never) : t('mapPicker' as never)}
        </Typography.Text>
      )}
    </div>
  );
}
