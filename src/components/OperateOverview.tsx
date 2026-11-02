import {
  ControllingDevicesCard,
  EquipmentPropertiesCard,
  EquipmentStateCard,
} from './EquipmentOverviewCards.tsx'
import { OperationalRollup } from './OperationalRollup.tsx'
import { KeyPointsSection } from './KeyPointsSection.tsx'
import type { PointFilter } from '../data/operateOverview.ts'
import { RelatedEquipment } from './RelatedEquipment.tsx'
import { EquipmentResources } from './EquipmentResources.tsx'

type OperateOverviewProps = {
  onViewDevice: (deviceId: string) => void
  onFilterPoints: (filter: PointFilter) => void
  onViewAllPoints: () => void
  onViewPointDetails: (pointId: string) => void
  currentEquipmentId: string
  relatedEquipmentVisible: boolean
  previousEquipmentName?: string
  onSelectRelatedEquipment: (equipmentId: string) => void
  onBackToPreviousEquipment: () => void
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
}: OperateOverviewProps) {
  return (
    <div className="operate-overview">
      <h2 className="operate-overview__section-heading">Overview</h2>
      <nav className="operate-overview__mobile-shortcuts" aria-label="Troubleshooting shortcuts">
        <a href="#notes-heading">Notes</a>
        <a href="#field-information-heading">Field information</a>
        <a href="#documents-heading">Documents</a>
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
      {relatedEquipmentVisible && (
        <RelatedEquipment
          currentEquipmentId={currentEquipmentId}
          previousEquipmentName={previousEquipmentName}
          onSelectEquipment={onSelectRelatedEquipment}
          onBack={onBackToPreviousEquipment}
        />
      )}
      <EquipmentResources />
    </div>
  )
}