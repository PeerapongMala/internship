import type { ProfileData } from '../pages/ProfilePage'
import './DetailCard.css'

interface LicenseCardProps {
  data: ProfileData
  isEditing: boolean
  onChange: (field: keyof ProfileData, value: string) => void
}

interface LicenseField {
  label: string
  field: keyof ProfileData
}

const fields: LicenseField[] = [
  { label: 'ใบอนุญาตตัวแทนประกันชีวิต', field: 'insuranceLicense' },
  { label: 'ผู้แนะนำการลงทุน (IC License)', field: 'icLicense' },
  { label: 'คุณวุฒิ', field: 'qualifications' },
  { label: 'ใบอนุญาตอื่นๆ', field: 'otherLicenses' },
]

export default function LicenseCard({ data, isEditing, onChange }: LicenseCardProps) {
  return (
    <div className="detail-card">
      <h3 className="detail-title">ข้อมูลใบอนุญาต</h3>
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
            <div className="detail-row" key={item.field}>
              <div className="detail-label">{item.label}</div>
              <div className="detail-value">{data[item.field]}</div>
            </div>
          )
        )}
      </div>
    </div>
  )
}
