import { lazy, Suspense, useState } from 'react'
import { EquipmentHierarchy } from './components/EquipmentHierarchy.tsx'
import { EquipmentPage } from './components/EquipmentPage.tsx'
import { ActiveAlarmSummary } from './components/ActiveAlarmSummary.tsx'
import { PointDetails } from './components/PointDetails.tsx'
import { PointDirectory } from './components/PointDirectory.tsx'
import { OperateHeader } from './components/OperateHeader.tsx'
import { OperateOverview } from './components/OperateOverview.tsx'
import { FilteredPoints } from './components/FilteredPoints.tsx'
import { PrimaryNavigation } from './components/PrimaryNavigation.tsx'
import { PrototypeShell } from './components/PrototypeShell.tsx'
import {
  findEquipmentPath,
  equipmentHierarchy,
  relatedEquipmentIds,
} from './data/equipment.ts'
import { operateOverviewData, type PointFilter } from './data/operateOverview.ts'
import { trendPointDetails } from './data/trends.ts'

const TrendsExperience = lazy(() => import('./components/TrendsExperience.tsx'))

export default function App() {
  type EquipmentContext = {
    selectedNodeId: string
    activeNavigation: string
    activeTab: 'Operate' | 'Points' | 'Trends'
    pointsFilter: PointFilter | null
    selectedPointId: string | null
  }
  type PointReturnContext = Pick<
    EquipmentContext,
    'activeNavigation' | 'activeTab' | 'pointsFilter'
  >

  const [selectedNodeId, setSelectedNodeId] = useState('ahu-sa-01')
  const [activeNavigation, setActiveNavigation] = useState('Equipment')
  const [activeTab, setActiveTab] = useState<'Operate' | 'Points' | 'Trends'>('Operate')
  const [pointsFilter, setPointsFilter] = useState<PointFilter | null>(null)
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null)
  const [equipmentHistory, setEquipmentHistory] = useState<EquipmentContext[]>([])
  const [pointReturnContext, setPointReturnContext] = useState<PointReturnContext | null>(null)
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
    } else if (label === 'Trends') {
      setSelectedPointId(null)
      setPointsFilter(null)
      setActiveTab('Trends')
    } else if (label === 'Alarms & Faults') {
      setSelectedPointId(null)
      setPointsFilter('alarm')
      setActiveTab('Points')
    }
  }

  function showAllPoints() {
    setSelectedPointId(null)
    setPointsFilter(null)
    setActiveTab('Points')
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
  ].find((point) => point.id === selectedPointId)
  const previousEquipmentId = equipmentHistory.at(-1)?.selectedNodeId
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
              onViewAllPoints={showAllPoints}
              onViewPointDetails={openPointDetails}
              currentEquipmentId={selectedNodeId}
              relatedEquipmentVisible={relatedEquipmentIds.has(selectedNodeId)}
              previousEquipmentName={previousEquipmentName}
              onSelectRelatedEquipment={navigateToEquipment}
              onBackToPreviousEquipment={returnToPreviousEquipment}
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
            <PointDirectory onSelectPoint={openPointDetails} />
          )}
          {activeTab === 'Trends' && (
            <Suspense fallback={null}>
              <TrendsExperience onViewPoint={openPointDetails} />
            </Suspense>
          )}
        </EquipmentPage>
      </div>
    </PrototypeShell>
  )
}