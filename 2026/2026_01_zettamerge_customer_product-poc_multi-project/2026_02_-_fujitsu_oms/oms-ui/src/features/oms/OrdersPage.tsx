import { useState, useEffect, useMemo } from 'react';
import { Card } from 'antd';
import { useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { useAppContext } from '../../context/AppContext';
import type { Order } from '../../types';
import TableSearchBar from '../../components/TableSearchBar';
import OrderTable from './OrderTable';
import OrderDetailDrawer from './OrderDetailDrawer';

export default function OrdersPage() {
  const { state } = useAppContext();
  const location = useLocation();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);

  // Auto-open drawer if navigated with openOrderId state
  useEffect(() => {
    const openOrderId = (location.state as { openOrderId?: string })?.openOrderId;
    if (openOrderId) {
      const order = state.orders.find((o) => o.id === openOrderId);
      if (order) {
        setSelectedOrder(order);
        setDrawerOpen(true);
      }
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  const filteredOrders = useMemo(() => {
    let result = state.orders;

    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customer.name.toLowerCase().includes(q) ||
          o.customer.phone.includes(q) ||
          o.branch.toLowerCase().includes(q),
      );
    }

    if (dateRange && dateRange[0] && dateRange[1]) {
      const start = dateRange[0].startOf('day');
      const end = dateRange[1].endOf('day');
      result = result.filter((o) => {
        const d = dayjs(o.createdAt);
        return d.isAfter(start) && d.isBefore(end);
      });
    }

    return result;
  }, [state.orders, searchText, dateRange]);

  const handleRowClick = (order: Order) => {
    const fresh = state.orders.find((o) => o.id === order.id) || order;
    setSelectedOrder(fresh);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedOrder(null);
  };

  const currentOrder = selectedOrder
    ? state.orders.find((o) => o.id === selectedOrder.id) || selectedOrder
    : null;

  return (
    <Card>
      <TableSearchBar
        searchText={searchText}
        onSearchChange={setSearchText}
        placeholderKey="searchOrders"
        showDateRange
        onDateRangeChange={setDateRange}
      />

      <OrderTable orders={filteredOrders} onRowClick={handleRowClick} />
      <OrderDetailDrawer order={currentOrder} open={drawerOpen} onClose={handleDrawerClose} />
    </Card>
  );
}
