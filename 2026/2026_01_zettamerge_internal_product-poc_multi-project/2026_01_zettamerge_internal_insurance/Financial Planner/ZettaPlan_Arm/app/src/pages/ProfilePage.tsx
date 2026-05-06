import { useState, useRef } from 'react'
import ProfileCard from '../components/ProfileCard'
import ContactCard from '../components/ContactCard'
import LicenseCard from '../components/LicenseCard'
import './ProfilePage.css'

export interface ProfileData {
  avatarUrl: string
  firstName: string
  nickname: string
  role: string
  company: string
  phone: string
  email: string
  lineId: string
  address: string
  socialMedia: string
  insuranceLicense: string
  icLicense: string
  qualifications: string
  otherLicenses: string
}

interface ProfilePageProps {
  profile: ProfileData
  onSave: (data: ProfileData) => void
}

export default function ProfilePage({ profile, onSave }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState<ProfileData>(profile)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleEdit = () => {
    setDraft({ ...profile })
    setPreviewUrl(null)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setPreviewUrl(null)
    setIsEditing(false)
  }

  const handleSave = () => {
    const saved = { ...draft }
    if (previewUrl) {
      saved.avatarUrl = previewUrl
    }
    onSave(saved)
    setPreviewUrl(null)
    setIsEditing(false)
  }

  const handleChange = (field: keyof ProfileData, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }))
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setPreviewUrl(reader.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="content">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <ProfileCard
        data={isEditing ? draft : profile}
        avatarUrl={previewUrl ?? (isEditing ? draft.avatarUrl : profile.avatarUrl)}
        isEditing={isEditing}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onSave={handleSave}
        onChange={handleChange}
        onAvatarClick={handleAvatarClick}
      />

      <div className="details-grid">
        <ContactCard
          data={isEditing ? draft : profile}
          isEditing={isEditing}
          onChange={handleChange}
        />
        <LicenseCard
          data={isEditing ? draft : profile}
          isEditing={isEditing}
          onChange={handleChange}
        />
      </div>

      <footer className="footer">
        &copy; 2026. ZettaPlan All rights reserved.
      </footer>
    </div>
  )
}
