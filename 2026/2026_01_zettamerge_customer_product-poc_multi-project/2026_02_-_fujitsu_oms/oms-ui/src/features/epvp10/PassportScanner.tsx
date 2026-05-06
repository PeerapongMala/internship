import { useState } from 'react';
import { Card, Button, Descriptions, Spin, Typography, Space } from 'antd';
import { ScanOutlined, UserOutlined } from '@ant-design/icons';
import { epvp10Service } from '../../services/epvp10.service';
import { useLanguage } from '../../i18n/LanguageContext';
import type { PassportData } from '../../types/epvp10';

const { Text } = Typography;

interface Props {
  onScanned: (data: PassportData) => void;
}

export default function PassportScanner({ onScanned }: Props) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [passportData, setPassportData] = useState<PassportData | null>(null);

  const handleScan = async () => {
    setLoading(true);
    setPassportData(null);
    try {
      const result = await epvp10Service.scanPassport('mock-image-data');
      if (result.success && result.data) {
        setPassportData(result.data);
        onScanned(result.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Scan Area */}
      <div
        style={{
          border: '2px dashed var(--border-light)',
          borderRadius: 12,
          height: 200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--card-bg)',
          gap: 12,
          transition: 'border-color 0.3s',
        }}
      >
        {loading ? (
          <Spin size="large" tip={t('scanning')} style={{ fontSize: 16 }}>
            <div style={{ padding: 40 }} />
          </Spin>
        ) : passportData ? (
          <Space direction="vertical" align="center">
            <UserOutlined style={{ fontSize: 36, color: 'var(--primary)' }} />
            <Text strong style={{ fontSize: 18, color: 'var(--text-primary)' }}>
              {passportData.fullName}
            </Text>
            <Text style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
              {passportData.passportNumber}
            </Text>
          </Space>
        ) : (
          <>
            <ScanOutlined style={{ fontSize: 48, color: 'var(--text-secondary)' }} />
            <Text style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
              {t('placePassportHere')}
            </Text>
          </>
        )}
      </div>

      {/* Scan Button */}
      {!passportData && (
        <Button
          type="primary"
          icon={<ScanOutlined />}
          size="large"
          block
          loading={loading}
          onClick={handleScan}
          style={{ height: 48, fontSize: 16, borderRadius: 10 }}
        >
          {t('scanPassport')}
        </Button>
      )}

      {/* Passport Data Display */}
      {passportData && (
        <Card
          size="small"
          style={{
            borderRadius: 12,
            background: 'var(--card-bg)',
            border: '1px solid var(--border-light)',
          }}
        >
          <Descriptions
            column={1}
            size="middle"
            labelStyle={{ fontSize: 15, color: 'var(--text-secondary)', fontWeight: 500 }}
            contentStyle={{ fontSize: 16, color: 'var(--text-primary)', fontWeight: 600 }}
          >
            <Descriptions.Item label={t('passportNumber')}>
              {passportData.passportNumber}
            </Descriptions.Item>
            <Descriptions.Item label={t('fullName')}>
              {passportData.fullName}
            </Descriptions.Item>
            <Descriptions.Item label={t('nationality')}>
              {passportData.nationality}
            </Descriptions.Item>
            <Descriptions.Item label={t('dateOfBirth')}>
              {passportData.dateOfBirth}
            </Descriptions.Item>
            <Descriptions.Item label={t('expiryDate')}>
              {passportData.expiryDate}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}
    </Space>
  );
}
