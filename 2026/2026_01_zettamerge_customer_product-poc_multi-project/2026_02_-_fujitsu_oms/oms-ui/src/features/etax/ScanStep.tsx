import { useState } from 'react';
import { Card, Button, Input, Space, Typography, Spin } from 'antd';
import { ScanOutlined, SearchOutlined } from '@ant-design/icons';
import { etaxService } from '../../services/etax.service';
import { useETaxStore } from '../../stores/etaxStore';
import { useLanguage } from '../../i18n/LanguageContext';

const { Text, Title } = Typography;

export default function ScanStep() {
  const { t } = useLanguage();
  const { setScanResult, setWizardStep } = useETaxStore();
  const [receiptInput, setReceiptInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanActive, setScanActive] = useState(false);

  const handleScanQR = async () => {
    setLoading(true);
    setScanActive(true);
    try {
      const result = await etaxService.scanQRCode('mock-image-data');
      if (result.success && result.data) {
        setScanResult(result.data);
        setWizardStep('verify');
      }
    } finally {
      setLoading(false);
      setScanActive(false);
    }
  };

  const handleSearch = async () => {
    if (!receiptInput.trim()) return;
    setLoading(true);
    try {
      const result = await etaxService.lookupByReceiptId(receiptInput.trim());
      if (result.success && result.data) {
        setScanResult(result.data);
        setWizardStep('verify');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: '0 auto' }}>
      {/* QR Scan Section */}
      <Card
        style={{
          marginBottom: 20,
          borderRadius: 16,
          border: '1px solid var(--border-primary)',
          background: 'var(--surface-secondary)',
        }}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Title level={4} style={{ marginBottom: 20, color: 'var(--text-primary)', fontSize: 20 }}>
            {t('scanQR')}
          </Title>

          {scanActive ? (
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  background: 'var(--surface-tertiary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  animation: 'etax-pulse 1.5s ease-in-out infinite',
                }}
              >
                <ScanOutlined style={{ fontSize: 56, color: 'var(--primary-color)' }} />
              </div>
              <Text style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
                {t('scanning')}
              </Text>
              <style>{`
                @keyframes etax-pulse {
                  0%, 100% { transform: scale(1); opacity: 1; }
                  50% { transform: scale(1.08); opacity: 0.7; }
                }
              `}</style>
            </div>
          ) : (
            <Button
              type="primary"
              size="large"
              icon={<ScanOutlined />}
              onClick={handleScanQR}
              loading={loading && !receiptInput}
              style={{
                height: 56,
                fontSize: 18,
                borderRadius: 12,
                paddingInline: 40,
              }}
            >
              {t('scanQR')}
            </Button>
          )}
        </div>
      </Card>

      {/* Manual Receipt ID Search */}
      <Card
        style={{
          borderRadius: 16,
          border: '1px solid var(--border-primary)',
          background: 'var(--surface-secondary)',
        }}
      >
        <Text
          style={{
            display: 'block',
            marginBottom: 16,
            fontSize: 16,
            color: 'var(--text-secondary)',
          }}
        >
          {t('enterReceiptId')}
        </Text>

        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder={t('receiptId')}
            value={receiptInput}
            onChange={(e) => setReceiptInput(e.target.value)}
            onPressEnter={handleSearch}
            size="large"
            style={{ fontSize: 16, borderRadius: '12px 0 0 12px' }}
            disabled={loading}
          />
          <Button
            type="primary"
            size="large"
            icon={<SearchOutlined />}
            onClick={handleSearch}
            loading={loading && !!receiptInput}
            disabled={!receiptInput.trim()}
            style={{ borderRadius: '0 12px 12px 0', fontSize: 16 }}
          >
            {t('searchReceipt')}
          </Button>
        </Space.Compact>
      </Card>

      {/* Central loading overlay */}
      {loading && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 24,
          }}
        >
          <Spin size="large" />
        </div>
      )}
    </div>
  );
}
