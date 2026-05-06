import { useState, useMemo } from 'react';
import { Table, Button, Select, Modal, Tag, Space, Card, App, Row, Col } from 'antd';
import { FileTextOutlined, SendOutlined, EyeOutlined, ThunderboltOutlined, FilePdfOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAppContext } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import type { Invoice } from '../../types';
import { generateInvoiceNumber, generateTaxXml } from './xmlGenerator';
import ETaxWizard from './ETaxWizard';
import { useETaxStore } from '../../stores/etaxStore';
import TableSearchBar from '../../components/TableSearchBar';

export default function ETaxPage() {
  const { state, dispatch } = useAppContext();
  const { t } = useLanguage();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [xmlPreview, setXmlPreview] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [sending, setSending] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const { wizardOpen, setWizardOpen } = useETaxStore();

  const eligibleOrders = useMemo(() => {
    const invoicedOrderIds = new Set(state.invoices.map((inv) => inv.orderId));
    return state.orders.filter(
      (o) => o.status === 'Delivered' && !invoicedOrderIds.has(o.id),
    );
  }, [state.orders, state.invoices]);

  const handleGenerate = () => {
    if (!selectedOrderId) return;
    const order = state.orders.find((o) => o.id === selectedOrderId);
    if (!order) return;

    const invoiceNumber = generateInvoiceNumber();
    const xmlContent = generateTaxXml(order, invoiceNumber);

    const invoice: Invoice = {
      id: `inv-${Date.now()}`,
      orderId: order.id,
      invoiceNumber,
      xmlContent,
      sentToInet: false,
      sentAt: null,
      createdAt: dayjs().toISOString(),
    };

    dispatch({ type: 'ADD_INVOICE', payload: invoice });
    message.success(t('invoiceGenerated'));
    setSelectedOrderId(null);
  };

  const handleSendToInet = (invoiceId: string) => {
    setSending(invoiceId);
    setTimeout(() => {
      dispatch({ type: 'MARK_INVOICE_SENT', payload: { invoiceId } });
      message.success(t('invoiceSent'));
      setSending(null);
    }, 1500);
  };

  const filteredInvoices = useMemo(() => {
    if (!searchText.trim()) return state.invoices;
    const q = searchText.toLowerCase();
    return state.invoices.filter((inv) => {
      const order = state.orders.find((o) => o.id === inv.orderId);
      return (
        inv.invoiceNumber.toLowerCase().includes(q) ||
        (order?.orderNumber.toLowerCase().includes(q)) ||
        (order?.customer.name.toLowerCase().includes(q))
      );
    });
  }, [state.invoices, state.orders, searchText]);

  const columns: ColumnsType<Invoice> = [
    {
      title: t('invoiceNumber'),
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
    },
    {
      title: t('orderNumber'),
      key: 'orderNumber',
      render: (_, record) => {
        const order = state.orders.find((o) => o.id === record.orderId);
        return order?.orderNumber || '—';
      },
    },
    {
      title: t('customer'),
      key: 'customer',
      render: (_, record) => {
        const order = state.orders.find((o) => o.id === record.orderId);
        return order?.customer.name || '—';
      },
    },
    {
      title: t('sentToInet'),
      dataIndex: 'sentToInet',
      key: 'sentToInet',
      render: (sent: boolean, record) => (
        <Tag color={sent ? 'green' : 'orange'}>
          {sent ? `${t('sent')} — ${dayjs(record.sentAt).format('DD/MM HH:mm')}` : t('notSent')}
        </Tag>
      ),
    },
    {
      title: t('date'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (val: string) => dayjs(val).format('DD/MM/YY HH:mm'),
    },
    {
      title: t('actions'),
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<FilePdfOutlined />}
            onClick={() => navigate(`/etax/invoice/${record.id}`)}
          >
            {t('viewPDF')}
          </Button>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => setXmlPreview(record.xmlContent)}
          >
            {t('viewXml')}
          </Button>
          {!record.sentToInet && (
            <Button
              size="small"
              type="primary"
              icon={<SendOutlined />}
              loading={sending === record.id}
              onClick={() => handleSendToInet(record.id)}
            >
              {sending === record.id ? t('sending') : t('sendToInet')}
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Row gutter={[20, 20]}>
      {/* Wizard or Generate Section */}
      <Col span={24}>
        {wizardOpen ? (
          <ETaxWizard />
        ) : (
          <Card>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <Button
                type="primary"
                icon={<ThunderboltOutlined />}
                onClick={() => setWizardOpen(true)}
                size="large"
                style={{
                  height: 48,
                  fontSize: 16,
                  borderRadius: 12,
                  paddingInline: 28,
                }}
              >
                {t('startWizard')}
              </Button>

              <div
                style={{
                  width: 1,
                  height: 32,
                  background: 'var(--border-primary)',
                  marginInline: 8,
                }}
              />

              <Select
                value={selectedOrderId}
                onChange={setSelectedOrderId}
                placeholder={t('selectOrder')}
                style={{ width: 360 }}
                options={eligibleOrders.map((o) => ({
                  value: o.id,
                  label: `${o.orderNumber} — ${o.customer.name} (฿${o.totalAmount.toLocaleString()})`,
                }))}
                allowClear
                notFoundContent={t('noDeliveredOrders')}
              />
              <Button
                type="primary"
                icon={<FileTextOutlined />}
                onClick={handleGenerate}
                disabled={!selectedOrderId}
              >
                {t('generateInvoice')}
              </Button>
            </div>
          </Card>
        )}
      </Col>

      {/* Invoice Table */}
      <Col span={24}>
        <Card title={t('invoiceList')}>
          <TableSearchBar
            searchText={searchText}
            onSearchChange={setSearchText}
            placeholderKey="searchInvoices"
          />
          <Table<Invoice>
            dataSource={filteredInvoices}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            size="middle"
          />
        </Card>
      </Col>

      {/* XML Preview Modal */}
      <Modal
        title={t('xmlPreview')}
        open={!!xmlPreview}
        onCancel={() => setXmlPreview(null)}
        footer={null}
        width={700}
      >
        <pre
          style={{
            background: 'var(--surface-tertiary)',
            padding: 20,
            borderRadius: 12,
            overflow: 'auto',
            maxHeight: 500,
            fontSize: 12,
            lineHeight: 1.6,
            fontFamily: "'SF Mono', 'Fira Code', monospace",
          }}
        >
          {xmlPreview}
        </pre>
      </Modal>

    </Row>
  );
}
