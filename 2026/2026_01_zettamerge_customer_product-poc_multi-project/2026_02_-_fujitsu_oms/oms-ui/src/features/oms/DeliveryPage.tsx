import { useMemo } from 'react';
import { Empty, Typography, Row, Col } from 'antd';
import { useAppContext } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import DeliveryCard from './DeliveryCard';

export default function DeliveryPage() {
  const { state } = useAppContext();
  const { t } = useLanguage();

  const deliveryItems = useMemo(() => {
    return state.deliveries
      .filter((d) => d.status !== 'Failed')
      .map((delivery) => {
        const order = state.orders.find((o) => o.id === delivery.orderId);
        return order ? { delivery, order } : null;
      })
      .filter(Boolean) as { delivery: (typeof state.deliveries)[0]; order: (typeof state.orders)[0] }[];
  }, [state.deliveries, state.orders]);

  const needToMark = useMemo(
    () => deliveryItems.filter(({ delivery }) => delivery.status !== 'Delivered'),
    [deliveryItems],
  );

  const marked = useMemo(
    () => deliveryItems.filter(({ delivery }) => delivery.status === 'Delivered'),
    [deliveryItems],
  );

  return (
    <div>
      {/* Section 1: Need to Mark */}
      <div className="delivery-section-header">
        <Typography.Title level={4} style={{ margin: 0 }}>
          {t('needToMark')}
        </Typography.Title>
        <Typography.Text type="secondary" style={{ fontSize: 14 }}>
          {needToMark.length} {t('assignedOrders').toLowerCase()}
        </Typography.Text>
      </div>

      {needToMark.length === 0 ? (
        <Empty description="No pending deliveries" style={{ marginBottom: 32 }} />
      ) : (
        <Row gutter={[20, 20]} style={{ marginBottom: 40 }}>
          {needToMark.map(({ delivery, order }) => (
            <Col xs={24} md={12} xl={8} key={delivery.id}>
              <DeliveryCard order={order} delivery={delivery} />
            </Col>
          ))}
        </Row>
      )}

      {/* Section 2: Marked as Delivered */}
      <div className="delivery-section-header">
        <Typography.Title level={4} style={{ margin: 0 }}>
          {t('markedDelivered')}
        </Typography.Title>
        <Typography.Text type="secondary" style={{ fontSize: 14 }}>
          {marked.length} {t('Delivered').toLowerCase()}
        </Typography.Text>
      </div>

      {marked.length === 0 ? (
        <Empty description="No completed deliveries" />
      ) : (
        <Row gutter={[20, 20]}>
          {marked.map(({ delivery, order }) => (
            <Col xs={24} md={12} xl={8} key={delivery.id}>
              <DeliveryCard order={order} delivery={delivery} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
