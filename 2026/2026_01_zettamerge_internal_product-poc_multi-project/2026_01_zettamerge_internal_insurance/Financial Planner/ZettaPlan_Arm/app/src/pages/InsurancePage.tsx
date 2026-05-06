import DonutChart from '../components/DonutChart'
import usePersistedState from '../hooks/usePersistedState'
import './InsurancePage.css'

export type InsuranceType = 'ประกันชีวิต' | 'ประกันสุขภาพ'

export interface InsuranceItem {
  id: number
  type: InsuranceType
  company: string
  coverage: number
  premium: number
}

// Life policy from LifeInsurancePage
interface LifePolicy {
  id: number
  code: string
  company: string
  coverage: number
  premium: number
}

// Health policy from HealthInsurancePage
interface HealthPolicy {
  id: number
  code: string
  company: string
  coverage: number
  premium: number
}

const initialHealthInsurance: InsuranceItem[] = [
  { id: 2, type: 'ประกันสุขภาพ', company: 'Muang Thai', coverage: 5_000_000, premium: 30_000 },
]

const typeConfig: Record<InsuranceType, { color: string; legendLabel: string }> = {
  'ประกันชีวิต': { color: '#6366F1', legendLabel: 'Life' },
  'ประกันสุขภาพ': { color: '#22C55E', legendLabel: 'Health' },
}

const formatNumber = (n: number) => n.toLocaleString('en-US')

export default function InsurancePage() {
  const [healthItems] = usePersistedState<InsuranceItem[]>('zettaplan_insurance', initialHealthInsurance)

  // Read life policies from LifeInsurancePage localStorage (read-only)
  const lifePolicies: LifePolicy[] = (() => {
    try {
      const raw = localStorage.getItem('zettaplan_life_policies')
      return raw ? (JSON.parse(raw) as LifePolicy[]) : []
    } catch {
      return []
    }
  })()

  // Read health policies from HealthInsurancePage localStorage (read-only)
  const healthPolicies: HealthPolicy[] = (() => {
    try {
      const raw = localStorage.getItem('zettaplan_health_policies')
      return raw ? (JSON.parse(raw) as HealthPolicy[]) : []
    } catch {
      return []
    }
  })()

  // Aggregate life policies into summary row
  const lifeTotalCoverage = lifePolicies.reduce((sum, p) => sum + p.coverage, 0)
  const lifeTotalPremium = lifePolicies.reduce((sum, p) => sum + p.premium, 0)

  // Aggregate health policies into summary row
  const healthTotalCoverage = healthPolicies.reduce((sum, p) => sum + p.coverage, 0)
  const healthTotalPremium = healthPolicies.reduce((sum, p) => sum + p.premium, 0)

  // Build combined items for the table
  // Use health policies from HealthInsurancePage if available, otherwise fallback to old healthItems
  const items: InsuranceItem[] = [
    ...(lifePolicies.length > 0
      ? [{ id: -1, type: 'ประกันชีวิต' as InsuranceType, company: lifePolicies.map((p) => p.company).filter((v, i, a) => a.indexOf(v) === i).join(', '), coverage: lifeTotalCoverage, premium: lifeTotalPremium }]
      : []),
    ...(healthPolicies.length > 0
      ? [{ id: -2, type: 'ประกันสุขภาพ' as InsuranceType, company: healthPolicies.map((p) => p.company).filter((v, i, a) => a.indexOf(v) === i).join(', '), coverage: healthTotalCoverage, premium: healthTotalPremium }]
      : healthItems.filter((i) => i.type === 'ประกันสุขภาพ')),
  ]

  const totalCoverage = items.reduce((sum, i) => sum + i.coverage, 0)
  const totalPremium = items.reduce((sum, i) => sum + i.premium, 0)

  const typeTotals = (Object.keys(typeConfig) as InsuranceType[]).map((type) => {
    const config = typeConfig[type]
    const typeCoverage = items.filter((i) => i.type === type).reduce((sum, i) => sum + i.coverage, 0)
    return {
      type,
      ...config,
      total: typeCoverage,
      percentage: totalCoverage > 0 ? (typeCoverage / totalCoverage) * 100 : 0,
    }
  })

  return (
    <div className="content insurance-content">
      {/* ===== ส่วนบน: 2 การ์ด ===== */}
      <div className="insurance-top-grid">
        {/* ซ้าย: ประกันรวมทั้งหมด */}
        <div className="ins-card ins-summary-card">
          <h3 className="ins-card-title">ประกันรวมทั้งหมด</h3>
          <div className="ins-total-value">
            {formatNumber(totalCoverage)} <span className="ins-currency">บาท</span>
          </div>
          <div className="ins-premium-row">
            <span className="ins-premium-label">เบี้ยประกันทั้งหมด</span>
          </div>
          <div className="ins-premium-value">
            {formatNumber(totalPremium)} <span className="ins-currency">บาท</span>
          </div>

          <div className="ins-breakdown-title">จำแนกตามทุนประกัน:</div>
          <div className="ins-breakdown-list">
            {typeTotals.map((t) => (
              <div className="ins-breakdown-row" key={t.type}>
                <span className="ins-dot" style={{ background: t.color }} />
                <span className="ins-breakdown-label">{t.type}</span>
                <span className="ins-breakdown-pct">{t.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* ขวา: แผนภูมิภาพรวมประกัน */}
        <div className="ins-card ins-chart-card">
          <h3 className="ins-card-title">แผนภูมิภาพรวมประกัน</h3>
          <div className="ins-chart-content">
            <DonutChart
              segments={typeTotals.map((t) => ({
                value: t.percentage,
                color: t.color,
                label: t.legendLabel,
                amount: t.total,
              }))}
              size={220}
              strokeWidth={45}
            />
            <div className="ins-legend">
              {typeTotals.map((t) => (
                <div className="ins-legend-item" key={t.type}>
                  <span className="ins-legend-swatch" style={{ background: t.color }} />
                  <span className="ins-legend-text">{t.legendLabel}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== ส่วนล่าง: ตารางรายการประกัน ===== */}
      <div className="ins-card ins-table-card">
        <h3 className="ins-card-title ins-table-title">รายการประกัน</h3>
        <div className="ins-table-wrapper">
          <table className="ins-table">
            <thead>
              <tr>
                <th>ประเภท</th>
                <th>บริษัท</th>
                <th className="text-right">ทุนประกันรวม (บาท)</th>
                <th className="text-right">เบี้ยประกัน (บาท)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.type}</td>
                  <td>{item.company}</td>
                  <td className="text-right value-cell">{formatNumber(item.coverage)}</td>
                  <td className="text-right value-cell">{formatNumber(item.premium)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <footer className="footer">
        &copy; 2026. ZettaPlan All rights reserved.
      </footer>
    </div>
  )
}
