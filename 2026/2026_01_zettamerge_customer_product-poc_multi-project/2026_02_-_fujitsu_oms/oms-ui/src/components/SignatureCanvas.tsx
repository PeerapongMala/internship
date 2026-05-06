import { useRef } from 'react';
import { Modal, Button, Space } from 'antd';
import ReactSignatureCanvas from 'react-signature-canvas';
import { useLanguage } from '../i18n/LanguageContext';

interface Props {
  visible: boolean;
  onSave: (base64: string) => void;
  onCancel: () => void;
}

export default function SignatureCanvas({ visible, onSave, onCancel }: Props) {
  const { t } = useLanguage();
  const sigRef = useRef<ReactSignatureCanvas | null>(null);

  const handleClear = () => {
    sigRef.current?.clear();
  };

  const handleSave = () => {
    if (sigRef.current && !sigRef.current.isEmpty()) {
      const base64 = sigRef.current.toDataURL('image/png');
      onSave(base64);
    }
  };

  return (
    <Modal
      title={t('signatureCapture')}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={480}
    >
      <div
        style={{
          border: '1px solid var(--border-light)',
          borderRadius: 8,
          marginBottom: 16,
          background: 'var(--card-bg)',
        }}
      >
        <ReactSignatureCanvas
          ref={sigRef}
          canvasProps={{
            width: 432,
            height: 200,
            style: { width: '100%', height: 200 },
          }}
          penColor="#000"
        />
      </div>
      <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
        <Button onClick={handleClear}>{t('clearSignature')}</Button>
        <Button onClick={onCancel}>{t('cancel')}</Button>
        <Button type="primary" onClick={handleSave}>
          {t('saveSignature')}
        </Button>
      </Space>
    </Modal>
  );
}
