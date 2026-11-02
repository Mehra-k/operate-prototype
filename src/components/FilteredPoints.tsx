import { AlertTriangle } from 'lucide-react'
import {
  formatPointValue,
  getKeyPoint,
  operateOverviewData,
  overriddenPointId,
  type PointFilter,
} from '../data/operateOverview.ts'

type FilteredPointsProps = {
  filter: PointFilter
}

export function FilteredPoints({ filter }: FilteredPointsProps) {
  const isAlarmFilter = filter === 'alarm'
  const overriddenPoint = operateOverviewData.keyPoints.find(
    (point) => point.id === overriddenPointId,
  )
  const points = isAlarmFilter
    ? operateOverviewData.activeAlarms.flatMap((alarm) => {
        const point = getKeyPoint(alarm.id)
        return point
          ? [{
              id: alarm.id,
              pointName: point.pointName,
              currentValue: formatPointValue(point.value, point.unit),
              status: alarm.condition,
            }]
          : []
      })
    : overriddenPoint
      ? [{
          id: overriddenPoint.id,
          pointName: overriddenPoint.pointName,
          currentValue: formatPointValue(overriddenPoint.value, overriddenPoint.unit),
          status: 'In Override',
        }]
      : []
  const heading = isAlarmFilter ? 'In Alarm' : 'In Override'

  return (
    <section className="filtered-points" aria-labelledby="filtered-points-heading">
      <header className="filtered-points__header">
        <h2 id="filtered-points-heading">{heading}</h2>
        <span>{points.length} {points.length === 1 ? 'point' : 'points'}</span>
      </header>
      <div className="filtered-points__table" role="table" aria-label={`${heading} points`}>
        <div className="filtered-points__columns" role="row">
          <span role="columnheader">Point</span>
          <span role="columnheader">Current Value</span>
          <span role="columnheader">Status</span>
        </div>
        {points.map((point) => (
          <div className="filtered-points__row" role="row" key={point.id}>
            <span className="filtered-points__name" role="cell">
              {!isAlarmFilter && <AlertTriangle size={12} aria-hidden="true" />}
              {point.pointName}
            </span>
            <span role="cell">{point.currentValue}</span>
            <span
              className={`filtered-points__status${isAlarmFilter ? ' is-alarm' : ' is-override'}`}
              role="cell"
            >
              {point.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}