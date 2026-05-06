import { Steps, Card, Button } from 'antd';
import { CloseOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useETaxStore } from '../../stores/etaxStore';
import { useLanguage } from '../../i18n/LanguageContext';
import ScanStep from './ScanStep';
import VerifyStep from './VerifyStep';
import SuccessStep from './SuccessStep';

const STEP_MAP = { scan: 0, verify: 1, success: 2 } as const;

const slideVariants = {
  enter: { x: 80, opacity: 0 },
  center: { x: 0, opacity: 1 },
  exit: { x: -80, opacity: 0 },
};

export default function ETaxWizard() {
  const { t } = useLanguage();
  const { wizardStep, setWizardStep, resetWizard } = useETaxStore();

  const currentIndex = STEP_MAP[wizardStep];

  const steps = [
    { title: t('wizardStep1') },
    { title: t('wizardStep2') },
    { title: t('wizardStep3') },
  ];

  const renderStepContent = () => {
    switch (wizardStep) {
      case 'scan':
        return <ScanStep />;
      case 'verify':
        return <VerifyStep />;
      case 'success':
        return <SuccessStep />;
      default:
        return null;
    }
  };

  return (
    <Card
      style={{
        borderRadius: 16,
        border: '1px solid var(--border-primary)',
        background: 'var(--surface-primary)',
      }}
    >
      {/* Header with Steps and Close */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 32,
          gap: 16,
        }}
      >
        {/* Back Button (visible on verify step) */}
        <div style={{ minWidth: 80 }}>
          {wizardStep === 'verify' && (
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => setWizardStep('scan')}
              style={{ fontSize: 16, borderRadius: 8 }}
            >
              {t('back')}
            </Button>
          )}
        </div>

        {/* Steps */}
        <div style={{ flex: 1, maxWidth: 500 }}>
          <Steps
            current={currentIndex}
            items={steps}
            size="default"
            style={{ fontSize: 16 }}
          />
        </div>

        {/* Close button */}
        <div style={{ minWidth: 80, textAlign: 'right' }}>
          <Button
            icon={<CloseOutlined />}
            onClick={resetWizard}
            style={{ fontSize: 16, borderRadius: 8 }}
          >
            {t('closeWizard')}
          </Button>
        </div>
      </div>

      {/* Step Content with Animation */}
      <div style={{ overflow: 'hidden', minHeight: 300 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={wizardStep}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  );
}
