import { useState } from 'react';
import { Form, Input, DatePicker, Checkbox, Button, Card, App, Row, Col, Select, InputNumber, Typography, Segmented } from 'antd';
import { PlusOutlined, DeleteOutlined, CloudDownloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useAppContext } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useReservationStore } from '../../stores/reservationStore';
import { reservationService } from '../../services/reservation.service';
import type { ShippingLabelData } from '../../services/reservation.service';
import { BRANCHES } from '../../types';
import type { Order, OrderItem, ShippingProvider } from '../../types';
import MapPickerMock from './MapPickerMock';
import ShippingLabel from './ShippingLabel';

const PRODUCT_CATALOG = [
  { sku: 'AP-001', name: 'เครื่องฟอกอากาศ Sharp', price: 8990 },
  { sku: 'RC-002', name: 'หม้อหุงข้าว Zojirushi', price: 5490 },
  { sku: 'CM-005', name: 'เครื่องชงกาแฟ DeLonghi', price: 15900 },
  { sku: 'VC-010', name: 'เครื่องดูดฝุ่น Dyson V15', price: 24900 },
  { sku: 'WM-008', name: 'เครื่องซักผ้า Samsung 12kg', price: 13900 },
  { sku: 'TV-015', name: 'ทีวี LG OLED 55"', price: 39900 },
  { sku: 'AC-020', name: 'แอร์ Daikin Inverter 12000BTU', price: 22900 },
  { sku: 'MW-025', name: 'ไมโครเวฟ Panasonic', price: 4590 },
  { sku: 'BL-035', name: 'เครื่องปั่น Philips', price: 2990 },
  { sku: 'IR-040', name: 'เตารีดไอน้ำ Tefal', price: 3490 },
  { sku: 'FR-030', name: 'ตู้เย็น Hitachi 2 ประตู', price: 18900 },
  { sku: 'FN-045', name: 'พัดลมตั้งพื้น Hatari', price: 1290 },
];

interface CartItem extends OrderItem {
  key: string;
}

export default function ReservationPage() {
  const { dispatch } = useAppContext();
  const { t } = useLanguage();
  const { notification } = App.useApp();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { mode, setMode } = useReservationStore();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | undefined>();
  const [fetchingAddress, setFetchingAddress] = useState(false);
  const [shippingLabel, setShippingLabel] = useState<ShippingLabelData | null>(null);
  const [labelOpen, setLabelOpen] = useState(false);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleAddProduct = () => {
    if (!selectedSku) return;
    const existing = cartItems.find((c) => c.sku === selectedSku);
    if (existing) {
      setCartItems((prev) =>
        prev.map((c) => (c.sku === selectedSku ? { ...c, qty: c.qty + 1 } : c)),
      );
    } else {
      const product = PRODUCT_CATALOG.find((p) => p.sku === selectedSku);
      if (product) {
        setCartItems((prev) => [...prev, { ...product, qty: 1, key: product.sku }]);
      }
    }
    setSelectedSku(null);
  };

  const handleRemoveItem = (sku: string) => {
    setCartItems((prev) => prev.filter((c) => c.sku !== sku));
  };

  const handleQtyChange = (sku: string, qty: number | null) => {
    if (!qty || qty < 1) return;
    setCartItems((prev) =>
      prev.map((c) => (c.sku === sku ? { ...c, qty } : c)),
    );
  };

  const handleFetchAddress = async () => {
    setFetchingAddress(true);
    const result = await reservationService.fetchAddressFromMarketplace('mock');
    if (result.success) {
      form.setFieldsValue({ address: result.data.address });
      setCoordinates(result.data.coordinates);
    }
    setFetchingAddress(false);
  };

  const handleSubmit = async (values: {
    customerName: string;
    phone: string;
    address: string;
    branch: string;
    deliveryDate: dayjs.Dayjs;
    pdpaConsent: boolean;
    shippingProvider: ShippingProvider;
  }) => {
    if (cartItems.length === 0) {
      notification.warning({ message: t('addProductRequired'), placement: 'topRight' });
      return;
    }

    const now = dayjs();
    const id = `ord-${Date.now()}`;
    const orderNumber = `ORD-${now.format('YYYYMMDD')}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

    const items: OrderItem[] = cartItems.map(({ sku, name, qty, price }) => ({ sku, name, qty, price }));

    const newOrder: Order = {
      id,
      orderNumber,
      type: 'reservation',
      status: 'Pending',
      branch: values.branch,
      marketplace: mode === 'online' ? 'phone' : 'walk-in',
      shippingProvider: values.shippingProvider,
      coordinates,
      customer: {
        name: values.customerName,
        phone: values.phone,
        address: values.address,
      },
      items,
      totalAmount,
      pdpaConsent: values.pdpaConsent,
      slaDeadline: values.deliveryDate.endOf('day').toISOString(),
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    };

    dispatch({ type: 'ADD_ORDER', payload: newOrder });

    // Generate shipping label if Flash or DHL
    if (values.shippingProvider !== 'self-delivery') {
      const labelResult = await reservationService.generateShippingLabel(
        values.shippingProvider as 'flash' | 'dhl',
        newOrder,
      );
      if (labelResult.success) {
        setShippingLabel(labelResult.data);
        setLabelOpen(true);
      }
    }

    notification.success({
      message: t('reservationCreated'),
      description: orderNumber,
      placement: 'topRight',
    });
    form.resetFields();
    setCartItems([]);
    setCoordinates(undefined);
    navigate('/orders', { state: { openOrderId: id } });
  };

  const branchOptions = BRANCHES.map((b) => ({ value: b, label: b }));
  const productOptions = PRODUCT_CATALOG.map((p) => ({
    value: p.sku,
    label: `${p.name} — ฿${p.price.toLocaleString()}`,
  }));

  const shippingOptions = [
    { value: 'flash', label: t('flashExpress' as never) },
    { value: 'dhl', label: t('dhlExpress' as never) },
    { value: 'self-delivery', label: t('selfDelivery' as never) },
  ];

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark="optional"
        size="large"
        initialValues={{ shippingProvider: 'self-delivery' }}
      >
        {/* Mode selector */}
        <div style={{ marginBottom: 20 }}>
          <Segmented
            value={mode}
            onChange={(val) => setMode(val as 'online' | 'offline')}
            options={[
              { label: t('onlineMode' as never), value: 'online' },
              { label: t('offlineMode' as never), value: 'offline' },
            ]}
            size="large"
          />
        </div>

        <Row gutter={[24, 24]}>
          {/* Left column — Customer info */}
          <Col xs={24} lg={12}>
            <Card title={t('customerInfo')}>
              <Form.Item
                name="customerName"
                label={t('customerName')}
                rules={[{ required: true, message: t('required') }]}
              >
                <Input placeholder="สมชาย วงศ์สวัสดิ์" />
              </Form.Item>

              <Form.Item
                name="phone"
                label={t('phoneNumber')}
                rules={[
                  { required: true, message: t('required') },
                  { pattern: /^0\d{1,2}-?\d{3}-?\d{4}$/, message: t('invalidPhone') },
                ]}
              >
                <Input placeholder="081-234-5678" />
              </Form.Item>

              <Form.Item
                name="address"
                label={t('deliveryAddress')}
                rules={[{ required: true, message: t('required') }]}
              >
                <Input.TextArea rows={3} placeholder="123 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110" />
              </Form.Item>

              {/* Online mode: fetch address button */}
              {mode === 'online' && (
                <Button
                  icon={<CloudDownloadOutlined />}
                  onClick={handleFetchAddress}
                  loading={fetchingAddress}
                  style={{ marginBottom: 16 }}
                >
                  {t('fetchFromMarketplace' as never)}
                </Button>
              )}

              {/* Map picker */}
              <div style={{ marginBottom: 16 }}>
                <MapPickerMock
                  coordinates={coordinates}
                  interactive={mode === 'offline'}
                  onPick={(coords) => setCoordinates(coords)}
                />
              </div>

              <Form.Item
                name="branch"
                label={t('branch')}
                rules={[{ required: true, message: t('required') }]}
              >
                <Select options={branchOptions} placeholder={t('selectBranch')} />
              </Form.Item>

              <Form.Item
                name="deliveryDate"
                label={t('deliveryDate')}
                rules={[{ required: true, message: t('required') }]}
              >
                <DatePicker
                  style={{ width: '100%' }}
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                  format="DD/MM/YYYY"
                />
              </Form.Item>

              <Form.Item
                name="shippingProvider"
                label={t('shippingProvider' as never)}
                rules={[{ required: true, message: t('required') }]}
              >
                <Select options={shippingOptions} />
              </Form.Item>

              <Form.Item
                name="pdpaConsent"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) =>
                      value ? Promise.resolve() : Promise.reject(new Error(t('pdpaRequired'))),
                  },
                ]}
              >
                <Checkbox>
                  <span style={{ fontSize: 13, lineHeight: 1.6 }}>{t('pdpaConsent')}</span>
                </Checkbox>
              </Form.Item>
            </Card>
          </Col>

          {/* Right column — Products */}
          <Col xs={24} lg={12}>
            <Card title={t('products')}>
              {/* Add product */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                <Select
                  value={selectedSku}
                  onChange={setSelectedSku}
                  options={productOptions}
                  placeholder={t('selectProduct')}
                  style={{ flex: 1 }}
                  showSearch
                  optionFilterProp="label"
                  allowClear
                />
                <Button icon={<PlusOutlined />} onClick={handleAddProduct} disabled={!selectedSku}>
                  {t('addItem')}
                </Button>
              </div>

              {/* Cart items */}
              {cartItems.length === 0 ? (
                <Typography.Text type="secondary" style={{ display: 'block', textAlign: 'center', padding: '24px 0' }}>
                  {t('noProductsAdded')}
                </Typography.Text>
              ) : (
                <div>
                  {cartItems.map((item) => (
                    <div
                      key={item.sku}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 0',
                        borderBottom: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <Typography.Text strong style={{ fontSize: 15 }}>{item.name}</Typography.Text>
                        <br />
                        <Typography.Text type="secondary" style={{ fontSize: 13 }}>{item.sku} — ฿{item.price.toLocaleString()}</Typography.Text>
                      </div>
                      <InputNumber
                        min={1}
                        max={99}
                        value={item.qty}
                        onChange={(val) => handleQtyChange(item.sku, val)}
                        style={{ width: 70 }}
                      />
                      <Typography.Text strong style={{ width: 90, textAlign: 'right', fontSize: 15 }}>
                        ฿{(item.price * item.qty).toLocaleString()}
                      </Typography.Text>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleRemoveItem(item.sku)}
                        size="small"
                      />
                    </div>
                  ))}

                  {/* Total */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 0 8px',
                  }}>
                    <Typography.Text strong style={{ fontSize: 18 }}>{t('total')}</Typography.Text>
                    <Typography.Text strong style={{ fontSize: 20 }}>฿{totalAmount.toLocaleString()}</Typography.Text>
                  </div>
                </div>
              )}
            </Card>

            {/* Submit */}
            <Form.Item style={{ marginTop: 20 }}>
              <Button type="primary" htmlType="submit" size="large" block>
                {t('submitReservation')}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <ShippingLabel open={labelOpen} label={shippingLabel} onClose={() => setLabelOpen(false)} />
    </>
  );
}
