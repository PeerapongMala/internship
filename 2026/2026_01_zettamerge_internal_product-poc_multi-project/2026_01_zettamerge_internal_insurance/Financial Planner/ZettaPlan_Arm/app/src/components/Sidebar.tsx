import { useState } from 'react'
import logoExpand from '../assets/ZPLogo.png'
import logoCollapse from '../assets/ZPLogocollapse.png'
import './Sidebar.css'

interface SubItem {
  label: string
  icon?: string
}

interface NavItem {
  icon: string
  label: string
  hasArrow?: boolean
  subItems?: SubItem[]
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    title: 'MENU',
    items: [
      { icon: 'person', label: 'ข้อมูลส่วนตัว' },
      { icon: 'account_balance_wallet', label: 'สินทรัพย์' },
      { icon: 'edit_note', label: 'วางแผนเกษียณ' },
      { icon: 'flag', label: 'เป้าหมายการเงิน' },
    ],
  },
  {
    title: 'TOOLS',
    items: [
      {
        icon: 'shield',
        label: 'ประกัน',
        hasArrow: true,
        subItems: [
          { label: 'ประกันชีวิต', icon: 'favorite' },
          { label: 'ประกันสุขภาพ', icon: 'health_and_safety' },
        ],
      },
      { icon: 'calculate', label: 'วางแผนภาษี' },
      { icon: 'trending_up', label: 'พอร์ตแนะนำ' },
    ],
  },
  {
    title: 'MORE',
    items: [
      { icon: 'description', label: 'ดูรายงาน' },
    ],
  },
]

interface SidebarProps {
  isOpen: boolean
  collapsed: boolean
  activePage: string
  onNavigate: (page: string) => void
  onClose: () => void
  onToggleCollapse: () => void
}

export default function Sidebar({ isOpen, collapsed, activePage, onNavigate, onClose, onToggleCollapse }: SidebarProps) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)

  const handleNavClick = (item: NavItem) => {
    if (item.subItems) {
      setExpandedMenu((prev) => (prev === item.label ? null : item.label))
      onNavigate(item.label)
    } else {
      onNavigate(item.label)
      onClose()
    }
  }

  return (
    <>
      <aside className={`sidebar ${isOpen ? 'open' : ''} ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-inner">
          {/* โลโก้ + ปุ่มหุบ/กาง */}
          {collapsed ? (
            <button className="logo-expand-btn" onClick={onToggleCollapse} title="กางเมนู">
              <img src={logoCollapse} alt="ZettaPlan" className="logo-img-collapse" />
              <span className="material-icons-outlined logo-expand-arrow">chevron_right</span>
            </button>
          ) : (
            <div className="logo">
              <img src={logoExpand} alt="ZettaPlan" className="logo-img-expand" />
              <button className="collapse-btn" onClick={onToggleCollapse} title="หุบเมนู">
                <span className="material-icons-outlined">chevron_left</span>
              </button>
            </div>
          )}

          {/* เมนูนำทาง */}
          <nav className="nav">
            {navSections.map((section) => (
              <div className="nav-section" key={section.title}>
                <div className="nav-label">{section.title}</div>
                {section.items.map((item) => (
                  <div key={item.label}>
                    <a
                      href="#"
                      className={`nav-item ${activePage === item.label ? 'active' : ''}`}
                      title={collapsed ? item.label : undefined}
                      onClick={(e) => {
                        e.preventDefault()
                        handleNavClick(item)
                      }}
                    >
                      <span className="material-icons-outlined nav-icon">{item.icon}</span>
                      {!collapsed && <span className="nav-text">{item.label}</span>}
                      {!collapsed && item.hasArrow && (
                        <span className={`material-icons-outlined nav-arrow ${expandedMenu === item.label ? 'expanded' : ''}`}>
                          chevron_right
                        </span>
                      )}
                    </a>

                    {/* เมนูย่อย */}
                    {item.subItems && expandedMenu === item.label && (
                      <div className={`sub-menu ${collapsed ? 'sub-menu-collapsed' : ''}`}>
                        {item.subItems.map((sub) => (
                          <a
                            href="#"
                            className={`nav-item sub-item ${activePage === sub.label ? 'active' : ''}`}
                            key={sub.label}
                            title={collapsed ? sub.label : undefined}
                            onClick={(e) => {
                              e.preventDefault()
                              onNavigate(sub.label)
                              onClose()
                            }}
                          >
                            {collapsed && sub.icon && (
                              <span className="material-icons-outlined nav-icon">{sub.icon}</span>
                            )}
                            {!collapsed && <span className="nav-text">{sub.label}</span>}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </nav>

          {/* ส่วนล่าง */}
          <div className="sidebar-bottom">
            {collapsed ? (
              <button
                className="collapse-bottom-icon"
                onClick={onToggleCollapse}
                title="กางเมนู"
              >
                <span className="material-icons-outlined">workspace_premium</span>
              </button>
            ) : (
              <>
                <div className="plan-card">
                  <div className="plan-icon">
                    <span className="material-icons-outlined">workspace_premium</span>
                  </div>
                  <div className="plan-info">
                    <div className="plan-title">อัปเกรดแพค</div>
                    <div className="plan-subtitle">อัปเกรดแผน</div>
                  </div>
                </div>
                <button className="upgrade-btn">Upgrade Pro</button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay สำหรับมือถือ */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
    </>
  )
}
