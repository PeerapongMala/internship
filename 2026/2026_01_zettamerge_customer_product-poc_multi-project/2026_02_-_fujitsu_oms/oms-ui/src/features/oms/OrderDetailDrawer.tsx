import { useState } from 'react';
import { Drawer, Descriptions, Table, Button, Space, Timeline, App, Alert, Modal, Tag } from 'antd';
import { SyncOutlined, CheckCircleOutlined, CloseCircleOutlined, DollarOutlined, FileTextOutlined } from '@ant-design/icons';
import type { Order, OrderStatus } from '../../types';
import { STATUS_TRANSITIONS } from '../../types';
import StatusBadge from '../../components/StatusBadge';
import SLABadge from '../../components/SLABadge';
import MarketplaceBadge from './MarketplaceBadge';
import { useAppContext } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import type { TranslationKey } from '../../i18n/en';
import { omsService } from '../../services/oms.service';
import dayjs from 'dayjs';

interface Props {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

export default function OrderDetailDrawer({ order, open, onClose }: Props) {
  const { state, dispatch } = useAppContext();
  const { t } = useLanguage();
  const { message } = App.useApp();
  const [syncLoading, setSyncLoading] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);

  if (!order) return null;

  const nextStatuses = STATUS_TRANSITIONS[order.status];
  const orderLogs = state.logs.filter((l) => l.orderId === order.id);
  const isPaid = order.paymentStatus === 'paid';

  const handleStatusUpdate = (newStatus: OrderStatus) => {
    dispatch({
      type: 'UPDATE_ORDER_STATUS',
      payload: { orderId: order.id, status: newStatus, user: 'admin' },
    });
    message.success(t('statusUpdated'));
  };

  const handleSyncToPOS = async () => {
    setSyncLoading(true);
    try {
      const result = await omsService.syncToPOS(order.id);
      if (result.success) {
        message.success(t('syncSuccess' as TranslationKey));
      } else {
        message.error(result.error || t('syncFailed' as TranslationKey));
      }
    } catch {
      message.error(t('syncFailed' as TranslationKey));
    } finally {
      setSyncLoading(false);
    }
  };

  const handleCustomerPay = () => {
    dispatch({ type: 'MARK_ORDER_PAID', payload: { orderId: order.id } });
    message.success(t('paymentReceived' as TranslationKey));
  };

  const renderSyncButton = () => {
    const syncStatus = order.posSyncStatus;

    if (syncStatus === 'syncing') {
      return (
        <Button type="primary" loading icon={<SyncOutlined spin />} disabled>
          {t('syncing' as TranslationKey)}
        </Button>
      );
    }

    if (syncStatus === 'success') {
      return (
        <Button type="primary" icon={<CheckCircleOutlined style={{ color: 'green' }} />} disabled>
          {t('synced' as TranslationKey)}
        </Button>
      );
    }

    if (syncStatus === 'error') {
      return (
        <Button type="primary" danger icon={<CloseCircleOutlined />} onClick={handleSyncToPOS} loading={syncLoading}>
          {t('syncFailedRetry' as TranslationKey)}
        </Button>
      );
    }

    return (
      <Button type="primary" icon={<SyncOutlined />} onClick={handleSyncToPOS} loading={syncLoading}>
        {t('syncToPOS' as TranslationKey)}
      </Button>
    );
  };

  const itemColumns = [
    { title: t('sku'), dataIndex: 'sku', key: 'sku' },
    { title: t('product'), dataIndex: 'name', key: 'name' },
    { title: t('qty'), dataIndex: 'qty', key: 'qty', width: 60 },
    {
      title: t('price'),
      dataIndex: 'price',
      key: 'price',
      width: 100,
      render: (v: number) => `฿${v.toLocaleString()}`,
    },
  ];

  return (
    <Drawer
      title={`${t('orderDetail')} — ${order.orderNumber}`}
      open={open}
      onClose={onClose}
      width={520}
    >
      {/* Status + Marketplace + SLA */}
      <div style={{ marginBottom: 16, display: 'flex', gap: 8, alignItems: 'center' }}>
        <StatusBadge status={order.status} />
        <MarketplaceBadge source={order.marketplace} />
        {!['Delivered', 'Failed'].includes(order.status) && (
          <SLABadge deadline={order.slaDeadline} />
        )}
      </div>

      {/* Customer Info */}
      <Descriptions
        title={t('customerInfo')}
        column={1}
        bordered
        size="small"
        style={{ marginBottom: 16 }}
      >
        <Descriptions.Item label={t('name')}>{order.customer.name}</Descriptions.Item>
        <Descriptions.Item label={t('phone')}>{order.customer.phone}</Descriptions.Item>
        <Descriptions.Item label={t('address')}>{order.customer.address}</Descriptions.Item>
        <Descriptions.Item label={t('branch')}>{order.branch}</Descriptions.Item>
      </Descriptions>

      {/* Items */}
      <Table
        dataSource={order.items}
        columns={itemColumns}
        rowKey="sku"
        pagination={false}
        size="small"
        style={{ marginBottom: 16 }}
        footer={() => (
          <div style={{ textAlign: 'right', fontWeight: 600 }}>
            {t('total')}: ฿{order.totalAmount.toLocaleString()}
          </div>
        )}
      />

      {/* Payment Section */}
      <div style={{ marginBottom: 24 }}>
        <h4>{t('paymentMethod' as TranslationKey)}</h4>
        {isPaid ? (
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Tag color="green">{t('paid' as TranslationKey)}</Tag>
              <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                {order.receiptId} — {dayjs(order.paidAt).format('DD/MM/YY HH:mm')}
              </span>
            </div>
            <Button icon={<FileTextOutlined />} onClick={() => setReceiptOpen(true)}>
              {t('viewReceipt' as TranslationKey)}
            </Button>
          </Space>
        ) : (
          <Button
            type="primary"
            icon={<DollarOutlined />}
            onClick={handleCustomerPay}
            style={{ background: '#52c41a', borderColor: '#52c41a' }}
          >
            {t('customerPay' as TranslationKey)}
          </Button>
        )}
      </div>

      {/* Out for Delivery notice */}
      {order.status === 'OutForDelivery' && (
        <Alert
          type="info"
          showIcon
          message={t('outForDeliveryNotice')}
          style={{ marginBottom: 16 }}
        />
      )}

      {/* Status Update */}
      {nextStatuses.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h4>{t('updateStatus')}</h4>
          <Space wrap>
            {nextStatuses.map((ns) => {
              const needsPay = ns === 'Picking' && !isPaid;
              return (
                <Button
                  key={ns}
                  type={ns === 'Failed' ? 'default' : 'primary'}
                  danger={ns === 'Failed'}
                  disabled={needsPay}
                  onClick={() => handleStatusUpdate(ns)}
                  title={needsPay ? t('payBeforePicking' as TranslationKey) : undefined}
                >
                  {t(ns as TranslationKey)}
                </Button>
              );
            })}
          </Space>
        </div>
      )}

      {/* Sync to POS */}
      <div style={{ marginBottom: 24 }}>
        <h4>{t('syncToPOS' as TranslationKey)}</h4>
        {renderSyncButton()}
      </div>

      {/* Timeline */}
      {orderLogs.length > 0 && (
        <div>
          <h4>{t('timeline')}</h4>
          <Timeline
            items={orderLogs.map((log) => ({
              children: (
                <>
                  <strong>{log.action}</strong>
                  <br />
                  <small>
                    {dayjs(log.timestamp).format('DD/MM/YY HH:mm')} — {log.user}
                  </small>
                </>
              ),
            }))}
          />
        </div>
      )}

      {/* Receipt Modal */}
      <Modal
        title={t('receiptDetail' as TranslationKey)}
        open={receiptOpen}
        onCancel={() => setReceiptOpen(false)}
        footer={null}
        width={480}
      >
        {isPaid && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 20 }}>{order.receiptId}</h2>
              <Tag color="green" style={{ marginTop: 8, fontSize: 14, padding: '2px 12px' }}>
                {t('paid' as TranslationKey)}
              </Tag>
            </div>

            <Descriptions column={1} size="small" bordered style={{ marginBottom: 16 }}>
              <Descriptions.Item label={t('orderNumber')}>{order.orderNumber}</Descriptions.Item>
              <Descriptions.Item label={t('name')}>{order.customer.name}</Descriptions.Item>
              <Descriptions.Item label={t('phone')}>{order.customer.phone}</Descriptions.Item>
              <Descriptions.Item label={t('paymentMethod' as TranslationKey)}>
                {t('cash' as TranslationKey)}
              </Descriptions.Item>
              <Descriptions.Item label={t('paidAt' as TranslationKey)}>
                {dayjs(order.paidAt).format('DD/MM/YYYY HH:mm:ss')}
              </Descriptions.Item>
            </Descriptions>

            <Table
              dataSource={order.items}
              columns={itemColumns}
              rowKey="sku"
              pagination={false}
              size="small"
              footer={() => (
                <div style={{ textAlign: 'right', fontWeight: 700, fontSize: 16 }}>
                  {t('total')}: ฿{order.totalAmount.toLocaleString()}
                </div>
              )}
            />
          </div>
        )}
      </Modal>
    </Drawer>
  );
}
