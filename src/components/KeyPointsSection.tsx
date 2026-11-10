import { useRef, useState } from 'react'
import { ChevronRight, Settings2, X } from 'lucide-react'
import {
  formatPointValue,
  getPointStatuses,
  operateOverviewData,
  type KeyPoint,
} from '../data/operateOverview.ts'
import { PointStatusChips } from './PointStatusChips.tsx'

type KeyPointsSectionProps = {
  onSelectPoint: (pointId: string) => void
}

function KeyPointCard({
  point,
  onSelectPoint,
}: {
  point: KeyPoint
  onSelectPoint: (pointId: string) => void
}) {
  const stateClass = point.state.toLowerCase()

  return (
    <button
      className={`key-point-card is-${stateClass}`}
      type="button"
      aria-label={`View ${point.pointName}: ${formatPointValue(point.value, point.unit)}, ${getPointStatuses(point).join(', ')}`}
      onClick={() => onSelectPoint(point.id)}
    >
      <span className="key-point-card__heading">
        <span>{point.pointName}</span>
        <ChevronRight size={13} aria-hidden="true" />
      </span>
      <PointStatusChips point={point} />
      <span className={`key-point-card__reading${point.unit === '%' ? ' is-percent' : ''}`}>
        <span>{point.value}</span>
        <small>{point.unit}</small>
      </span>
      <span className="key-point-card__metadata">
        <span className="key-point-card__updated">{point.updated}</span>
      </span>
    </button>
  )
}

export function KeyPointsSection({
  onSelectPoint,
}: KeyPointsSectionProps) {
  const customizeDialog = useRef<HTMLDialogElement>(null)
  const customizeButtonRef = useRef<HTMLButtonElement>(null)
  
  // Applied selection (persisted)
  const [appliedKeyPointIds, setAppliedKeyPointIds] = useState<Set<string>>(
    new Set(operateOverviewData.keyPoints.map(p => p.id))
  )
  
  // Draft selection (only during customization)
  const [draftKeyPointIds, setDraftKeyPointIds] = useState<Set<string>>(
    new Set(appliedKeyPointIds)
  )

  function handleOpenCustomise() {
    // Copy applied selection to draft
    setDraftKeyPointIds(new Set(appliedKeyPointIds))
    // Open dialog
    customizeDialog.current?.showModal()
  }

  function handleCancelCustomise() {
    // Discard draft changes
    setDraftKeyPointIds(new Set(appliedKeyPointIds))
    // Close dialog
    customizeDialog.current?.close()
    // Restore focus to button
    customizeButtonRef.current?.focus()
  }

  function handleCheckboxChange(pointId: string, checked: boolean) {
    const newDraft = new Set(draftKeyPointIds)
    if (checked) {
      newDraft.add(pointId)
    } else {
      newDraft.delete(pointId)
    }
    setDraftKeyPointIds(newDraft)
  }

  function handleApplyCustomise() {
    // Apply draft selection
    setAppliedKeyPointIds(new Set(draftKeyPointIds))
    // Close dialog
    customizeDialog.current?.close()
    // Restore focus to button
    customizeButtonRef.current?.focus()
  }

  function handleDialogCancel() {
    // Handle native dialog cancel (Escape key)
    handleCancelCustomise()
  }

  const visibleKeyPoints = operateOverviewData.keyPoints.filter(p => appliedKeyPointIds.has(p.id))

  return (
    <>
      <section className="key-points" aria-labelledby="key-points-heading">
        <header className="key-points__header">
          <h2 id="key-points-heading">Key Points</h2>
          <button
            ref={customizeButtonRef}
            className="key-points__customize"
            type="button"
            onClick={handleOpenCustomise}
            aria-label="Customize Key Points"
          >
            <Settings2 size={11} aria-hidden="true" />
            Customise
          </button>
        </header>
        <div className="key-points__grid">
          {visibleKeyPoints.map((point) => (
            <KeyPointCard
              key={point.id}
              point={point}
              onSelectPoint={onSelectPoint}
            />
          ))}
        </div>
      </section>

      <dialog
        className="key-points-customize"
        ref={customizeDialog}
        aria-labelledby="customize-key-points-heading"
        onCancel={handleDialogCancel}
      >
        <header>
          <h3 id="customize-key-points-heading">Customise Key Points</h3>
          <button
            type="button"
            aria-label="Close customization"
            title="Close"
            onClick={handleCancelCustomise}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </header>
        <div className="key-points-customize__list">
          {operateOverviewData.keyPoints.map((point) => (
            <label key={point.id}>
              <input
                type="checkbox"
                checked={draftKeyPointIds.has(point.id)}
                onChange={(event) => handleCheckboxChange(point.id, event.target.checked)}
              />
              <span className="key-points-customize__point-name">{point.pointName}</span>
              <span className="key-points-customize__point-value">
                {formatPointValue(point.value, point.unit)}
              </span>
              <PointStatusChips point={point} />
            </label>
          ))}
        </div>
        <footer>
          <button type="button" onClick={handleCancelCustomise}>
            Cancel
          </button>
          <button type="button" onClick={handleApplyCustomise} disabled={draftKeyPointIds.size === 0} className="key-points-customize__apply">
            Apply
          </button>
        </footer>
      </dialog>
    </>
  )
}