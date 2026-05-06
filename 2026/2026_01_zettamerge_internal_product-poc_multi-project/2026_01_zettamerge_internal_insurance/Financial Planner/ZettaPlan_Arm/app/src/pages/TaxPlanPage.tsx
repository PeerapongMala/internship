import { useState } from 'react'
import usePersistedState from '../hooks/usePersistedState'
import './TaxPlanPage.css'

// ===== Basic Mode Data =====
interface TaxDataBasic {
  annualIncome: number
  totalDeduction: number
}

// ===== Advanced Mode Data =====
interface TaxDataAdvanced {
  annualIncome: number
  socialSecurity: number
  providentFund: number
  rmfSsfThaiEsg: number
  insurancePremium: number
  otherDeduction: number
}

type TaxLevel = 'ขั้นพื้นฐาน' | 'ขั้นสูง'

const defaultBasic: TaxDataBasic = {
  annualIncome: 1_600_000,
  totalDeduction: 500_000,
}

const defaultAdvanced: TaxDataAdvanced = {
  annualIncome: 4_000,
  socialSecurity: 9_000,
  providentFund: 20_000,
  rmfSsfThaiEsg: 50_000,
  insurancePremium: 30_000,
  otherDeduction: 0,
}

// Thai progressive tax brackets
const taxBrackets = [
  { min: 0, max: 150_000, rate: 0, label: 'ยกเว้น', rangeLabel: '0 > 150K' },
  { min: 150_000, max: 300_000, rate: 5, label: '5%', rangeLabel: '150K > 300K' },
  { min: 300_000, max: 500_000, rate: 10, label: '10%', rangeLabel: '300K > 500K' },
  { min: 500_000, max: 750_000, rate: 15, label: '15%', rangeLabel: '500K > 750K' },
  { min: 750_000, max: 1_000_000, rate: 20, label: '20%', rangeLabel: '750K > 1M' },
  { min: 1_000_000, max: 2_000_000, rate: 25, label: '25%', rangeLabel: '1M > 2M' },
  { min: 2_000_000, max: 5_000_000, rate: 30, label: '30%', rangeLabel: '2M > 5M' },
  { min: 5_000_000, max: Infinity, rate: 35, label: '35%', rangeLabel: 'สุทธิ > 5M' },
]

function calculateTax(netIncome: number): number {
  if (netIncome <= 0) return 0
  let tax = 0
  for (const bracket of taxBrackets) {
    if (netIncome <= bracket.min) break
    const taxable = Math.min(netIncome, bracket.max) - bracket.min
    tax += taxable * (bracket.rate / 100)
  }
  return tax
}

function getHighestBracketIndex(netIncome: number): number {
  if (netIncome < 0) return -1
  // netIncome 0~150K → ยกเว้น (index 0)
  for (let i = taxBrackets.length - 1; i >= 0; i--) {
    if (netIncome > taxBrackets[i].min) return i
  }
  return 0
}

const formatNumber = (n: number) => Math.round(n).toLocaleString('en-US')

// Advanced mode field definitions
const advancedFields: { key: keyof TaxDataAdvanced; label: string; viewLabel: string; unit: string }[] = [
  { key: 'annualIncome', label: 'รายได้ทั้งปี (บาท)', viewLabel: 'รายได้ทั้งปี', unit: 'บาท' },
  { key: 'socialSecurity', label: 'ประกันสังคม (บาท)', viewLabel: 'ประกันสังคม', unit: 'บาท' },
  { key: 'providentFund', label: 'กองทุนสำรองเลี้ยงชีพ (บาท)', viewLabel: 'กองทุนสำรองเลี้ยงชีพ', unit: 'บาท' },
  { key: 'rmfSsfThaiEsg', label: 'RMF / SSF / ThaiESG (บาท)', viewLabel: 'RMF / SSF / ThaiESG', unit: 'บาท' },
  { key: 'insurancePremium', label: 'เบี้ยประกันชีวิต / สุขภาพ (บาท)', viewLabel: 'เบี้ยประกันชีวิต / สุขภาพ', unit: 'บาท' },
  { key: 'otherDeduction', label: 'อื่นๆ (บริจาค / ดอกเบี้ยบ้าน) (บาท)', viewLabel: 'อื่นๆ (บริจาค / ดอกเบี้ยบ้าน)', unit: 'บาท' },
]

export default function TaxPlanPage() {
  // Persisted state for both modes
  const [basicData, setBasicData] = usePersistedState<TaxDataBasic>('zettaplan_tax', defaultBasic)
  const [advancedData, setAdvancedData] = usePersistedState<TaxDataAdvanced>('zettaplan_tax_adv', defaultAdvanced)

  const [taxLevel, setTaxLevel] = useState<TaxLevel>('ขั้นพื้นฐาน')
  const [isEditing, setIsEditing] = useState(false)

  // Drafts for both modes
  const [basicDraft, setBasicDraft] = useState<Record<keyof TaxDataBasic, string>>({
    annualIncome: String(basicData.annualIncome),
    totalDeduction: String(basicData.totalDeduction),
  })
  const [advancedDraft, setAdvancedDraft] = useState<Record<keyof TaxDataAdvanced, string>>({
    annualIncome: String(advancedData.annualIncome),
    socialSecurity: String(advancedData.socialSecurity),
    providentFund: String(advancedData.providentFund),
    rmfSsfThaiEsg: String(advancedData.rmfSsfThaiEsg),
    insurancePremium: String(advancedData.insurancePremium),
    otherDeduction: String(advancedData.otherDeduction),
  })

  const isAdvanced = taxLevel === 'ขั้นสูง'

  // Calculations
  const advTotalDeduction = advancedData.socialSecurity + advancedData.providentFund
    + advancedData.rmfSsfThaiEsg + advancedData.insurancePremium + advancedData.otherDeduction

  const netIncome = isAdvanced
    ? Math.max(advancedData.annualIncome - advTotalDeduction, 0)
    : Math.max(basicData.annualIncome - basicData.totalDeduction, 0)

  const annualIncome = isAdvanced ? advancedData.annualIncome : basicData.annualIncome
  const taxAmount = calculateTax(netIncome)
  const effectiveRate = annualIncome > 0 ? (taxAmount / annualIncome) * 100 : 0
  const highestBracketIdx = getHighestBracketIndex(netIncome)

  // Handlers — Basic mode
  const handleEditBasic = () => {
    setBasicDraft({
      annualIncome: String(basicData.annualIncome),
      totalDeduction: String(basicData.totalDeduction),
    })
    setIsEditing(true)
  }

  const handleSaveBasic = () => {
    setBasicData({
      annualIncome: Number(basicDraft.annualIncome) || 0,
      totalDeduction: Number(basicDraft.totalDeduction) || 0,
    })
    setIsEditing(false)
  }

  // Handlers — Advanced mode
  const handleEditAdvanced = () => {
    setAdvancedDraft({
      annualIncome: String(advancedData.annualIncome),
      socialSecurity: String(advancedData.socialSecurity),
      providentFund: String(advancedData.providentFund),
      rmfSsfThaiEsg: String(advancedData.rmfSsfThaiEsg),
      insurancePremium: String(advancedData.insurancePremium),
      otherDeduction: String(advancedData.otherDeduction),
    })
    setIsEditing(true)
  }

  const handleSaveAdvanced = () => {
    setAdvancedData({
      annualIncome: Number(advancedDraft.annualIncome) || 0,
      socialSecurity: Number(advancedDraft.socialSecurity) || 0,
      providentFund: Number(advancedDraft.providentFund) || 0,
      rmfSsfThaiEsg: Number(advancedDraft.rmfSsfThaiEsg) || 0,
      insurancePremium: Number(advancedDraft.insurancePremium) || 0,
      otherDeduction: Number(advancedDraft.otherDeduction) || 0,
    })
    setIsEditing(false)
  }

  const handleCancel = () => setIsEditing(false)

  const handleLevelChange = (level: TaxLevel) => {
    setIsEditing(false)
    setTaxLevel(level)
  }

  const handleEdit = () => isAdvanced ? handleEditAdvanced() : handleEditBasic()
  const handleSave = () => isAdvanced ? handleSaveAdvanced() : handleSaveBasic()

  // Render advanced fields in view mode — row layout (label left, value right)
  const renderAdvancedViewFields = () => (
    <div className="tax-adv-fields">
      {advancedFields.map((f) => (
        <div className="tax-adv-row" key={f.key}>
          <span className="tax-adv-label">{f.viewLabel}</span>
          <span className="tax-adv-value">{formatNumber(advancedData[f.key])} {f.unit}</span>
        </div>
      ))}
      <div className="tax-adv-row tax-adv-total">
        <span className="tax-adv-label">รวมลดหย่อน</span>
        <span className="tax-adv-value">{formatNumber(advTotalDeduction)} บาท</span>
      </div>
    </div>
  )

  // Render advanced fields in edit mode
  const renderAdvancedEditFields = () => (
    <div className="tax-fields">
      {advancedFields.map((f) => (
        <div className="tax-field" key={f.key}>
          <span className="tax-field-label">{f.label}</span>
          <input
            type="number"
            className="tax-field-input"
            value={advancedDraft[f.key]}
            onChange={(e) => setAdvancedDraft((prev) => ({ ...prev, [f.key]: e.target.value }))}
          />
        </div>
      ))}
    </div>
  )

  return (
    <div className="content tax-content">
      {/* ===== Top Grid ===== */}
      <div className="tax-top-grid">
        {/* Left: Input Card */}
        <div className="tax-card tax-input-card">
          <div className="tax-input-header">
            <h3 className="tax-card-title">
              {isAdvanced ? 'จำลองการลดหย่อนละเอียด' : 'จำลองการลดหย่อนพื้นฐาน'}
            </h3>
            <select
              className="tax-level-select"
              value={taxLevel}
              onChange={(e) => handleLevelChange(e.target.value as TaxLevel)}
            >
              <option value="ขั้นพื้นฐาน">ขั้นพื้นฐาน</option>
              <option value="ขั้นสูง">ขั้นสูง</option>
            </select>
          </div>

          {isAdvanced ? (
            /* ===== Advanced Mode ===== */
            isEditing ? renderAdvancedEditFields() : renderAdvancedViewFields()
          ) : (
            /* ===== Basic Mode ===== */
            <div className="tax-fields">
              <div className="tax-field">
                <span className="tax-field-label">รายได้ทั้งปี (บาท)</span>
                {isEditing ? (
                  <input type="number" className="tax-field-input" value={basicDraft.annualIncome}
                    onChange={(e) => setBasicDraft((prev) => ({ ...prev, annualIncome: e.target.value }))} />
                ) : (
                  <span className="tax-field-value">{formatNumber(basicData.annualIncome)}</span>
                )}
              </div>
              <div className="tax-field">
                <span className="tax-field-label">ค่าลดหย่อนรวม (บาท)</span>
                {isEditing ? (
                  <input type="number" className="tax-field-input" value={basicDraft.totalDeduction}
                    onChange={(e) => setBasicDraft((prev) => ({ ...prev, totalDeduction: e.target.value }))} />
                ) : (
                  <span className="tax-field-value">{formatNumber(basicData.totalDeduction)}</span>
                )}
              </div>
            </div>
          )}

          {isEditing ? (
            <div className="tax-edit-actions">
              <button className="tax-action-btn cancel" onClick={handleCancel}>
                <span className="material-icons-outlined">close</span> ยกเลิกการแก้ไข
              </button>
              <button className="tax-action-btn save" onClick={handleSave}>
                <span className="material-icons-outlined">check</span> บันทึกข้อมูล
              </button>
            </div>
          ) : (
            <button className="tax-edit-btn" onClick={handleEdit}>
              <span className="material-icons-outlined">edit</span> แก้ไขข้อมูล
            </button>
          )}
        </div>

        {/* Right: ภาษีที่ต้องจ่ายโดยประมาณ */}
        <div className="tax-result-card">
          <div className="tax-result-label">ภาษีที่ต้องจ่ายโดยประมาณ</div>
          <div className="tax-result-value">{formatNumber(taxAmount)} บาท</div>
          <div className="tax-result-details">
            <div className="tax-result-row">
              <span className="tax-result-detail-label">เงินได้สุทธิ:</span>
              <span className="tax-result-detail-value">{formatNumber(netIncome)} บาท</span>
            </div>
            <div className="tax-result-row">
              <span className="tax-result-detail-label">ฐานภาษีสูงสุด:</span>
              <span className="tax-result-detail-value">{effectiveRate.toFixed(1)}% (ประมาณ)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Tax Brackets Table ===== */}
      <div className="tax-card tax-brackets-card">
        <h3 className="tax-card-title">ตารางฐานภาษี</h3>
        <div className="tax-brackets-list">
          {[...taxBrackets].reverse().map((bracket, i) => {
            const originalIdx = taxBrackets.length - 1 - i
            const isActive = netIncome > bracket.min
            const isCurrentBracket = originalIdx === highestBracketIdx
            return (
              <div className={`tax-bracket-row ${isActive ? 'active' : ''} ${isCurrentBracket ? 'current' : ''}`} key={i}>
                <span className="tax-bracket-rate">{bracket.label}</span>
                <div className="tax-bracket-bar-area">
                  {isActive && bracket.rate > 0 && (
                    <div
                      className="tax-bracket-bar"
                      style={{
                        width: `${Math.min(((Math.min(netIncome, bracket.max) - bracket.min) / (bracket.max === Infinity ? 10_000_000 : bracket.max - bracket.min)) * 100, 100)}%`,
                      }}
                    />
                  )}
                </div>
                <div className="tax-bracket-right">
                  <span className="tax-bracket-range">{bracket.rangeLabel}</span>
                  {isCurrentBracket && (
                    <span className="tax-bracket-badge">คุณอยู่ขั้นนี้</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <footer className="footer">
        &copy; 2026. ZettaPlan All rights reserved.
      </footer>
    </div>
  )
}
