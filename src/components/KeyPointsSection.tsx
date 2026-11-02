import { ArrowRight, ChevronRight } from 'lucide-react'
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
      </span>
      <span className="key-point-card__metadata">
        <span className="key-point-card__state">
          {point.state}
        </span>
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