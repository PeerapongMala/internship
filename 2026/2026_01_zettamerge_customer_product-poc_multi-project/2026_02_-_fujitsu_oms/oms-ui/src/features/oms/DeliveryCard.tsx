import { useState } from 'react';
import { Card, Button, Typography, Space, App } from 'antd';
import { EnvironmentOutlined, PhoneOutlined, EditOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { Order, Delivery } from '../../types';
import StatusBadge from '../../components/StatusBadge';
import SignatureCanvas from '../../components/SignatureCanvas';
import { useAppContext } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import dayjs from 'dayjs';

interface Props {
  order: Order;
  delivery: Delivery;
}

export default function DeliveryCard({ order, delivery }: Props) {
  const { dispatch } = useAppContext();
  const { t } = useLanguage();
  const { message } = App.useApp();
  const [sigModalOpen, setSigModalOpen] = useState(false);
  const [signature, setSignature] = useState<string | null>(delivery.signatureBase64);

  const handleSaveSignature = (base64: string) => {
    setSignature(base64);
    dispatch({
      type: 'UPDATE_DELIVERY',
      payload: { deliveryId: delivery.id, updates: { signatureBase64: base64 } },
    });
    setSigModalOpen(false);
    message.success(t('saveSignature'));
  };

  const handleMarkDelivered = () => {
    if (!signature) {
      message.warning(t('signatureRequired'));
      return;
    }
    const now = dayjs().toISOString();
    dispatch({
      type: 'UPDATE_DELIVERY',
      payload: { deliveryId: delivery.id, updates: { status: 'Delivered', deliveredAt: now } },
    });
    dispatch({
      type: 'UPDATE_ORDER_STATUS',
      payload: { orderId: order.id, status: 'Delivered', user: delivery.driverName },
    });
    message.success(t('deliveryCompleted'));
  };

  const isCompleted = delivery.status === 'Delivered';

  return (
    <Card className="delivery-card">
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Typography.Text strong style={{ fontSize: 18 }}>{order.orderNumber}</Typography.Text>
        <StatusBadge status={delivery.status} type="delivery" />
      </div>

      {/* Customer */}
      <Typography.Text strong style={{ fontSize: 18, display: 'block', marginBottom: 12 }}>
        {order.customer.name}
      </Typography.Text>

      <Space direction="vertical" size={4} style={{ width: '100%', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)' }}>
          <PhoneOutlined />
          <Typography.Text type="secondary">{order.customer.phone}</Typography.Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: 'var(--text-muted)' }}>
          <EnvironmentOutlined style={{ marginTop: 3 }} />
          <Typography.Text type="secondary" style={{ fontSize: 15 }}>{order.customer.address}</Typography.Text>
        </div>
      </Space>

      {/* Items */}
      <div style={{ marginBottom: 16, padding: 16, background: 'var(--surface-tertiary)', borderRadius: 12 }}>
        {order.items.map((item) => (
          <div key={item.sku} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <Typography.Text style={{ fontSize: 15 }}>{item.name} x{item.qty}</Typography.Text>
            <Typography.Text style={{ fontSize: 15 }}>฿{item.price.toLocaleString()}</Typography.Text>
          </div>
        ))}
        <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: 8, paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
          <Typography.Text strong style={{ fontSize: 15 }}>{t('total')}</Typography.Text>
          <Typography.Text strong style={{ fontSize: 15 }}>฿{order.totalAmount.toLocaleString()}</Typography.Text>
        </div>
      </div>

      {/* Signature preview */}
      {signature && (
        <div style={{ marginBottom: 16, textAlign: 'center', padding: 12, background: 'var(--surface-tertiary)', borderRadius: 12 }}>
          <img src={signature} alt="Signature" style={{ maxWidth: '100%', height: 80 }} />
        </div>
      )}

      {/* Action buttons */}
      {!isCompleted && (
        <Space direction="vertical" style={{ width: '100%' }} size={8}>
          <Button block size="large" icon={<EditOutlined />} onClick={() => setSigModalOpen(true)}>
            {t('captureSignature')}
          </Button>
          <Button
            block
            size="large"
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={handleMarkDelivered}
            style={{ background: 'var(--success-color)', borderColor: 'var(--success-color)' }}
          >
            {t('markDelivered')}
          </Button>
        </Space>
      )}

      {isCompleted && delivery.deliveredAt && (
        <div style={{ textAlign: 'center', padding: '12px 0' }}>
          <Typography.Text style={{ color: 'var(--success-color)', fontWeight: 600, fontSize: 18 }}>
            {t('Delivered')} — {dayjs(delivery.deliveredAt).format('DD/MM/YY HH:mm')}
          </Typography.Text>
        </div>
      )}

      <SignatureCanvas
        visible={sigModalOpen}
        onSave={handleSaveSignature}
        onCancel={() => setSigModalOpen(false)}
      />
    </Card>
  );
}
