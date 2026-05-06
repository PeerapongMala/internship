import { useState, useEffect } from 'react';
import { Card, Descriptions, Button, Input, Spin, App } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { etaxService } from '../../services/etax.service';
import { useETaxStore } from '../../stores/etaxStore';
import { useLanguage } from '../../i18n/LanguageContext';
import type { CustomerVerification } from '../../types/etax';

export default function VerifyStep() {
  const { t } = useLanguage();
  const { message } = App.useApp();
  const { currentScanResult, setVerification, setWizardStep } = useETaxStore();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [customerData, setCustomerData] = useState<CustomerVerification | null>(null);
  const [editTaxId, setEditTaxId] = useState('');
  const [editAddress, setEditAddress] = useState('');

  useEffect(() => {
    if (!currentScanResult) return;

    const fetchCustomer = async () => {
      setLoading(true);
      try {
        const result = await etaxService.verifyCustomer(currentScanResult.receiptId);
        if (result.success && result.data) {
          setCustomerData(result.data);
          setEditTaxId(result.data.taxId);
          setEditAddress(result.data.address);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [currentScanResult]);

  const handleConfirm = async () => {
    if (!currentScanResult || !customerData) return;

    setGenerating(true);
    try {
      // Update verification with edited fields
      const updatedVerification: CustomerVerification = {
        ...customerData,
        taxId: editTaxId,
        address: editAddress,
      };
      setVerification(updatedVerification);

      const result = await etaxService.generateInvoice(currentScanResult.orderId);
      if (result.success) {
        message.success(t('invoiceCreated'));
        setWizardStep('success');
      }
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <Spin size="large" />
        <div
          style={{
            marginTop: 16,
            fontSize: 16,
            color: 'var(--text-secondary)',
          }}
        >
          {t('verifying')}
        </div>
      </div>
    );
  }

  if (!customerData || !currentScanResult) {
    return null;
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      {/* Receipt Summary */}
      <Card
        style={{
          marginBottom: 20,
          borderRadius: 16,
          border: '1px solid var(--border-primary)',
          background: 'var(--surface-secondary)',
        }}
      >
        <Descriptions
          column={1}
          size="middle"
          labelStyle={{ fontSize: 16, color: 'var(--text-secondary)', fontWeight: 500 }}
          contentStyle={{ fontSize: 16, color: 'var(--text-primary)' }}
        >
          <Descriptions.Item label={t('receiptId')}>
            {currentScanResult.receiptId}
          </Descriptions.Item>
          <Descriptions.Item label={t('receiptAmount')}>
            {`\u0E3F${currentScanResult.amount.toLocaleString()}`}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Customer Details (editable) */}
      <Card
        title={
          <span style={{ fontSize: 18, color: 'var(--text-primary)' }}>
            {t('customerDetails')}
          </span>
        }
        style={{
          marginBottom: 20,
          borderRadius: 16,
          border: '1px solid var(--border-primary)',
          background: 'var(--surface-secondary)',
        }}
      >
        <Descriptions
          column={1}
          size="middle"
          labelStyle={{ fontSize: 16, color: 'var(--text-secondary)', fontWeight: 500 }}
          contentStyle={{ fontSize: 16, color: 'var(--text-primary)' }}
        >
          <Descriptions.Item label={t('name')}>
            {customerData.customerName}
          </Descriptions.Item>
          <Descriptions.Item label={t('taxId')}>
            <Input
              value={editTaxId}
              onChange={(e) => setEditTaxId(e.target.value)}
              style={{ fontSize: 16, borderRadius: 8, maxWidth: 300 }}
              size="large"
            />
          </Descriptions.Item>
          <Descriptions.Item label={t('address')}>
            <Input.TextArea
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
              style={{ fontSize: 16, borderRadius: 8 }}
              autoSize={{ minRows: 2, maxRows: 4 }}
            />
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* Confirm Button */}
      <div style={{ textAlign: 'center' }}>
        <Button
          type="primary"
          size="large"
          icon={<CheckCircleOutlined />}
          onClick={handleConfirm}
          loading={generating}
          style={{
            height: 56,
            fontSize: 18,
            borderRadius: 12,
            paddingInline: 40,
          }}
        >
          {generating ? t('generating') : t('confirmDetails')}
        </Button>
      </div>
    </div>
  );
}
