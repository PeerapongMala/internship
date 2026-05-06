import { Button, Table } from 'antd';
import { ArrowLeftOutlined, PrinterOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { useOmsStore } from '../../stores/omsStore';
import { useLanguage } from '../../i18n/LanguageContext';
import type { TranslationKey } from '../../i18n/en';

export default function InvoicePDFViewer() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { invoiceId } = useParams<{ invoiceId: string }>();

  const invoices = useOmsStore((s) => s.invoices);
  const orders = useOmsStore((s) => s.orders);

  const invoice = invoices.find((inv) => inv.id === invoiceId);
  const order = invoice ? orders.find((o) => o.id === invoice.orderId) : null;

  if (!invoice || !order) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <h2 style={{ color: 'var(--text-secondary)' }}>Invoice not found</h2>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/etax')}>
          {t('back')}
        </Button>
      </div>
    );
  }

  const vat = Math.round(order.totalAmount * 0.07);
  const subtotal = order.totalAmount - vat;

  const itemColumns = [
    { title: '#', key: 'no', width: 40, render: (_: unknown, __: unknown, i: number) => i + 1 },
    { title: t('product'), dataIndex: 'name', key: 'name' },
    { title: t('qty'), dataIndex: 'qty', key: 'qty', width: 60, align: 'center' as const },
    {
      title: t('price'),
      dataIndex: 'price',
      key: 'price',
      width: 110,
      align: 'right' as const,
      render: (v: number) => `฿${v.toLocaleString()}`,
    },
    {
      title: t('total'),
      key: 'amount',
      width: 120,
      align: 'right' as const,
      render: (_: unknown, r: { qty: number; price: number }) => `฿${(r.qty * r.price).toLocaleString()}`,
    },
  ];

  const labelStyle: React.CSSProperties = {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  };

  const valueStyle: React.CSSProperties = {
    fontSize: 14,
    color: '#000',
    marginBottom: 10,
  };

  const subValueStyle: React.CSSProperties = {
    fontSize: 13,
    color: '#555',
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Top bar */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/etax')}>
          {t('back')}
        </Button>
        <Button type="primary" icon={<PrinterOutlined />} onClick={() => window.print()}>
          {t('printPDF' as TranslationKey)}
        </Button>
      </div>

      {/* Invoice document */}
      <div
        className="invoice-document"
        style={{
          background: '#fff',
          color: '#000',
          padding: 48,
          borderRadius: 12,
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h2 style={{ margin: 0, fontSize: 26, color: '#000', fontWeight: 700 }}>
            {t('taxInvoice' as TranslationKey)}
          </h2>
          <div style={{ fontSize: 15, color: '#555', marginTop: 6 }}>
            {invoice.invoiceNumber}
          </div>
          <div style={{ fontSize: 13, color: '#999', marginTop: 2 }}>
            {dayjs(invoice.createdAt).format('DD/MM/YYYY HH:mm')}
          </div>
        </div>

        <div style={{ borderTop: '2px solid #000', marginBottom: 28 }} />

        {/* Seller & Buyer — two-column grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 32,
            marginBottom: 28,
            paddingBottom: 24,
            borderBottom: '1px solid #eee',
          }}
        >
          {/* Seller */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#000', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {t('seller' as TranslationKey)}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#000', marginBottom: 4 }}>
              บริษัท ฟูจิตสึ (ประเทศไทย) จำกัด
            </div>
            <div style={subValueStyle}>Tax ID: 0105500000001</div>
            <div style={subValueStyle}>{order.branch}</div>
          </div>

          {/* Buyer */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#000', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {t('buyer' as TranslationKey)}
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#000', marginBottom: 4 }}>
              {order.customer.name}
            </div>
            <div style={subValueStyle}>{order.customer.phone}</div>
            <div style={subValueStyle}>{order.customer.address}</div>
          </div>
        </div>

        {/* Order info row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 32,
            marginBottom: 28,
          }}
        >
          <div>
            <div style={labelStyle}>{t('orderNumber')}</div>
            <div style={valueStyle}>{order.orderNumber}</div>
          </div>
          <div>
            <div style={labelStyle}>{t('date')}</div>
            <div style={valueStyle}>{dayjs(invoice.createdAt).format('DD/MM/YYYY')}</div>
          </div>
        </div>

        {/* Items Table */}
        <Table
          dataSource={order.items}
          columns={itemColumns}
          rowKey="sku"
          pagination={false}
          size="small"
          style={{ marginBottom: 24 }}
        />

        {/* Summary */}
        <div style={{ borderTop: '1px solid #ddd', paddingTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 48 }}>
            <div style={{ textAlign: 'right', fontSize: 15 }}>
              <div style={{ marginBottom: 8, color: '#666' }}>
                {t('subtotal' as TranslationKey)}
              </div>
              <div style={{ marginBottom: 8, color: '#666' }}>
                {t('vatRate' as TranslationKey)} (7%)
              </div>
              <div style={{ fontWeight: 700, fontSize: 18, paddingTop: 8, borderTop: '1px solid #ddd' }}>
                {t('grandTotal' as TranslationKey)}
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: 15, minWidth: 120 }}>
              <div style={{ marginBottom: 8 }}>฿{subtotal.toLocaleString()}</div>
              <div style={{ marginBottom: 8 }}>฿{vat.toLocaleString()}</div>
              <div style={{ fontWeight: 700, fontSize: 18, paddingTop: 8, borderTop: '1px solid #ddd' }}>
                ฿{order.totalAmount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
