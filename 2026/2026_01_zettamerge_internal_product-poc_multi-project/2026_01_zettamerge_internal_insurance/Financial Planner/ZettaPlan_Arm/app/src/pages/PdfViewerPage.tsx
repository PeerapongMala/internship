import { useRef, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import './PdfViewerPage.css'

/* ===== Shared types (read-only from localStorage) ===== */
interface Asset { id: number; name: string; category: string; institution: string; value: number }
interface RetirementData { currentAge: number; retireAge: number; monthlyExpense: number; inflation: number }
interface LifePolicy { id: number; code: string; company: string; coverage: number; premium: number }
interface HealthPolicy { id: number; code: string; company: string; coverage: number; premium: number }
interface NeedItem { id: number; name: string; amount: number }
interface Goal { id: number; name: string; targetAmount: number; currentSavings: number; years: number; expectedReturn: number }
interface ProfileData { firstName: string; role: string; company: string; phone?: string; email?: string; [key: string]: unknown }
interface TaxDataBasic { annualIncome: number; totalDeduction: number }
interface InvestmentData { initialInvestment: number; monthlySaving: number; expectedReturn: number; years: number }
interface CoverageData { roomPerNight: number; annualLimit: number; opdPerVisit: number }

function readLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch { return fallback }
}

const fmt = (n: number) => Math.round(n).toLocaleString('en-US')

const taxBrackets = [
  { min: 0, max: 150_000, rate: 0 }, { min: 150_000, max: 300_000, rate: 5 },
  { min: 300_000, max: 500_000, rate: 10 }, { min: 500_000, max: 750_000, rate: 15 },
  { min: 750_000, max: 1_000_000, rate: 20 }, { min: 1_000_000, max: 2_000_000, rate: 25 },
  { min: 2_000_000, max: 5_000_000, rate: 30 }, { min: 5_000_000, max: Infinity, rate: 35 },
]

function calcTax(netIncome: number): number {
  if (netIncome <= 0) return 0
  let tax = 0
  for (const b of taxBrackets) {
    if (netIncome <= b.min) break
    tax += (Math.min(netIncome, b.max) - b.min) * (b.rate / 100)
  }
  return tax
}

function calcMonthlySaving(target: number, current: number, years: number, ret: number): number {
  const gap = target - current
  if (gap <= 0 || years <= 0) return 0
  const months = years * 12
  if (ret <= 0) return gap / months
  const r = ret / 100 / 12
  return gap / ((Math.pow(1 + r, months) - 1) / r)
}

/* A4 dimensions: 210mm x 297mm → aspect ratio */
const A4_WIDTH = 794  /* px at 96dpi */
const A4_HEIGHT = 1123

export default function PdfViewerPage() {
  const navigate = useNavigate()
  const contentRef = useRef<HTMLDivElement>(null)
  const pagesContainerRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(100)
  const [generating, setGenerating] = useState(false)
  const [activePage, setActivePage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const pageRefs = useRef<HTMLDivElement[]>([])

  // ===== Read ALL data =====
  const profile = readLS<ProfileData>('zettaplan_profile', { firstName: 'สมชาย ใจดี', role: 'Senior Financial Advisor', company: 'ZettaWealth Co., Ltd.' })
  const assets = readLS<Asset[]>('zettaplan_assets', [])
  const retirement = readLS<RetirementData>('zettaplan_retirement', { currentAge: 30, retireAge: 60, monthlyExpense: 30000, inflation: 3 })
  const lifePolicies = readLS<LifePolicy[]>('zettaplan_life_policies', [])
  const healthPolicies = readLS<HealthPolicy[]>('zettaplan_health_policies', [])
  const lifeNeeds = readLS<NeedItem[]>('zettaplan_life_needs_v2', [])
  const goals = readLS<Goal[]>('zettaplan_goals', [])
  const taxData = readLS<TaxDataBasic>('zettaplan_tax', { annualIncome: 1_600_000, totalDeduction: 500_000 })
  const portData = readLS<InvestmentData>('zettaplan_portfolio', { initialInvestment: 100_000, monthlySaving: 5_000, expectedReturn: 5, years: 3 })
  const healthCoverage = readLS<CoverageData>('zettaplan_health_coverage', { roomPerNight: 4_000, annualLimit: 500_000, opdPerVisit: 1_000 })

  // ===== Computed values =====
  const totalAsset = assets.reduce((s, a) => s + a.value, 0)
  const yearsToRetire = retirement.retireAge - retirement.currentAge
  const futureMonthly = retirement.monthlyExpense * Math.pow(1 + retirement.inflation / 100, yearsToRetire > 0 ? yearsToRetire : 0)
  const retirementNeeded = futureMonthly * 12 * 25
  const retirementEnough = totalAsset >= retirementNeeded
  const lifeTotalCoverage = lifePolicies.reduce((s, p) => s + p.coverage, 0)
  const lifeTotalPremium = lifePolicies.reduce((s, p) => s + p.premium, 0)
  const lifeTotalNeeds = lifeNeeds.reduce((s, n) => s + n.amount, 0)
  const lifeCoverageGap = lifeTotalNeeds - totalAsset - lifeTotalCoverage
  const lifeIsCovered = lifeCoverageGap <= 0
  const healthTotalCoverage = healthPolicies.reduce((s, p) => s + p.coverage, 0)
  const healthTotalPremium = healthPolicies.reduce((s, p) => s + p.premium, 0)
  const netIncome = taxData.annualIncome - taxData.totalDeduction
  const taxAmount = calcTax(netIncome)
  const effectiveRate = taxData.annualIncome > 0 ? (taxAmount / taxData.annualIncome) * 100 : 0
  const r = portData.expectedReturn / 100 / 12
  const months = portData.years * 12
  const fvInitial = portData.initialInvestment * Math.pow(1 + r, months)
  const fvAnnuity = r > 0 ? portData.monthlySaving * ((Math.pow(1 + r, months) - 1) / r) : portData.monthlySaving * months
  const portFV = fvInitial + fvAnnuity
  const today = new Date()
  const thaiDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear() + 543}`

  // ===== Pagination: measure content then split into pages =====
  const [pages, setPages] = useState<number[][]>([]) // each page = array of section indices

  const paginate = useCallback(() => {
    if (!contentRef.current) return
    const sections = contentRef.current.querySelectorAll<HTMLElement>('.pdf-section-block')
    if (sections.length === 0) return

    const padTop = 56
    const padBottom = 56
    const usable = A4_HEIGHT - padTop - padBottom
    const result: number[][] = [[]]
    let currentHeight = 0

    sections.forEach((sec, i) => {
      const h = sec.getBoundingClientRect().height
      if (currentHeight + h > usable && result[result.length - 1].length > 0) {
        result.push([])
        currentHeight = 0
      }
      result[result.length - 1].push(i)
      currentHeight += h
    })

    setPages(result)
    setTotalPages(result.length)
  }, [])

  useEffect(() => {
    // initial measurement after render
    const timer = setTimeout(paginate, 100)
    return () => clearTimeout(timer)
  }, [paginate])

  // ===== Navigate to page =====
  const goToPage = (pageIdx: number) => {
    setActivePage(pageIdx)
    const container = pagesContainerRef.current
    const el = pageRefs.current[pageIdx]
    if (container && el) {
      container.scrollTo({ top: el.offsetTop - container.offsetTop, behavior: 'smooth' })
    }
  }

  // ===== Track active page on scroll =====
  const handleScroll = () => {
    const container = pagesContainerRef.current
    if (!container) return
    const scrollTop = container.scrollTop + 100
    for (let i = pageRefs.current.length - 1; i >= 0; i--) {
      const el = pageRefs.current[i]
      if (el && el.offsetTop <= scrollTop) {
        setActivePage(i)
        break
      }
    }
  }

  // ===== Download multi-page PDF =====
  const handleDownload = async () => {
    if (generating) return
    setGenerating(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')

      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfW = 210
      const pdfH = 297

      const pageEls = pagesContainerRef.current?.querySelectorAll<HTMLElement>('.pdf-page')
      if (!pageEls) return

      for (let i = 0; i < pageEls.length; i++) {
        if (i > 0) pdf.addPage()
        const canvas = await html2canvas(pageEls[i], {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
        })
        const imgData = canvas.toDataURL('image/png')
        pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH)
      }

      pdf.save('Financial_Plan_Report.pdf')
    } catch (err) {
      console.error('PDF generation failed:', err)
    } finally {
      setGenerating(false)
    }
  }

  const handleZoomIn = () => setZoom((z) => Math.min(200, z + 25))
  const handleZoomOut = () => setZoom((z) => Math.max(50, z - 25))

  // ===== Build section blocks =====
  const sectionBlocks: { key: string; node: React.ReactNode }[] = []

  // Header + Confidential
  sectionBlocks.push({
    key: 'header',
    node: (
      <>
        <div className="pdf-header">
          <div>
            <h1 className="pdf-title">รายงานแผนการเงินส่วนบุคคล</h1>
            <div className="pdf-subtitle">Personal Financial Planning Report</div>
          </div>
          <div className="pdf-planner-info">
            <div className="pdf-planner-name">{profile.firstName}</div>
            <div className="pdf-planner-role">{profile.role}</div>
            <div className="pdf-planner-company">{profile.company}</div>
          </div>
        </div>
        <div className="pdf-confidential">
          เอกสารฉบับนี้จัดทำขึ้นเพื่อใช้เป็นแนวทางในการวางแผนทางการเงินเท่านั้น โปรดปรึกษาที่ปรึกษาทางการเงินก่อนตัดสินใจลงทุน
        </div>
      </>
    ),
  })

  // Executive Summary
  sectionBlocks.push({
    key: 'summary',
    node: (
      <div className="pdf-section">
        <h2 className="pdf-section-title">สรุปภาพรวม (Executive Summary)</h2>
        <div className="pdf-summary-grid">
          <div className="pdf-summary-box">
            <div className="pdf-summary-label">สินทรัพย์สุทธิ</div>
            <div className="pdf-summary-value">{fmt(totalAsset)} <span>บาท</span></div>
          </div>
          <div className="pdf-summary-box">
            <div className="pdf-summary-label">ทุนเกษียณที่ต้องมี</div>
            <div className="pdf-summary-value">{fmt(retirementNeeded)} <span>บาท</span></div>
          </div>
          <div className="pdf-summary-box">
            <div className="pdf-summary-label">ทุนประกันชีวิตรวม</div>
            <div className="pdf-summary-value">{fmt(lifeTotalCoverage)} <span>บาท</span></div>
          </div>
          <div className="pdf-summary-box">
            <div className="pdf-summary-label">ภาษีที่ต้องจ่าย</div>
            <div className="pdf-summary-value">{fmt(taxAmount)} <span>บาท</span></div>
          </div>
        </div>
      </div>
    ),
  })

  // Section 1: สินทรัพย์
  if (assets.length > 0) {
    sectionBlocks.push({
      key: 'assets',
      node: (
        <div className="pdf-section">
          <h2 className="pdf-section-title">1. สินทรัพย์ (Assets)</h2>
          <table className="pdf-table">
            <thead>
              <tr>
                <th>ลำดับ</th>
                <th>รายการ</th>
                <th>ประเภท</th>
                <th>สถาบันการเงิน</th>
                <th className="text-right">มูลค่า (บาท)</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((a, i) => (
                <tr key={a.id}>
                  <td>{i + 1}</td>
                  <td>{a.name}</td>
                  <td>{a.category}</td>
                  <td>{a.institution}</td>
                  <td className="text-right">{fmt(a.value)}</td>
                </tr>
              ))}
              <tr className="pdf-total-row">
                <td colSpan={4}><strong>รวมสินทรัพย์ทั้งหมด</strong></td>
                <td className="text-right"><strong>{fmt(totalAsset)} บาท</strong></td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    })
  }

  // Section 2: แผนเกษียณ
  sectionBlocks.push({
    key: 'retirement',
    node: (
      <div className="pdf-section">
        <h2 className="pdf-section-title">2. แผนเกษียณ (Retirement Plan)</h2>
        <table className="pdf-table pdf-detail-table">
          <tbody>
            <tr><td className="pdf-detail-label">อายุปัจจุบัน</td><td>{retirement.currentAge} ปี</td></tr>
            <tr><td className="pdf-detail-label">อายุเกษียณ</td><td>{retirement.retireAge} ปี</td></tr>
            <tr><td className="pdf-detail-label">ระยะเวลาถึงเกษียณ</td><td>{yearsToRetire > 0 ? yearsToRetire : 0} ปี</td></tr>
            <tr><td className="pdf-detail-label">ค่าใช้จ่ายต่อเดือน (ปัจจุบัน)</td><td>{fmt(retirement.monthlyExpense)} บาท</td></tr>
            <tr><td className="pdf-detail-label">ค่าใช้จ่ายต่อเดือน (ณ วันเกษียณ)</td><td>{fmt(futureMonthly)} บาท</td></tr>
            <tr><td className="pdf-detail-label">อัตราเงินเฟ้อ</td><td>{retirement.inflation}% ต่อปี</td></tr>
            <tr><td className="pdf-detail-label">เงินก้อนที่ต้องมี ณ วันเกษียณ</td><td className="pdf-highlight">{fmt(retirementNeeded)} บาท</td></tr>
            <tr><td className="pdf-detail-label">ผลการประเมิน</td><td className={retirementEnough ? 'pdf-status-pass' : 'pdf-status-fail'}>{retirementEnough ? 'เพียงพอ' : 'ไม่เพียงพอ — ต้องเตรียมเงินเพิ่ม'}</td></tr>
          </tbody>
        </table>
      </div>
    ),
  })

  // Section 3: เป้าหมายการเงิน
  if (goals.length > 0) {
    sectionBlocks.push({
      key: 'goals',
      node: (
        <div className="pdf-section">
          <h2 className="pdf-section-title">3. เป้าหมายการเงิน (Financial Goals)</h2>
          <table className="pdf-table">
            <thead>
              <tr>
                <th>เป้าหมาย</th>
                <th className="text-right">จำนวนเงิน (บาท)</th>
                <th className="text-right">มีอยู่แล้ว (บาท)</th>
                <th className="text-right">ระยะเวลา</th>
                <th className="text-right">ออมต่อเดือน (บาท)</th>
              </tr>
            </thead>
            <tbody>
              {goals.map((g) => (
                <tr key={g.id}>
                  <td>{g.name}</td>
                  <td className="text-right">{fmt(g.targetAmount)}</td>
                  <td className="text-right">{fmt(g.currentSavings)}</td>
                  <td className="text-right">{g.years} ปี</td>
                  <td className="text-right pdf-highlight">{fmt(calcMonthlySaving(g.targetAmount, g.currentSavings, g.years, g.expectedReturn))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    })
  }

  // Section 4: ประกันชีวิต
  sectionBlocks.push({
    key: 'life-insurance',
    node: (
      <div className="pdf-section">
        <h2 className="pdf-section-title">4. ประกันชีวิต (Life Insurance)</h2>
        {lifePolicies.length > 0 && (
          <table className="pdf-table">
            <thead>
              <tr>
                <th>รหัสกรมธรรม์</th>
                <th>บริษัท</th>
                <th className="text-right">ทุนประกัน (บาท)</th>
                <th className="text-right">เบี้ยรายปี (บาท)</th>
              </tr>
            </thead>
            <tbody>
              {lifePolicies.map((p) => (
                <tr key={p.id}>
                  <td>{p.code}</td>
                  <td>{p.company}</td>
                  <td className="text-right">{fmt(p.coverage)}</td>
                  <td className="text-right">{fmt(p.premium)}</td>
                </tr>
              ))}
              <tr className="pdf-total-row">
                <td colSpan={2}><strong>รวม</strong></td>
                <td className="text-right"><strong>{fmt(lifeTotalCoverage)}</strong></td>
                <td className="text-right"><strong>{fmt(lifeTotalPremium)}</strong></td>
              </tr>
            </tbody>
          </table>
        )}
        <div className="pdf-info-row" style={{ marginTop: 12 }}>
          <span>ภาระและความจำเป็นรวม: {fmt(lifeTotalNeeds)} บาท</span>
          <span>ทรัพย์สินรวม: {fmt(totalAsset)} บาท</span>
          <span>ทุนประกันรวม: {fmt(lifeTotalCoverage)} บาท</span>
          <span className="pdf-result-tag" style={{ color: lifeIsCovered ? '#10B981' : '#EF4444' }}>
            {lifeIsCovered ? 'ครอบคลุมแล้ว' : `ขาดความคุ้มครอง ${fmt(lifeCoverageGap)} บาท`}
          </span>
        </div>
      </div>
    ),
  })

  // Section 5: ประกันสุขภาพ
  sectionBlocks.push({
    key: 'health-insurance',
    node: (
      <div className="pdf-section">
        <h2 className="pdf-section-title">5. ประกันสุขภาพ (Health Insurance)</h2>
        {healthPolicies.length > 0 && (
          <table className="pdf-table">
            <thead>
              <tr>
                <th>รหัสกรมธรรม์</th>
                <th>บริษัท</th>
                <th className="text-right">ทุนประกัน (บาท)</th>
                <th className="text-right">เบี้ยรายปี (บาท)</th>
              </tr>
            </thead>
            <tbody>
              {healthPolicies.map((p) => (
                <tr key={p.id}>
                  <td>{p.code}</td>
                  <td>{p.company}</td>
                  <td className="text-right">{fmt(p.coverage)}</td>
                  <td className="text-right">{fmt(p.premium)}</td>
                </tr>
              ))}
              <tr className="pdf-total-row">
                <td colSpan={2}><strong>รวม</strong></td>
                <td className="text-right"><strong>{fmt(healthTotalCoverage)}</strong></td>
                <td className="text-right"><strong>{fmt(healthTotalPremium)}</strong></td>
              </tr>
            </tbody>
          </table>
        )}
        <table className="pdf-table pdf-detail-table" style={{ marginTop: 12 }}>
          <tbody>
            <tr><td className="pdf-detail-label">ค่าห้องต่อคืน</td><td>{fmt(healthCoverage.roomPerNight)} บาท</td></tr>
            <tr><td className="pdf-detail-label">วงเงินเหมาจ่ายต่อปี</td><td>{fmt(healthCoverage.annualLimit)} บาท</td></tr>
            <tr><td className="pdf-detail-label">ค่ารักษาผู้ป่วยนอก (OPD)</td><td>{fmt(healthCoverage.opdPerVisit)} บาท/ครั้ง</td></tr>
          </tbody>
        </table>
      </div>
    ),
  })

  // Section 6: วางแผนภาษี
  sectionBlocks.push({
    key: 'tax',
    node: (
      <div className="pdf-section">
        <h2 className="pdf-section-title">6. วางแผนภาษี (Tax Planning)</h2>
        <table className="pdf-table pdf-detail-table">
          <tbody>
            <tr><td className="pdf-detail-label">รายได้ทั้งปี</td><td>{fmt(taxData.annualIncome)} บาท</td></tr>
            <tr><td className="pdf-detail-label">ค่าลดหย่อนรวม</td><td>{fmt(taxData.totalDeduction)} บาท</td></tr>
            <tr><td className="pdf-detail-label">เงินได้สุทธิ</td><td>{fmt(netIncome)} บาท</td></tr>
            <tr><td className="pdf-detail-label">ภาษีที่ต้องจ่าย</td><td className="pdf-highlight">{fmt(taxAmount)} บาท</td></tr>
            <tr><td className="pdf-detail-label">อัตราภาษีเฉลี่ย</td><td>{effectiveRate.toFixed(2)}%</td></tr>
          </tbody>
        </table>
      </div>
    ),
  })

  // Section 7: จำลองการลงทุน
  sectionBlocks.push({
    key: 'investment',
    node: (
      <div className="pdf-section">
        <h2 className="pdf-section-title">7. จำลองการลงทุน (Investment Simulation)</h2>
        <table className="pdf-table pdf-detail-table">
          <tbody>
            <tr><td className="pdf-detail-label">เงินลงทุนเริ่มต้น</td><td>{fmt(portData.initialInvestment)} บาท</td></tr>
            <tr><td className="pdf-detail-label">ออมเพิ่มต่อเดือน</td><td>{fmt(portData.monthlySaving)} บาท</td></tr>
            <tr><td className="pdf-detail-label">ผลตอบแทนที่คาดหวัง</td><td>{portData.expectedReturn}% ต่อปี</td></tr>
            <tr><td className="pdf-detail-label">ระยะเวลาลงทุน</td><td>{portData.years} ปี</td></tr>
            <tr><td className="pdf-detail-label">มูลค่าพอร์ต ณ สิ้นงวด</td><td className="pdf-highlight">{fmt(portFV)} บาท</td></tr>
          </tbody>
        </table>
      </div>
    ),
  })

  // Disclaimer + Footer
  sectionBlocks.push({
    key: 'footer',
    node: (
      <>
        <div className="pdf-disclaimer">
          <strong>หมายเหตุ:</strong> ข้อมูลในรายงานฉบับนี้เป็นการประมาณการเบื้องต้นเท่านั้น ผลลัพธ์ที่แท้จริงอาจแตกต่างจากที่ประมาณการไว้ การลงทุนมีความเสี่ยง ผู้ลงทุนควรทำความเข้าใจลักษณะสินค้า เงื่อนไขผลตอบแทนและความเสี่ยงก่อนตัดสินใจลงทุน
        </div>
        <div className="pdf-paper-footer">
          <span>ZettaPlan Financial Report — {profile.company}</span>
          <span>วันที่จัดทำ: {thaiDate}</span>
        </div>
      </>
    ),
  })

  // ===== Render: hidden measure container + actual paginated pages =====
  const hasPaginated = pages.length > 0

  return (
    <div className="pdf-viewer-page">
      {/* ===== Top Bar ===== */}
      <div className="pdf-topbar">
        <div className="pdf-topbar-left">
          <button className="pdf-back-btn" onClick={() => navigate('/dashboard')}>
            <span className="material-icons-outlined">arrow_back</span>
          </button>
          <span className="material-icons-outlined pdf-file-icon">description</span>
          <span className="pdf-filename">Financial_Plan_Report.pdf</span>
        </div>

        <div className="pdf-topbar-center">
          <button className="pdf-zoom-btn" onClick={handleZoomOut}>
            <span className="material-icons-outlined">remove</span>
          </button>
          <span className="pdf-zoom-label">{zoom}%</span>
          <button className="pdf-zoom-btn" onClick={handleZoomIn}>
            <span className="material-icons-outlined">add</span>
          </button>
          <span className="pdf-page-indicator">หน้า {activePage + 1} / {totalPages}</span>
        </div>

        <div className="pdf-topbar-right">
          <button className="pdf-download-btn" onClick={handleDownload} disabled={generating}>
            <span className="material-icons-outlined">download</span>
            {generating ? 'กำลังสร้าง...' : 'Download'}
          </button>
        </div>
      </div>

      <div className="pdf-layout">
        {/* ===== Page Sidebar ===== */}
        <div className="pdf-sidebar">
          <div className="pdf-sidebar-title">หน้า</div>
          <div className="pdf-sidebar-list">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`pdf-sidebar-page ${activePage === i ? 'active' : ''}`}
                onClick={() => goToPage(i)}
              >
                <div className="pdf-sidebar-thumb">
                  <span>{i + 1}</span>
                </div>
                <div className="pdf-sidebar-label">หน้า {i + 1}</div>
              </button>
            ))}
          </div>
        </div>

        {/* ===== Pages Area ===== */}
        <div className="pdf-body" ref={pagesContainerRef} onScroll={handleScroll}>
          {/* Hidden measurement container */}
          <div
            ref={contentRef}
            className="pdf-measure"
            style={{ width: A4_WIDTH - 112, position: 'absolute', left: -9999, top: 0, visibility: 'hidden' }}
          >
            {sectionBlocks.map((sb) => (
              <div key={sb.key} className="pdf-section-block">{sb.node}</div>
            ))}
          </div>

          {/* Actual paginated pages */}
          <div className="pdf-pages-col" style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}>
            {hasPaginated ? (
              pages.map((sectionIndices, pageIdx) => (
                <div
                  key={pageIdx}
                  className="pdf-page"
                  ref={(el) => { if (el) pageRefs.current[pageIdx] = el }}
                  style={{ width: A4_WIDTH, minHeight: A4_HEIGHT }}
                >
                  <div className="pdf-page-inner">
                    {sectionIndices.map((si) => (
                      <div key={sectionBlocks[si].key}>{sectionBlocks[si].node}</div>
                    ))}
                  </div>
                  <div className="pdf-page-number">หน้า {pageIdx + 1} / {pages.length}</div>
                </div>
              ))
            ) : (
              /* Fallback: single page while measuring */
              <div
                className="pdf-page"
                ref={(el) => { if (el) pageRefs.current[0] = el }}
                style={{ width: A4_WIDTH, minHeight: A4_HEIGHT }}
              >
                <div className="pdf-page-inner">
                  {sectionBlocks.map((sb) => (
                    <div key={sb.key}>{sb.node}</div>
                  ))}
                </div>
                <div className="pdf-page-number">หน้า 1 / 1</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
