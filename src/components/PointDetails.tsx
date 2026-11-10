import { ArrowLeft } from 'lucide-react'
import {
  formatPointValue,
  getPointStatuses,
  operateOverviewData,
  type KeyPoint,
} from '../data/operateOverview.ts'
import { PointStatusChips } from './PointStatusChips.tsx'

type PointDetailsProps = {
  point: KeyPoint
  equipmentName: string
  onBack: () => void
}

export function PointDetails({ point, equipmentName, onBack }: PointDetailsProps) {
  const alarm = operateOverviewData.activeAlarms.find(
    (activeAlarm) => activeAlarm.id === point.id,
  )

  return (
    <div className={`point-details is-${point.state.toLowerCase()}`}>
      <button className="point-details__back" type="button" onClick={onBack}>
        <ArrowLeft size={14} aria-hidden="true" />
        Back to {equipmentName}
      </button>
      <header className="point-details__header">
        <h2>{point.pointName}</h2>
        <PointStatusChips point={point} />
      </header>
      <section className="point-details__summary" aria-label="Point status">
        <div>
          <span>Current Value</span>
          <strong aria-label={formatPointValue(point.value, point.unit)}>
            {point.value}{point.unit === '%' ? '' : ' '}<small>{point.unit}</small>
          </strong>
        </div>
        <div>
          <span>{alarm ? 'Alarm State' : 'Point State'}</span>
          <strong className="point-details__status-text">{alarm ? alarm.condition : getPointStatuses(point).join(', ')}</strong>
        </div>
        {alarm && (
          <div>
            <span>Alarm Began</span>
            <strong>{alarm.timestamp} <small>({alarm.duration})</small></strong>
          </div>
        )}
      </section>
      <div className="point-details__sections">
        <section className="point-detail-panel point-detail-panel--trend">
          <h3>Point Trend</h3>
          <div className="point-details__trend-placeholder" aria-label="Point trend placeholder" />
        </section>
        <section className="point-detail-panel">
          <h3>Point Configuration and Alarm Parameters</h3>
          <dl className="point-details__parameters">
            {point.setpoint && (
              <div>
                <dt>Setpoint</dt>
                <dd>{point.setpoint}</dd>
              </div>
            )}
            {alarm && (
              <div>
                <dt>Alarm Condition</dt>
                <dd className="point-details__alarm-message">{alarm.condition}</dd>
              </div>
            )}
          </dl>
        </section>
        <section className="point-detail-panel">
          <h3>Alarm History</h3>
          {alarm && (
            <div className="point-details__history-row">
              <span>{alarm.timestamp}</span>
              <span className="point-details__alarm-message">{alarm.condition}</span>
              <span>{alarm.duration}</span>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}