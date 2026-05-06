import type { ProfileData } from '../pages/ProfilePage'
import './DetailCard.css'

interface ContactCardProps {
  data: ProfileData
  isEditing: boolean
  onChange: (field: keyof ProfileData, value: string) => void
}

interface ContactField {
  icon: string
  label: string
  field: keyof ProfileData
}

const fields: ContactField[] = [
  { icon: 'phone', label: 'เบอร์โทรศัพท์', field: 'phone' },
  { icon: 'email', label: 'อีเมล', field: 'email' },
  { icon: 'chat', label: 'LINE ID', field: 'lineId' },
  { icon: 'location_on', label: 'ที่ทำงาน', field: 'address' },
  { icon: 'language', label: 'Social Media', field: 'socialMedia' },
]

export default function ContactCard({ data, isEditing, onChange }: ContactCardProps) {
  return (
    <div className="detail-card">
      <h3 className="detail-title">ช่องทางการติดต่อ</h3>
      <div className="detail-list">
        {fields.map((item) =>
          isEditing ? (
            <div className="form-group" key={item.field}>
              <label className="form-label">{item.label}</label>
              <input
                type="text"
                className="form-input"
                value={data[item.field]}
                onChange={(e) => onChange(item.field, e.target.value)}
              />
            </div>
          ) : (
            <div className="detail-item" key={item.field}>
              <span className="material-icons-outlined detail-icon">{item.icon}</span>
              <span>
                {item.field === 'lineId' ? `LINE ID: ${data.lineId}` : data[item.field]}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  )
}
