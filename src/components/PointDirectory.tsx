import { ChevronRight } from 'lucide-react'
import { formatPointValue, operateOverviewData } from '../data/operateOverview.ts'

type PointDirectoryProps = {
  onSelectPoint: (pointId: string) => void
}

export function PointDirectory({ onSelectPoint }: PointDirectoryProps) {
  return (
    <section className="point-directory" aria-labelledby="point-directory-heading">
      <header className="point-directory__header">
        <h2 id="point-directory-heading">Points</h2>
        <span>{operateOverviewData.keyPoints.length} Key Points</span>
      </header>
      <div className="point-directory__list">
        {operateOverviewData.keyPoints.map((point) => (
          <button
            className="point-directory__row"
            key={point.id}
            type="button"
            onClick={() => onSelectPoint(point.id)}
          >
            <span className="point-directory__name">{point.pointName}</span>
            <span className="point-directory__value">
              {formatPointValue(point.value, point.unit)}
            </span>
            <span className={`point-directory__state is-${point.state.toLowerCase()}`}>
              {point.state}
            </span>
            <ChevronRight size={13} aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  )
}