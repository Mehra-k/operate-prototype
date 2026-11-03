import { useState, useRef } from 'react'
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatPointValue } from '../data/operateOverview.ts'
import {
  formatTrendTimestamp,
  type OverviewTrendEvent,
  type OverviewTrendSeries,
  type TrendSample,
} from '../data/overviewTrends.ts'

type PointTrendChartProps = {
  series: OverviewTrendSeries[]
  samples: TrendSample[]
  start: number
  end: number
  focusedSeriesId: string | null
  scale: number
  events: OverviewTrendEvent[]
  onSelectEvent: (event: OverviewTrendEvent) => void
  onManualRangeSelect?: (newStart: number, newEnd: number) => void
}

export function PointTrendChart({
  series,
  samples,
  start,
  end,
  focusedSeriesId,
  scale,
  events,
  onSelectEvent,
  onManualRangeSelect,
}: PointTrendChartProps) {
  const [selectionStart, setSelectionStart] = useState<number | null>(null)
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const chartContainerRef = useRef<HTMLDivElement>(null)
  
  const units = [...new Set(series.map((item) => item.unit))]
  const chartData = samples.map((sample) => ({ timestamp: sample.timestamp, ...sample.values }))
  const tickCount = end - start > 24 * 60 * 60 * 1000 ? 8 : 7
  const timeTicks = Array.from({ length: tickCount }, (_, index) => start + index * (end - start) / (tickCount - 1))

  // Calculate pixel-to-timestamp mapping
  function getTimestampFromPixelX(pixelX: number): number {
    const container = chartContainerRef.current
    if (!container) return start
    const rect = container.getBoundingClientRect()
    const chartLeft = rect.left
    const chartRight = rect.right
    
    // Account for chart margins (left and right)
    const plotLeft = chartLeft + 48 + 8 // left axis width + margin
    const plotRight = chartRight - 12 // right margin
    const plotWidth = plotRight - plotLeft
    
    if (pixelX <= plotLeft) return start
    if (pixelX >= plotRight) return end
    
    const fraction = (pixelX - plotLeft) / plotWidth
    return Math.round(start + fraction * (end - start))
  }

  function handleMouseDown(e: React.MouseEvent) {
    if (e.button !== 0) return // Only left click
    const timestamp = getTimestampFromPixelX(e.clientX)
    setSelectionStart(timestamp)
    setSelectionEnd(timestamp)
    setIsSelecting(true)
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!isSelecting || selectionStart === null) return
    const timestamp = getTimestampFromPixelX(e.clientX)
    setSelectionEnd(timestamp)
  }

  function handleMouseUp() {
    if (!isSelecting || selectionStart === null || selectionEnd === null) {
      setIsSelecting(false)
      return
    }
    setIsSelecting(false)
    
    // Ensure start is before end
    const rangeStart = Math.min(selectionStart, selectionEnd)
    const rangeEnd = Math.max(selectionStart, selectionEnd)
    
    // Only apply if selection is meaningful (not just a click)
    if (rangeEnd - rangeStart > 60000) { // At least 1 minute
      onManualRangeSelect?.(rangeStart, rangeEnd)
      setSelectionStart(null)
      setSelectionEnd(null)
    } else {
      setSelectionStart(null)
      setSelectionEnd(null)
    }
  }

  function handleMouseLeave() {
    if (isSelecting) {
      setIsSelecting(false)
      setSelectionStart(null)
      setSelectionEnd(null)
    }
  }

  // Calculate positions for selection overlay
  let selectionStartPercent = 0
  let selectionWidthPercent = 0
  if (selectionStart !== null && selectionEnd !== null && isSelecting) {
    const minTime = Math.min(selectionStart, selectionEnd)
    const maxTime = Math.max(selectionStart, selectionEnd)
    selectionStartPercent = ((minTime - start) / (end - start)) * 100
    selectionWidthPercent = ((maxTime - minTime) / (end - start)) * 100
  }

  const displayStart = selectionStart !== null && isSelecting ? Math.min(selectionStart, selectionEnd!) : null
  const displayEnd = selectionEnd !== null && isSelecting ? Math.max(selectionStart!, selectionEnd) : null
  const durationMs = displayStart !== null && displayEnd !== null ? displayEnd - displayStart : 0
  const durationHours = Math.floor(durationMs / (60 * 60 * 1000))
  const durationMinutes = Math.floor((durationMs % (60 * 60 * 1000)) / (60 * 1000))

  return (
    <div 
      className="point-trend-chart-scroll" 
      tabIndex={0} 
      role="region" 
      aria-label="Point Trend chart, horizontally scrollable on small screens"
      ref={chartContainerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{ cursor: isSelecting ? 'crosshair' : 'default', position: 'relative' }}
    >
      <div className="point-trend-chart">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 24, right: 12, bottom: 8, left: 8 }}>
            <CartesianGrid stroke="#e7e9ec" vertical={false} />
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={[start, end]}
              scale="time"
              ticks={timeTicks}
              tickFormatter={(value: number) => end - start > 24 * 60 * 60 * 1000
                ? formatTrendTimestamp(value, true)
                : new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', hour: 'numeric', minute: '2-digit' }).format(value)}
              tick={{ fontSize: 9, fill: '#697078' }}
              tickLine={false}
              axisLine={{ stroke: '#dfe1e4' }}
            />
            {units.map((unit, unitIndex) => {
              const focus = series.find((item) => item.id === focusedSeriesId && item.unit === unit)
              const values = focus ? samples.map((sample) => sample.values[focus.id]) : []
              const low = values.length ? Math.min(...values) : 0
              const high = values.length ? Math.max(...values) : 1
              const center = (low + high) / 2
              const halfRange = Math.max((high - low) * 0.6, 0.1) / scale
              return (
                <YAxis
                  key={unit}
                  yAxisId={unit}
                  orientation={unitIndex === 0 ? 'left' : 'right'}
                  width={48}
                  tick={{ fontSize: 9, fill: '#697078' }}
                  tickLine={false}
                  axisLine={false}
                  domain={focus ? [center - halfRange, center + halfRange] : ['auto', 'auto']}
                  allowDataOverflow={Boolean(focus)}
                  label={{ value: unit, angle: -90, position: unitIndex === 0 ? 'insideLeft' : 'insideRight', fontSize: 9, fill: '#697078' }}
                />
              )
            })}
            <Tooltip
              cursor={{ stroke: '#7d8c99', strokeWidth: 1, strokeDasharray: '3 3' }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null
                return (
                  <div className="overview-trend-tooltip">
                    <strong>{formatTrendTimestamp(Number(label))} UTC</strong>
                    {payload.map((entry) => {
                      const item = series.find((candidate) => candidate.id === entry.dataKey)
                      return item ? (
                        <div key={item.id}>
                          <span style={{ color: item.color }}>{item.name}</span>
                          <b>{formatPointValue(String(entry.value), item.unit)}</b>
                        </div>
                      ) : null
                    })}
                  </div>
                )
              }}
            />
            {series.map((item, index) => {
              const common = {
                yAxisId: item.unit,
                dataKey: item.id,
                stroke: item.color,
                strokeWidth: focusedSeriesId === item.id ? 2.5 : 1.5,
                strokeOpacity: focusedSeriesId && focusedSeriesId !== item.id ? 0.3 : 1,
                isAnimationActive: false,
              }
              return index === 0 && !item.setpoint ? (
                <Area {...common} key={item.id} type="monotone" fill={item.color} fillOpacity={0.08} activeDot={{ r: 3 }} />
              ) : (
                <Line {...common} key={item.id} type={item.setpoint ? 'stepAfter' : 'monotone'} strokeDasharray={item.setpoint ? '5 3' : undefined} dot={false} activeDot={{ r: 3 }} />
              )
            })}
            {units[0] && events.map((event) => (
              <ReferenceLine
                key={event.id}
                x={event.timestamp}
                yAxisId={units[0]}
                stroke={event.color}
                strokeDasharray="3 3"
                shape={({ x1, x2, y1, y2 }: { x1?: number; x2?: number; y1?: number; y2?: number }) => {
                  if (x1 === undefined || y1 === undefined || y2 === undefined) return <g />
                  const top = Math.min(y1, y2)
                  return (
                    <g>
                      <line x1={x1} x2={x2} y1={y1} y2={y2} stroke={event.color} strokeDasharray="3 3" />
                      <line x1={x1} x2={x2} y1={y1} y2={y2} stroke="transparent" strokeWidth={12} onMouseEnter={() => onSelectEvent(event)} onClick={() => onSelectEvent(event)} style={{ cursor: 'pointer' }} />
                      <path d={`M${x1} ${top - 5}l5 5-5 5-5-5z`} fill={event.color} pointerEvents="none" />
                      <circle
                        cx={x1}
                        cy={top}
                        r={9}
                        fill="transparent"
                        role="button"
                        tabIndex={0}
                        aria-label={`${event.kind} at ${formatTrendTimestamp(event.timestamp)} UTC`}
                        onFocus={() => onSelectEvent(event)}
                        onMouseEnter={() => onSelectEvent(event)}
                        onClick={() => onSelectEvent(event)}
                        onKeyDown={(keyboardEvent) => {
                          if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
                            keyboardEvent.preventDefault()
                            onSelectEvent(event)
                          }
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <title>{`${event.kind}: ${event.description}`}</title>
                      </circle>
                    </g>
                  )
                }}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
        
        {/* Selection overlay */}
        {isSelecting && selectionStart !== null && selectionEnd !== null && (
          <div className="point-trend-selection-overlay">
            <div 
              className="point-trend-selection-area"
              style={{
                left: `${selectionStartPercent}%`,
                width: `${selectionWidthPercent}%`,
              }}
            >
              <div className="point-trend-selection-handle point-trend-selection-handle--start" />
              <div className="point-trend-selection-handle point-trend-selection-handle--end" />
            </div>
            
            <div 
              className="point-trend-selection-tooltip"
              style={{
                left: `${Math.min(selectionStartPercent, selectionStartPercent + selectionWidthPercent) + selectionWidthPercent / 2}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="point-trend-selection-tooltip-item">
                <strong>Start:</strong> {displayStart ? formatTrendTimestamp(displayStart) : '--'}
              </div>
              <div className="point-trend-selection-tooltip-item">
                <strong>End:</strong> {displayEnd ? formatTrendTimestamp(displayEnd) : '--'}
              </div>
              <div className="point-trend-selection-tooltip-item">
                <strong>Duration:</strong> {durationHours > 0 ? `${durationHours}h ` : ''}{durationMinutes}m
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}