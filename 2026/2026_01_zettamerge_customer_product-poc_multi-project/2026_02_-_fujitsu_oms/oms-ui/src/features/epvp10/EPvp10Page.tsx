import { useState, useMemo } from 'react';
import { Card, Button, Table, Typography, Space, Modal, Tag, InputNumber, App, Row, Col } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useLanguage } from '../../i18n/LanguageContext';
import { useEpvp10Store } from '../../stores/epvp10Store';
import { epvp10Service } from '../../services/epvp10.service';
import type { VATRefundApplication, PassportData } from '../../types/epvp10';
import { PVP10_STATUS_COLORS } from '../../types/epvp10';
import OfflineBanner from './OfflineBanner';
import PassportScanner from './PassportScanner';
import ValidationStatusBar from './ValidationStatusBar';
import TableSearchBar from '../../components/TableSearchBar';

const { Title, Text } = Typography;

/** Format currency with Baht prefix */
function formatBaht(value: number): string {
  return `฿${value.toLocaleString()}`;
}

export default function EPvp10Page() {
  const { t } = useLanguage();
  const { message } = App.useApp();
  const applications = useEpvp10Store((s) => s.applications);
  const updateApplication = useEpvp10Store((s) => s.updateApplication);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [scannedPassport, setScannedPassport] = useState<PassportData | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);

  // Search & detail / processing state
  const [searchText, setSearchText] = useState('');
  const [expandedRowKey, setExpandedRowKey] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // ── New Application Modal ──────────────────────────

  const handleOpenModal = () => {
    setScannedPassport(null);
    setPurchaseAmount(0);
    setModalOpen(true);
  };

  const handlePassportScanned = (data: PassportData) => {
    setScannedPassport(data);
    message.success(t('passportScanSuccess'));
  };

  const handleSubmitApplication = async () => {
    if (!scannedPassport || purchaseAmount <= 0) return;
    setSubmitting(true);
    try {
      const vatAmount = Math.round(purchaseAmount * 7 / 107); // VAT 7%
      const result = await epvp10Service.submitRefundApplication({
        passportData: scannedPassport,
        purchaseAmount,
        vatAmount,
        refundAmount: vatAmount,
        receiptIds: [`RCP-${dayjs().format('YYYYMMDD')}-${Date.now().toString().slice(-4)}`],
      });
      if (result.success) {
        message.success(t('applicationSubmitted'));
        setModalOpen(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ── Process Next Step ──────────────────────────────

  const handleProcessNext = async (app: VATRefundApplication) => {
    setProcessingId(app.id);
    try {
      const { status } = app;

      if (status === 'passport_scanned' || status === 'immigration_check') {
        await epvp10Service.checkImmigrationStatus(app.id);
      } else if (status === 'immigration_approved' || status === 'ktb_processing') {
        await epvp10Service.checkKTBStatus(app.id);
      } else if (status === 'ktb_approved') {
        updateApplication(app.id, {
          status: 'refund_complete',
          updatedAt: dayjs().toISOString(),
        });
      }

      message.success(t('stepProcessed'));
    } finally {
      setProcessingId(null);
    }
  };

  const filteredApplications = useMemo(() => {
    if (!searchText.trim()) return applications;
    const q = searchText.toLowerCase();
    return applications.filter(
      (a) =>
        a.passportData.passportNumber.toLowerCase().includes(q) ||
        a.passportData.fullName.toLowerCase().includes(q) ||
        a.passportData.nationality.toLowerCase().includes(q),
    );
  }, [applications, searchText]);

  // ── Status label helper ────────────────────────────

  const statusLabel = (status: string): string => {
    const map: Record<string, string> = {
      pending_scan: t('pendingScan'),
      passport_scanned: t('passportScanned'),
      immigration_check: t('immigrationCheck'),
      immigration_approved: t('immigrationApproved'),
      immigration_rejected: t('immigrationRejected'),
      ktb_processing: t('ktbProcessing'),
      ktb_approved: t('ktbApproved'),
      ktb_rejected: t('ktbRejected'),
      refund_complete: t('refundComplete'),
    };
    return map[status] || status;
  };

  // ── Table Columns ──────────────────────────────────

  const columns: ColumnsType<VATRefundApplication> = [
    {
      title: t('passportNumber'),
      key: 'passport',
      render: (_, r) => (
        <Text strong style={{ fontSize: 15 }}>
          {r.passportData.passportNumber}
        </Text>
      ),
    },
    {
      title: t('fullName'),
      key: 'name',
      render: (_, r) => (
        <Text style={{ fontSize: 15 }}>{r.passportData.fullName}</Text>
      ),
    },
    {
      title: t('nationality'),
      key: 'nationality',
      render: (_, r) => (
        <Text style={{ fontSize: 15 }}>{r.passportData.nationality}</Text>
      ),
    },
    {
      title: t('purchaseAmount'),
      key: 'purchaseAmount',
      align: 'right' as const,
      render: (_, r) => (
        <Text style={{ fontSize: 15, fontWeight: 600 }}>
          {formatBaht(r.purchaseAmount)}
        </Text>
      ),
    },
    {
      title: t('refundAmount'),
      key: 'refundAmount',
      align: 'right' as const,
      render: (_, r) => (
        <Text style={{ fontSize: 15, fontWeight: 600, color: 'var(--success)' }}>
          {formatBaht(r.refundAmount)}
        </Text>
      ),
    },
    {
      title: t('status'),
      key: 'status',
      render: (_, r) => (
        <Tag
          color={PVP10_STATUS_COLORS[r.status]}
          style={{ fontSize: 14, padding: '2px 10px' }}
        >
          {statusLabel(r.status)}
        </Tag>
      ),
    },
    {
      title: t('date'),
      key: 'date',
      render: (_, r) => (
        <Text style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
          {dayjs(r.submittedAt).format('DD/MM/YY HH:mm')}
        </Text>
      ),
    },
  ];

  // ── Render ─────────────────────────────────────────

  return (
    <Row gutter={[20, 20]}>
      {/* Offline Banner */}
      <Col span={24}>
        <OfflineBanner />
      </Col>

      {/* Header */}
      <Col span={24}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <Title level={3} style={{ margin: 0, fontSize: 24, color: 'var(--text-primary)' }}>
            {t('vatRefund')}
          </Title>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={handleOpenModal}
            style={{ fontSize: 16, height: 44, borderRadius: 10 }}
          >
            {t('newApplication')}
          </Button>
        </div>
      </Col>

      {/* Applications Table */}
      <Col span={24}>
        <Card
          style={{
            borderRadius: 16,
            background: 'var(--card-bg)',
            border: '1px solid var(--border-light)',
          }}
        >
          <TableSearchBar
            searchText={searchText}
            onSearchChange={setSearchText}
            placeholderKey="searchApplications"
          />
          <Table<VATRefundApplication>
            dataSource={filteredApplications}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            size="middle"
            expandable={{
              expandedRowKeys: expandedRowKey ? [expandedRowKey] : [],
              onExpand: (expanded, record) => {
                setExpandedRowKey(expanded ? record.id : null);
              },
              expandedRowRender: (record) => {
                const currentApp = applications.find((a) => a.id === record.id) || record;
                return (
                  <div style={{ padding: '8px 16px' }}>
                    <ValidationStatusBar
                      currentStatus={currentApp.status}
                      loading={processingId === currentApp.id}
                      onProcessNext={() => handleProcessNext(currentApp)}
                    />
                  </div>
                );
              },
            }}
            onRow={(record) => ({
              onClick: () => {
                setExpandedRowKey(expandedRowKey === record.id ? null : record.id);
              },
              style: { cursor: 'pointer', fontSize: 15 },
            })}
          />
        </Card>
      </Col>

      {/* New Application Modal */}
      <Modal
        title={
          <Text strong style={{ fontSize: 20, color: 'var(--text-primary)' }}>
            {t('newApplication')}
          </Text>
        }
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={560}
        destroyOnClose
      >
        <Space direction="vertical" size="large" style={{ width: '100%', paddingTop: 8 }}>
          {/* Passport Scanner */}
          <PassportScanner onScanned={handlePassportScanned} />

          {/* Amount Inputs (shown after passport scan) */}
          {scannedPassport && (
            <Card
              size="small"
              style={{
                borderRadius: 12,
                background: 'var(--card-bg)',
                border: '1px solid var(--border-light)',
              }}
            >
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <Text
                    strong
                    style={{
                      display: 'block',
                      marginBottom: 6,
                      fontSize: 15,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {t('purchaseAmount')} (฿)
                  </Text>
                  <InputNumber
                    size="large"
                    min={0}
                    value={purchaseAmount}
                    onChange={(v) => setPurchaseAmount(v ?? 0)}
                    formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                    parser={(v) => Number(v?.replace(/,/g, '') ?? 0)}
                    style={{ width: '100%', fontSize: 16 }}
                    prefix="฿"
                  />
                </div>
                {purchaseAmount > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '8px 0',
                      borderTop: '1px solid var(--border-light)',
                    }}
                  >
                    <Text style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
                      {t('refundAmount')}
                    </Text>
                    <Text strong style={{ fontSize: 18, color: 'var(--success)' }}>
                      {formatBaht(Math.round(purchaseAmount * 7 / 107))}
                    </Text>
                  </div>
                )}
                <Button
                  type="primary"
                  size="large"
                  block
                  loading={submitting}
                  disabled={purchaseAmount <= 0}
                  onClick={handleSubmitApplication}
                  style={{ height: 48, fontSize: 16, borderRadius: 10 }}
                >
                  {t('submitApplication')}
                </Button>
              </Space>
            </Card>
          )}
        </Space>
      </Modal>
    </Row>
  );
}
