import { lazy, Suspense } from 'react'
import { ChevronDown } from 'lucide-react'
import {
  ControllingDevicesCard,
  EquipmentPropertiesCard,
  EquipmentStateCard,
} from './EquipmentOverviewCards.tsx'
import { OperationalRollup } from './OperationalRollup.tsx'
import { KeyPointsSection } from './KeyPointsSection.tsx'
import type { PointFilter } from '../data/operateOverview.ts'
import { RelatedEquipment } from './RelatedEquipment.tsx'
import { EquipmentResources, type EquipmentNotesProps } from './EquipmentResources.tsx'
import type { OverviewTrendState } from '../data/overviewTrends.ts'

const PointTrendPanel = lazy(() => import('./PointTrendPanel.tsx'))

type OperateOverviewProps = EquipmentNotesProps & {
  onViewDevice: (deviceId: string) => void
  onFilterPoints: (filter: PointFilter) => void
  onViewPointDetails: (pointId: string) => void
  onViewDocuments: () => void
  currentEquipmentId: string
  relatedEquipmentVisible: boolean
  previousEquipmentName?: string
  onSelectRelatedEquipment: (equipmentId: string) => void
  onBackToPreviousEquipment: () => void
  pointTrendState: OverviewTrendState
  onPointTrendStateChange: (state: OverviewTrendState) => void
  notesOpen?: boolean
  onToggleNotes?: (open: boolean) => void
}

export function OperateOverview({
  onViewDevice,
  onFilterPoints,
  onViewPointDetails,
  currentEquipmentId,
  relatedEquipmentVisible,
  previousEquipmentName,
  onSelectRelatedEquipment,
  onBackToPreviousEquipment,
  pointTrendState,
  onPointTrendStateChange,
  notes,
  onNotesChange,
  onViewAllNotes,
  onViewDocuments,
  notesOpen = true,
  onToggleNotes,
}: OperateOverviewProps) {
  const containerClass = `operate-overview-container${notesOpen ? ' is-notes-open' : ''}`

  return (
    <div className={containerClass}>
      <div className="operate-overview">
        <div className="operate-overview__header">
          <h2 className="operate-overview__section-heading">Overview</h2>
          {!notesOpen && onToggleNotes && (
            <button
              className="operate-overview__notes-reopen-btn"
              onClick={() => onToggleNotes(true)}
              type="button"
              aria-label="Open Notes panel"
            >
              <ChevronDown size={16} aria-hidden="true" />
              Notes
            </button>
          )}
        </div>
        <nav className="operate-overview__mobile-shortcuts" aria-label="Troubleshooting shortcuts">
          <a href="#notes-heading">Notes</a>
          <a href="#field-information-heading">Field information</a>
          <button type="button" onClick={onViewDocuments}>Files</button>
          {relatedEquipmentVisible && <a href="#related-equipment-heading">Related equipment</a>}
        </nav>
        <div className="operate-overview__cards">
          <EquipmentPropertiesCard />
          <EquipmentStateCard />
          <ControllingDevicesCard onViewDevice={onViewDevice} />
        </div>
        <OperationalRollup onFilterPoints={onFilterPoints} />
        <KeyPointsSection
          onSelectPoint={onViewPointDetails}
        />
        {currentEquipmentId === 'ahu-sa-01' && (
          <Suspense fallback={<div className="overview-point-trend__loading" aria-label="Loading Point Trend" />}>
            <PointTrendPanel state={pointTrendState} onStateChange={onPointTrendStateChange} />
          </Suspense>
        )}
        {relatedEquipmentVisible && (
          <RelatedEquipment
            currentEquipmentId={currentEquipmentId}
            previousEquipmentName={previousEquipmentName}
            onSelectEquipment={onSelectRelatedEquipment}
            onBack={onBackToPreviousEquipment}
          />
        )}
      </div>
      <EquipmentResources notes={notes} onNotesChange={onNotesChange} onViewAllNotes={onViewAllNotes} notesOpen={notesOpen} onToggleNotes={onToggleNotes} />
    </div>
  )
}