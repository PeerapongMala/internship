import { useState } from 'react'
import DonutChart from '../components/DonutChart'
import AreaChart from '../components/AreaChart'
import usePersistedState from '../hooks/usePersistedState'
import './PortfolioPage.css'

interface InvestmentData {
  initialInvestment: number
  monthlySaving: number
  expectedReturn: number
  years: number
}

const defaultData: InvestmentData = {
  initialInvestment: 100_000,
  monthlySaving: 5_000,
  expectedReturn: 5,
  years: 3,
}

const portfolioSegments = [
  { label: 'ตราสารหนี้', color: '#F59E0B', pct: 40 },
  { label: 'หุ้นไทย', color: '#8B5CF6', pct: 25 },
  { label: 'หุ้นต่างประเทศ', color: '#22C55E', pct: 20 },
  { label: 'อสังหาฯ', color: '#EF4444', pct: 15 },
]

const formatNumber = (n: number) => Math.round(n).toLocaleString('en-US')

export default function PortfolioPage() {
  const [data, setData] = usePersistedState<InvestmentData>('zettaplan_portfolio', defaultData)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState<Record<keyof InvestmentData, string>>({
    initialInvestment: String(data.initialInvestment),
    monthlySaving: String(data.monthlySaving),
    expectedReturn: String(data.expectedReturn),
    years: String(data.years),
  })

  // Build chart data: compound growth per year
  const chartData = (() => {
    const r = data.expectedReturn / 100 / 12
    const points = []
    for (let y = 0; y <= data.years; y++) {
      const months = y * 12
      // FV of initial investment + FV of annuity (monthly savings)
      const fvInitial = data.initialInvestment * Math.pow(1 + r, months)
      const fvAnnuity = r > 0
        ? data.monthlySaving * ((Math.pow(1 + r, months) - 1) / r)
        : data.monthlySaving * months
      points.push({
        label: String(data.years >= 10 ? y : y + (data.years <= 5 ? 30 : 30)),
        value: fvInitial + fvAnnuity,
      })
    }
    // Use actual age labels: start from 30
    return points.map((p, i) => ({ ...p, label: String(30 + i) }))
  })()

  const handleEdit = () => {
    setDraft({
      initialInvestment: String(data.initialInvestment),
      monthlySaving: String(data.monthlySaving),
      expectedReturn: String(data.expectedReturn),
      years: String(data.years),
    })
    setIsEditing(true)
  }

  const handleSave = () => {
    const parsed: InvestmentData = {
      initialInvestment: Number(draft.initialInvestment) || 0,
      monthlySaving: Number(draft.monthlySaving) || 0,
      expectedReturn: Number(draft.expectedReturn) || 0,
      years: Number(draft.years) || 1,
    }
    if (parsed.years <= 0) return
    setData(parsed)
    setIsEditing(false)
  }

  const handleCancel = () => setIsEditing(false)

  const handleDraftChange = (field: keyof InvestmentData, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="content portfolio-content">
      {/* ===== Banner ===== */}
      <div className="port-banner">
        <div className="port-banner-subtitle">พอร์ตที่แนะนำจาก AI</div>
        <div className="port-banner-title">AIA 5 Years Plan</div>
      </div>

      {/* ===== Middle: Donut + Details ===== */}
      <div className="port-middle-grid">
        {/* Left: Donut Chart + Legend */}
        <div className="port-card port-chart-card">
          <div className="port-chart-content">
            <DonutChart
              segments={portfolioSegments.map((s) => ({
                value: s.pct,
                color: s.color,
                label: s.label,
              }))}
              size={200}
              strokeWidth={45}
            />
            <div className="port-legend">
              {portfolioSegments.map((s) => (
                <div className="port-legend-item" key={s.label}>
                  <span className="port-legend-swatch" style={{ background: s.color }} />
                  <span className="port-legend-text">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Details */}
        <div className="port-card port-details-card">
          <h3 className="port-card-title">รายละเอียดพอร์ต</h3>
          <p className="port-details-desc">
            เน้นสร้างสมดุลระหว่างผลตอบแทนและความเสี่ยง
            เหมาะสำหรับการลงทุน ระยะยาว 3-5 ปีขึ้นไป
          </p>
          <div className="port-return-box">
            <div className="port-return-label">ผลตอบแทนที่คาดหวังเฉลี่ย</div>
            <div className="port-return-value">5 - 8%</div>
            <div className="port-return-unit">ต่อปี (Compound Annual Growth Rate)</div>
          </div>
        </div>
      </div>

      {/* ===== Bottom: Investment Simulator + Chart ===== */}
      <div className="port-bottom-grid">
        {/* Left: จำลองการลงทุน */}
        <div className="port-card port-sim-card">
          <h3 className="port-card-title">จำลองการลงทุน</h3>

          <div className="port-sim-fields">
            <div className="port-sim-field">
              <span className="port-sim-label">เงินลงทุนเริ่มต้น (บาท)</span>
              {isEditing ? (
                <input type="number" className="port-sim-input" value={draft.initialInvestment}
                  onChange={(e) => handleDraftChange('initialInvestment', e.target.value)} />
              ) : (
                <span className="port-sim-value">{formatNumber(data.initialInvestment)}</span>
              )}
            </div>
            <div className="port-sim-field">
              <span className="port-sim-label">ออมเพิ่มต่อเดือน (บาท)</span>
              {isEditing ? (
                <input type="number" className="port-sim-input" value={draft.monthlySaving}
                  onChange={(e) => handleDraftChange('monthlySaving', e.target.value)} />
              ) : (
                <span className="port-sim-value">{formatNumber(data.monthlySaving)}</span>
              )}
            </div>
            <div className="port-sim-field">
              <span className="port-sim-label">ผลตอบแทนที่คาดหวัง (%)</span>
              {isEditing ? (
                <input type="number" className="port-sim-input" value={draft.expectedReturn}
                  onChange={(e) => handleDraftChange('expectedReturn', e.target.value)} />
              ) : (
                <span className="port-sim-value">{data.expectedReturn}</span>
              )}
            </div>
            <div className="port-sim-field">
              <span className="port-sim-label">ระยะเวลา (ปี)</span>
              {isEditing ? (
                <input type="number" className="port-sim-input" value={draft.years}
                  onChange={(e) => handleDraftChange('years', e.target.value)} />
              ) : (
                <span className="port-sim-value">{data.years}</span>
              )}
            </div>
          </div>

          {isEditing ? (
            <div className="port-sim-actions">
              <button className="port-sim-btn cancel" onClick={handleCancel}>
                <span className="material-icons-outlined">close</span> ยกเลิกการแก้ไข
              </button>
              <button className="port-sim-btn save" onClick={handleSave}>
                <span className="material-icons-outlined">check</span> บันทึกข้อมูล
              </button>
            </div>
          ) : (
            <button className="port-sim-btn edit" onClick={handleEdit}>
              <span className="material-icons-outlined">edit</span> แก้ไขข้อมูล
            </button>
          )}
        </div>

        {/* Right: Area Chart */}
        <div className="port-card port-area-card">
          <div className="port-area-wrapper">
            <AreaChart data={chartData} width={600} height={320} color="#2DD4BF" />
          </div>
        </div>
      </div>

      <footer className="footer">
        &copy; 2026. ZettaPlan All rights reserved.
      </footer>
    </div>
  )
}
