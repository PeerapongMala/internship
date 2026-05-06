import { useState } from 'react'
import DonutChart from '../components/DonutChart'
import ConfirmModal from '../components/ConfirmModal'
import usePersistedState from '../hooks/usePersistedState'
import './AssetPage.css'

type AssetCategory = 'เงินสด/ฝากธนาคาร' | 'กองทุนรวม' | 'หุ้นสามัญ'

interface Asset {
  id: number
  name: string
  category: AssetCategory
  institution: string
  value: number
}

interface CategoryConfig {
  label: string
  color: string
  categoryDisplay: string
}

const categoryConfig: Record<AssetCategory, CategoryConfig> = {
  'เงินสด/ฝากธนาคาร': {
    label: 'เงินสด/ฝากธนาคาร',
    color: '#6366F1',
    categoryDisplay: 'เงินฝาก',
  },
  'กองทุนรวม': {
    label: 'กองทุนรวม',
    color: '#22C55E',
    categoryDisplay: 'กองทุน',
  },
  'หุ้นสามัญ': {
    label: 'หุ้นสามัญ',
    color: '#F59E0B',
    categoryDisplay: 'หุ้น',
  },
}

const categoryOptions: AssetCategory[] = ['เงินสด/ฝากธนาคาร', 'กองทุนรวม', 'หุ้นสามัญ']

const initialAssets: Asset[] = [
  { id: 1, name: 'หุ้นสามัญ', category: 'หุ้นสามัญ', institution: 'Bualuang', value: 3_000_000 },
  { id: 2, name: 'กองทุนรวม', category: 'กองทุนรวม', institution: 'SCBAM', value: 2_500_000 },
  { id: 3, name: 'เงินสด/ฝากธนาคาร', category: 'เงินสด/ฝากธนาคาร', institution: 'KBANK', value: 1_500_000 },
]

const formatNumber = (n: number) => n.toLocaleString('en-US')

interface ModalForm {
  name: string
  category: AssetCategory
  institution: string
  value: string
}

const emptyForm: ModalForm = {
  name: '',
  category: 'หุ้นสามัญ',
  institution: '',
  value: '',
}

export default function AssetPage() {
  const [assets, setAssets] = usePersistedState<Asset[]>('zettaplan_assets', initialAssets)
  const [nextId, setNextId] = usePersistedState<number>('zettaplan_nextId', 4)

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<ModalForm>(emptyForm)

  // Confirm delete state
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [exitingId, setExitingId] = useState<number | null>(null)

  const totalValue = assets.reduce((sum, a) => sum + a.value, 0)

  const categoryTotals = (Object.keys(categoryConfig) as AssetCategory[]).map((key) => {
    const config = categoryConfig[key]
    const catTotal = assets
      .filter((a) => a.category === key)
      .reduce((sum, a) => sum + a.value, 0)
    return {
      category: key,
      ...config,
      total: catTotal,
      percentage: totalValue > 0 ? (catTotal / totalValue) * 100 : 0,
    }
  })

  const requestDelete = (id: number) => {
    setConfirmDeleteId(id)
  }

  const confirmDelete = () => {
    if (confirmDeleteId === null) return
    setExitingId(confirmDeleteId)
    setConfirmDeleteId(null)
    setTimeout(() => {
      setAssets((prev) => prev.filter((a) => a.id !== confirmDeleteId))
      setExitingId(null)
    }, 300)
  }

  const cancelDelete = () => {
    setConfirmDeleteId(null)
  }

  const openAddModal = () => {
    setEditingId(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  const openEditModal = (asset: Asset) => {
    setEditingId(asset.id)
    setForm({
      name: asset.name,
      category: asset.category,
      institution: asset.institution,
      value: String(asset.value),
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditingId(null)
  }

  const handleFormChange = (field: keyof ModalForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    const parsedValue = Number(form.value) || 0
    if (!form.name.trim() || !form.institution.trim() || parsedValue <= 0) return

    if (editingId !== null) {
      // แก้ไข
      setAssets((prev) =>
        prev.map((a) =>
          a.id === editingId
            ? { ...a, name: form.name, category: form.category, institution: form.institution, value: parsedValue }
            : a
        )
      )
    } else {
      // เพิ่มใหม่
      setAssets((prev) => [
        ...prev,
        {
          id: nextId,
          name: form.name,
          category: form.category,
          institution: form.institution,
          value: parsedValue,
        },
      ])
      setNextId((prev) => prev + 1)
    }
    closeModal()
  }

  return (
    <div className="content asset-content">
      {/* ===== ส่วนบน: 2 การ์ด ===== */}
      <div className="asset-top-grid">
        {/* ซ้าย: สินทรัพย์สุทธิ */}
        <div className="asset-card net-asset-card">
          <h3 className="asset-card-title">สินทรัพย์สุทธิ</h3>
          <div className="net-asset-value">
            {formatNumber(totalValue)} <span className="currency">บาท</span>
          </div>
          <div className="category-list">
            {categoryTotals.map((cat) => (
              <div className="category-row" key={cat.category}>
                <span className="category-dot" style={{ background: cat.color }} />
                <span className="category-label">{cat.label}</span>
                <span className="category-pct">{cat.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
          <button className="add-asset-btn" onClick={openAddModal}>+ เพิ่มรายการสินทรัพย์</button>
        </div>

        {/* ขวา: สัดส่วนสินทรัพย์ */}
        <div className="asset-card allocation-card">
          <h3 className="asset-card-title">สัดส่วนสินทรัพย์</h3>
          <div className="allocation-content">
            <DonutChart
              segments={categoryTotals.map((cat) => ({
                value: cat.percentage,
                color: cat.color,
                label: cat.label,
                amount: cat.total,
              }))}
              size={200}
            />
            <div className="allocation-legend">
              {categoryTotals.map((cat) => (
                <div className="legend-item" key={cat.category}>
                  <span className="legend-swatch" style={{ background: cat.color }} />
                  <span className="legend-text">{cat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== ส่วนล่าง: ตารางรายการสินทรัพย์ ===== */}
      <div className="asset-card asset-table-card">
        <h3 className="asset-card-title">รายการสินทรัพย์</h3>
        <div className="table-wrapper">
          <table className="asset-table">
            <thead>
              <tr>
                <th>รายการ</th>
                <th>ประเภท</th>
                <th>สถาบันการเงิน</th>
                <th className="text-right">มูลค่าสินทรัพย์ (บาท)</th>
                <th className="text-center">แก้ไข</th>
                <th className="text-center">ลบ</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.id} className={exitingId === asset.id ? 'row-exit' : ''}>
                  <td>{asset.name}</td>
                  <td>{categoryConfig[asset.category].categoryDisplay}</td>
                  <td>{asset.institution}</td>
                  <td className="text-right value-cell">{formatNumber(asset.value)}</td>
                  <td className="text-center">
                    <button className="icon-btn" onClick={() => openEditModal(asset)}>
                      <span className="material-icons-outlined">edit</span>
                    </button>
                  </td>
                  <td className="text-center">
                    <button className="icon-btn delete" onClick={() => requestDelete(asset.id)}>
                      <span className="material-icons-outlined">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="footer">
        &copy; 2026. ZettaPlan All rights reserved.
      </footer>

      {/* ===== Confirm Delete Modal ===== */}
      <ConfirmModal
        isOpen={confirmDeleteId !== null}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      {/* ===== Modal เพิ่ม/แก้ไขสินทรัพย์ ===== */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <span className="material-icons-outlined">close</span>
            </button>

            <h3 className="modal-title">คำนวณการวางแผนเกษียณ</h3>

            <div className="modal-form">
              <div className="modal-field">
                <label className="modal-label">รายการ</label>
                <input
                  type="text"
                  className="modal-input"
                  value={form.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                />
              </div>

              <div className="modal-field">
                <label className="modal-label">ประเภท</label>
                <select
                  className="modal-input modal-select"
                  value={form.category}
                  onChange={(e) => handleFormChange('category', e.target.value)}
                >
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {categoryConfig[cat].categoryDisplay}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-field">
                <label className="modal-label">สถาบันการเงิน</label>
                <input
                  type="text"
                  className="modal-input"
                  value={form.institution}
                  onChange={(e) => handleFormChange('institution', e.target.value)}
                />
              </div>

              <div className="modal-field">
                <label className="modal-label">มูลค่าสินทรัพย์ (บาท)</label>
                <input
                  type="number"
                  className="modal-input"
                  value={form.value}
                  onChange={(e) => handleFormChange('value', e.target.value)}
                />
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
