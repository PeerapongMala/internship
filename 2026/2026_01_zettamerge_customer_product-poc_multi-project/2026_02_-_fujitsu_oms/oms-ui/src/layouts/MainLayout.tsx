import { useState } from 'react';
import { Space, Popconfirm, Button } from 'antd';
import {
  DashboardOutlined,
  ShoppingCartOutlined,
  CarOutlined,
  FormOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  ReloadOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  AppstoreOutlined,
  DownOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import ThemeToggle from '../components/ThemeToggle';
import LanguageToggle from '../components/LanguageToggle';
import { useLanguage } from '../i18n/LanguageContext';
import { useAppContext } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import type { TranslationKey } from '../i18n/en';

interface NavItem {
  key: string;
  icon: React.ReactNode;
  labelKey: TranslationKey;
  children?: { key: string; icon: React.ReactNode; labelKey: TranslationKey }[];
}

const NAV_ITEMS: NavItem[] = [
  {
    key: '/oms',
    icon: <AppstoreOutlined />,
    labelKey: 'menuOMS' as TranslationKey,
    children: [
      { key: '/', icon: <DashboardOutlined />, labelKey: 'menuDashboard' as TranslationKey },
      { key: '/orders', icon: <ShoppingCartOutlined />, labelKey: 'menuOrders' as TranslationKey },
      { key: '/delivery', icon: <CarOutlined />, labelKey: 'menuDelivery' as TranslationKey },
    ],
  },
  { key: '/reservation', icon: <FormOutlined />, labelKey: 'menuReservation' as TranslationKey },
  { key: '/etax', icon: <FileTextOutlined />, labelKey: 'menuETax' as TranslationKey },
  { key: '/epvp10', icon: <SafetyCertificateOutlined />, labelKey: 'menuEPvp10' as TranslationKey },
];

const PAGE_TITLES: Record<string, TranslationKey> = {
  '/': 'menuDashboard',
  '/orders': 'menuOrders',
  '/delivery': 'menuDelivery',
  '/reservation': 'menuReservation',
  '/etax': 'menuETax',
  '/epvp10': 'menuEPvp10' as TranslationKey,
};

function getPageTitle(pathname: string): TranslationKey {
  if (pathname.startsWith('/etax/invoice/')) return 'taxInvoice' as TranslationKey;
  return PAGE_TITLES[pathname] || 'menuDashboard';
}

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const { dispatch } = useAppContext();
  const { isDark } = useTheme();
  const [collapsed, setCollapsed] = useState(false);
  const [omsOpen, setOmsOpen] = useState(true);

  const titleKey = getPageTitle(location.pathname);
  const isOmsRoute = ['/', '/orders', '/delivery'].includes(location.pathname);

  return (
    <div data-theme={isDark ? 'dark' : 'light'}>
      {/* Sidebar */}
      <nav className={`mota-sidebar${collapsed ? ' mota-sidebar--collapsed' : ''}`}>
        <div className="mota-sidebar-logo" onClick={() => navigate('/')}>
          {collapsed ? 'OMS' : 'OMS Fujitsu'}
        </div>

        <div className="mota-sidebar-nav">
          {NAV_ITEMS.map((item) => {
            if (item.children) {
              return (
                <div key={item.key}>
                  <button
                    className={`mota-sidebar-item ${isOmsRoute ? 'active' : ''}`}
                    onClick={() => {
                      if (collapsed) {
                        navigate('/');
                      } else {
                        setOmsOpen((o) => !o);
                      }
                    }}
                  >
                    {item.icon}
                    {collapsed ? (
                      <span className="mota-tooltip">{t(item.labelKey)}</span>
                    ) : (
                      <>
                        <span className="mota-sidebar-label">{t(item.labelKey)}</span>
                        <span style={{ marginLeft: 'auto', fontSize: 10, opacity: 0.6 }}>
                          {omsOpen ? <DownOutlined /> : <RightOutlined />}
                        </span>
                      </>
                    )}
                  </button>
                  {!collapsed && omsOpen && item.children.map((child) => (
                    <button
                      key={child.key}
                      className={`mota-sidebar-item mota-sidebar-subitem ${location.pathname === child.key ? 'active' : ''}`}
                      onClick={() => navigate(child.key)}
                      style={{ paddingLeft: 36 }}
                    >
                      {child.icon}
                      <span className="mota-sidebar-label">{t(child.labelKey)}</span>
                    </button>
                  ))}
                </div>
              );
            }

            return (
              <button
                key={item.key}
                className={`mota-sidebar-item ${location.pathname === item.key ? 'active' : ''}`}
                onClick={() => navigate(item.key)}
              >
                {item.icon}
                {collapsed ? (
                  <span className="mota-tooltip">{t(item.labelKey)}</span>
                ) : (
                  <span className="mota-sidebar-label">{t(item.labelKey)}</span>
                )}
              </button>
            );
          })}
        </div>

        <div className="mota-sidebar-bottom">
          <button
            className="mota-sidebar-item mota-sidebar-toggle"
            onClick={() => setCollapsed((c) => !c)}
          >
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            {collapsed && <span className="mota-tooltip">Expand</span>}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className={`mota-content${collapsed ? ' mota-content--collapsed' : ''}`}>
        <header className="mota-header">
          <div className="mota-header-left">
            <h1 className="mota-header-title">{t(titleKey)}</h1>
          </div>

          <div className="mota-header-actions">
            <Popconfirm
              title={t('resetConfirm')}
              onConfirm={() => dispatch({ type: 'RESET_DATA' })}
              okText={t('yes')}
              cancelText={t('no')}
            >
              <Button size="small" icon={<ReloadOutlined />} type="text" />
            </Popconfirm>

            <Space size={8}>
              <LanguageToggle />
              <ThemeToggle />
            </Space>

            <div className="mota-avatar">A</div>
          </div>
        </header>

        <div className="mota-page">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </div>
      </div>
    </div>
  );
}
