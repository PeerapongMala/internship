import { Modal, Typography, Button, Divider } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';
import { useLanguage } from '../../i18n/LanguageContext';
import type { ShippingLabelData } from '../../services/reservation.service';

interface Props {
  open: boolean;
  label: ShippingLabelData | null;
  onClose: () => void;
}

export default function ShippingLabel({ open, label, onClose }: Props) {
  const { t } = useLanguage();
  if (!label) return null;

  const isFlash = label.provider === 'flash';

  return (
    <Modal
      open={open}
      onCancel={onClose}
      title={t('viewShippingLabel' as never)}
      width={480}
      footer={[
        <Button key="close" onClick={onClose}>{t('cancel')}</Button>,
        <Button key="print" type="primary" icon={<PrinterOutlined />} onClick={() => window.print()}>
          {t('printLabel' as never)}
        </Button>,
      ]}
    >
      <div style={{
        border: '2px solid var(--border-light)',
        borderRadius: 12,
        padding: 24,
        background: 'var(--card-bg)',
      }}>
        {/* Provider header */}
        <div style={{
          textAlign: 'center',
          padding: '12px 0',
          marginBottom: 16,
          borderBottom: '2px solid var(--border-light)',
        }}>
          <Typography.Title level={3} style={{
            margin: 0,
            color: isFlash ? '#fbbf24' : '#d40511',
            letterSpacing: 2,
          }}>
            {isFlash ? 'FLASH EXPRESS' : 'DHL EXPRESS'}
          </Typography.Title>
        </div>

        {/* Tracking number */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            {t('trackingNumber' as never)}
          </Typography.Text>
          <br />
          <Typography.Text strong style={{ fontSize: 20, letterSpacing: 2 }}>
            {label.trackingNumber}
          </Typography.Text>
        </div>

        {/* Mock barcode */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          marginBottom: 16,
          padding: '8px 0',
        }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: Math.random() > 0.5 ? 3 : 1.5,
                height: 40,
                background: 'var(--text-primary)',
              }}
            />
          ))}
        </div>

        <Divider style={{ margin: '12px 0' }} />

        {/* Sender */}
        <div style={{ marginBottom: 12 }}>
          <Typography.Text strong style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            FROM
          </Typography.Text>
          <br />
          <Typography.Text style={{ fontSize: 14 }}>{label.senderName}</Typography.Text>
          <br />
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>{label.senderAddress}</Typography.Text>
        </div>

        {/* Recipient */}
        <div>
          <Typography.Text strong style={{ fontSize: 12, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
            TO
          </Typography.Text>
          <br />
          <Typography.Text strong style={{ fontSize: 15 }}>{label.recipientName}</Typography.Text>
          <br />
          <Typography.Text style={{ fontSize: 13 }}>{label.recipientAddress}</Typography.Text>
        </div>
      </div>
    </Modal>
  );
}
