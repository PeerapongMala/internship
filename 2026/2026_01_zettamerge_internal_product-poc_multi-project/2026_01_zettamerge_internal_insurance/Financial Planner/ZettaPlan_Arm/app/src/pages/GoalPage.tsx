import { useState } from 'react'
import ConfirmModal from '../components/ConfirmModal'
import usePersistedState from '../hooks/usePersistedState'
import './GoalPage.css'

interface Goal {
  id: number
  name: string
  targetAmount: number
  currentSavings: number
  years: number
  expectedReturn: number
}

interface GoalForm {
  name: string
  targetAmount: string
  currentSavings: string
  years: string
  expectedReturn: string
}

const emptyForm: GoalForm = {
  name: '',
  targetAmount: '',
  currentSavings: '',
  years: '',
  expectedReturn: '',
}

const initialGoals: Goal[] = [
  { id: 1, name: 'ทุนการศึกษาบุตร', targetAmount: 2_000_000, currentSavings: 500_000, years: 15, expectedReturn: 5 },
  { id: 2, name: 'ซื้อ IPAD Gen 6', targetAmount: 20_000, currentSavings: 5_000, years: 3, expectedReturn: 5 },
]

const formatNumber = (n: number) => Math.round(n).toLocaleString('en-US')

function calcMonthlySaving(goal: Goal): number {
  const { targetAmount, currentSavings, years, expectedReturn } = goal
  const gap = targetAmount - currentSavings
  if (gap <= 0 || years <= 0) return 0
  const months = years * 12
  if (expectedReturn <= 0) return gap / months
  const r = expectedReturn / 100 / 12
  // Future Value of Annuity: FV = PMT × ((1+r)^n - 1) / r
  // PMT = FV / ((1+r)^n - 1) * r
  const fvFactor = (Math.pow(1 + r, months) - 1) / r
  return gap / fvFactor
}

export default function GoalPage() {
  const [goals, setGoals] = usePersistedState<Goal[]>('zettaplan_goals', initialGoals)
  const [nextId, setNextId] = usePersistedState<number>('zettaplan_goals_nextId', 3)

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<GoalForm>(emptyForm)

  // Confirm delete
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  const openAddModal = () => {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEditModal = (goal: Goal) => {
    setEditingId(goal.id)
    setForm({
      name: goal.name,
      targetAmount: String(goal.targetAmount),
      currentSavings: String(goal.currentSavings),
      years: String(goal.years),
      expectedReturn: String(goal.expectedReturn),
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingId(null)
  }

  const handleFormChange = (field: keyof GoalForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    const parsed = {
      targetAmount: Number(form.targetAmount) || 0,
      currentSavings: Number(form.currentSavings) || 0,
      years: Number(form.years) || 0,
      expectedReturn: Number(form.expectedReturn) || 0,
    }
    if (!form.name.trim() || parsed.targetAmount <= 0 || parsed.years <= 0) return

    if (editingId !== null) {
      setGoals((prev) =>
        prev.map((g) =>
          g.id === editingId ? { ...g, name: form.name, ...parsed } : g
        )
      )
    } else {
      setGoals((prev) => [
        ...prev,
        { id: nextId, name: form.name, ...parsed },
      ])
      setNextId((prev) => prev + 1)
    }
    closeModal()
  }

  const requestDelete = (id: number) => {
    setConfirmDeleteId(id)
  }

  const confirmDelete = () => {
    if (confirmDeleteId === null) return
    setGoals((prev) => prev.filter((g) => g.id !== confirmDeleteId))
    setConfirmDeleteId(null)
  }

  const cancelDelete = () => {
    setConfirmDeleteId(null)
  }

  return (
    <div className="content goal-content">
      <button className="goal-add-btn" onClick={openAddModal}>
        <span className="material-icons-outlined">add</span>
        เพิ่มเป้าหมาย
      </button>

      <div className="goal-grid">
        {goals.map((goal) => {
          const monthly = calcMonthlySaving(goal)
          return (
            <div className="goal-card" key={goal.id}>
              <div className="goal-card-header">
                <h3 className="goal-card-title">{goal.name}</h3>
                <button className="icon-btn delete" onClick={() => requestDelete(goal.id)}>
                  <span className="material-icons-outlined">delete</span>
                </button>
              </div>

              <span className="goal-badge">เป้าหมาย: {goal.years} ปี</span>

              <div className="goal-info-row">
                <span className="goal-info-label">เป้าหมาย (บาท)</span>
                <span className="goal-info-value">{formatNumber(goal.targetAmount)}</span>
              </div>

              <div className="goal-info-row">
                <span className="goal-info-label">มีอยู่แล้ว (บาท)</span>
                <span className="goal-info-value">{formatNumber(goal.currentSavings)}</span>
              </div>

              <div className="goal-highlight">
                <div className="goal-highlight-label">เงินที่ต้องเก็บเดือนละประมาณ</div>
                <div className="goal-highlight-value">{formatNumber(monthly)} บาท</div>
              </div>

              <button className="goal-edit-btn" onClick={() => openEditModal(goal)}>
                <span className="material-icons-outlined">edit</span>
                แก้ไขข้อมูล
              </button>
            </div>
          )
        })}
      </div>

      <footer className="footer">
        &copy; 2026. ZettaPlan All rights reserved.
      </footer>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={confirmDeleteId !== null}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <span className="material-icons-outlined">close</span>
            </button>

            <h3 className="modal-title">
              {editingId !== null ? 'แก้ไขเป้าหมาย' : 'สร้างเป้าหมายใหม่'}
            </h3>

            <div className="modal-form">
              <div className="modal-field">
                <label className="modal-label">ชื่อเป้าหมาย</label>
                <input
                  type="text"
                  className="modal-input"
                  value={form.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                />
              </div>

              <div className="modal-row-2">
                <div className="modal-field">
                  <label className="modal-label">จำนวนเงินที่ตั้งไว้ (บาท)</label>
                  <input
                    type="number"
                    className="modal-input"
                    value={form.targetAmount}
                    onChange={(e) => handleFormChange('targetAmount', e.target.value)}
                  />
                </div>
                <div className="modal-field">
                  <label className="modal-label">เงินออมปัจจุบัน</label>
                  <input
                    type="number"
                    className="modal-input"
                    value={form.currentSavings}
                    onChange={(e) => handleFormChange('currentSavings', e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-row-2">
                <div className="modal-field">
                  <label className="modal-label">ระยะเวลา (ปี)</label>
                  <input
                    type="number"
                    className="modal-input"
                    value={form.years}
                    onChange={(e) => handleFormChange('years', e.target.value)}
                  />
                </div>
                <div className="modal-field">
                  <label className="modal-label">Exp. Return (%)</label>
                  <input
                    type="number"
                    className="modal-input"
                    value={form.expectedReturn}
                    onChange={(e) => handleFormChange('expectedReturn', e.target.value)}
                  />
                </div>
              </div>

              <button className="modal-save-btn" onClick={handleSave}>
                <span className="material-icons-outlined">check</span>
                บันทึกข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
