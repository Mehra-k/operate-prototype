import { useState } from 'react'
import { EquipmentHierarchy } from './components/EquipmentHierarchy.tsx'
import { EquipmentPage, type EquipmentTab } from './components/EquipmentPage.tsx'
import { DocumentsPanel } from './components/EquipmentResources.tsx'
import { ActiveAlarmSummary } from './components/ActiveAlarmSummary.tsx'
import { PointDetails } from './components/PointDetails.tsx'
import { PointsTable } from './components/PointsTable.tsx'
import { NotesTab } from './components/NotesTab.tsx'
import { OperateHeader } from './components/OperateHeader.tsx'
import { OperateOverview } from './components/OperateOverview.tsx'
import { FilteredPoints } from './components/FilteredPoints.tsx'
import { PrimaryNavigation } from './components/PrimaryNavigation.tsx'
import { PrototypeShell } from './components/PrototypeShell.tsx'
import { EquipmentGraphic } from './components/EquipmentGraphic.tsx'
import {
  findEquipmentPath,
  equipmentHierarchy,
  relatedEquipmentIds,
} from './data/equipment.ts'
import { operateOverviewData, type PointFilter } from './data/operateOverview.ts'
import { trendPointDetails } from './data/trends.ts'
import { overviewTrendPresets, pressureSetpointDetails, type OverviewTrendState } from './data/overviewTrends.ts'
import { initialEquipmentNotes } from './data/equipmentResources.ts'

export default function App() {
  type EquipmentContext = {
    selectedNodeId: string
    activeNavigation: string
    activeTab: EquipmentTab
    pointsFilter: PointFilter | null
    selectedPointId: string | null
  }
  type PointReturnContext = Pick<
    EquipmentContext,
    'activeNavigation' | 'activeTab' | 'pointsFilter'
  >

  const [selectedNodeId, setSelectedNodeId] = useState('ahu-sa-01')
  const [activeNavigation, setActiveNavigation] = useState('Equipment')
  const [activeTab, setActiveTab] = useState<EquipmentTab>('Operate')
  const [notes, setNotes] = useState(initialEquipmentNotes)
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null)
  const [pointsFilter, setPointsFilter] = useState<PointFilter | null>(null)
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null)
  const [equipmentHistory, setEquipmentHistory] = useState<EquipmentContext[]>([])
  const [pointReturnContext, setPointReturnContext] = useState<PointReturnContext | null>(null)
  const [pointTrendState, setPointTrendState] = useState<OverviewTrendState>(
    () => ({ views: overviewTrendPresets, activeViewId: overviewTrendPresets[0].id }),
  )
  const [notesOpen, setNotesOpen] = useState(true)
  const [relatedEquipmentOriginId, setRelatedEquipmentOriginId] = useState<string | null>(null)
  const selectedPath = findEquipmentPath(equipmentHierarchy, selectedNodeId) ?? []
  const selectedNode = selectedPath.at(-1)

  function navigateToEquipment(nodeId: string) {
    if (nodeId === selectedNodeId) {
      setActiveNavigation('Equipment')
      setActiveTab('Operate')
      setSelectedPointId(null)
      setPointsFilter(null)
      return
    }

    // If we're not already in a related equipment exploration, start one
    if (!relatedEquipmentOriginId) {
      setRelatedEquipmentOriginId(selectedNodeId)
    }

    setEquipmentHistory((history) => [
      ...history,
      { selectedNodeId, activeNavigation, activeTab, pointsFilter, selectedPointId },
    ])
    setSelectedNodeId(nodeId)
    setActiveNavigation('Equipment')
    setActiveTab('Operate')
    setSelectedPointId(null)
    setPointsFilter(null)
  }

  function returnToPreviousEquipment() {
    const previousContext = equipmentHistory.at(-1)
    if (!previousContext) return

    setSelectedNodeId(previousContext.selectedNodeId)
    setActiveNavigation(previousContext.activeNavigation)
    setActiveTab(previousContext.activeTab)
    setPointsFilter(previousContext.pointsFilter)
    setSelectedPointId(previousContext.selectedPointId)
    setEquipmentHistory((history) => history.slice(0, -1))
  }

  function returnToRelatedEquipmentOrigin() {
    if (!relatedEquipmentOriginId) return

    setSelectedNodeId(relatedEquipmentOriginId)
    setActiveNavigation('Equipment')
    setActiveTab('Operate')
    setSelectedPointId(null)
    setPointsFilter(null)
    setEquipmentHistory([])
    setRelatedEquipmentOriginId(null)
  }

  function openPointDetails(pointId: string) {
    setPointReturnContext({ activeNavigation, activeTab, pointsFilter })
    setSelectedPointId(pointId)
    setPointsFilter(null)
    setActiveTab('Points')
  }

  function showFilteredPoints(filter: PointFilter) {
    setSelectedPointId(null)
    setPointsFilter(filter)
    setActiveTab('Points')
  }

  function showAllAlarms() {
    setActiveNavigation('Alarms & Faults')
    showFilteredPoints('alarm')
  }

  function navigatePrimaryNavigation(label: string) {
    setActiveNavigation(label)
    if (label === 'Equipment') {
      setSelectedPointId(null)
      setPointsFilter(null)
      setActiveTab('Operate')
    } else if (label === 'Alarms & Faults') {
      setSelectedPointId(null)
      setPointsFilter('alarm')
      setActiveTab('Points')
    }
  }

  function returnToEquipment() {
    setSelectedPointId(null)
    setPointsFilter(pointReturnContext?.pointsFilter ?? null)
    setActiveTab(pointReturnContext?.activeTab ?? 'Operate')
    setActiveNavigation(pointReturnContext?.activeNavigation ?? 'Equipment')
    setPointReturnContext(null)
  }

  const selectedPoint = [
    ...operateOverviewData.keyPoints,
    ...trendPointDetails,
    pressureSetpointDetails,
  ].find((point) => point.id === selectedPointId)
  const previousEquipmentId = relatedEquipmentOriginId
  const previousEquipmentName = previousEquipmentId
    ? findEquipmentPath(equipmentHierarchy, previousEquipmentId)?.at(-1)?.name
    : undefined

  return (
    <PrototypeShell>
      <OperateHeader />
      <div className="app-body">
        <PrimaryNavigation
          activeItem={activeNavigation}
          onSelect={navigatePrimaryNavigation}
          alarmCount={operateOverviewData.activeAlarmCount}
        />
        <EquipmentHierarchy
          nodes={equipmentHierarchy}
          selectedNodeId={selectedNodeId}
          onSelect={navigateToEquipment}
        />
        <EquipmentPage
          equipmentName={selectedNode?.name ?? 'AHU-SA-01'}
          equipmentPath={selectedPath.map((node) => node.name)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          headerContent={activeTab === 'Operate' ? (
            <ActiveAlarmSummary
              onViewPoint={openPointDetails}
              onViewAllAlarms={showAllAlarms}
            />
          ) : null}
        >
          {activeTab === 'Operate' && (
            <OperateOverview
              onViewDevice={() => setActiveNavigation('Command Center')}
              onFilterPoints={showFilteredPoints}
              onViewPointDetails={openPointDetails}
              currentEquipmentId={selectedNodeId}
              relatedEquipmentVisible={relatedEquipmentIds.has(selectedNodeId)}
              previousEquipmentName={previousEquipmentName}
              onSelectRelatedEquipment={navigateToEquipment}
              onBackToPreviousEquipment={relatedEquipmentOriginId ? returnToRelatedEquipmentOrigin : returnToPreviousEquipment}
              pointTrendState={pointTrendState}
              onPointTrendStateChange={setPointTrendState}
              notes={notes}
              onNotesChange={setNotes}
              onViewDocuments={() => setActiveTab('Associated Documents')}
              notesOpen={notesOpen}
              onToggleNotes={setNotesOpen}
            />
          )}
          {activeTab === 'Points' && selectedPoint && (
            <PointDetails
              point={selectedPoint}
              equipmentName={selectedNode?.name ?? 'AHU-SA-01'}
              onBack={returnToEquipment}
            />
          )}
          {activeTab === 'Points' && !selectedPoint && pointsFilter && (
            <FilteredPoints filter={pointsFilter} />
          )}
          {activeTab === 'Points' && !selectedPoint && !pointsFilter && (
            <PointsTable onSelectPoint={openPointDetails} />
          )}
          {activeTab === 'Equipment Graphic' && (
            <EquipmentGraphic />
          )}
          {activeTab === 'Associated Documents' && (
            <DocumentsPanel selectedDocumentId={selectedDocumentId} onSelectDocument={setSelectedDocumentId} />
          )}
          {activeTab === 'Notes' && (
            <NotesTab notes={notes} onNotesChange={setNotes} />
          )}
        </EquipmentPage>
      </div>
    </PrototypeShell>
  )
}