import { useState, useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import ProfilePage from './pages/ProfilePage'
import AssetPage from './pages/AssetPage'
import RetirementPage from './pages/RetirementPage'
import GoalPage from './pages/GoalPage'
import InsurancePage from './pages/InsurancePage'
import LifeInsurancePage from './pages/LifeInsurancePage'
import HealthInsurancePage from './pages/HealthInsurancePage'
import PortfolioPage from './pages/PortfolioPage'
import TaxPlanPage from './pages/TaxPlanPage'
import DashboardPage from './pages/DashboardPage'
import PdfViewerPage from './pages/PdfViewerPage'
import usePersistedState from './hooks/usePersistedState'
import type { ProfileData } from './pages/ProfilePage'

const routeTitles: Record<string, string> = {
  '/': 'ข้อมูลส่วนตัว',
  '/assets': 'สินทรัพย์',
  '/retirement': 'วางแผนเกษียณ',
  '/goals': 'เป้าหมายการเงิน',
  '/insurance': 'ประกัน',
  '/insurance/life': 'ประกัน / ประกันชีวิต',
  '/insurance/health': 'ประกัน / ประกันสุขภาพ',
  '/portfolio': 'พอร์ตลงทุน',
  '/tax': 'วางแผนภาษี',
  '/dashboard': 'ดูรายงาน',
}

const navRoutes: Record<string, string> = {
  'ข้อมูลส่วนตัว': '/',
  'สินทรัพย์': '/assets',
  'วางแผนเกษียณ': '/retirement',
  'เป้าหมายการเงิน': '/goals',
  'ประกัน': '/insurance',
  'ประกันชีวิต': '/insurance/life',
  'ประกันสุขภาพ': '/insurance/health',
  'พอร์ตแนะนำ': '/portfolio',
  'วางแผนภาษี': '/tax',
  'ดูรายงาน': '/dashboard',
}

const pathToLabel: Record<string, string> = {
  '/': 'ข้อมูลส่วนตัว',
  '/assets': 'สินทรัพย์',
  '/retirement': 'วางแผนเกษียณ',
  '/goals': 'เป้าหมายการเงิน',
  '/insurance': 'ประกัน',
  '/insurance/life': 'ประกันชีวิต',
  '/insurance/health': 'ประกันสุขภาพ',
  '/portfolio': 'พอร์ตแนะนำ',
  '/tax': 'วางแผนภาษี',
  '/dashboard': 'ดูรายงาน',
}

const defaultData: ProfileData = {
  avatarUrl: 'https://ui-avatars.com/api/?name=S+J&background=7C3AED&color=fff&size=150&rounded=true&bold=true&font-size=0.4',
  firstName: 'สมชาย ใจดี',
  nickname: 'ชาย',
  role: 'Senior Financial Advisor',
  company: 'ZettaWealth Co., Ltd.',
  phone: '081-234-5678',
  email: 'Somchai@zettawealth.com',
  lineId: '@Somchai.zetta',
  address: '123 อาคารสรรธิ ชั้น 15 กรุงเทพ',
  socialMedia: 'Somchai.Money',
  insuranceLicense: '5401012345',
  icLicense: '5401012345',
  qualifications: 'MDRT 2024, COT, FChFP, CFP',
  otherLicenses: 'IC Complex 2, นายหน้าวินาศภัย',
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [profile, setProfile] = usePersistedState<ProfileData>('zettaplan_profile', defaultData)

  const location = useLocation()
  const navigate = useNavigate()

  // Scroll to top on every page change
  useEffect(() => {
    window.scrollTo(0, 0)
    document.querySelector('.main')?.scrollTo(0, 0)
  }, [location.pathname])

  // PDF Viewer is a standalone full-screen page (no sidebar/topbar)
  if (location.pathname === '/report/pdf') {
    return <PdfViewerPage />
  }

  const pageTitle = routeTitles[location.pathname] || 'ข้อมูลส่วนตัว'
  const activePage = pathToLabel[location.pathname] || 'ข้อมูลส่วนตัว'

  const handleNavigate = (page: string) => {
    const path = navRoutes[page]
    if (path) {
      navigate(path)
    }
  }

  return (
    <div className={`layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        isOpen={sidebarOpen}
        collapsed={sidebarCollapsed}
        activePage={activePage}
        onNavigate={handleNavigate}
        onClose={() => setSidebarOpen(false)}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
      />

      <main className="main">
        <TopBar
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
          userName={profile.firstName}
          avatarUrl={profile.avatarUrl}
          pageTitle={pageTitle}
          onBack={location.pathname !== '/' ? () => navigate('/') : undefined}
        />
        <Routes>
          <Route path="/" element={<ProfilePage profile={profile} onSave={setProfile} />} />
          <Route path="/assets" element={<AssetPage />} />
          <Route path="/retirement" element={<RetirementPage />} />
          <Route path="/goals" element={<GoalPage />} />
          <Route path="/insurance" element={<InsurancePage />} />
          <Route path="/insurance/life" element={<LifeInsurancePage />} />
          <Route path="/insurance/health" element={<HealthInsurancePage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/tax" element={<TaxPlanPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>
    </div>
  )
}
