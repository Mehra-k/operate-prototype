import { useRef, useState, useEffect } from 'react'
import { Maximize2, X } from 'lucide-react'
import { type OverviewTrendState, type OverviewTrendRange, type OverviewTrendEvent } from '../data/overviewTrends.ts'
import type { TrendSource } from '../data/trends.ts'
import { TrendWorkspace } from './TrendWorkspace.tsx'

type PointTrendPanelProps = {
  state: OverviewTrendState
  onStateChange: (state: OverviewTrendState) => void
}

export default function PointTrendPanel({ state, onStateChange }: PointTrendPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const expandButtonRef = useRef<HTMLButtonElement>(null)

  // Shared state for TrendWorkspace
  const [range, setRange] = useState<OverviewTrendRange>('24h')
  const [showCustomRange, setShowCustomRange] = useState(false)
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')
  const [hiddenIds, setHiddenIds] = useState<string[]>([])
  const [focusedId, setFocusedId] = useState<string | null>(null)
  const [scale, setScale] = useState(1)
  const [scaleMode, setScaleMode] = useState<'auto' | 'manual'>('auto')
  const [manualScaleMin, setManualScaleMin] = useState<number | ''>('')
  const [manualScaleMax, setManualScaleMax] = useState<number | ''>('')
  const [showScaleEditor, setShowScaleEditor] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<OverviewTrendEvent | null>(null)
  const [customTrendState, setCustomTrendState] = useState({ isActive: false, selectedPointIds: [] as string[] })
  const [source, setSource] = useState<TrendSource>('Current equipment')
  const [pointToAdd, setPointToAdd] = useState('')
  const [selectedRelatedEquipment, setSelectedRelatedEquipment] = useState('')
  const [selectedEquipmentIds, setSelectedEquipmentIds] = useState(new Set<string>())
  const [expandedTreeNodes, setExpandedTreeNodes] = useState(new Set<string>())
  const [showWiderSiteDropdown, setShowWiderSiteDropdown] = useState(false)

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isExpanded) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeExpandedModal()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isExpanded])

  function resetAll() {
    // Reset all state to defaults
    setHiddenIds([])
    setFocusedId(null)
    setSelectedEvent(null)
    setScale(1)
    setScaleMode('auto')
    setManualScaleMin('')
    setManualScaleMax('')
    setShowScaleEditor(false)
    setShowCustomRange(false)
    setCustomStart('')
    setCustomEnd('')
    setRange('24h')
    setPointToAdd('')
    setCustomTrendState({ isActive: false, selectedPointIds: [] })
    setSource('Current equipment')
    setSelectedRelatedEquipment('')
    setSelectedEquipmentIds(new Set())
    setExpandedTreeNodes(new Set())
    setShowWiderSiteDropdown(false)

    // Reset view to default
    onStateChange({ ...state, activeViewId: state.views[0].id })
  }

  function openExpandedModal() {
    setIsExpanded(true)
  }

  function closeExpandedModal() {
    setIsExpanded(false)
    expandButtonRef.current?.focus()
  }

  const activeView = state.views.find((view) => view.id === state.activeViewId) ?? state.views[0]

  return (
    <>
      <section className="overview-point-trend" aria-labelledby="overview-point-trend-heading">
        <header className="overview-point-trend__header">
          <h2 id="overview-point-trend-heading">
            {customTrendState.isActive ? 'Custom Trend' : activeView.name}
          </h2>
          <div className="overview-point-trend__header-actions">
            <button
              ref={expandButtonRef}
              type="button"
              title="Expand trend"
              aria-label="Expand trend"
              onClick={openExpandedModal}
              className="overview-point-trend__expand-btn"
            >
              <Maximize2 size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={resetAll}
              className="overview-point-trend__reset-btn"
              title="Reset all selections and settings"
            >
              Reset
            </button>
          </div>
        </header>

        <TrendWorkspace
          mode="inline"
          state={state}
          onStateChange={onStateChange}
          range={range}
          onRangeChange={setRange}
          showCustomRange={showCustomRange}
          onShowCustomRangeChange={setShowCustomRange}
          customStart={customStart}
          onCustomStartChange={setCustomStart}
          customEnd={customEnd}
          onCustomEndChange={setCustomEnd}
          hiddenIds={hiddenIds}
          onHiddenIdsChange={setHiddenIds}
          focusedId={focusedId}
          onFocusedIdChange={setFocusedId}
          scale={scale}
          onScaleChange={setScale}
          scaleMode={scaleMode}
          onScaleModeChange={setScaleMode}
          manualScaleMin={manualScaleMin}
          onManualScaleMinChange={setManualScaleMin}
          manualScaleMax={manualScaleMax}
          onManualScaleMaxChange={setManualScaleMax}
          showScaleEditor={showScaleEditor}
          onShowScaleEditorChange={setShowScaleEditor}
          selectedEvent={selectedEvent}
          onSelectedEventChange={setSelectedEvent}
          customTrendState={customTrendState}
          onCustomTrendStateChange={setCustomTrendState}
          source={source}
          onSourceChange={setSource}
          pointToAdd={pointToAdd}
          onPointToAddChange={setPointToAdd}
          selectedRelatedEquipment={selectedRelatedEquipment}
          onSelectedRelatedEquipmentChange={setSelectedRelatedEquipment}
          selectedEquipmentIds={selectedEquipmentIds}
          onSelectedEquipmentIdsChange={setSelectedEquipmentIds}
          expandedTreeNodes={expandedTreeNodes}
          onExpandedTreeNodesChange={setExpandedTreeNodes}
          showWiderSiteDropdown={showWiderSiteDropdown}
          onShowWiderSiteDropdownChange={setShowWiderSiteDropdown}
        />
      </section>

      {isExpanded && (
        <>
          <div
            className="overview-point-trend__modal-backdrop"
            onClick={() => closeExpandedModal()}
            aria-hidden="true"
          />
          <div
            className="overview-point-trend__modal"
            role="dialog"
            aria-labelledby="expanded-trend-title"
            aria-modal="true"
          >
            <header className="overview-point-trend__modal-header">
              <h2 id="expanded-trend-title">{customTrendState.isActive ? 'Custom Trend' : activeView.name}</h2>
              <div className="overview-point-trend__modal-actions">
                <button
                  type="button"
                  onClick={resetAll}
                  className="overview-point-trend__reset-btn"
                  title="Reset all selections and settings"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={closeExpandedModal}
                  aria-label="Close expanded trend view"
                  title="Close"
                  className="overview-point-trend__modal-close"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
            </header>

            <div className="overview-point-trend__modal-body">
              <TrendWorkspace
                mode="expanded"
                state={state}
                onStateChange={onStateChange}
                range={range}
                onRangeChange={setRange}
                showCustomRange={showCustomRange}
                onShowCustomRangeChange={setShowCustomRange}
                customStart={customStart}
                onCustomStartChange={setCustomStart}
                customEnd={customEnd}
                onCustomEndChange={setCustomEnd}
                hiddenIds={hiddenIds}
                onHiddenIdsChange={setHiddenIds}
                focusedId={focusedId}
                onFocusedIdChange={setFocusedId}
                scale={scale}
                onScaleChange={setScale}
                scaleMode={scaleMode}
                onScaleModeChange={setScaleMode}
                manualScaleMin={manualScaleMin}
                onManualScaleMinChange={setManualScaleMin}
                manualScaleMax={manualScaleMax}
                onManualScaleMaxChange={setManualScaleMax}
                showScaleEditor={showScaleEditor}
                onShowScaleEditorChange={setShowScaleEditor}
                selectedEvent={selectedEvent}
                onSelectedEventChange={setSelectedEvent}
                customTrendState={customTrendState}
                onCustomTrendStateChange={setCustomTrendState}
                source={source}
                onSourceChange={setSource}
                pointToAdd={pointToAdd}
                onPointToAddChange={setPointToAdd}
                selectedRelatedEquipment={selectedRelatedEquipment}
                onSelectedRelatedEquipmentChange={setSelectedRelatedEquipment}
                selectedEquipmentIds={selectedEquipmentIds}
                onSelectedEquipmentIdsChange={setSelectedEquipmentIds}
                expandedTreeNodes={expandedTreeNodes}
                onExpandedTreeNodesChange={setExpandedTreeNodes}
                showWiderSiteDropdown={showWiderSiteDropdown}
                onShowWiderSiteDropdownChange={setShowWiderSiteDropdown}
              />
            </div>
          </div>
        </>
      )}
    </>
  )
}
