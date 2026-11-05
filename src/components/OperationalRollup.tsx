import type { CSSProperties } from 'react'
import { useState } from 'react'
import { ArrowRight, TrendingUp } from 'lucide-react'
import { operateOverviewData, type PointFilter } from '../data/operateOverview.ts'

type OperationalRollupProps = {
  onFilterPoints: (filter: PointFilter) => void
}

type RollupStatus = (typeof operateOverviewData.operationalRollup)[number]

function RollupMetric({ status }: { status: RollupStatus }) {
  const percentage = Math.round((status.count / status.total) * 100)
  const progressStyle = { width: `${percentage}%` } satisfies CSSProperties
  const TrendIcon = status.trend.direction === 'up' ? TrendingUp : ArrowRight

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
      <span className="operational-rollup__trend">
        <span>Trend:</span>
        <TrendIcon size={12} aria-hidden="true" />
        <span>{status.trend.label} ({status.trend.change})</span>
      </span>
    </>
  )
}

function RollupPopover({ statusKey }: { statusKey: string }) {
  const keyPoints = operateOverviewData.keyPoints

  if (statusKey === 'alarm') {
    const alarmPoints = keyPoints.filter((p) => p.state === 'High' || p.state === 'Low')
    if (alarmPoints.length === 0) return null

    return (
      <div className="operational-rollup__popover">
        <div className="operational-rollup__popover-header">
          In alarm • {alarmPoints.length} points
        </div>
        <div className="operational-rollup__popover-content">
          {alarmPoints.map((point) => (
            <div key={point.id} className="operational-rollup__popover-item">
              <span className="operational-rollup__popover-name">{point.pointName}</span>
              <span className="operational-rollup__popover-value">
                {point.value} {point.unit}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (statusKey === 'override') {
    const overridePoints = keyPoints.filter((p) => p.state === 'Override')
    if (overridePoints.length === 0) return null

    return (
      <div className="operational-rollup__popover">
        <div className="operational-rollup__popover-header">
          In override • {overridePoints.length} points
        </div>
        <div className="operational-rollup__popover-content">
          {overridePoints.map((point) => (
            <div key={point.id} className="operational-rollup__popover-item">
              <span className="operational-rollup__popover-name">{point.pointName}</span>
              <span className="operational-rollup__popover-value">
                {point.value} {point.unit}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (statusKey === 'healthy') {
    const healthyPoints = keyPoints.filter((p) => p.state === 'Normal')
    if (healthyPoints.length === 0) return null

    return (
      <div className="operational-rollup__popover">
        <div className="operational-rollup__popover-header">
          Healthy • {healthyPoints.length} points
        </div>
        <div className="operational-rollup__popover-content operational-rollup__popover-content--compact">
          <span className="operational-rollup__popover-summary">
            All equipment operating within normal parameters
          </span>
        </div>
      </div>
    )
  }

  if (statusKey === 'down') {
    const downPoints = keyPoints.filter((p) => p.state === 'Down')
    if (downPoints.length === 0) return null

    return (
      <div className="operational-rollup__popover">
        <div className="operational-rollup__popover-header">
          Down • {downPoints.length} point
        </div>
        <div className="operational-rollup__popover-content">
          {downPoints.map((point) => (
            <div key={point.id} className="operational-rollup__popover-item">
              <span className="operational-rollup__popover-name">{point.pointName}</span>
              <span className="operational-rollup__popover-value">
                Communication lost
              </span>
              <span className="operational-rollup__popover-detail">
                Last communication: {point.updated}
              </span>
            </div>
          ))}
          <div className="operational-rollup__popover-summary">
            Communications failure
          </div>
        </div>
      </div>
    )
  }

  if (statusKey === 'fault') {
    const faultPoints = keyPoints.filter((p) => p.state === 'Fault')
    if (faultPoints.length === 0) return null

    return (
      <div className="operational-rollup__popover">
        <div className="operational-rollup__popover-header">
          Fault • {faultPoints.length} point
        </div>
        <div className="operational-rollup__popover-content">
          {faultPoints.map((point) => (
            <div key={point.id} className="operational-rollup__popover-item">
              <span className="operational-rollup__popover-name">{point.pointName}</span>
              <span className="operational-rollup__popover-value">
                {point.value} {point.unit}
              </span>
            </div>
          ))}
          <div className="operational-rollup__popover-summary">
            Sensor fault detected
          </div>
        </div>
      </div>
    )
  }

  if (statusKey === 'out-of-service') {
    const oosPoints = keyPoints.filter((p) => p.state === 'Out of Service')
    if (oosPoints.length === 0) return null

    return (
      <div className="operational-rollup__popover">
        <div className="operational-rollup__popover-header">
          Out of Service • {oosPoints.length} points
        </div>
        <div className="operational-rollup__popover-content">
          {oosPoints.map((point) => (
            <div key={point.id} className="operational-rollup__popover-item">
              <span className="operational-rollup__popover-name">{point.pointName}</span>
              <span className="operational-rollup__popover-value">
                Out of Service
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return null
}

function RollupItem({
  status,
  onFilterPoints,
}: {
  status: RollupStatus
  onFilterPoints: (filter: PointFilter) => void
}) {
  const [isHovering, setIsHovering] = useState(false)
  const shouldShowPopover = ['alarm', 'override', 'healthy', 'down', 'fault', 'out-of-service'].includes(status.key)

  if (status.filter) {
    return (
      <div
        className="operational-rollup__item-wrapper"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <button
          className={`operational-rollup__item is-${status.key}`}
          type="button"
          aria-label={`${status.label} ${status.count} / ${status.total}`}
          onClick={() => onFilterPoints(status.filter as PointFilter)}
        >
          <RollupMetric status={status} />
        </button>
        {shouldShowPopover && isHovering && (
          <RollupPopover statusKey={status.key} />
        )}
      </div>
    )
  }

  return (
    <div
      className="operational-rollup__item-wrapper"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className={`operational-rollup__item is-${status.key}`}>
        <RollupMetric status={status} />
      </div>
      {shouldShowPopover && isHovering && (
        <RollupPopover statusKey={status.key} />
      )}
    </div>
  )
}

export function OperationalRollup({ onFilterPoints }: OperationalRollupProps) {
  return (
    <section className="operational-rollup" aria-labelledby="operational-rollup-heading">
      <h2 id="operational-rollup-heading">Operational Roll-up</h2>
      <p className="operational-rollup__description">Trend shows change over last 24 h</p>
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