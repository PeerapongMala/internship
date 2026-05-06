import type { ProfileData } from '../pages/ProfilePage'
import './ProfileCard.css'

interface ProfileCardProps {
  data: ProfileData
  avatarUrl: string
  isEditing: boolean
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
  onChange: (field: keyof ProfileData, value: string) => void
  onAvatarClick: () => void
}

export default function ProfileCard({
  data,
  avatarUrl,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  onChange,
  onAvatarClick,
}: ProfileCardProps) {
  if (isEditing) {
    return (
      <div className="profile-card editing">
        {/* แบนเนอร์ด้านบน พร้อมรูปโปรไฟล์ */}
        <div className="profile-edit-banner">
          <div className="profile-avatar-wrapper">
            <img src={avatarUrl} alt="รูปโปรไฟล์" className="profile-avatar" />
            <button
              type="button"
              className="avatar-edit-overlay"
              onClick={onAvatarClick}
            >
              <span className="material-icons-outlined">edit</span>
            </button>
          </div>

          {/* ปุ่มยกเลิก / บันทึกข้อมูล */}
          <div className="profile-edit-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              <span className="material-icons-outlined">close</span>
              <span>ยกเลิก</span>
            </button>
            <button type="button" className="btn-save" onClick={onSave}>
              <span className="material-icons-outlined">check</span>
              <span>บันทึกข้อมูล</span>
            </button>
          </div>
        </div>

        {/* ฟอร์มแก้ไขข้อมูลโปรไฟล์ */}
        <div className="profile-edit-form">
          <div className="form-row two-cols">
            <div className="form-group">
              <label className="form-label">ชื่อจริง-นามสกุล</label>
              <input
                type="text"
                className="form-input"
                value={data.firstName}
                onChange={(e) => onChange('firstName', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">ชื่อเล่น</label>
              <input
                type="text"
                className="form-input"
                value={data.nickname}
                onChange={(e) => onChange('nickname', e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">ชื่อเล่น</label>
            <input
              type="text"
              className="form-input"
              value={data.role}
              onChange={(e) => onChange('role', e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">ชื่อเล่น</label>
            <input
              type="text"
              className="form-input"
              value={data.company}
              onChange={(e) => onChange('company', e.target.value)}
            />
          </div>
        </div>
      </div>
    )
  }

  // โหมดแสดงผลปกติ
  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-avatar-wrapper">
          <img src={avatarUrl} alt={data.firstName} className="profile-avatar" />
        </div>
        <button className="edit-btn" onClick={onEdit}>
          <span className="material-icons-outlined">edit</span>
          <span>แก้ไขข้อมูล</span>
        </button>
        <div className="profile-info">
          <h2 className="profile-name">
            {data.firstName} <span className="profile-gender">({data.nickname})</span>
          </h2>
          <p className="profile-role">{data.role}</p>
          <p className="profile-company">{data.company}</p>
        </div>
      </div>
    </div>
  )
}
