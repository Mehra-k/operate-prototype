import { getPointStatuses, type KeyPoint, type PointStatus } from '../data/operateOverview.ts'

const statusClasses: Record<PointStatus, string> = {
  'Healthy': 'normal',
  'In Alarm': 'alarm',
  'In Override': 'override',
  'Down': 'down',
  'Fault': 'fault',
  'Out of Service': 'oos',
}

export function PointStatusChips({ point }: { point: KeyPoint }) {
  return (
    <span className="point-status-chips">
      {getPointStatuses(point).map((status) => (
        <span key={status} className={`points-table__status point-status-chip is-${statusClasses[status]}`}>{status}</span>
      ))}
    </span>
  )
}