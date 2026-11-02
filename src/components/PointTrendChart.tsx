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
}: PointTrendChartProps) {
  const units = [...new Set(series.map((item) => item.unit))]
  const chartData = samples.map((sample) => ({ timestamp: sample.timestamp, ...sample.values }))
  const tickCount = end - start > 24 * 60 * 60 * 1000 ? 8 : 7
  const timeTicks = Array.from({ length: tickCount }, (_, index) => start + index * (end - start) / (tickCount - 1))

  return (
    <div className="point-trend-chart-scroll" tabIndex={0} role="region" aria-label="Point Trend chart, horizontally scrollable on small screens">
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
      </div>
    </div>
  )
}