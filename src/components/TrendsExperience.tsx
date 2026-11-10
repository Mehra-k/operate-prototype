import { useMemo, useState } from 'react'
import {
  Copy,
  Plus,
  Trash2,
  ExternalLink,
} from 'lucide-react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  trendEvents,
  trendPresets,
  trendSeriesCatalog,
  trendTimes,
  type TrendEvent,
  type TrendPreset,
  type TrendSeriesOption,
  type TrendSource,
} from '../data/trends.ts'
import { formatPointValue } from '../data/operateOverview.ts'

type TrendsExperienceProps = {
  onViewPoint: (pointId: string) => void
}

type TrendView = TrendPreset & {
  custom: boolean
}

type ChartRow = Record<string, string | number>

const trendSources: TrendSource[] = [
  'Current equipment',
  'Related equipment',
  'Wider site',
]

function valueDomain(
  series: TrendSeriesOption | undefined,
  scale: number,
): [number, number] | ['auto', 'auto'] {
  if (!series) return ['auto', 'auto']
  const minValue = Math.min(...series.values)
  const maxValue = Math.max(...series.values)
  const center = (minValue + maxValue) / 2
  const halfRange = Math.max((maxValue - minValue) * 0.62, 0.5) / scale
  return [center - halfRange, center + halfRange]
}

export function TrendsExperience({ onViewPoint }: TrendsExperienceProps) {
  const [views, setViews] = useState<TrendView[]>(() =>
    trendPresets.map((preset) => ({ ...preset, custom: false })),
  )
  const [activeViewId, setActiveViewId] = useState(trendPresets[0].id)
  const [timeRange, setTimeRange] = useState<'12h' | '24h'>('24h')
  const [focusedSeriesId, setFocusedSeriesId] = useState<string | null>(null)
  const [seriesScale, setSeriesScale] = useState(1)
  const [selectedPointId, setSelectedPointId] = useState('')
  const [selectedEvent, setSelectedEvent] = useState<TrendEvent | null>(null)
  const [nextCustomId, setNextCustomId] = useState(1)

  const activeView = views.find((view) => view.id === activeViewId) ?? views[0]
  const activeSeries = activeView.seriesIds
    .map((id) => trendSeriesCatalog.find((series) => series.id === id))
    .filter((series): series is TrendSeriesOption => Boolean(series))
  const focusedSeries = activeSeries.find((series) => series.id === focusedSeriesId)
  const focusedLeftSeries = focusedSeries?.axisId === 'left' ? focusedSeries : undefined
  const focusedRightSeries = focusedSeries?.axisId === 'right' ? focusedSeries : undefined
  const visibleTimes = timeRange === '12h' ? trendTimes.slice(-7) : trendTimes
  const chartData = useMemo<ChartRow[]>(
    () => visibleTimes.map((time) => {
      const sourceIndex = trendTimes.indexOf(time)
      const row: ChartRow = { time }
      for (const series of trendSeriesCatalog) {
        row[series.id] = series.values[sourceIndex] ?? 0
      }
      return row
    }),
    [visibleTimes],
  )
  const visibleEvents = trendEvents.filter((event) => visibleTimes.includes(event.time))
  const availablePoint = trendSeriesCatalog.find((point) => point.id === selectedPointId)

  function selectView(viewId: string) {
    setActiveViewId(viewId)
    setFocusedSeriesId(null)
    setSelectedEvent(null)
  }

  function duplicateView() {
    if (!activeView) return
    const id = `custom-trend-${nextCustomId}`
    setNextCustomId((current) => current + 1)
    setViews((current) => [
      ...current,
      { ...activeView, id, name: `${activeView.name} (Copy)`, custom: true },
    ])
    selectView(id)
  }

  function removeCustomView() {
    if (!activeView?.custom) return
    const fallbackView = trendPresets[0].id
    setViews((current) => current.filter((view) => view.id !== activeView.id))
    setActiveViewId(fallbackView)
    setFocusedSeriesId(null)
    setSelectedEvent(null)
  }

  function addPoint() {
    if (!activeView || !availablePoint || activeView.seriesIds.includes(availablePoint.id)) return
    setViews((current) => current.map((view) =>
      view.id === activeView.id
        ? { ...view, seriesIds: [...view.seriesIds, availablePoint.id] }
        : view,
    ))
    setFocusedSeriesId(availablePoint.id)
    setSelectedPointId('')
  }

  function toggleSeries(seriesId: string) {
    setFocusedSeriesId((current) => current === seriesId ? null : seriesId)
    setSeriesScale(1)
  }

  function domainFor(axisId: 'left' | 'right') {
    const focusedAxisSeries = axisId === 'left' ? focusedLeftSeries : focusedRightSeries
    return valueDomain(focusedAxisSeries, seriesScale)
  }

  return (
    <section className="trends-experience" aria-labelledby="trends-heading">
      <header className="trends-experience__header">
        <div>
          <h2 id="trends-heading">Trend Builder</h2>
          <p>Compare point histories across equipment</p>
        </div>
        <div className="trends-experience__view-actions">
          <label className="trends-experience__view-select">
            <span>Trend view</span>
            <select
              value={activeView?.id ?? trendPresets[0].id}
              onChange={(event) => selectView(event.target.value)}
              aria-label="Trend view"
            >
              <optgroup label="Pre-built trends">
                {views.filter((view) => !view.custom).map((view) => (
                  <option value={view.id} key={view.id}>{view.name}</option>
                ))}
              </optgroup>
              {views.some((view) => view.custom) && (
                <optgroup label="Custom trends">
                  {views.filter((view) => view.custom).map((view) => (
                    <option value={view.id} key={view.id}>{view.name}</option>
                  ))}
                </optgroup>
              )}
            </select>
          </label>
          <button
            className="trends-experience__action"
            type="button"
            disabled={activeView?.custom}
            onClick={duplicateView}
          >
            <Copy size={13} aria-hidden="true" />
            Duplicate as custom
          </button>
          {activeView?.custom && (
            <button
              className="trends-experience__remove"
              type="button"
              onClick={removeCustomView}
            >
              <Trash2 size={13} aria-hidden="true" />
              Remove custom trend
            </button>
          )}
        </div>
      </header>

      <section className="trend-chart-panel" aria-labelledby="trend-chart-title">
        <header className="trend-chart-panel__header">
          <h3 id="trend-chart-title">{activeView?.name}</h3>
          <label className="trend-chart-panel__range">
            <span>Time range</span>
            <select
              value={timeRange}
              onChange={(event) => {
                setTimeRange(event.target.value as '12h' | '24h')
                setSelectedEvent(null)
              }}
              aria-label="Time range"
            >
              <option value="12h">Last 12 Hours</option>
              <option value="24h">Last 24 Hours</option>
            </select>
          </label>
        </header>
        <div className="trend-chart-panel__chart" aria-label="Trend chart">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 22, right: 12, bottom: 4, left: 2 }}>
              <CartesianGrid stroke="#e7e9ec" strokeDasharray="3 3" />
              <XAxis dataKey="time" tick={{ fill: '#5e6369', fontSize: 9 }} tickLine={false} />
              {activeSeries.some((series) => series.axisId === 'left') && (
                <YAxis
                  yAxisId="left"
                  domain={focusedSeries?.axisId === 'left' ? domainFor('left') : ['auto', 'auto']}
                  tick={{ fill: '#5e6369', fontSize: 9 }}
                  tickLine={false}
                  axisLine={false}
                  width={42}
                />
              )}
              {activeSeries.some((series) => series.axisId === 'right') && (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={focusedSeries?.axisId === 'right' ? domainFor('right') : ['auto', 'auto']}
                  tick={{ fill: '#5e6369', fontSize: 9 }}
                  tickLine={false}
                  axisLine={false}
                  width={42}
                />
              )}
              <Tooltip
                labelFormatter={(label) => `Time: ${label}`}
                formatter={(value, name) => {
                  const series = trendSeriesCatalog.find((item) => item.id === String(name))
                  return [
                    series ? formatPointValue(String(value), series.unit) : String(value),
                    series?.name ?? String(name),
                  ]
                }}
                contentStyle={{ borderRadius: 3, borderColor: '#d7dce1', fontSize: 10 }}
              />
              {visibleEvents.map((event) => (
                <ReferenceLine
                  key={event.id}
                  x={event.time}
                  stroke={event.color}
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                  label={{ value: '◆', position: 'insideTop', fill: event.color, fontSize: 9 }}
                  onClick={() => setSelectedEvent(event)}
                />
              ))}
              {activeSeries.map((series) => (
                <Line
                  key={series.id}
                  yAxisId={series.axisId}
                  type="monotone"
                  dataKey={series.id}
                  stroke={series.color}
                  strokeWidth={focusedSeriesId === series.id ? 3 : 2}
                  strokeOpacity={focusedSeriesId && focusedSeriesId !== series.id ? 0.18 : 1}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 1 }}
                  isAnimationActive={false}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="trend-chart-panel__mobile-series" aria-label="Compact trend series values">
          {activeSeries.map((series) => {
            const latestValue = series.values[series.values.length - 1]
            return (
              <div className="trend-chart-panel__mobile-row" key={series.id}>
                <span className="trend-chart-panel__mobile-name">
                  <span style={{ backgroundColor: series.color }} aria-hidden="true" />
                  {series.name}
                </span>
                <strong>
                  {formatPointValue(
                    Number.isInteger(latestValue) ? latestValue.toLocaleString() : latestValue.toFixed(1),
                    series.unit,
                  )}
                </strong>
                <button type="button" onClick={() => onViewPoint(series.pointId)}>
                  View Point
                </button>
              </div>
            )
          })}
        </div>
        <div className="trend-chart-panel__series" aria-label="Chart series">
          {activeSeries.map((series) => (
            <button
              className={`trend-chart-panel__series-item${focusedSeriesId === series.id ? ' is-focused' : ''}`}
              type="button"
              key={series.id}
              aria-pressed={focusedSeriesId === series.id}
              onClick={() => toggleSeries(series.id)}
            >
              <span style={{ backgroundColor: series.color }} aria-hidden="true" />
              {series.name}
            </button>
          ))}
          {focusedSeries && (
            <>
              <label className="trend-chart-panel__scale">
                <span>Scale {seriesScale.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')}×</span>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.25"
                  value={seriesScale}
                  onChange={(event) => setSeriesScale(Number(event.target.value))}
                  aria-label="Selected series scale"
                />
              </label>
              <button
                className="trend-chart-panel__view-point"
                type="button"
                onClick={() => onViewPoint(focusedSeries.pointId)}
              >
                <ExternalLink size={12} aria-hidden="true" />
                View Point
              </button>
            </>
          )}
        </div>
        <div className="trend-chart-panel__events" aria-label="Trend event markers">
          <span className="trend-chart-panel__events-label">Events</span>
          {visibleEvents.map((event) => (
            <button
              className={`trend-chart-panel__event${selectedEvent?.id === event.id ? ' is-selected' : ''}`}
              type="button"
              key={event.id}
              aria-pressed={selectedEvent?.id === event.id}
              onClick={() => setSelectedEvent(event)}
            >
              <span style={{ backgroundColor: event.color }} aria-hidden="true" />
              {event.kind}
              <time>{event.time}</time>
            </button>
          ))}
        </div>
        {selectedEvent && (
          <aside className="trend-chart-panel__event-details" aria-live="polite">
            <div>
              <strong>{selectedEvent.kind}</strong>
              <span>{selectedEvent.pointName} · {selectedEvent.timestamp}</span>
              <p>{selectedEvent.summary}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              aria-label="Close event details"
            >
              ×
            </button>
          </aside>
        )}
      </section>

      <section className="trend-add-point" aria-label="Add points to trend">
        <label htmlFor="trend-point-source">Add point from</label>
        <select
          id="trend-point-source"
          value={selectedPointId}
          onChange={(event) => setSelectedPointId(event.target.value)}
        >
          <option value="">Select a point</option>
          {trendSources.map((source) => (
            <optgroup label={source} key={source}>
              {trendSeriesCatalog
                .filter((series) => series.source === source && !activeView?.seriesIds.includes(series.id))
                .map((series) => (
                  <option value={series.id} key={series.id}>{series.name}</option>
                ))}
          </optgroup>
          ))}
        </select>
        <button
          type="button"
          disabled={!availablePoint}
          onClick={addPoint}
        >
          <Plus size={13} aria-hidden="true" />
          Add point
        </button>
      </section>
    </section>
  )
}

export default TrendsExperience