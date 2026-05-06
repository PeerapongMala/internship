import { useState } from 'react';
import { Result, Button, Modal, Space, App } from 'antd';
import { FilePdfOutlined, FileTextOutlined, SendOutlined, CheckOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useETaxStore } from '../../stores/etaxStore';
import { useLanguage } from '../../i18n/LanguageContext';
import { etaxService } from '../../services/etax.service';
import { useOmsStore } from '../../stores/omsStore';
import type { TranslationKey } from '../../i18n/en';

export default function SuccessStep() {
  const { t } = useLanguage();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { currentScanResult, resetWizard } = useETaxStore();
  const [xmlModalOpen, setXmlModalOpen] = useState(false);
  const [sendingInet, setSendingInet] = useState(false);
  const [inetSent, setInetSent] = useState(false);

  const invoices = useOmsStore((s) => s.invoices);
  const latestInvoice = currentScanResult
    ? invoices.find((inv) => inv.orderId === currentScanResult.orderId)
    : null;

  const handleSendToInet = async () => {
    if (!latestInvoice) return;
    setSendingInet(true);
    try {
      const result = await etaxService.sendToInet(latestInvoice.id);
      if (result.success) {
        setInetSent(true);
        message.success(t('sentSuccess'));
      }
    } finally {
      setSendingInet(false);
    }
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <Result
        status="success"
        title={
          <span style={{ fontSize: 22, color: 'var(--text-primary)' }}>
            {t('invoiceCreated')}
          </span>
        }
        subTitle={
          <span style={{ fontSize: 16, color: 'var(--text-secondary)' }}>
            {t('invoiceCreatedDesc')}
            {latestInvoice && (
              <span style={{ display: 'block', marginTop: 8, fontWeight: 600 }}>
                {latestInvoice.invoiceNumber}
              </span>
            )}
          </span>
        }
        extra={
          <Space size="middle" wrap style={{ justifyContent: 'center' }}>
            <Button
              size="large"
              icon={<FileTextOutlined />}
              onClick={() => setXmlModalOpen(true)}
              style={{ height: 52, fontSize: 16, borderRadius: 12, paddingInline: 28 }}
            >
              {t('viewXml')}
            </Button>

            <Button
              size="large"
              icon={<FilePdfOutlined />}
              onClick={() => latestInvoice && navigate(`/etax/invoice/${latestInvoice.id}`)}
              style={{ height: 52, fontSize: 16, borderRadius: 12, paddingInline: 28 }}
            >
              {t('viewPDF')}
            </Button>

            <Button
              size="large"
              type="primary"
              icon={inetSent ? <CheckOutlined /> : <SendOutlined />}
              onClick={handleSendToInet}
              loading={sendingInet}
              disabled={inetSent || !latestInvoice}
              style={{ height: 52, fontSize: 16, borderRadius: 12, paddingInline: 28 }}
            >
              {sendingInet
                ? t('sendingToInet')
                : inetSent
                  ? t('sentSuccess')
                  : t('sendToInetBtn' as TranslationKey)}
            </Button>

            <Button
              size="large"
              onClick={resetWizard}
              style={{ height: 52, fontSize: 16, borderRadius: 12, paddingInline: 28 }}
            >
              {t('done')}
            </Button>
          </Space>
        }
      />

      {/* XML Preview Modal */}
      <Modal
        title={t('xmlPreview')}
        open={xmlModalOpen}
        onCancel={() => setXmlModalOpen(false)}
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
          {latestInvoice?.xmlContent || 'No invoice data available.'}
        </pre>
      </Modal>

    </div>
  );
}
