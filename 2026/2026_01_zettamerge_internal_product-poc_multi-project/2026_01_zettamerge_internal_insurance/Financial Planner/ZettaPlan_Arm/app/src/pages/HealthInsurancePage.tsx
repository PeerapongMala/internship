import { useState } from 'react'
import ConfirmModal from '../components/ConfirmModal'
import usePersistedState from '../hooks/usePersistedState'
import './HealthInsurancePage.css'

interface HealthPolicy {
  id: number
  code: string
  company: string
  coverage: number
  premium: number
}

interface CoverageData {
  roomPerNight: number
  annualLimit: number
  opdPerVisit: number
}

interface CoverageDraft {
  roomPerNight: string
  annualLimit: string
  opdPerVisit: string
}

type StandardLevel = 'ระดับทั่วไป (มาตรฐาน)' | 'ระดับกลาง' | 'ระดับสูง'

const standardBenchmarks: Record<StandardLevel, { room: number; annual: number; opd: number }> = {
  'ระดับทั่วไป (มาตรฐาน)': { room: 4_000, annual: 1_000_000, opd: 1_500 },
  'ระดับกลาง': { room: 6_000, annual: 3_000_000, opd: 2_500 },
  'ระดับสูง': { room: 10_000, annual: 5_000_000, opd: 5_000 },
}

const availableCases: Omit<HealthPolicy, 'id'>[] = Array.from({ length: 7 }, (_, i) => ({
  code: `INSH00000${i + 1}`,
  company: 'AIA',
  coverage: 1_000_000,
  premium: 25_000,
}))

const initialPolicies: HealthPolicy[] = [
  { id: 1, code: 'INSH000001', company: 'AIA', coverage: 5_000_000, premium: 30_000 },
]

const defaultCoverage: CoverageData = {
  roomPerNight: 4_000,
  annualLimit: 500_000,
  opdPerVisit: 1_000,
}

const formatNumber = (n: number) => Math.round(n).toLocaleString('en-US')

export default function HealthInsurancePage() {
  const [policies, setPolicies] = usePersistedState<HealthPolicy[]>('zettaplan_health_policies', initialPolicies)
  const [nextId, setNextId] = usePersistedState<number>('zettaplan_health_nextId', 2)
  const [coverage, setCoverage] = usePersistedState<CoverageData>('zettaplan_health_coverage', defaultCoverage)

  // Edit mode for coverage card
  const [editingCoverage, setEditingCoverage] = useState(false)
  const [draft, setDraft] = useState<CoverageDraft>({ roomPerNight: '', annualLimit: '', opdPerVisit: '' })

  // Add modal
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [selectedCases, setSelectedCases] = useState<Set<number>>(new Set())

  // Confirm delete
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  // Standard level
  const [standardLevel, setStandardLevel] = useState<StandardLevel>('ระดับทั่วไป (มาตรฐาน)')
  const benchmark = standardBenchmarks[standardLevel]

  // Coverage edit handlers
  const handleEditCoverage = () => {
    setDraft({
      roomPerNight: String(coverage.roomPerNight),
      annualLimit: String(coverage.annualLimit),
      opdPerVisit: String(coverage.opdPerVisit),
    })
    setEditingCoverage(true)
  }
  const handleSaveCoverage = () => {
    setCoverage({
      roomPerNight: Number(draft.roomPerNight) || 0,
      annualLimit: Number(draft.annualLimit) || 0,
      opdPerVisit: Number(draft.opdPerVisit) || 0,
    })
    setEditingCoverage(false)
  }
  const handleCancelCoverage = () => setEditingCoverage(false)
  const handleDraftChange = (field: keyof CoverageDraft, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }))
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
    const newPolicies: HealthPolicy[] = []
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

  // Comparison bar helper
  const getBarPercent = (actual: number, target: number) => {
    if (target <= 0) return 100
    return Math.min((actual / target) * 100, 100)
  }
  const getBarColor = (actual: number, target: number) => {
    return actual >= target ? '#10B981' : '#EF4444'
  }

  return (
    <div className="content health-ins-content">
      {/* ===== Table ===== */}
      <div className="health-card health-table-section">
        <div className="health-table-header">
          <h3 className="health-card-title">รายการประกันสุขภาพ</h3>
          <button className="health-add-btn" onClick={openAddModal}>
            <span className="material-icons-outlined">add</span>
            เพิ่มประกันสุขภาพ
          </button>
        </div>
        <div className="health-table-wrapper health-table-scroll">
          <table className="health-table">
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
      <div className="health-bottom-grid">
        {/* Left: ข้อมูลความคุ้มครองเดิม */}
        <div className="health-card">
          <h3 className="health-card-title">ข้อมูลความคุ้มครองเดิม</h3>
          {editingCoverage ? (
            <>
              <div className="health-fields">
                <div className="health-field">
                  <span className="health-field-label">ค่าห้องต่อคืน (บาท)</span>
                  <input type="number" className="health-field-input" value={draft.roomPerNight}
                    onChange={(e) => handleDraftChange('roomPerNight', e.target.value)} />
                </div>
                <div className="health-field">
                  <span className="health-field-label">วงเงินเหมาจ่ายต่อปี (บาท)</span>
                  <input type="number" className="health-field-input" value={draft.annualLimit}
                    onChange={(e) => handleDraftChange('annualLimit', e.target.value)} />
                </div>
                <div className="health-field">
                  <span className="health-field-label">ค่ารักษาผู้ป่วยนอก (OPD/ครั้ง) (บาท)</span>
                  <input type="number" className="health-field-input" value={draft.opdPerVisit}
                    onChange={(e) => handleDraftChange('opdPerVisit', e.target.value)} />
                </div>
              </div>
              <div className="health-edit-actions">
                <button className="health-action-btn cancel" onClick={handleCancelCoverage}>
                  <span className="material-icons-outlined">close</span> ยกเลิกการแก้ไข
                </button>
                <button className="health-action-btn save" onClick={handleSaveCoverage}>
                  <span className="material-icons-outlined">check</span> บันทึกข้อมูล
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="health-fields">
                <div className="health-field">
                  <span className="health-field-label">ค่าห้องต่อคืน (บาท)</span>
                  <span className="health-field-value">{formatNumber(coverage.roomPerNight)}</span>
                </div>
                <div className="health-field">
                  <span className="health-field-label">วงเงินเหมาจ่ายต่อปี (บาท)</span>
                  <span className="health-field-value">{formatNumber(coverage.annualLimit)}</span>
                </div>
                <div className="health-field">
                  <span className="health-field-label">ค่ารักษาผู้ป่วยนอก (OPD/ครั้ง) (บาท)</span>
                  <span className="health-field-value">{formatNumber(coverage.opdPerVisit)}</span>
                </div>
              </div>
              <button className="health-edit-btn" onClick={handleEditCoverage}>
                <span className="material-icons-outlined">edit</span> แก้ไขข้อมูล
              </button>
            </>
          )}
        </div>

        {/* Right: จำลองเปรียบเทียบกับค่ารักษามาตรฐาน */}
        <div className="health-card">
          <div className="health-compare-header">
            <h3 className="health-card-title">จำลองเปรียบเทียบกับค่ารักษามาตรฐาน</h3>
            <select
              className="health-level-select"
              value={standardLevel}
              onChange={(e) => setStandardLevel(e.target.value as StandardLevel)}
            >
              {Object.keys(standardBenchmarks).map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div className="health-compare-items">
            {/* ค่าห้องพักผู้ป่วยใน (OPD) */}
            <div className="health-compare-item">
              <div className="health-compare-item-header">
                <span className="health-compare-item-label">ค่าห้องพักผู้ป่วยใน (OPD)</span>
                <span className="health-compare-item-values" style={{ color: getBarColor(coverage.roomPerNight, benchmark.room) }}>
                  ฿ {formatNumber(coverage.roomPerNight)} / เป้าหมาย {formatNumber(benchmark.room)} บาท
                </span>
              </div>
              <div className="health-compare-bar">
                <div
                  className="health-compare-bar-fill"
                  style={{
                    width: `${getBarPercent(coverage.roomPerNight, benchmark.room)}%`,
                    background: getBarColor(coverage.roomPerNight, benchmark.room),
                  }}
                />
              </div>
            </div>

            {/* วงเงินรักษาโรคร้ายแรง/เหมาจ่าย */}
            <div className="health-compare-item">
              <div className="health-compare-item-header">
                <span className="health-compare-item-label">วงเงินรักษาโรคร้ายแรง/เหมาจ่าย</span>
                <span className="health-compare-item-values" style={{ color: getBarColor(coverage.annualLimit, benchmark.annual) }}>
                  ฿ {formatNumber(coverage.annualLimit)} / เป้าหมาย {formatNumber(benchmark.annual)} บาท
                </span>
              </div>
              <div className="health-compare-bar">
                <div
                  className="health-compare-bar-fill"
                  style={{
                    width: `${getBarPercent(coverage.annualLimit, benchmark.annual)}%`,
                    background: getBarColor(coverage.annualLimit, benchmark.annual),
                  }}
                />
              </div>
            </div>

            {/* ค่ารักษาผู้ป่วยนอก (OPD) */}
            <div className="health-compare-item">
              <div className="health-compare-item-header">
                <span className="health-compare-item-label">ค่ารักษาผู้ป่วยนอก (OPD)</span>
                <span className="health-compare-item-values" style={{ color: getBarColor(coverage.opdPerVisit, benchmark.opd) }}>
                  ฿ {formatNumber(coverage.opdPerVisit)} / เป้าหมาย {formatNumber(benchmark.opd)} บาท
                </span>
              </div>
              <div className="health-compare-bar">
                <div
                  className="health-compare-bar-fill"
                  style={{
                    width: `${getBarPercent(coverage.opdPerVisit, benchmark.opd)}%`,
                    background: getBarColor(coverage.opdPerVisit, benchmark.opd),
                  }}
                />
              </div>
            </div>
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
          <div className="modal-card health-add-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setAddModalOpen(false)}>
              <span className="material-icons-outlined">close</span>
            </button>
            <h3 className="modal-title">เพิ่มประกันสุขภาพ</h3>
            <div className="health-case-table-wrapper">
              <table className="health-case-table">
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
