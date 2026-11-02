import { ArrowRight, ChevronRight, TrendingDown, TrendingUp } from 'lucide-react'
import {
  formatPointValue,
  operateOverviewData,
  type KeyPoint,
} from '../data/operateOverview.ts'

type KeyPointsSectionProps = {
  onViewAllPoints: () => void
  onSelectPoint: (pointId: string) => void
}

function KeyPointCard({
  point,
  onSelectPoint,
}: {
  point: KeyPoint
  onSelectPoint: (pointId: string) => void
}) {
  const activeAlarm = operateOverviewData.activeAlarms.find(
    (alarm) => alarm.id === point.id,
  )
  const TrendIcon = point.trend === 'down' ? TrendingDown : TrendingUp
  const stateClass = point.state.toLowerCase()

  return (
    <button
      className={`key-point-card is-${stateClass}`}
      type="button"
      aria-label={`View ${point.pointName}: ${formatPointValue(point.value, point.unit)}, ${point.state}`}
      onClick={() => onSelectPoint(point.id)}
    >
      <span className="key-point-card__heading">
        <span>{point.pointName}</span>
        <ChevronRight size={13} aria-hidden="true" />
      </span>
      <span className={`key-point-card__reading${point.unit === '%' ? ' is-percent' : ''}`}>
        <span>{point.value}</span>
        <small>{point.unit}</small>
        <TrendIcon size={17} aria-hidden="true" />
      </span>
      <span className="key-point-card__metadata">
        <span className="key-point-card__state">
          <span aria-hidden="true" />
          {point.state}
        </span>
        {activeAlarm ? (
          <span className="key-point-card__condition">{activeAlarm.condition}</span>
        ) : point.setpoint ? (
          <span className="key-point-card__setpoint">SP: {point.setpoint}</span>
        ) : null}
        <span className="key-point-card__updated">{point.updated}</span>
      </span>
    </button>
  )
}

export function KeyPointsSection({
  onViewAllPoints,
  onSelectPoint,
}: KeyPointsSectionProps) {
  return (
    <section className="key-points" aria-labelledby="key-points-heading">
      <header className="key-points__header">
        <h2 id="key-points-heading">Key Points</h2>
        <button type="button" onClick={onViewAllPoints}>
          View all points
          <ArrowRight size={13} aria-hidden="true" />
        </button>
      </header>
      <div className="key-points__grid">
        {operateOverviewData.keyPoints.map((point) => (
          <KeyPointCard
            key={point.id}
            point={point}
            onSelectPoint={onSelectPoint}
          />
        ))}
      </div>
    </section>
  )
}