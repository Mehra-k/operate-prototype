import { ChevronDown, ChevronRight, Crosshair, Plus, X } from 'lucide-react'
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
import { equipmentHierarchy, type EquipmentTreeNode } from '../data/equipment.ts'
import type { TrendSource } from '../data/trends.ts'
import { PointTrendChart } from './PointTrendChart.tsx'

export type TrendWorkspaceMode = 'inline' | 'expanded'

type TrendWorkspaceProps = {
  mode: TrendWorkspaceMode
  state: OverviewTrendState
  onStateChange: (state: OverviewTrendState) => void
  // Shared state for the workspace
  range: OverviewTrendRange
  onRangeChange: (range: OverviewTrendRange) => void
  showCustomRange: boolean
  onShowCustomRangeChange: (show: boolean) => void
  customStart: string
  onCustomStartChange: (start: string) => void
  customEnd: string
  onCustomEndChange: (end: string) => void
  hiddenIds: string[]
  onHiddenIdsChange: (ids: string[]) => void
  focusedId: string | null
  onFocusedIdChange: (id: string | null) => void
  scale: number
  onScaleChange: (scale: number) => void
  scaleMode: 'auto' | 'manual'
  onScaleModeChange: (mode: 'auto' | 'manual') => void
  manualScaleMin: number | ''
  onManualScaleMinChange: (min: number | '') => void
  manualScaleMax: number | ''
  onManualScaleMaxChange: (max: number | '') => void
  showScaleEditor: boolean
  onShowScaleEditorChange: (show: boolean) => void
  selectedEvent: OverviewTrendEvent | null
  onSelectedEventChange: (event: OverviewTrendEvent | null) => void
  customTrendState: { isActive: boolean; selectedPointIds: string[] }
  onCustomTrendStateChange: (state: { isActive: boolean; selectedPointIds: string[] }) => void
  source: TrendSource
  onSourceChange: (source: TrendSource) => void
  pointToAdd: string
  onPointToAddChange: (pointId: string) => void
  selectedRelatedEquipment: string
  onSelectedRelatedEquipmentChange: (equipmentId: string) => void
  selectedEquipmentIds: Set<string>
  onSelectedEquipmentIdsChange: (ids: Set<string>) => void
  expandedTreeNodes: Set<string>
  onExpandedTreeNodesChange: (nodes: Set<string>) => void
  showWiderSiteDropdown: boolean
  onShowWiderSiteDropdownChange: (show: boolean) => void
}

const sources: TrendSource[] = ['Current equipment', 'Related equipment', 'Wider site']

// Related equipment for demo purposes
const relatedEquipmentOptions = [
  { id: 'chiller-ch-01', name: 'Chiller CH-01' },
  { id: 'ahu-sa-02', name: 'AHU-SA-02' },
  { id: 'vav-01', name: 'VAV-01' },
  { id: 'vav-02', name: 'VAV-02' },
  { id: 'vav-03', name: 'VAV-03' },
]

export function TrendWorkspace({
  mode,
  state,
  onStateChange,
  range,
  onRangeChange,
  showCustomRange,
  onShowCustomRangeChange,
  customStart,
  onCustomStartChange,
  customEnd,
  onCustomEndChange,
  hiddenIds,
  onHiddenIdsChange,
  focusedId,
  onFocusedIdChange,
  scale,
  onScaleChange,
  scaleMode,
  onScaleModeChange,
  manualScaleMin,
  onManualScaleMinChange,
  manualScaleMax,
  onManualScaleMaxChange,
  showScaleEditor,
  onShowScaleEditorChange,
  selectedEvent,
  onSelectedEventChange,
  customTrendState,
  onCustomTrendStateChange,
  source,
  onSourceChange,
  pointToAdd,
  onPointToAddChange,
  selectedRelatedEquipment,
  onSelectedRelatedEquipmentChange,
  selectedEquipmentIds,
  onSelectedEquipmentIdsChange,
  expandedTreeNodes,
  onExpandedTreeNodesChange,
  showWiderSiteDropdown,
  onShowWiderSiteDropdownChange,
}: TrendWorkspaceProps) {
  const activeView = state.views.find((view) => view.id === state.activeViewId) ?? state.views[0]

  // Determine which series to show
  const activeSeriesIds = customTrendState.isActive ? customTrendState.selectedPointIds : activeView.seriesIds
  const series = activeSeriesIds.flatMap((id) => {
    const item = overviewTrendSeries.find((candidate) => candidate.id === id)
    return item ? [item] : []
  })

  const visibleSeries = series.filter((item) => !hiddenIds.includes(item.id))

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

  // Get available series based on source
  let availableSeries: typeof overviewTrendSeries
  if (source === 'Current equipment') {
    availableSeries = overviewTrendSeries.filter(
      (item) => item.source === 'Current equipment' && !activeSeriesIds.includes(item.id)
    )
  } else if (source === 'Related equipment' && selectedRelatedEquipment) {
    // For related equipment, filter by equipment ID
    availableSeries = overviewTrendSeries.filter(
      (item) => item.id.startsWith(selectedRelatedEquipment.toLowerCase()) && !activeSeriesIds.includes(item.id)
    )
  } else if (source === 'Wider site' && selectedEquipmentIds.size > 0) {
    // For wider site, filter by all selected equipment
    availableSeries = overviewTrendSeries.filter((item) => {
      const matchesSelected = Array.from(selectedEquipmentIds).some((equipmentId) =>
        item.id.startsWith(equipmentId.toLowerCase())
      )
      return matchesSelected && !activeSeriesIds.includes(item.id)
    })
  } else {
    availableSeries = []
  }

  function applyCustomRange() {
    if (!customStart || !customEnd) return
    const startTime = new Date(customStart).getTime()
    const endTime = new Date(customEnd).getTime()
    if (startTime >= endTime) {
      alert('Start time must be before end time')
      return
    }
    onShowCustomRangeChange(true)
    onSelectedEventChange(null)
  }

  function resetScale() {
    onScaleChange(1)
    onScaleModeChange('auto')
    onManualScaleMinChange('')
    onManualScaleMaxChange('')
  }

  function applyManualScale() {
    if (manualScaleMin === '' || manualScaleMax === '') return
    const min = Number(manualScaleMin)
    const max = Number(manualScaleMax)
    if (min >= max) {
      alert('Minimum must be less than maximum')
      return
    }
    onScaleModeChange('manual')
    onShowScaleEditorChange(false)
  }

  function handleManualRangeSelect(newStart: number, newEnd: number) {
    onCustomStartChange(new Date(newStart).toISOString().slice(0, 16))
    onCustomEndChange(new Date(newEnd).toISOString().slice(0, 16))
    onShowCustomRangeChange(true)
    onSelectedEventChange(null)
  }

  function selectView(id: string) {
    onStateChange({ ...state, activeViewId: id })
    onCustomTrendStateChange({ isActive: false, selectedPointIds: [] })
    onHiddenIdsChange([])
    onFocusedIdChange(null)
    onSelectedEventChange(null)
    onSelectedRelatedEquipmentChange('')
    onSelectedEquipmentIdsChange(new Set())
    onPointToAddChange('')
    onShowWiderSiteDropdownChange(false)
  }

  function toggleCustomTrendMode() {
    if (customTrendState.isActive) {
      onCustomTrendStateChange({ isActive: false, selectedPointIds: [] })
    } else {
      onCustomTrendStateChange({ isActive: true, selectedPointIds: [...activeView.seriesIds] })
    }
    onHiddenIdsChange([])
    onFocusedIdChange(null)
    onSelectedRelatedEquipmentChange('')
    onSelectedEquipmentIdsChange(new Set())
    onPointToAddChange('')
    onShowWiderSiteDropdownChange(false)
  }

  function addPointToCustomTrend() {
    if (!pointToAdd || customTrendState.selectedPointIds.includes(pointToAdd)) return
    onCustomTrendStateChange({
      ...customTrendState,
      selectedPointIds: [...customTrendState.selectedPointIds, pointToAdd],
    })
    onPointToAddChange('')
  }

  function removePointFromCustomTrend(pointId: string) {
    onCustomTrendStateChange({
      ...customTrendState,
      selectedPointIds: customTrendState.selectedPointIds.filter((id) => id !== pointId),
    })
    onHiddenIdsChange(hiddenIds.filter((id) => id !== pointId))
    if (focusedId === pointId) onFocusedIdChange(null)
  }

  function renderEquipmentTree(nodes: EquipmentTreeNode[], depth: number = 0) {
    return (
      <div style={{ paddingLeft: `${depth * 16}px` }}>
        {nodes.map((node) => {
          const isEquipment = node.kind === 'equipment'
          const hasChildren = node.children && node.children.length > 0
          const isExpanded = expandedTreeNodes.has(node.id)
          const isChecked = selectedEquipmentIds.has(node.id)

          return (
            <div key={node.id}>
              <div className="wider-site-tree-node">
                {hasChildren ? (
                  <button
                    type="button"
                    className="wider-site-tree-toggle"
                    onClick={() => {
                      const newExpanded = new Set(expandedTreeNodes)
                      if (isExpanded) {
                        newExpanded.delete(node.id)
                      } else {
                        newExpanded.add(node.id)
                      }
                      onExpandedTreeNodesChange(newExpanded)
                    }}
                    aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${node.name}`}
                  >
                    {isExpanded ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                  </button>
                ) : (
                  <span style={{ width: '14px' }} />
                )}

                {isEquipment ? (
                  <label className="wider-site-tree-equipment-label">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(event) => {
                        const newSelected = new Set(selectedEquipmentIds)
                        if (event.target.checked) {
                          newSelected.add(node.id)
                        } else {
                          newSelected.delete(node.id)
                          onPointToAddChange('')
                        }
                        onSelectedEquipmentIdsChange(newSelected)
                      }}
                      aria-label={`Select ${node.name}`}
                    />
                    <span className="wider-site-tree-equipment">{node.name}</span>
                  </label>
                ) : (
                  <button
                    type="button"
                    className="wider-site-tree-group"
                    onClick={() => {
                      if (hasChildren) {
                        const newExpanded = new Set(expandedTreeNodes)
                        if (isExpanded) {
                          newExpanded.delete(node.id)
                        } else {
                          newExpanded.add(node.id)
                        }
                        onExpandedTreeNodesChange(newExpanded)
                      }
                    }}
                  >
                    {node.name}
                  </button>
                )}
              </div>
              {isExpanded && hasChildren && node.children && renderEquipmentTree(node.children, depth + 1)}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className={`trend-workspace trend-workspace--${mode}`}>
      {/* Time range control */}
      <div className="trend-workspace__range-control">
        <label>
          <span className="overview-point-trend__sr-only">Point Trend time range</span>
          <select
            aria-label="Point Trend time range"
            value={showCustomRange ? 'custom' : range}
            onChange={(event) => {
              if (event.target.value === 'custom') {
                onShowCustomRangeChange(true)
              } else {
                onRangeChange(event.target.value as OverviewTrendRange)
                onShowCustomRangeChange(false)
                onSelectedEventChange(null)
              }
            }}
          >
            {overviewTrendRanges.map((item) => (
              <option value={item.value} key={item.value}>
                {item.label}
              </option>
            ))}
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
                onChange={(e) => onCustomStartChange(e.target.value)}
                max={customEnd || undefined}
              />
            </label>
            <label>
              End
              <input
                type="datetime-local"
                value={customEnd}
                onChange={(e) => onCustomEndChange(e.target.value)}
                min={customStart || undefined}
              />
            </label>
            <button type="button" onClick={applyCustomRange} disabled={!customStart || !customEnd}>
              Apply
            </button>
            <button
              type="button"
              onClick={() => {
                onShowCustomRangeChange(false)
                onCustomStartChange('')
                onCustomEndChange('')
                onRangeChange('24h')
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Series legend */}
      <div className="overview-point-trend__legend" aria-label="Point Trend series">
        {series.map((item) => (
          <div className={`overview-point-trend__chip${focusedId === item.id ? ' is-focused' : ''}`} key={item.id}>
            <label>
              <input
                type="checkbox"
                checked={!hiddenIds.includes(item.id)}
                aria-label={`Show ${item.name}`}
                style={{ accentColor: item.color }}
                onChange={(event) =>
                  onHiddenIdsChange(
                    event.target.checked ? hiddenIds.filter((id) => id !== item.id) : [...hiddenIds, item.id]
                  )
                }
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
                onFocusedIdChange(focusedId === item.id ? null : item.id)
                onHiddenIdsChange(hiddenIds.filter((id) => id !== item.id))
                if (focusedId !== item.id) {
                  onScaleChange(1)
                  onScaleModeChange('auto')
                  onManualScaleMinChange('')
                  onManualScaleMaxChange('')
                  onShowScaleEditorChange(false)
                }
              }}
            >
              <Crosshair size={12} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>

      {/* Chart */}
      {visibleSeries.length ? (
        <PointTrendChart
          series={visibleSeries}
          samples={samples}
          start={start}
          end={overviewTrendEnd}
          focusedSeriesId={focusedId}
          scale={scale}
          events={events}
          onSelectEvent={onSelectedEventChange}
          onManualRangeSelect={handleManualRangeSelect}
        />
      ) : (
        <div className="overview-point-trend__empty">{series.length ? 'All series hidden' : 'No series selected'}</div>
      )}

      {/* Events */}
      <div className="overview-point-trend__events" aria-label="Point Trend events">
        {events.map((event) => (
          <button
            type="button"
            key={event.id}
            aria-pressed={selectedEvent?.id === event.id}
            title={`${event.kind}: ${formatTrendTimestamp(event.timestamp)} UTC. ${event.description}`}
            onMouseEnter={() => onSelectedEventChange(event)}
            onClick={() => onSelectedEventChange(event)}
          >
            <span style={{ backgroundColor: event.color }} aria-hidden="true" />
            {event.kind}
          </button>
        ))}
      </div>
      {selectedEvent && (
        <aside className="overview-point-trend__event-details" aria-live="polite">
          <div>
            <strong>{selectedEvent.kind}</strong>
            <time dateTime={new Date(selectedEvent.timestamp).toISOString()}>
              {formatTrendTimestamp(selectedEvent.timestamp)} UTC
            </time>
            <p>{selectedEvent.description}</p>
          </div>
          <button
            type="button"
            aria-label="Close Point Trend event"
            title="Close event"
            onClick={() => onSelectedEventChange(null)}
          >
            <X size={14} />
          </button>
        </aside>
      )}

      {/* Scale editor */}
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
                onChange={(event) => onScaleChange(Number(event.target.value))}
                disabled={scaleMode === 'manual' && manualScaleMin !== '' && manualScaleMax !== ''}
              />
            </label>
            <button
              type="button"
              title="Scale options"
              aria-label="Scale options"
              className="overview-point-trend__scale-menu-btn"
              onClick={() => onShowScaleEditorChange(!showScaleEditor)}
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
                  onChange={() => onScaleModeChange('auto')}
                />
                Auto scale
              </label>
              <label>
                <input
                  type="radio"
                  name="scale-mode"
                  value="manual"
                  checked={scaleMode === 'manual'}
                  onChange={() => onScaleModeChange('manual')}
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
                      onChange={(e) => onManualScaleMinChange(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Enter minimum"
                    />
                  </label>
                  <label>
                    Max
                    <input
                      type="number"
                      step="0.1"
                      value={manualScaleMax}
                      onChange={(e) => onManualScaleMaxChange(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Enter maximum"
                    />
                  </label>
                  <button type="button" onClick={applyManualScale} disabled={manualScaleMin === '' || manualScaleMax === ''}>
                    Apply
                  </button>
                </>
              )}
              <button type="button" onClick={resetScale}>
                Reset scale
              </button>
              <button type="button" onClick={() => onShowScaleEditorChange(false)}>
                Done
              </button>
            </div>
          )}
        </div>
      )}

      {/* Two-column lower controls */}
      <div className="overview-point-trend__lower-controls">
        {/* Left column: Trend View only */}
        <div className="overview-point-trend__lower-column overview-point-trend__lower-column--left">
          <h3 className="overview-point-trend__section-title">Trend View</h3>
          <select
            value={customTrendState.isActive ? 'custom' : activeView.id}
            onChange={(event) => {
              if (event.target.value === 'custom') {
                toggleCustomTrendMode()
              } else {
                selectView(event.target.value)
              }
            }}
            aria-label="Select trend view"
            className="overview-point-trend__trend-view-select"
          >
            <optgroup label="Pre-built trends">
              {state.views
                .filter((view) => !view.custom)
                .map((view) => (
                  <option value={view.id} key={view.id}>
                    {view.name}
                  </option>
                ))}
            </optgroup>
          </select>
        </div>

        {/* Right column: Create Custom Trend section and Add Point From (when in custom mode) */}
        {customTrendState.isActive && (
          <div className="overview-point-trend__lower-column overview-point-trend__lower-column--right">
            {/* Create Custom Trend as a heading only */}
            <h3 className="overview-point-trend__section-title overview-point-trend__create-custom-heading">
              Create Custom Trend
            </h3>

            {/* Add Point From section */}
            <div className="overview-point-trend__add-point-from-section">
              <h4 className="overview-point-trend__add-point-from-heading">Add Point From</h4>

              {/* Add point from controls */}
              <div className="overview-point-trend__add-point-from-controls" aria-label="Add point from">
                <label className="overview-point-trend__source-label">
                  <span className="overview-point-trend__sr-only">Point source</span>
                  <select
                    value={source}
                    onChange={(event) => {
                      onSourceChange(event.target.value as TrendSource)
                      onPointToAddChange('')
                      onSelectedRelatedEquipmentChange('')
                      onSelectedEquipmentIdsChange(new Set())
                      onShowWiderSiteDropdownChange(false)
                    }}
                    aria-label="Point source"
                    className="overview-point-trend__source-select"
                  >
                    {sources.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </label>

                {/* Current equipment: point selector */}
                {source === 'Current equipment' && (
                  <>
                    <label className="overview-point-trend__point-label">
                      <span className="overview-point-trend__sr-only">Point</span>
                      <select
                        value={pointToAdd}
                        onChange={(event) => onPointToAddChange(event.target.value)}
                        aria-label="Point to add"
                        className="overview-point-trend__point-select"
                    >
                      <option value="">Select point</option>
                      {availableSeries.map((item) => (
                        <option value={item.id} key={item.id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <button
                    type="button"
                    disabled={!pointToAdd}
                    onClick={addPointToCustomTrend}
                    className="overview-point-trend__add-point-btn"
                  >
                    <Plus size={16} aria-hidden="true" />
                    Add point
                  </button>
                  </>
                )}

                {/* Related equipment: equipment then point selector */}
                {source === 'Related equipment' && (
                  <>
                    <label className="overview-point-trend__equipment-label">
                      <span className="overview-point-trend__sr-only">Equipment</span>
                      <select
                        value={selectedRelatedEquipment}
                        onChange={(event) => {
                          onSelectedRelatedEquipmentChange(event.target.value)
                          onPointToAddChange('')
                        }}
                        aria-label="Related equipment"
                        className="overview-point-trend__equipment-select"
                      >
                        <option value="">Select equipment</option>
                        {relatedEquipmentOptions.map((item) => (
                          <option value={item.id} key={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </label>

                    {selectedRelatedEquipment && (
                      <>
                        <label className="overview-point-trend__point-label">
                          <span className="overview-point-trend__sr-only">Point</span>
                          <select
                            value={pointToAdd}
                            onChange={(event) => onPointToAddChange(event.target.value)}
                            aria-label="Point to add"
                            className="overview-point-trend__point-select"
                          >
                            <option value="">Select point</option>
                            {availableSeries.map((item) => (
                              <option value={item.id} key={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </label>
                        <button
                          type="button"
                          disabled={!pointToAdd}
                          onClick={addPointToCustomTrend}
                          className="overview-point-trend__add-point-btn"
                        >
                          <Plus size={16} aria-hidden="true" />
                          Add point
                        </button>
                      </>
                    )}
                  </>
                )}

                {/* Wider site: dropdown + point selector */}
                {source === 'Wider site' && (
                  <>
                    <div className="wider-site-dropdown-container">
                      <button
                        type="button"
                        className="wider-site-dropdown-trigger"
                        onClick={() => onShowWiderSiteDropdownChange(!showWiderSiteDropdown)}
                        aria-expanded={showWiderSiteDropdown}
                        aria-label="Select equipment"
                      >
                        {selectedEquipmentIds.size === 0
                          ? 'Select equipment'
                          : selectedEquipmentIds.size === 1
                            ? Array.from(selectedEquipmentIds)[0]
                            : `${selectedEquipmentIds.size} selected`}
                        <ChevronDown size={16} />
                      </button>

                      {showWiderSiteDropdown && (
                        <>
                          <div className="wider-site-dropdown-backdrop" onClick={() => onShowWiderSiteDropdownChange(false)} />
                          <div className="wider-site-dropdown-popover">
                            {renderEquipmentTree(equipmentHierarchy)}
                          </div>
                        </>
                      )}
                    </div>

                    {selectedEquipmentIds.size > 0 && (
                      <>
                        <label className="overview-point-trend__point-label">
                          <span className="overview-point-trend__sr-only">Point</span>
                          <select
                            value={pointToAdd}
                            onChange={(event) => onPointToAddChange(event.target.value)}
                            aria-label="Point to add"
                            className="overview-point-trend__point-select"
                          >
                            <option value="">Select point</option>
                            {availableSeries.map((item) => (
                              <option value={item.id} key={item.id}>
                                {item.name}
                              </option>
                            ))}
                          </select>
                        </label>
                        <button
                          type="button"
                          disabled={!pointToAdd}
                          onClick={addPointToCustomTrend}
                          className="overview-point-trend__add-point-btn"
                        >
                          <Plus size={16} aria-hidden="true" />
                          Add point
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Selected points below Add Point From controls */}
              {customTrendState.selectedPointIds.length > 0 && (
                <div className="overview-point-trend__selected-points">
                  {customTrendState.selectedPointIds.map((pointId) => {
                    const seriesItem = overviewTrendSeries.find((s) => s.id === pointId)
                    return seriesItem ? (
                      <button
                        key={pointId}
                        type="button"
                        className="overview-point-trend__selected-point-chip"
                        title={`Remove ${seriesItem.name}`}
                        onClick={() => removePointFromCustomTrend(pointId)}
                      >
                        {seriesItem.name}
                        <X size={14} aria-hidden="true" />
                      </button>
                    ) : null
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
