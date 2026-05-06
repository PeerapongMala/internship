import { useState } from 'react'

interface DonutSegment {
  value: number
  color: string
  label: string
  amount?: number
}

interface DonutChartProps {
  segments: DonutSegment[]
  size?: number
  strokeWidth?: number
}

const fmt = (n: number) => Math.round(n).toLocaleString('en-US')

export default function DonutChart({
  segments,
  size = 200,
  strokeWidth = 40,
}: DonutChartProps) {
  const pad = 6 // safe area for hover expansion
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const center = size / 2 + pad
  const vbSize = size + pad * 2

  const [hovered, setHovered] = useState<number | null>(null)

  let accumulated = 0

  return (
    <div className="donut-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
      <svg
        width={vbSize}
        height={vbSize}
        viewBox={`0 0 ${vbSize} ${vbSize}`}
        className="donut-chart"
      >
        {segments.map((seg, i) => {
          const segmentLength = (seg.value / 100) * circumference
          const offset = accumulated
          accumulated += segmentLength

          const isHovered = hovered === i

          return (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
              strokeDasharray={`${segmentLength} ${circumference - segmentLength}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${center} ${center})`}
              aria-label={seg.label}
              style={{
                transition: 'stroke-width 0.2s ease, stroke-dasharray 0.5s ease, stroke-dashoffset 0.5s ease',
                cursor: 'pointer',
                filter: isHovered ? 'brightness(1.1)' : 'none',
              }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            />
          )
        })}

        {/* Center tooltip text */}
        {hovered !== null && segments[hovered] && (
          <>
            <text
              x={center}
              y={center - 8}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={11}
              fill="var(--gray-500)"
              fontWeight={500}
            >
              {segments[hovered].label}
            </text>
            <text
              x={center}
              y={center + 10}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={14}
              fill="var(--gray-900)"
              fontWeight={700}
            >
              {segments[hovered].amount != null ? `${fmt(segments[hovered].amount!)}` : `${segments[hovered].value.toFixed(1)}%`}
            </text>
          </>
        )}
      </svg>
    </div>
  )
}
