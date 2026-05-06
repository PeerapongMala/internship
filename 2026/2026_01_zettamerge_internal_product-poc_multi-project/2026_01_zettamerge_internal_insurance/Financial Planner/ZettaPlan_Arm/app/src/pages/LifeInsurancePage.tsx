import { useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmModal from '../components/ConfirmModal'
import usePersistedState from '../hooks/usePersistedState'
import './LifeInsurancePage.css'

interface LifePolicy {
  id: number
  code: string
  company: string
  coverage: number
  premium: number
}

interface NeedItem {
  id: number
  name: string
  amount: number
}

interface NeedDraftItem {
  id: number
  name: string
  amount: string
}

// Asset from AssetPage (read from localStorage)
interface Asset {
  id: number
  name: string
  category: string
  institution: string
  value: number
}

// Available cases for the "Add" modal
const availableCases: Omit<LifePolicy, 'id'>[] = Array.from({ length: 7 }, (_, i) => ({
  code: `INSL00000${i + 1}`,
  company: 'AIA',
  coverage: 1_000_000,
  premium: 25_000,
}))

const defaultNeeds: NeedItem[] = [
  { id: 1, name: 'หนี้สินคงค้าง (บ้าน/รถ)', amount: 300_000 },
  { id: 2, name: 'ทุนการศึกษาบุตร (ที่ขาด)', amount: 10_000 },
  { id: 3, name: 'กองทุนดูแลครอบครัว', amount: 30_000 },
  { id: 4, name: 'ค่าใช้จ่ายวาระสุดท้าย', amount: 20_000 },
]

const initialPolicies: LifePolicy[] = [
  { id: 1, code: 'INSL000001', company: 'AIA', coverage: 1_000_000, premium: 25_000 },
]

const formatNumber = (n: number) => Math.round(n).toLocaleString('en-US')

export default function LifeInsurancePage() {
  const [policies, setPolicies] = usePersistedState<LifePolicy[]>('zettaplan_life_policies', initialPolicies)
  const [nextId, setNextId] = usePersistedState<number>('zettaplan_life_nextId', 2)
  const [needs, setNeeds] = usePersistedState<NeedItem[]>('zettaplan_life_needs_v2', defaultNeeds)
  const [needsNextId, setNeedsNextId] = usePersistedState<number>('zettaplan_life_needs_nextId', 5)

  // Read assets from AssetPage localStorage (read-only)
  const storedAssets = (() => {
    try {
      const raw = localStorage.getItem('zettaplan_assets')
      return raw ? (JSON.parse(raw) as Asset[]) : []
    } catch {
      return []
    }
  })()

  // Edit mode for needs card
  const [editingNeeds, setEditingNeeds] = useState(false)
  const [needsDraft, setNeedsDraft] = useState<NeedDraftItem[]>([])
  const [needsDraftNextId, setNeedsDraftNextId] = useState(0)

  // Add modal
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [selectedCases, setSelectedCases] = useState<Set<number>>(new Set())

  // Confirm delete
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  // Calculations
  const totalNeed = needs.reduce((s, n) => s + n.amount, 0)
  const totalAsset = storedAssets.reduce((s, a) => s + a.value, 0)
  const totalPolicyCoverage = policies.reduce((s, p) => s + p.coverage, 0)
  const gap = totalNeed - totalAsset - totalPolicyCoverage
  const funded = totalNeed > 0 ? Math.min(((totalAsset + totalPolicyCoverage) / totalNeed) * 100, 100) : 100
  const isCovered = gap <= 0

  // Needs edit handlers
  const handleEditNeeds = () => {
    setNeedsDraft(needs.map((n) => ({ id: n.id, name: n.name, amount: String(n.amount) })))
    setNeedsDraftNextId(needsNextId)
    setEditingNeeds(true)
  }
  const handleSaveNeeds = () => {
    const saved = needsDraft.map((d) => ({
      id: d.id,
      name: d.name.trim() || 'รายการ',
      amount: Number(d.amount) || 0,
    }))
    setNeeds(saved)
    setNeedsNextId(needsDraftNextId)
    setEditingNeeds(false)
  }
  const handleCancelNeeds = () => setEditingNeeds(false)

  const handleAddNeedBlock = () => {
    setNeedsDraft((prev) => [{ id: needsDraftNextId, name: '', amount: '' }, ...prev])
    setNeedsDraftNextId((prev) => prev + 1)
  }
  const handleRemoveNeedBlock = (id: number) => {
    setNeedsDraft((prev) => prev.filter((d) => d.id !== id))
  }
  const handleNeedDraftChange = (id: number, field: 'name' | 'amount', value: string) => {
    setNeedsDraft((prev) => prev.map((d) => d.id === id ? { ...d, [field]: value } : d))
  }

  // Add modal handlers
  const openAddModal = () => {
    setSelectedCases(new Set())
    setAddModalOpen(true)
  }
  const toggleCase = (idx: number) => {
    setSelectedCases((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }
  const toggleAllCases = () => {
    if (selectedCases.size === availableCases.length) {
      setSelectedCases(new Set())
    } else {
      setSelectedCases(new Set(availableCases.map((_, i) => i)))
    }
  }
  const handleAddSave = () => {
    if (selectedCases.size === 0) return
    let id = nextId
    const newPolicies: LifePolicy[] = []
    selectedCases.forEach((idx) => {
      const c = availableCases[idx]
      newPolicies.push({ id, ...c })
      id++
    })
    setPolicies((prev) => [...prev, ...newPolicies])
    setNextId(id)
    setAddModalOpen(false)
  }

  // Delete
  const confirmDelete = () => {
    if (confirmDeleteId === null) return
    setPolicies((prev) => prev.filter((p) => p.id !== confirmDeleteId))
    setConfirmDeleteId(null)
  }

  return (
    <div className="content life-ins-content">
      {/* ===== Banner ===== */}
      <div className={`life-banner ${isCovered ? 'covered' : ''}`}>
        <div className="life-banner-label">สรุปความคุ้มครองที่ต้องทำเพิ่ม</div>
        {isCovered ? (
          <div className="life-banner-value covered-text">ครอบคลุมแล้ว</div>
        ) : (
          <div className="life-banner-value">{formatNumber(gap)} <span className="life-banner-unit">บาท</span></div>
        )}
        <div className="life-banner-desc">
          คุณควรทำทุนประกันเพิ่มอย่างน้อยจำนวนนี้ เพื่อปิดความเสี่ยงทางการเงิน
        </div>
        <div className="life-progress-bar">
          <div
            className={`life-progress-fill ${isCovered ? 'covered' : ''}`}
            style={{ width: `${funded}%` }}
          />
        </div>
        <div className="life-progress-labels">
          <span>Funded: {Math.round(funded)}%</span>
          <span>เป้าหมาย: 100%</span>
        </div>
      </div>

      {/* ===== Table ===== */}
      <div className="life-card life-table-section">
        <div className="life-table-header">
          <h3 className="life-card-title">รายการประกันชีวิต</h3>
          <button className="life-add-btn" onClick={openAddModal}>
            <span className="material-icons-outlined">add</span>
            เพิ่มประกันชีวิต
          </button>
        </div>
        <div className="life-table-wrapper life-table-scroll">
          <table className="life-table">
            <thead>
              <tr>
                <th>รหัสประกัน</th>
                <th>บริษัท</th>
                <th className="text-right">ทุนประกันรวม (บาท)</th>
                <th className="text-right">เบี้ยประกัน (บาท)</th>
                <th className="text-center">ลบ</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((p) => (
                <tr key={p.id}>
                  <td>{p.code}</td>
                  <td>{p.company}</td>
                  <td className="text-right value-cell">{formatNumber(p.coverage)}</td>
                  <td className="text-right">{formatNumber(p.premium)}</td>
                  <td className="text-center">
                    <button className="icon-btn delete" onClick={() => setConfirmDeleteId(p.id)}>
                      <span className="material-icons-outlined">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== Bottom 2 Cards ===== */}
      <div className="life-bottom-grid">
        {/* Left: ภาระและความจำเป็น */}
        <div className="life-card">
          <div className="life-needs-header">
            <h3 className="life-card-title">ภาระและความจำเป็น</h3>
            {editingNeeds && (
              <button className="life-add-btn" onClick={handleAddNeedBlock}>
                <span className="material-icons-outlined">add</span>
                เพิ่มความจำเป็น
              </button>
            )}
          </div>
          {editingNeeds ? (
            <>
              <div className="life-needs-scroll">
                {needsDraft.map((d) => (
                  <div className="life-need-block" key={d.id}>
                    <button className="life-need-block-delete" onClick={() => handleRemoveNeedBlock(d.id)}>
                      <span className="material-icons-outlined">delete</span>
                    </button>
                    <div className="life-field">
                      <span className="life-field-label">ชื่อรายการ</span>
                      <input type="text" className="life-field-input" value={d.name}
                        onChange={(e) => handleNeedDraftChange(d.id, 'name', e.target.value)} />
                    </div>
                    <div className="life-field">
                      <span className="life-field-label">จำนวนเงิน (บาท)</span>
                      <input type="number" className="life-field-input" value={d.amount}
                        onChange={(e) => handleNeedDraftChange(d.id, 'amount', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="life-total-row">
                <span className="life-total-label">รวมความจำเป็น</span>
                <span className="life-total-value">
                  {formatNumber(needsDraft.reduce((s, d) => s + (Number(d.amount) || 0), 0))} บาท
                </span>
              </div>
              <div className="life-edit-actions">
                <button className="life-action-btn cancel" onClick={handleCancelNeeds}>
                  <span className="material-icons-outlined">close</span> ยกเลิกการแก้ไข
                </button>
                <button className="life-action-btn save" onClick={handleSaveNeeds}>
                  <span className="material-icons-outlined">check</span> บันทึกข้อมูล
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="life-fields">
                {needs.map((n) => (
                  <div className="life-field" key={n.id}>
                    <span className="life-field-label">{n.name} (บาท)</span>
                    <span className="life-field-value">{formatNumber(n.amount)}</span>
                  </div>
                ))}
              </div>
              <div className="life-total-row">
                <span className="life-total-label">รวมความจำเป็น</span>
                <span className="life-total-value">{formatNumber(totalNeed)} บาท</span>
              </div>
              <button className="life-edit-btn" onClick={handleEditNeeds}>
                <span className="material-icons-outlined">edit</span> แก้ไขข้อมูล
              </button>
            </>
          )}
        </div>

        {/* Right: ทรัพย์สินที่มีอยู่ (read-only, from AssetPage) */}
        <div className="life-card">
          <h3 className="life-card-title">ทรัพย์สินที่มีอยู่</h3>
          <p className="life-assets-hint">*สามารถไปที่หน้า <Link to="/assets" className="life-assets-link">สินทรัพย์</Link> เพื่อแก้ไขข้อมูลได้</p>
          <div className="life-assets-scroll">
            {storedAssets.length > 0 ? (
              storedAssets.map((a) => (
                <div className="life-asset-item" key={a.id}>
                  <div className="life-asset-item-header">
                    <span className="life-asset-item-name">{a.name}</span>
                  </div>
                  <div className="life-asset-item-detail">
                    <span className="life-field-label">{a.category}</span>
                    <span className="life-field-value">{formatNumber(a.value)}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="life-empty-text">ยังไม่มีข้อมูลสินทรัพย์</div>
            )}
          </div>
          <div className="life-total-row">
            <span className="life-total-label" style={{ color: 'var(--primary)' }}>รวมทรัพย์สิน</span>
            <span className="life-total-value accent">{formatNumber(totalAsset)} บาท</span>
          </div>
        </div>
      </div>

      <footer className="footer">
        &copy; 2026. ZettaPlan All rights reserved.
      </footer>

      {/* Confirm Delete */}
      <ConfirmModal isOpen={confirmDeleteId !== null} onConfirm={confirmDelete} onCancel={() => setConfirmDeleteId(null)} />

      {/* Add Cases Modal */}
      {addModalOpen && (
        <div className="modal-overlay" onClick={() => setAddModalOpen(false)}>
          <div className="modal-card life-add-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setAddModalOpen(false)}>
              <span className="material-icons-outlined">close</span>
            </button>
            <h3 className="modal-title">เพิ่มประกันชีวิต</h3>
            <div className="life-case-table-wrapper">
              <table className="life-case-table">
                <thead>
                  <tr>
                    <th className="text-center">
                      <input type="checkbox" checked={selectedCases.size === availableCases.length}
                        onChange={toggleAllCases} />
                    </th>
                    <th>รหัสประกัน</th>
                    <th>บริษัท</th>
                    <th className="text-right">ทุนประกันรวม (บาท)</th>
                    <th className="text-right">เบี้ยประกัน (บาท)</th>
                  </tr>
                </thead>
                <tbody>
                  {availableCases.map((c, idx) => (
                    <tr key={idx} className={selectedCases.has(idx) ? 'selected' : ''} onClick={() => toggleCase(idx)}>
                      <td className="text-center">
                        <input type="checkbox" checked={selectedCases.has(idx)} onChange={() => toggleCase(idx)} />
                      </td>
                      <td>{c.code}</td>
                      <td>{c.company}</td>
                      <td className="text-right value-cell">{formatNumber(c.coverage)}</td>
                      <td className="text-right">{formatNumber(c.premium)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button className="modal-save-btn" onClick={handleAddSave}>เลือก</button>
          </div>
        </div>
      )}
    </div>
  )
}
