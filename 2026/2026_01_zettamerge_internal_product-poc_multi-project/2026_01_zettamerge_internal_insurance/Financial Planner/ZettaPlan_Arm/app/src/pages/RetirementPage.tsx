import { useState } from 'react'
import AreaChart from '../components/AreaChart'
import usePersistedState from '../hooks/usePersistedState'
import './RetirementPage.css'

interface RetirementData {
  currentAge: number
  retireAge: number
  monthlyExpense: number
  inflation: number
}

const defaultData: RetirementData = {
  currentAge: 30,
  retireAge: 60,
  monthlyExpense: 30000,
  inflation: 3,
}

const formatNumber = (n: number) => Math.round(n).toLocaleString('en-US')

export default function RetirementPage() {
  const [data, setData] = usePersistedState<RetirementData>('zettaplan_retirement', defaultData)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState<Record<keyof RetirementData, string>>({
    currentAge: String(data.currentAge),
    retireAge: String(data.retireAge),
    monthlyExpense: String(data.monthlyExpense),
    inflation: String(data.inflation),
  })

  // Calculations
  const yearsToRetire = data.retireAge - data.currentAge
  const futureMonthly = data.monthlyExpense * Math.pow(1 + data.inflation / 100, yearsToRetire)
  const totalNeeded = futureMonthly * 12 * 25

  // Chart data: linear savings growth per year
  const chartData = Array.from({ length: yearsToRetire + 1 }, (_, i) => ({
    label: String(data.currentAge + i),
    value: (totalNeeded / yearsToRetire) * i,
  }))

  const handleEdit = () => {
    setDraft({
      currentAge: String(data.currentAge),
      retireAge: String(data.retireAge),
      monthlyExpense: String(data.monthlyExpense),
      inflation: String(data.inflation),
    })
    setIsEditing(true)
  }

  const handleSave = () => {
    const parsed: RetirementData = {
      currentAge: Number(draft.currentAge) || 0,
      retireAge: Number(draft.retireAge) || 0,
      monthlyExpense: Number(draft.monthlyExpense) || 0,
      inflation: Number(draft.inflation) || 0,
    }
    if (parsed.retireAge <= parsed.currentAge || parsed.monthlyExpense <= 0) return
    setData(parsed)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleDraftChange = (field: keyof RetirementData, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="content retirement-content">
      <div className="retirement-grid">
        {/* ===== ซ้าย: การ์ดคำนวณ ===== */}
        <div className="retire-card calc-card">
          <h3 className="retire-card-title">คำนวณการวางแผนเกษียณ</h3>

          <div className="calc-fields">
            <div className="field-row">
              <span className="field-label">อายุปัจจุบัน (ปี)</span>
              {isEditing ? (
                <input
                  type="number"
                  className="field-input"
                  value={draft.currentAge}
                  onChange={(e) => handleDraftChange('currentAge', e.target.value)}
                />
              ) : (
                <span className="field-value">{formatNumber(data.currentAge)}</span>
              )}
            </div>

            <div className="field-row">
              <span className="field-label">เกษียณที่อายุ (ปี)</span>
              {isEditing ? (
                <input
                  type="number"
                  className="field-input"
                  value={draft.retireAge}
                  onChange={(e) => handleDraftChange('retireAge', e.target.value)}
                />
              ) : (
                <span className="field-value">{formatNumber(data.retireAge)}</span>
              )}
            </div>

            <div className="field-row">
              <span className="field-label">ใช้เงินหลังเกษียณ (บาท/เดือน)</span>
              {isEditing ? (
                <input
                  type="number"
                  className="field-input"
                  value={draft.monthlyExpense}
                  onChange={(e) => handleDraftChange('monthlyExpense', e.target.value)}
                />
              ) : (
                <span className="field-value">{formatNumber(data.monthlyExpense)}</span>
              )}
            </div>

            <div className="field-row">
              <span className="field-label">เงินเฟ้อ (%)</span>
              {isEditing ? (
                <input
                  type="number"
                  className="field-input"
                  value={draft.inflation}
                  onChange={(e) => handleDraftChange('inflation', e.target.value)}
                />
              ) : (
                <span className="field-value">{data.inflation}</span>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="calc-actions">
              <button className="calc-btn cancel" onClick={handleCancel}>
                ยกเลิก
              </button>
              <button className="calc-btn save" onClick={handleSave}>
                <span className="material-icons-outlined">check</span>
                บันทึก
              </button>
            </div>
          ) : (
            <button className="calc-btn edit" onClick={handleEdit}>
              <span className="material-icons-outlined">edit</span>
              แก้ไขข้อมูล
            </button>
          )}
        </div>

        {/* ===== ขวา: ผลลัพธ์ ===== */}
        <div className="results-col">
          {/* 2 summary cards */}
          <div className="summary-grid">
            <div className="summary-card">
              <div className="summary-label">เงินใช้ต่อเดือน (ในอนาคต)</div>
              <div className="summary-value">{formatNumber(futureMonthly)}</div>
            </div>
            <div className="summary-card">
              <div className="summary-label">แผนเกษียณอายุ</div>
              <div className="summary-value">{formatNumber(totalNeeded)}</div>
            </div>
          </div>

          {/* Area chart */}
          <div className="retire-card chart-card">
            <h3 className="retire-card-title">ผลการวางแผนเกษียณ</h3>
            <div className="chart-wrapper">
              <AreaChart data={chartData} width={600} height={280} color="#2DD4BF" />
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        &copy; 2026. ZettaPlan All rights reserved.
      </footer>
    </div>
  )
}
