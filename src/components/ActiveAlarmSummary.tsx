import { useState } from 'react'
import { Bell, ArrowRight, CheckCircle2, ChevronRight, CircleX, ArrowDown, ArrowUp } from 'lucide-react'
import {
  formatPointValue,
  getKeyPoint,
  operateOverviewData,
} from '../data/operateOverview.ts'

type ActiveAlarmSummaryProps = {
  onViewPoint: (pointId: string) => void
  onViewAllAlarms: () => void
}

export function ActiveAlarmSummary({
  onViewPoint,
  onViewAllAlarms,
}: ActiveAlarmSummaryProps) {
  const { activeAlarmCount, alarmDescription, activeAlarms } = operateOverviewData

  return (
    <section className="active-alarm-summary" aria-labelledby="active-alarms-heading">
      <header className="active-alarm-summary__header">
        <Bell
          className="active-alarm-summary__icon"
          size={18}
          fill="currentColor"
          aria-hidden="true"
        />
        <div className="active-alarm-summary__heading-copy">
          <h2 id="active-alarms-heading">{activeAlarmCount} Active Alarms</h2>
          <p>{alarmDescription}</p>
        </div>
        <button
          className="active-alarm-summary__all-action"
          type="button"
          onClick={onViewAllAlarms}
        >
          View all alarms ({activeAlarmCount})
          <ArrowRight size={13} aria-hidden="true" />
        </button>
      </header>
      <div className="active-alarm-summary__table" role="table" aria-label="Active alarms">
        <div className="active-alarm-summary__columns" role="row">
          <span role="columnheader">Point</span>
          <span role="columnheader">Alarm Message</span>
          <span role="columnheader">Acknowledge</span>
          <span role="columnheader">Clear</span>
          <span role="columnheader">Current Value</span>
          <span role="columnheader">Time in Alarm</span>
          <span role="columnheader">Action</span>
        </div>
        {activeAlarms.map((alarm) => (
          <AlarmRow alarm={alarm} onViewPoint={onViewPoint} key={alarm.id} />
        ))}
      </div>
    </section>
  )
}

function AlarmRow({
  alarm,
  onViewPoint,
}: {
  alarm: (typeof operateOverviewData.activeAlarms)[number]
  onViewPoint: (pointId: string) => void
}) {
  const point = getKeyPoint(alarm.id)
  const [acknowledged, setAcknowledged] = useState(false)
  const [clearRequested, setClearRequested] = useState(false)

  // Detect Low/High alarms
  const isLow = alarm.condition.toLowerCase().startsWith('low')
  const isHigh = alarm.condition.toLowerCase().startsWith('high')

  return (
    <div className={`active-alarm-summary__row is-${point?.state.toLowerCase() ?? 'alarm'}`} role="row">
      <span className="active-alarm-summary__point" role="cell">
        {point?.pointName ?? alarm.id}
      </span>
      <span className="active-alarm-summary__condition" role="cell">
        {isLow && <ArrowDown size={11} aria-hidden="true" />}
        {isHigh && <ArrowUp size={11} aria-hidden="true" />}
        {alarm.condition}
      </span>
      <span className="active-alarm-summary__acknowledge" role="cell">
        <button
          className="alarm-status-action"
          type="button"
          aria-label={`Acknowledge ${point?.pointName ?? alarm.id}`}
          aria-pressed={acknowledged}
          title={acknowledged ? 'Acknowledged locally' : 'Acknowledge alarm'}
          onClick={() => setAcknowledged((current) => !current)}
        >
          <CheckCircle2 size={13} aria-hidden="true" />
        </button>
      </span>
      <span className="active-alarm-summary__clear" role="cell">
        <button
          className="alarm-status-action"
          type="button"
          aria-label={`Request clear ${point?.pointName ?? alarm.id}`}
          aria-pressed={clearRequested}
          title={clearRequested ? 'Clear requested locally' : 'Request alarm clear'}
          onClick={() => setClearRequested((current) => !current)}
        >
          <CircleX size={13} aria-hidden="true" />
        </button>
      </span>
      <span className="active-alarm-summary__value" role="cell">
        {point ? formatPointValue(point.value, point.unit) : '—'}
      </span>
      <span className="active-alarm-summary__time" role="cell">
        <span>{alarm.timestamp}</span>
        <span className="active-alarm-summary__duration">({alarm.duration})</span>
      </span>
      <span className="active-alarm-summary__action-cell" role="cell">
        <button type="button" onClick={() => onViewPoint(alarm.id)}>
          View Point
          <ChevronRight size={12} aria-hidden="true" />
        </button>
      </span>
    </div>
  )
}