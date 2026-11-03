import { useRef, useState, type FormEvent } from 'react'
import { Copy, Crosshair, ExternalLink, MoreHorizontal, Pencil, Plus, Trash2, X, ChevronDown } from 'lucide-react'
import {
  formatTrendTimestamp,
  overviewTrendEnd,
  overviewTrendEvents,
  overviewTrendRanges,
  overviewTrendSamples,
  overviewTrendSeries,
  type OverviewTrendEvent,
  type OverviewTrendRange,
  type OverviewTrendState,
} from '../data/overviewTrends.ts'
import type { TrendSource } from '../data/trends.ts'
import { PointTrendChart } from './PointTrendChart.tsx'

type PointTrendPanelProps = {
  state: OverviewTrendState
  onStateChange: (state: OverviewTrendState) => void
  onViewPoint: (pointId: string) => void
}

const sources: TrendSource[] = ['Current equipment', 'Related equipment', 'Wider site']

export default function PointTrendPanel({ state, onStateChange, onViewPoint }: PointTrendPanelProps) {
  const activeView = state.views.find((view) => view.id === state.activeViewId) ?? state.views[0]
  const [range, setRange] = useState<OverviewTrendRange>('24h')
  const [showCustomRange, setShowCustomRange] = useState(false)
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')
  const [hiddenIds, setHiddenIds] = useState<string[]>([])
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState(activeView.seriesIds[0] ?? '')
  const [scale, setScale] = useState(1)
  const [scaleMode, setScaleMode] = useState<'auto' | 'manual'>('auto')
  const [manualScaleMin, setManualScaleMin] = useState<number | ''>('')
  const [manualScaleMax, setManualScaleMax] = useState<number | ''>('')
  const [showScaleEditor, setShowScaleEditor] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<OverviewTrendEvent | null>(null)
  const [editor, setEditor] = useState<'new' | 'rename' | 'series' | null>(null)
  const [nameDraft, setNameDraft] = useState('')
  const [source, setSource] = useState<TrendSource>('Current equipment')
  const [pointToAdd, setPointToAdd] = useState('')
  const menu = useRef<HTMLDetailsElement>(null)

  const series = activeView.seriesIds.flatMap((id) => {
    const item = overviewTrendSeries.find((candidate) => candidate.id === id)
    return item ? [item] : []
  })
  const visibleSeries = series.filter((item) => !hiddenIds.includes(item.id))
  const selectedSeries = series.find((item) => item.id === selectedId) ?? series[0]
  
  // Calculate time range
  let start: number
  if (showCustomRange && customStart && customEnd) {
    start = new Date(customStart).getTime()
  } else {
    const duration = overviewTrendRanges.find((item) => item.value === range)!.hours * 60 * 60 * 1000
    start = overviewTrendEnd - duration
  }
  
  const samples = overviewTrendSamples.filter((sample) => sample.timestamp >= start)
  const events = overviewTrendEvents.filter((event) => event.timestamp >= start && event.timestamp <= overviewTrendEnd)
  const availableSeries = overviewTrendSeries.filter((item) => item.source === source && !activeView.seriesIds.includes(item.id))

  function resetPresentation() {
    setHiddenIds([])
    setFocusedId(null)
    setSelectedEvent(null)
    setScale(1)
    setScaleMode('auto')
    setManualScaleMin('')
    setManualScaleMax('')
    setShowScaleEditor(false)
    setShowCustomRange(false)
    setEditor(null)
    setPointToAdd('')
    if (menu.current) menu.current.open = false
  }

  function applyCustomRange() {
    if (!customStart || !customEnd) return
    const startTime = new Date(customStart).getTime()
    const endTime = new Date(customEnd).getTime()
    if (startTime >= endTime) {
      alert('Start time must be before end time')
      return
    }
    setShowCustomRange(true)
    setSelectedEvent(null)
  }

  function resetScale() {
    setScale(1)
    setScaleMode('auto')
    setManualScaleMin('')
    setManualScaleMax('')
  }

  function applyManualScale() {
    if (manualScaleMin === '' || manualScaleMax === '') return
    const min = Number(manualScaleMin)
    const max = Number(manualScaleMax)
    if (min >= max) {
      alert('Minimum must be less than maximum')
      return
    }
    setScaleMode('manual')
    setShowScaleEditor(false)
  }

  function handleManualRangeSelect(newStart: number, newEnd: number) {
    setCustomStart(new Date(newStart).toISOString().slice(0, 16))
    setCustomEnd(new Date(newEnd).toISOString().slice(0, 16))
    setShowCustomRange(true)
    setSelectedEvent(null)
  }

  function selectView(id: string) {
    onStateChange({ ...state, activeViewId: id })
    resetPresentation()
    setSelectedId(state.views.find((view) => view.id === id)?.seriesIds[0] ?? '')
  }

  function duplicateView() {
    const copy = { ...activeView, id: crypto.randomUUID(), name: `${activeView.name} (Copy)`, seriesIds: [...activeView.seriesIds], custom: true }
    onStateChange({ views: [...state.views, copy], activeViewId: copy.id })
    resetPresentation()
    setSelectedId(copy.seriesIds[0] ?? '')
  }

  function openEditor(nextEditor: 'new' | 'rename' | 'series') {
    setNameDraft(nextEditor === 'rename' ? activeView.name : '')
    setEditor(nextEditor)
    if (menu.current) menu.current.open = false
  }

  function submitName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = nameDraft.trim()
    if (!name) return
    if (editor === 'new') {
      const newView = { id: crypto.randomUUID(), name, custom: true, seriesIds: [] }
      onStateChange({ views: [...state.views, newView], activeViewId: newView.id })
      resetPresentation()
      setSelectedId('')
      setEditor('series')
    } else if (activeView.custom) {
      onStateChange({ ...state, views: state.views.map((view) => view.id === activeView.id ? { ...view, name } : view) })
      setEditor(null)
    }
  }

  function removeView() {
    if (!activeView.custom) return
    onStateChange({ views: state.views.filter((view) => view.id !== activeView.id), activeViewId: state.views[0].id })
    resetPresentation()
  }

  function updateSeries(ids: string[]) {
    if (!activeView.custom) return
    onStateChange({ ...state, views: state.views.map((view) => view.id === activeView.id ? { ...view, seriesIds: ids } : view) })
  }

  function addSeries() {
    if (!activeView.custom || !availableSeries.some((item) => item.id === pointToAdd)) return
    updateSeries([...activeView.seriesIds, pointToAdd])
    setSelectedId(pointToAdd)
    setPointToAdd('')
  }

  function removeSeries(id: string) {
    updateSeries(activeView.seriesIds.filter((item) => item !== id))
    setHiddenIds((current) => current.filter((item) => item !== id))
    if (focusedId === id) setFocusedId(null)
    if (selectedId === id) setSelectedId(activeView.seriesIds.find((item) => item !== id) ?? '')
  }

  return (
    <section className="overview-point-trend" aria-labelledby="overview-point-trend-heading">
      <header className="overview-point-trend__header">
        <h2 id="overview-point-trend-heading">{activeView.name}</h2>
        <div className="overview-point-trend__toolbar">
          <div className="overview-point-trend__range-control">
            <label>
              <span className="overview-point-trend__sr-only">Point Trend time range</span>
              <select aria-label="Point Trend time range" value={showCustomRange ? 'custom' : range} onChange={(event) => {
                if (event.target.value === 'custom') {
                  setShowCustomRange(true)
                } else {
                  setRange(event.target.value as OverviewTrendRange)
                  setShowCustomRange(false)
                  setSelectedEvent(null)
                }
              }}>
                {overviewTrendRanges.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}
                <option value="custom">Custom Range</option>
              </select>
            </label>
            {showCustomRange && (
              <div className="overview-point-trend__custom-range">
                <label>
                  Start
                  <input
                    type="datetime-local"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    max={customEnd || undefined}
                  />
                </label>
                <label>
                  End
                  <input
                    type="datetime-local"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    min={customStart || undefined}
                  />
                </label>
                <button type="button" onClick={applyCustomRange} disabled={!customStart || !customEnd}>Apply</button>
                <button type="button" onClick={() => {
                  setShowCustomRange(false)
                  setCustomStart('')
                  setCustomEnd('')
                  setRange('24h')
                }}>Cancel</button>
              </div>
            )}
          </div>
          <details className="overview-point-trend__menu" ref={menu}>
            <summary aria-label="Trend options" title="Trend options"><MoreHorizontal size={16} aria-hidden="true" /></summary>
            <div className="overview-point-trend__menu-items">
              <button type="button" onClick={duplicateView}><Copy size={12} />Duplicate trend</button>
              <button type="button" onClick={() => openEditor('new')}><Plus size={12} />Create custom trend</button>
              {activeView.custom && (
                <>
                  <button type="button" onClick={() => openEditor('rename')}><Pencil size={12} />Rename trend</button>
                  <button type="button" onClick={() => openEditor('series')}><Plus size={12} />Edit series</button>
                  <button type="button" onClick={removeView}><Trash2 size={12} />Remove custom trend</button>
                </>
              )}
            </div>
          </details>
        </div>
      </header>

      <div className="overview-point-trend__legend" aria-label="Point Trend series">
        {series.map((item) => (
          <div className={`overview-point-trend__chip${focusedId === item.id ? ' is-focused' : ''}`} key={item.id}>
            <label>
              <input
                type="checkbox"
                checked={!hiddenIds.includes(item.id)}
                aria-label={`Show ${item.name}`}
                style={{ accentColor: item.color }}
                onChange={(event) => setHiddenIds((current) => event.target.checked ? current.filter((id) => id !== item.id) : [...current, item.id])}
              />
              <span style={{ fontWeight: focusedId === item.id ? 600 : 400 }}>
                {item.name}
                {focusedId === item.id && <span className="overview-point-trend__focus-badge"> • Focused</span>}
              </span>
            </label>
            <button 
              type="button" 
              title={focusedId === item.id ? `Clear focus from ${item.name}` : `Focus ${item.name}`} 
              aria-label={focusedId === item.id ? `Clear focus from ${item.name}` : `Focus ${item.name}`} 
              aria-pressed={focusedId === item.id} 
              className={focusedId === item.id ? 'is-active' : ''}
              onClick={() => {
                setFocusedId((current) => current === item.id ? null : item.id)
                setSelectedId(item.id)
                setHiddenIds((current) => current.filter((id) => id !== item.id))
                if (focusedId !== item.id) {
                  setScale(1)
                  setScaleMode('auto')
                  setManualScaleMin('')
                  setManualScaleMax('')
                  setShowScaleEditor(false)
                }
              }}
            >
              <Crosshair size={12} aria-hidden="true" />
            </button>
            {activeView.custom && <button type="button" title={`Remove ${item.name}`} aria-label={`Remove ${item.name}`} onClick={() => removeSeries(item.id)}><X size={12} aria-hidden="true" /></button>}
          </div>
        ))}
      </div>

      {(editor === 'new' || editor === 'rename') && (
        <form className="overview-point-trend__editor" onSubmit={submitName}>
          <label>{editor === 'new' ? 'New trend name' : 'Trend name'}<input autoFocus value={nameDraft} onChange={(event) => setNameDraft(event.target.value)} required /></label>
          <button type="submit" disabled={!nameDraft.trim()}>{editor === 'new' ? 'Create trend' : 'Save name'}</button>
          <button type="button" onClick={() => setEditor(null)}>Cancel</button>
        </form>
      )}
      {editor === 'series' && activeView.custom && (
        <div className="overview-point-trend__editor">
          <label>Point source<select aria-label="Point Trend point source" value={source} onChange={(event) => { setSource(event.target.value as TrendSource); setPointToAdd('') }}>
            {sources.map((item) => <option key={item}>{item}</option>)}
          </select></label>
          <label>Point<select aria-label="Point Trend point to add" value={pointToAdd} onChange={(event) => setPointToAdd(event.target.value)}>
            <option value="">Select a point</option>
            {availableSeries.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
          </select></label>
          <button type="button" disabled={!pointToAdd} onClick={addSeries}><Plus size={12} />Add series</button>
          <button type="button" onClick={() => setEditor(null)}>Done</button>
        </div>
      )}

      {visibleSeries.length ? (
        <PointTrendChart series={visibleSeries} samples={samples} start={start} end={overviewTrendEnd} focusedSeriesId={focusedId} scale={scale} events={events} onSelectEvent={setSelectedEvent} onManualRangeSelect={handleManualRangeSelect} />
      ) : <div className="overview-point-trend__empty">{series.length ? 'All series hidden' : 'No series selected'}</div>}

      <div className="overview-point-trend__events" aria-label="Point Trend events">
        {events.map((event) => (
          <button type="button" key={event.id} aria-pressed={selectedEvent?.id === event.id} title={`${event.kind}: ${formatTrendTimestamp(event.timestamp)} UTC. ${event.description}`} onMouseEnter={() => setSelectedEvent(event)} onClick={() => setSelectedEvent(event)}>
            <span style={{ backgroundColor: event.color }} aria-hidden="true" />
            {event.kind}
          </button>
        ))}
      </div>
      {selectedEvent && (
        <aside className="overview-point-trend__event-details" aria-live="polite">
          <div><strong>{selectedEvent.kind}</strong><time dateTime={new Date(selectedEvent.timestamp).toISOString()}>{formatTrendTimestamp(selectedEvent.timestamp)} UTC</time><p>{selectedEvent.description}</p></div>
          <button type="button" aria-label="Close Point Trend event" title="Close event" onClick={() => setSelectedEvent(null)}><X size={14} /></button>
        </aside>
      )}

      <footer className="overview-point-trend__footer">
        <label>Trend view<select aria-label="Overview trend view" value={activeView.id} onChange={(event) => selectView(event.target.value)}>
          <optgroup label="Pre-built trends">{state.views.filter((view) => !view.custom).map((view) => <option value={view.id} key={view.id}>{view.name}</option>)}</optgroup>
          {state.views.some((view) => view.custom) && <optgroup label="Custom trends">{state.views.filter((view) => view.custom).map((view) => <option value={view.id} key={view.id}>{view.name}</option>)}</optgroup>}
        </select></label>
        {selectedSeries && (
          <div className="overview-point-trend__source">
            <label>Series<select aria-label="Point Trend selected series" value={selectedSeries.id} onChange={(event) => setSelectedId(event.target.value)}>
              {series.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
            </select></label>
            <button type="button" onClick={() => onViewPoint(selectedSeries.pointId)}><ExternalLink size={12} />View point</button>
          </div>
        )}
        {focusedId && (
          <div className="overview-point-trend__scale">
            <div className="overview-point-trend__scale-header">
              <label>
                {scaleMode === 'auto' ? `Scale ${scale}x (Auto)` : `Scale ${scale}x (Manual)`}
                <input 
                  type="range" 
                  min="0.5" 
                  max="2" 
                  step="0.25" 
                  aria-label="Point Trend focused scale" 
                  value={scale} 
                  onChange={(event) => setScale(Number(event.target.value))}
                  disabled={scaleMode === 'manual' && (manualScaleMin !== '' && manualScaleMax !== '')}
                />
              </label>
              <button 
                type="button" 
                title="Scale options" 
                aria-label="Scale options" 
                className="overview-point-trend__scale-menu-btn"
                onClick={() => setShowScaleEditor(!showScaleEditor)}
              >
                <ChevronDown size={12} />
              </button>
            </div>
            {showScaleEditor && (
              <div className="overview-point-trend__scale-editor">
                <label>
                  <input 
                    type="radio" 
                    name="scale-mode" 
                    value="auto" 
                    checked={scaleMode === 'auto'}
                    onChange={() => setScaleMode('auto')}
                  />
                  Auto scale
                </label>
                <label>
                  <input 
                    type="radio" 
                    name="scale-mode" 
                    value="manual" 
                    checked={scaleMode === 'manual'}
                    onChange={() => setScaleMode('manual')}
                  />
                  Manual scale
                </label>
                {scaleMode === 'manual' && (
                  <>
                    <label>
                      Min
                      <input 
                        type="number" 
                        step="0.1"
                        value={manualScaleMin} 
                        onChange={(e) => setManualScaleMin(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Enter minimum"
                      />
                    </label>
                    <label>
                      Max
                      <input 
                        type="number" 
                        step="0.1"
                        value={manualScaleMax} 
                        onChange={(e) => setManualScaleMax(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Enter maximum"
                      />
                    </label>
                    <button type="button" onClick={applyManualScale} disabled={manualScaleMin === '' || manualScaleMax === ''}>Apply</button>
                  </>
                )}
                <button type="button" onClick={resetScale}>Reset scale</button>
                <button type="button" onClick={() => setShowScaleEditor(false)}>Done</button>
              </div>
            )}
          </div>
        )}
      </footer>
    </section>
  )
}