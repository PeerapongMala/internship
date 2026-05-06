import { useNavigate } from 'react-router-dom'
import DonutChart from '../components/DonutChart'
import AreaChart from '../components/AreaChart'
import './DashboardPage.css'

/* ===== Types (read-only mirrors from other pages) ===== */
interface Asset { id: number; name: string; category: 'เงินสด/ฝากธนาคาร' | 'กองทุนรวม' | 'หุ้นสามัญ'; institution: string; value: number }
interface RetirementData { currentAge: number; retireAge: number; monthlyExpense: number; inflation: number }
interface LifePolicy { id: number; code: string; company: string; coverage: number; premium: number }
interface HealthPolicy { id: number; code: string; company: string; coverage: number; premium: number }
interface NeedItem { id: number; name: string; amount: number }
interface Goal { id: number; name: string; targetAmount: number; currentSavings: number; years: number; expectedReturn: number }
interface TaxDataBasic { annualIncome: number; totalDeduction: number }
interface InvestmentData { initialInvestment: number; monthlySaving: number; expectedReturn: number; years: number }
interface ProfileData { firstName: string; role: string; company: string; avatarUrl?: string; [key: string]: unknown }

/* ===== Helpers ===== */
const fmt = (n: number) => Math.round(n).toLocaleString('en-US')

function readLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch { return fallback }
}

const categoryColors: Record<string, string> = {
  'เงินสด/ฝากธนาคาร': '#6366F1',
  'กองทุนรวม': '#22C55E',
  'หุ้นสามัญ': '#F59E0B',
}

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

/* ===== Radar Chart ===== */
const radarLabels = ['สภาพคล่อง', 'การออม', 'ความคุ้มครอง', 'หนี้สิน', 'ภาษี']
const radarAngles = radarLabels.map((_, i) => (Math.PI * 2 * i) / radarLabels.length - Math.PI / 2)

function RadarChart({ values }: { values: number[] }) {
  const pad = 48, maxR = 110, cx = pad + maxR, cy = pad + maxR
  const vbSize = (pad + maxR) * 2
  const toXY = (a: number, r: number) => ({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r })
  const dataPoints = values.map((v, i) => toXY(radarAngles[i], (v / 100) * maxR))

  return (
    <svg viewBox={`0 0 ${vbSize} ${vbSize}`} className="radar-chart">
      {[0.25, 0.5, 0.75, 1].map((r) => (
        <polygon key={r} points={radarAngles.map((a) => { const p = toXY(a, r * maxR); return `${p.x},${p.y}` }).join(' ')} fill="none" stroke="var(--gray-200)" strokeWidth={1} />
      ))}
      {radarAngles.map((a, i) => { const e = toXY(a, maxR); return <line key={i} x1={cx} y1={cy} x2={e.x} y2={e.y} stroke="var(--gray-200)" strokeWidth={1} /> })}
      <polygon className="radar-area" points={dataPoints.map((p) => `${p.x},${p.y}`).join(' ')} fill="rgba(124,58,237,0.2)" stroke="var(--primary)" strokeWidth={2} />
      {dataPoints.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={4} fill="var(--primary)" className="radar-dot" />)}
      {radarAngles.map((a, i) => { const l = toXY(a, maxR + 28); return <text key={i} x={l.x} y={l.y} textAnchor="middle" dominantBaseline="middle" fontSize={13} fill="var(--gray-600)" fontWeight={600}>{radarLabels[i]}</text> })}
    </svg>
  )
}

/* ===== Dashboard ===== */
export default function DashboardPage() {
  const navigate = useNavigate()

  // ===== Read profile =====
  const profile = readLS<ProfileData>('zettaplan_profile', {
    firstName: 'สมชาย ใจดี', role: 'Senior Financial Advisor', company: 'ZettaWealth Co., Ltd.',
    avatarUrl: 'https://ui-avatars.com/api/?name=S+J&background=7C3AED&color=fff&size=150&rounded=true&bold=true&font-size=0.4',
  })

  // ===== Read all persisted data =====
  const assets = readLS<Asset[]>('zettaplan_assets', [
    { id: 1, name: 'หุ้นสามัญ', category: 'หุ้นสามัญ', institution: 'Bualuang', value: 3_000_000 },
    { id: 2, name: 'กองทุนรวม', category: 'กองทุนรวม', institution: 'SCBAM', value: 2_500_000 },
    { id: 3, name: 'เงินสด/ฝากธนาคาร', category: 'เงินสด/ฝากธนาคาร', institution: 'KBANK', value: 1_500_000 },
  ])
  const retirement = readLS<RetirementData>('zettaplan_retirement', { currentAge: 30, retireAge: 60, monthlyExpense: 30000, inflation: 3 })
  const goals = readLS<Goal[]>('zettaplan_goals', [
    { id: 1, name: 'ทุนการศึกษาบุตร', targetAmount: 2_000_000, currentSavings: 500_000, years: 15, expectedReturn: 5 },
  ])
  const lifePolicies = readLS<LifePolicy[]>('zettaplan_life_policies', [
    { id: 1, code: 'INSL000001', company: 'AIA', coverage: 1_000_000, premium: 25_000 },
  ])
  const healthPolicies = readLS<HealthPolicy[]>('zettaplan_health_policies', [
    { id: 1, code: 'INSH000001', company: 'AIA', coverage: 5_000_000, premium: 30_000 },
  ])
  const lifeNeeds = readLS<NeedItem[]>('zettaplan_life_needs_v2', [
    { id: 1, name: 'หนี้สินคงค้าง', amount: 300_000 },
    { id: 2, name: 'ทุนการศึกษาบุตร', amount: 10_000 },
    { id: 3, name: 'กองทุนดูแลครอบครัว', amount: 30_000 },
    { id: 4, name: 'ค่าใช้จ่ายวาระสุดท้าย', amount: 20_000 },
  ])
  const taxData = readLS<TaxDataBasic>('zettaplan_tax', { annualIncome: 1_600_000, totalDeduction: 500_000 })
  const portData = readLS<InvestmentData>('zettaplan_portfolio', { initialInvestment: 100_000, monthlySaving: 5_000, expectedReturn: 5, years: 3 })

  // ===== Computed: สินทรัพย์ =====
  const totalAsset = assets.reduce((s, a) => s + a.value, 0)
  const catMap = new Map<string, number>()
  assets.forEach((a) => catMap.set(a.category, (catMap.get(a.category) || 0) + a.value))
  const donutSegments = Array.from(catMap.entries()).map(([cat, val]) => ({
    label: cat, color: categoryColors[cat] || '#999',
    value: totalAsset > 0 ? (val / totalAsset) * 100 : 0, amount: val,
  }))

  // ===== Computed: เกษียณ =====
  const yearsToRetire = retirement.retireAge - retirement.currentAge
  const futureMonthly = retirement.monthlyExpense * Math.pow(1 + retirement.inflation / 100, yearsToRetire > 0 ? yearsToRetire : 0)
  const retirementNeeded = futureMonthly * 12 * 25
  const retirementEnough = totalAsset >= retirementNeeded

  // ===== Computed: เป้าหมาย =====
  const totalGoalTarget = goals.reduce((s, g) => s + g.targetAmount, 0)
  const totalGoalSavings = goals.reduce((s, g) => s + g.currentSavings, 0)

  // ===== Computed: ประกันชีวิต =====
  const lifeTotalCoverage = lifePolicies.reduce((s, p) => s + p.coverage, 0)
  const lifeTotalNeeds = lifeNeeds.reduce((s, n) => s + n.amount, 0)
  const lifeCoverageGap = lifeTotalNeeds - totalAsset - lifeTotalCoverage

  // ===== Computed: ประกันสุขภาพ =====
  const healthTotalCoverage = healthPolicies.reduce((s, p) => s + p.coverage, 0)

  // ===== Computed: ภาษี =====
  const netIncome = taxData.annualIncome - taxData.totalDeduction
  const taxAmount = calcTax(netIncome)

  // ===== Computed: พอร์ตแนะนำ =====
  const r = portData.expectedReturn / 100 / 12
  const months = portData.years * 12
  const fvInitial = portData.initialInvestment * Math.pow(1 + r, months)
  const fvAnnuity = r > 0 ? portData.monthlySaving * ((Math.pow(1 + r, months) - 1) / r) : portData.monthlySaving * months
  const portFV = fvInitial + fvAnnuity

  // ===== Alerts (ประกันชีวิต, ภาษี, พอร์ตแนะนำ) =====
  const alerts: { text: string; sub: string; type: 'danger' | 'warning' | 'success' }[] = []
  if (lifeCoverageGap > 0) {
    alerts.push({ text: 'ขาดความคุ้มครอง', sub: `ต้องการเพิ่ม ${fmt(lifeCoverageGap)}`, type: 'danger' })
  } else {
    alerts.push({ text: 'ความคุ้มครองเพียงพอ', sub: `คุ้มครอง ${fmt(lifeTotalCoverage)} บาท`, type: 'success' })
  }
  if (taxAmount > 0) {
    alerts.push({ text: `ภาษีที่ต้องจ่าย ${fmt(taxAmount)} บาท`, sub: `รายได้สุทธิ ${fmt(netIncome)} บาท`, type: 'warning' })
  } else {
    alerts.push({ text: 'ไม่ต้องเสียภาษี', sub: 'ได้รับยกเว้น', type: 'success' })
  }
  alerts.push({ text: `พอร์ตแนะนำ: ${fmt(portFV)} บาท`, sub: `ผลตอบแทน ${portData.expectedReturn}% ใน ${portData.years} ปี`, type: 'success' })

  // ===== Radar =====
  const liquidityScore = Math.min(100, (catMap.get('เงินสด/ฝากธนาคาร') || 0) / 50_000)
  const savingsScore = Math.min(100, totalAsset / 100_000)
  const coverageScore = lifeCoverageGap <= 0 ? 90 : Math.max(10, 90 - (lifeCoverageGap / (lifeTotalNeeds || 1)) * 60)
  const debtScore = 70
  const taxScore = taxAmount <= 0 ? 90 : Math.max(20, 90 - (taxAmount / (taxData.annualIncome || 1)) * 100)
  const radarValues = [liquidityScore, savingsScore, coverageScore, debtScore, taxScore]

  // ===== Trend chart =====
  const trendData = Array.from({ length: 11 }, (_, i) => ({
    label: String(retirement.currentAge + i),
    value: totalAsset * Math.pow(1.05, i),
  }))

  // ===== Top assets =====
  const topAssets = [...assets].sort((a, b) => b.value - a.value).slice(0, 3)

  return (
    <div className="content dash-content">
      {/* Export PDF */}
      <button className="dash-export-btn" onClick={() => navigate('/report/pdf')}>
        <span className="material-icons-outlined">picture_as_pdf</span>
        Export PDF
      </button>

      {/* ===== Report Banner ===== */}
      <div className="dash-report-banner">
        <div className="dash-report-left">
          <span className="dash-report-badge">FINANCIAL PLAN REPORT</span>
          <h2 className="dash-report-title">สรุปแผนการเงินส่วนบุคคล</h2>
          <p className="dash-report-subtitle">จัดทำโดย: {profile.firstName} ({profile.company})</p>
        </div>
        <div className="dash-report-right">
          <div className="dash-report-for">สำหรับคุณลูกค้า</div>
          <div className="dash-report-date">วันที่: {new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
        </div>
      </div>

      {/* ===== Row 1: สินทรัพย์สุทธิ + แจ้งเตือน + Radar ===== */}
      <div className="dash-top-grid">
        <div className="dash-left-col">
          {/* สินทรัพย์ */}
          <div className="dash-card dash-net-card" onClick={() => navigate('/assets')}>
            <h3 className="dash-card-title">สินทรัพย์สุทธิ</h3>
            <div className="dash-net-value">{fmt(totalAsset)} <span className="dash-net-unit">บาท</span></div>
            <span className="dash-net-badge">
              <span className="material-icons-outlined" style={{ fontSize: 14 }}>check_circle</span>
              เต็มโควตาปีนี้แล้ว
            </span>
          </div>

          {/* แจ้งเตือน */}
          <div className="dash-card dash-alert-card">
            <h3 className="dash-card-title">แจ้งเตือน</h3>
            <div className="dash-alerts">
              {alerts.map((a, i) => (
                <div key={i} className={`dash-alert-item ${a.type}`}>
                  <div className="dash-alert-text">{a.text}</div>
                  <div className="dash-alert-sub">{a.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Radar */}
        <div className="dash-card dash-radar-card">
          <h3 className="dash-card-title dash-card-title--left">ภาพรวมการเงิน</h3>
          <div className="dash-radar-wrapper">
            <RadarChart values={radarValues} />
          </div>
        </div>
      </div>

      {/* ===== Row 2: สัดส่วนสินทรัพย์ + แนวโน้ม ===== */}
      <div className="dash-mid-grid">
        <div className="dash-card dash-donut-card" onClick={() => navigate('/assets')}>
          <h3 className="dash-card-title">สัดส่วนสินทรัพย์</h3>
          <div className="dash-donut-content">
            <DonutChart segments={donutSegments} size={180} strokeWidth={40} />
            <div className="dash-donut-legend">
              {donutSegments.map((s) => (
                <div className="dash-legend-item" key={s.label}>
                  <span className="dash-legend-swatch" style={{ background: s.color }} />
                  <span className="dash-legend-label">{s.label}</span>
                  <span className="dash-legend-amount">{fmt(s.amount)} บาท</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dash-card dash-trend-card">
          <h3 className="dash-card-title">แนวโน้มความมั่นคง (10 ปีข้างหน้า)</h3>
          <div className="dash-trend-wrapper">
            <AreaChart data={trendData} width={520} height={240} color="#22C55E" />
          </div>
        </div>
      </div>

      {/* ===== Row 3: Summary Cards Grid ===== */}
      <div className="dash-summary-grid">
        {/* วางแผนเกษียณ */}
        <div className="dash-card dash-summary-item" onClick={() => navigate('/retirement')}>
          <div className="dash-summary-icon retire"><span className="material-icons-outlined">edit_note</span></div>
          <h4 className="dash-summary-title">วางแผนเกษียณ</h4>
          <div className="dash-summary-value">{fmt(retirementNeeded)}</div>
          <div className="dash-summary-unit">บาท (ที่ต้องมี)</div>
          <span className={`dash-summary-badge ${retirementEnough ? 'success' : 'danger'}`}>
            {retirementEnough ? 'เพียงพอ' : 'ยังไม่เพียงพอ'}
          </span>
        </div>

        {/* เป้าหมายการเงิน */}
        <div className="dash-card dash-summary-item" onClick={() => navigate('/goals')}>
          <div className="dash-summary-icon goal"><span className="material-icons-outlined">flag</span></div>
          <h4 className="dash-summary-title">เป้าหมายการเงิน</h4>
          <div className="dash-summary-value">{fmt(totalGoalTarget)}</div>
          <div className="dash-summary-unit">บาท ({goals.length} เป้าหมาย)</div>
          <span className="dash-summary-badge info">มีอยู่ {fmt(totalGoalSavings)} บาท</span>
        </div>

        {/* ประกันชีวิต */}
        <div className="dash-card dash-summary-item" onClick={() => navigate('/insurance/life')}>
          <div className="dash-summary-icon life"><span className="material-icons-outlined">shield</span></div>
          <h4 className="dash-summary-title">ประกันชีวิต</h4>
          <div className="dash-summary-value">{fmt(lifeTotalCoverage)}</div>
          <div className="dash-summary-unit">บาท (ทุนประกัน)</div>
          <span className={`dash-summary-badge ${lifeCoverageGap <= 0 ? 'success' : 'danger'}`}>
            {lifeCoverageGap <= 0 ? 'คุ้มครองเพียงพอ' : `ขาด ${fmt(lifeCoverageGap)}`}
          </span>
        </div>

        {/* ประกันสุขภาพ */}
        <div className="dash-card dash-summary-item" onClick={() => navigate('/insurance/health')}>
          <div className="dash-summary-icon health"><span className="material-icons-outlined">local_hospital</span></div>
          <h4 className="dash-summary-title">ประกันสุขภาพ</h4>
          <div className="dash-summary-value">{fmt(healthTotalCoverage)}</div>
          <div className="dash-summary-unit">บาท (วงเงินคุ้มครอง)</div>
          <span className="dash-summary-badge info">{healthPolicies.length} กรมธรรม์</span>
        </div>

        {/* วางแผนภาษี */}
        <div className="dash-card dash-summary-item" onClick={() => navigate('/tax')}>
          <div className="dash-summary-icon tax"><span className="material-icons-outlined">calculate</span></div>
          <h4 className="dash-summary-title">วางแผนภาษี</h4>
          <div className="dash-summary-value">{fmt(taxAmount)}</div>
          <div className="dash-summary-unit">บาท (ภาษีที่ต้องจ่าย)</div>
          <span className={`dash-summary-badge ${taxAmount <= 0 ? 'success' : 'warning'}`}>
            {taxAmount <= 0 ? 'ยกเว้นภาษี' : `รายได้สุทธิ ${fmt(netIncome)}`}
          </span>
        </div>

        {/* พอร์ตแนะนำ */}
        <div className="dash-card dash-summary-item" onClick={() => navigate('/portfolio')}>
          <div className="dash-summary-icon port"><span className="material-icons-outlined">trending_up</span></div>
          <h4 className="dash-summary-title">พอร์ตแนะนำ</h4>
          <div className="dash-summary-value">{fmt(portFV)}</div>
          <div className="dash-summary-unit">บาท (มูลค่าใน {portData.years} ปี)</div>
          <span className="dash-summary-badge success">ผลตอบแทน {portData.expectedReturn}%</span>
        </div>
      </div>

      {/* ===== Bottom: Top Assets Table ===== */}
      <div className="dash-card dash-table-card">
        <h3 className="dash-card-title">รายการสินทรัพย์สูงสุด</h3>
        <div className="dash-table-wrapper">
          <table className="dash-table">
            <thead>
              <tr>
                <th>รายการ</th>
                <th>ประเภท</th>
                <th>สถาบันการเงิน</th>
                <th className="text-right">มูลค่าสินทรัพย์ (บาท)</th>
              </tr>
            </thead>
            <tbody>
              {topAssets.map((a) => (
                <tr key={a.id}>
                  <td>{a.name}</td>
                  <td>{a.category === 'เงินสด/ฝากธนาคาร' ? 'เงินฝาก' : a.category === 'กองทุนรวม' ? 'กองทุน' : 'หุ้น'}</td>
                  <td>{a.institution}</td>
                  <td className="text-right value-cell">{fmt(a.value)} บาท</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="footer">&copy; 2026. ZettaPlan All rights reserved.</footer>
    </div>
  )
}
