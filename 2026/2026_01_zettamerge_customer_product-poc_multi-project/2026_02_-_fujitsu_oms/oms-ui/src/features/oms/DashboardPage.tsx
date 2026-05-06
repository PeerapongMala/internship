import { useMemo, useState, useEffect, useRef } from 'react';
import { Card, Col, Row, Select, Typography, Progress } from 'antd';
import {
  ShoppingCartOutlined,
  ClockCircleOutlined,
  CarOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import { useAppContext } from '../../context/AppContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { BRANCHES } from '../../types';
import type { OrderStatus } from '../../types';
import SLABadge from '../../components/SLABadge';
import StatusBadge from '../../components/StatusBadge';
import PageSkeleton from '../../components/PageSkeleton';

const STATUS_BAR_COLORS: Record<OrderStatus, string> = {
  Pending: '#fa8c16',
  Picking: '#1677ff',
  ReadyToShip: '#13c2c2',
  OutForDelivery: '#2f54eb',
  Delivered: '#52c41a',
  Failed: '#ff4d4f',
};

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  variant: 'total' | 'pending' | 'delivery' | 'failed';
}

function StatCard({ icon, value, label, variant }: StatCardProps) {
  return (
    <Card className="mota-stat-card">
      <div className={`mota-stat-icon mota-stat-icon--${variant}`}>
        {icon}
      </div>
      <div className="mota-stat-value">{value}</div>
      <div className="mota-stat-label">{label}</div>
    </Card>
  );
}

export default function DashboardPage() {
  const { state } = useAppContext();
  const { t } = useLanguage();
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [branchLoading, setBranchLoading] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setBranchLoading(true);
    const timer = setTimeout(() => setBranchLoading(false), 400);
    return () => clearTimeout(timer);
  }, [branchFilter]);

  const filtered = useMemo(() => {
    if (branchFilter === 'all') return state.orders;
    return state.orders.filter((o) => o.branch === branchFilter);
  }, [state.orders, branchFilter]);

  const stats = useMemo(() => ({
    total: filtered.length,
    pending: filtered.filter((o) => o.status === 'Pending').length,
    inDelivery: filtered.filter((o) => o.status === 'OutForDelivery').length,
    failed: filtered.filter((o) => o.status === 'Failed').length,
  }), [filtered]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    filtered.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return counts;
  }, [filtered]);

  const slaOrders = useMemo(() => {
    return filtered
      .filter((o) => !['Delivered', 'Failed'].includes(o.status))
      .sort((a, b) => new Date(a.slaDeadline).getTime() - new Date(b.slaDeadline).getTime())
      .slice(0, 8);
  }, [filtered]);

  const branchOptions = [
    { value: 'all', label: t('allBranches') },
    ...BRANCHES.map((b) => ({ value: b, label: b })),
  ];

  return (
    <div>
      {/* Branch Filter */}
      <div style={{ marginBottom: 24 }}>
        <Select
          value={branchFilter}
          onChange={setBranchFilter}
          options={branchOptions}
          style={{ width: 220 }}
          placeholder={t('filterByBranch')}
        />
      </div>

      {branchLoading ? (
        <PageSkeleton variant="dashboard" />
      ) : (
        <div className="page-content-enter">
          {/* Stat Cards */}
          <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
            <Col xs={12} sm={12} lg={6}>
              <StatCard
                icon={<ShoppingCartOutlined />}
                value={stats.total}
                label={t('totalOrders')}
                variant="total"
              />
            </Col>
            <Col xs={12} sm={12} lg={6}>
              <StatCard
                icon={<ClockCircleOutlined />}
                value={stats.pending}
                label={t('pendingOrders')}
                variant="pending"
              />
            </Col>
            <Col xs={12} sm={12} lg={6}>
              <StatCard
                icon={<CarOutlined />}
                value={stats.inDelivery}
                label={t('inDelivery')}
                variant="delivery"
              />
            </Col>
            <Col xs={12} sm={12} lg={6}>
              <StatCard
                icon={<CloseCircleOutlined />}
                value={stats.failed}
                label={t('failedOrders')}
                variant="failed"
              />
            </Col>
          </Row>

          <Row gutter={[20, 20]}>
            {/* Orders by Status */}
            <Col xs={24} lg={12}>
              <Card title={t('ordersByStatus')}>
                {Object.entries(statusCounts).map(([status, count]) => (
                  <div key={status} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <StatusBadge status={status as OrderStatus} />
                      <Typography.Text strong style={{ fontSize: 16 }}>{count}</Typography.Text>
                    </div>
                    <Progress
                      percent={Math.round((count / (filtered.length || 1)) * 100)}
                      strokeColor={STATUS_BAR_COLORS[status as OrderStatus]}
                      showInfo={false}
                      size="small"
                    />
                  </div>
                ))}
              </Card>
            </Col>

            {/* SLA Overview */}
            <Col xs={24} lg={12}>
              <Card title={t('slaOverview')}>
                {slaOrders.length === 0 ? (
                  <Typography.Text type="secondary">No active SLA orders</Typography.Text>
                ) : (
                  slaOrders.map((order) => (
                    <div
                      key={order.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 0',
                        borderBottom: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div>
                        <Typography.Text strong style={{ fontSize: 15 }}>{order.orderNumber}</Typography.Text>
                        <br />
                        <Typography.Text type="secondary" style={{ fontSize: 14 }}>
                          {order.customer.name} — {order.branch}
                        </Typography.Text>
                      </div>
                      <SLABadge deadline={order.slaDeadline} />
                    </div>
                  ))
                )}
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </div>
  );
}
