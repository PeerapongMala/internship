import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConfigProvider, theme, App as AntApp } from 'antd';
import { AppProvider } from './context/AppContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LanguageProvider } from './i18n/LanguageContext';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './features/oms/DashboardPage';
import OrdersPage from './features/oms/OrdersPage';
import DeliveryPage from './features/oms/DeliveryPage';
import ReservationPage from './features/reservation/ReservationPage';
import ETaxPage from './features/etax/ETaxPage';
import InvoicePDFViewer from './features/etax/InvoicePDFViewer';
import EPvp10Page from './features/epvp10/EPvp10Page';
import './styles/global.css';

function ThemedApp() {
  const { isDark } = useTheme();

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1a1a1a',
          borderRadius: 12,
          fontSize: 16,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans Thai', sans-serif",
          colorBgContainer: isDark ? '#161616' : '#ffffff',
          colorBgLayout: isDark ? '#0a0a0a' : '#f0f0f3',
          colorBorder: isDark ? '#2a2a2a' : '#e5e7eb',
          colorBorderSecondary: isDark ? '#2a2a2a' : '#e5e7eb',
        },
        components: {
          Card: {
            borderRadiusLG: 16,
          },
          Table: {
            borderRadius: 12,
            borderRadiusLG: 12,
            filterDropdownBg: isDark ? '#1f1f1f' : '#ffffff',
          },
          Button: {
            borderRadius: 10,
          },
          Input: {
            borderRadius: 10,
          },
          Select: {
            borderRadius: 10,
          },
          Modal: {
            borderRadiusLG: 16,
          },
        },
      }}
    >
      <AntApp>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/delivery" element={<DeliveryPage />} />
              <Route path="/reservation" element={<ReservationPage />} />
              <Route path="/etax" element={<ETaxPage />} />
              <Route path="/etax/invoice/:invoiceId" element={<InvoicePDFViewer />} />
              <Route path="/epvp10" element={<EPvp10Page />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AntApp>
    </ConfigProvider>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AppProvider>
          <ThemedApp />
        </AppProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
