import { lazy, Suspense } from 'react'
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
  onViewAllPoints: () => void
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
  onViewAllPoints,
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
  onViewDocuments,
  notesOpen = true,
  onToggleNotes,
}: OperateOverviewProps) {
  const containerClass = `operate-overview-container${notesOpen ? ' is-notes-open' : ''}`

  return (
    <div className={containerClass}>
      <div className="operate-overview">
        <h2 className="operate-overview__section-heading">Overview</h2>
        <nav className="operate-overview__mobile-shortcuts" aria-label="Troubleshooting shortcuts">
          <a href="#notes-heading">Notes</a>
          <a href="#field-information-heading">Field information</a>
          <button type="button" onClick={onViewDocuments}>Documents</button>
          {relatedEquipmentVisible && <a href="#related-equipment-heading">Related equipment</a>}
        </nav>
        <div className="operate-overview__cards">
          <EquipmentPropertiesCard />
          <ControllingDevicesCard onViewDevice={onViewDevice} />
          <EquipmentStateCard />
        </div>
        <OperationalRollup onFilterPoints={onFilterPoints} />
        <KeyPointsSection
          onViewAllPoints={onViewAllPoints}
          onSelectPoint={onViewPointDetails}
        />
        {currentEquipmentId === 'ahu-sa-01' && (
          <Suspense fallback={<div className="overview-point-trend__loading" aria-label="Loading Point Trend" />}>
            <PointTrendPanel state={pointTrendState} onStateChange={onPointTrendStateChange} onViewPoint={onViewPointDetails} />
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
      <EquipmentResources notes={notes} onNotesChange={onNotesChange} notesOpen={notesOpen} onToggleNotes={onToggleNotes} />
    </div>
  )
}