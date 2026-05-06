import './TopBar.css'

interface TopBarProps {
  onMenuToggle: () => void
  userName: string
  avatarUrl: string
  pageTitle: string
  onBack?: () => void
}

export default function TopBar({ onMenuToggle, userName, avatarUrl, pageTitle, onBack }: TopBarProps) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-toggle" onClick={onMenuToggle}>
          <span className="material-icons-outlined">menu</span>
        </button>
        {onBack && (
          <button className="back-btn" onClick={onBack}>
            <span className="material-icons-outlined">chevron_left</span>
          </button>
        )}
        <h1 className="page-title">{pageTitle}</h1>
      </div>
      <div className="topbar-right">
        <div className="user-badge">
          <img
            src={avatarUrl}
            alt="รูปโปรไฟล์"
            className="user-avatar-small"
          />
          <span className="user-name-small">{userName}</span>
        </div>
      </div>
    </header>
  )
}
