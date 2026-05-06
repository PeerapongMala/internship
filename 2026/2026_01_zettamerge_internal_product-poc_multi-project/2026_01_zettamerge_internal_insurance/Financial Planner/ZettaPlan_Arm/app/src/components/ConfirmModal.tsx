import './ConfirmModal.css'

interface ConfirmModalProps {
  isOpen: boolean
  title?: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  isOpen,
  title = 'ยืนยันการลบ',
  message = 'คุณต้องการลบรายการนี้ใช่หรือไม่?',
  confirmLabel = 'ยืนยัน',
  cancelLabel = 'ยกเลิก',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-card" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon">
          <span className="material-icons-outlined">warning_amber</span>
        </div>
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="confirm-btn cancel" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className="confirm-btn danger" onClick={onConfirm}>
            <span className="material-icons-outlined">delete</span>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
