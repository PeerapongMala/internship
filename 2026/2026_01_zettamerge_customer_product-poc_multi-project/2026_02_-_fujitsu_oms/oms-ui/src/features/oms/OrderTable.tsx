import { Tag, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { Order, OrderStatus, OrderType } from '../../types';
import { BRANCHES } from '../../types';
import StatusBadge from '../../components/StatusBadge';
import SLABadge from '../../components/SLABadge';
import MarketplaceBadge from './MarketplaceBadge';
import { useLanguage } from '../../i18n/LanguageContext';
import type { TranslationKey } from '../../i18n/en';


interface Props {
  orders: Order[];
  onRowClick: (order: Order) => void;
}

export default function OrderTable({ orders, onRowClick }: Props) {
  const { t } = useLanguage();

  const statusFilters = (['Pending', 'Picking', 'ReadyToShip', 'OutForDelivery', 'Delivered', 'Failed'] as OrderStatus[]).map(
    (s) => ({ text: t(s as TranslationKey), value: s }),
  );

  const branchFilters = BRANCHES.map((b) => ({ text: b, value: b }));

  const typeFilters = ([
    { text: t('online'), value: 'online' },
    { text: t('reservation'), value: 'reservation' },
  ]);

  const marketplaceFilters = [
    { text: 'Lazada', value: 'lazada' },
    { text: 'Shopee', value: 'shopee' },
    { text: 'TikTok', value: 'tiktok' },
    { text: 'Walk-in', value: 'walk-in' },
    { text: 'Phone', value: 'phone' },
  ];

  const columns: ColumnsType<Order> = [
    {
      title: t('orderNumber'),
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 160,
    },
    {
      title: t('customer'),
      dataIndex: ['customer', 'name'],
      key: 'customer',
      width: 200,
    },
    {
      title: t('orderType'),
      dataIndex: 'type',
      key: 'type',
      width: 130,
      filters: typeFilters,
      onFilter: (value, record) => record.type === value,
      render: (type: OrderType) => (
        <Tag>
          {t(type as TranslationKey)}
        </Tag>
      ),
    },
    {
      title: t('source' as TranslationKey),
      dataIndex: 'marketplace',
      key: 'marketplace',
      width: 120,
      filters: marketplaceFilters,
      onFilter: (value, record) => record.marketplace === value,
      render: (_: unknown, record: Order) => (
        <MarketplaceBadge source={record.marketplace} />
      ),
    },
    {
      title: t('branch'),
      dataIndex: 'branch',
      key: 'branch',
      filters: branchFilters,
      onFilter: (value, record) => record.branch === value,
      width: 160,
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      filters: statusFilters,
      onFilter: (value, record) => record.status === value,
      width: 150,
      render: (status: OrderStatus) => <StatusBadge status={status} />,
    },
    {
      title: t('amount'),
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      align: 'right',
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      render: (val: number) => `฿${val.toLocaleString()}`,
    },
    {
      title: t('sla'),
      dataIndex: 'slaDeadline',
      key: 'sla',
      width: 180,
      sorter: (a, b) => {
        const terminalA = ['Delivered', 'Failed'].includes(a.status);
        const terminalB = ['Delivered', 'Failed'].includes(b.status);
        if (terminalA && terminalB) return 0;
        if (terminalA) return 1;
        if (terminalB) return -1;
        return dayjs(a.slaDeadline).unix() - dayjs(b.slaDeadline).unix();
      },
      render: (_: string, record: Order) => {
        if (['Delivered', 'Failed'].includes(record.status)) return '—';
        return <SLABadge deadline={record.slaDeadline} />;
      },
    },
    {
      title: t('date'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 140,
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      defaultSortOrder: 'descend',
      render: (val: string) => dayjs(val).format('DD/MM/YY HH:mm'),
    },
  ];

  return (
    <Table<Order>
      dataSource={orders}
      columns={columns}
      rowKey="id"
      pagination={{ pageSize: 10 }}
      onRow={(record) => ({
        onClick: () => onRowClick(record),
        style: { cursor: 'pointer' },
      })}
      scroll={{ x: 1200 }}
      size="middle"
    />
  );
}
