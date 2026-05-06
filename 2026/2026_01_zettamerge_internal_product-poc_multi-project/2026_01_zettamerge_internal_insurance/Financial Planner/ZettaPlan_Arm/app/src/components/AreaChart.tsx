import { useState } from 'react'

interface DataPoint {
  label: string
  value: number
}

interface AreaChartProps {
  data: DataPoint[]
  width?: number
  height?: number
  color?: string
}

export default function AreaChart({
  data,
  width = 600,
  height = 300,
  color = '#2DD4BF',
}: AreaChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (data.length === 0) return null

  const padding = { top: 20, right: 20, bottom: 40, left: 60 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom

  const maxValue = Math.max(...data.map((d) => d.value))
  const niceMax = Math.ceil(maxValue / 100000) * 100000 || 100000

  const xStep = data.length > 1 ? chartW / (data.length - 1) : chartW

  const toX = (i: number) => padding.left + i * xStep
  const toY = (v: number) => padding.top + chartH - (v / niceMax) * chartH

  // Build path points
  const points = data.map((d, i) => `${toX(i)},${toY(d.value)}`)
  const linePoints = points.join(' ')
  const areaPoints = [
    `${toX(0)},${toY(0)}`,
    ...points,
    `${toX(data.length - 1)},${toY(0)}`,
  ].join(' ')

  // Y-axis grid lines (5 lines)
  const gridCount = 4
  const gridLines = Array.from({ length: gridCount + 1 }, (_, i) => {
    const value = (niceMax / gridCount) * i
    return { y: toY(value), label: value >= 1000 ? `${Math.round(value / 1000)}k` : String(value) }
  })

  // X-axis labels — show every nth label to avoid overlap
  const labelStep = data.length > 15 ? 3 : data.length > 10 ? 2 : 1

  // Tooltip helpers
  const formatTooltipValue = (n: number) => Math.round(n).toLocaleString('en-US')

  const renderTooltip = (i: number) => {
    const d = data[i]
    const cx = toX(i)
    const cy = toY(d.value)
    const tooltipW = 130
    const tooltipH = 44
    // Flip tooltip to left side if too close to right edge
    const flipX = cx + tooltipW + 12 > width - padding.right
    const tx = flipX ? cx - tooltipW - 12 : cx + 12
    const ty = Math.max(padding.top, Math.min(cy - tooltipH / 2, height - padding.bottom - tooltipH))

    return (
      <g pointerEvents="none">
        {/* Vertical guide line */}
        <line
          x1={cx} y1={padding.top} x2={cx} y2={padding.top + chartH}
          stroke={color} strokeWidth={1} strokeDasharray="4 3" opacity={0.5}
        />
        {/* Data point dot */}
        <circle cx={cx} cy={cy} r={5} fill={color} stroke="#fff" strokeWidth={2} />
        {/* Tooltip box */}
        <rect x={tx} y={ty} width={tooltipW} height={tooltipH} rx={6}
          fill="#1F2937" opacity={0.92} />
        <text x={tx + 10} y={ty + 16} fontSize={11} fill="#9CA3AF">
          อายุ {d.label} ปี
        </text>
        <text x={tx + 10} y={ty + 34} fontSize={13} fontWeight={700} fill="#fff">
          {formatTooltipValue(d.value)} บาท
        </text>
      </g>
    )
  }

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      className="area-chart"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      <defs>
        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {gridLines.map((line, i) => (
        <g key={i}>
          <line
            x1={padding.left}
            y1={line.y}
            x2={padding.left + chartW}
            y2={line.y}
            stroke="#E5E7EB"
            strokeWidth={1}
          />
          <text
            x={padding.left - 8}
            y={line.y + 4}
            textAnchor="end"
            fontSize={11}
            fill="#9CA3AF"
          >
            {line.label}
          </text>
        </g>
      ))}

      {/* Area fill */}
      <polygon points={areaPoints} fill="url(#areaGradient)" />

      {/* Line */}
      <polyline
        points={linePoints}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* X-axis labels */}
      {data.map((d, i) =>
        i % labelStep === 0 ? (
          <text
            key={i}
            x={toX(i)}
            y={height - 10}
            textAnchor="middle"
            fontSize={11}
            fill="#9CA3AF"
          >
            {d.label}
          </text>
        ) : null,
      )}

      {/* Invisible hit areas for hover */}
      {data.map((_, i) => (
        <rect
          key={i}
          x={toX(i) - xStep / 2}
          y={padding.top}
          width={xStep}
          height={chartH}
          fill="transparent"
          onMouseEnter={() => setHoveredIndex(i)}
        />
      ))}

      {/* Tooltip */}
      {hoveredIndex !== null && renderTooltip(hoveredIndex)}
    </svg>
  )
}
