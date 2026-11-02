import type { CSSProperties } from 'react'
import { operateOverviewData, type PointFilter } from '../data/operateOverview.ts'

type OperationalRollupProps = {
  onFilterPoints: (filter: PointFilter) => void
}

type RollupStatus = (typeof operateOverviewData.operationalRollup)[number]

function RollupMetric({ status }: { status: RollupStatus }) {
  const percentage = Math.round((status.count / status.total) * 100)
  const progressStyle = { width: `${percentage}%` } satisfies CSSProperties

  return (
    <>
      <span className="operational-rollup__label">{status.label}</span>
      <span className="operational-rollup__count">
        {status.count} / {status.total}
      </span>
      <span
        className="operational-rollup__progress"
        role="progressbar"
        aria-label={`${status.label} points`}
        aria-valuemin={0}
        aria-valuemax={status.total}
        aria-valuenow={status.count}
      >
        <span style={progressStyle} />
      </span>
      <span className="operational-rollup__percentage">{percentage}%</span>
    </>
  )
}

function RollupItem({
  status,
  onFilterPoints,
}: {
  status: RollupStatus
  onFilterPoints: (filter: PointFilter) => void
}) {
  if (status.filter) {
    return (
      <button
        className={`operational-rollup__item is-${status.key}`}
        type="button"
        aria-label={`${status.label} ${status.count} / ${status.total}`}
        onClick={() => onFilterPoints(status.filter as PointFilter)}
      >
        <RollupMetric status={status} />
      </button>
    )
  }

  return (
    <div className={`operational-rollup__item is-${status.key}`}>
      <RollupMetric status={status} />
    </div>
  )
}

export function OperationalRollup({ onFilterPoints }: OperationalRollupProps) {
  return (
    <section className="operational-rollup" aria-labelledby="operational-rollup-heading">
      <h2 id="operational-rollup-heading">Operational Roll-up</h2>
      <div className="operational-rollup__items">
        {operateOverviewData.operationalRollup.map((status) => (
          <RollupItem
            key={status.key}
            status={status}
            onFilterPoints={onFilterPoints}
          />
        ))}
      </div>
    </section>
  )
}