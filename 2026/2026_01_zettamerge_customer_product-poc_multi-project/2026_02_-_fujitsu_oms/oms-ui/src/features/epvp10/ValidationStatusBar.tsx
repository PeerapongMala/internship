import { Steps, Button } from 'antd';
import { useLanguage } from '../../i18n/LanguageContext';
import type { PVP10Status } from '../../types/epvp10';
import { PVP10_STATUS_FLOW } from '../../types/epvp10';

interface Props {
  currentStatus: PVP10Status;
  onProcessNext: () => void;
  loading?: boolean;
}

/** Map each status to its step index in the flow */
const STATUS_TO_STEP: Record<string, number> = {
  pending_scan: 0,
  passport_scanned: 1,
  immigration_check: 2,
  immigration_approved: 3,
  ktb_processing: 4,
  ktb_approved: 5,
  refund_complete: 6,
  // Rejected statuses map to the step they failed at
  immigration_rejected: 2,
  ktb_rejected: 4,
};

/** Statuses that are terminal (no further processing) */
const TERMINAL_STATUSES: PVP10Status[] = [
  'refund_complete',
  'immigration_rejected',
  'ktb_rejected',
];

export default function ValidationStatusBar({ currentStatus, onProcessNext, loading }: Props) {
  const { t } = useLanguage();

  const currentStepIndex = STATUS_TO_STEP[currentStatus] ?? 0;
  const isRejected = currentStatus.endsWith('_rejected');
  const isTerminal = TERMINAL_STATUSES.includes(currentStatus);

  /** Translation keys matching PVP10_STATUS_FLOW order */
  const stepTitleKeys = [
    'pendingScan',
    'passportScanned',
    'immigrationCheck',
    'immigrationApproved',
    'ktbProcessing',
    'ktbApproved',
    'refundComplete',
  ] as const;

  const items = PVP10_STATUS_FLOW.map((_statusKey, index) => {
    let status: 'wait' | 'process' | 'finish' | 'error' = 'wait';

    if (index < currentStepIndex) {
      status = 'finish';
    } else if (index === currentStepIndex) {
      status = isRejected ? 'error' : 'process';
    }

    return {
      title: (
        <span style={{ fontSize: 14, color: 'var(--text-primary)' }}>
          {t(stepTitleKeys[index])}
        </span>
      ),
      status,
    };
  });

  return (
    <div style={{ padding: '16px 0' }}>
      <Steps
        direction="horizontal"
        size="small"
        current={currentStepIndex}
        items={items}
        style={{ marginBottom: 20 }}
      />

      <Button
        type="primary"
        size="large"
        loading={loading}
        disabled={isTerminal || loading}
        onClick={onProcessNext}
        style={{ fontSize: 16, height: 44, borderRadius: 10 }}
      >
        {loading ? t('processing') : t('processNextStep')}
      </Button>
    </div>
  );
}
