import { useRef, useState, type ReactNode } from 'react'
import {
  Building2,
  Fan,
  Settings2,
  Snowflake,
  Wind,
  X,
  type LucideIcon,
} from 'lucide-react'
import {
  operateOverviewData,
  type EquipmentStateValue,
} from '../data/operateOverview.ts'

function OverviewCard({
  title,
  children,
  className = '',
  action,
}: {
  title: string
  children: ReactNode
  className?: string
  action?: ReactNode
}) {
  return (
    <section className={`overview-card ${className}`}>
      <h2 className="overview-card__title">{title}{action}</h2>
      {children}
    </section>
  )
}

export function EquipmentPropertiesCard() {
  return (
    <OverviewCard title="Equipment Properties" className="equipment-properties-card">
      <dl className="equipment-properties-card__list">
        {operateOverviewData.properties.map((property) => (
          <div className="equipment-properties-card__row" key={property.label}>
            <dt>{property.label}</dt>
            <dd>{property.value}</dd>
          </div>
        ))}
      </dl>
    </OverviewCard>
  )
}

export function ControllingDevicesCard({
  onViewDevice,
}: {
  onViewDevice: (deviceId: string) => void
}) {
  return (
    <OverviewCard title="Controlling Devices" className="controlling-devices-card">
      <div className="controlling-devices-card__list">
        {operateOverviewData.controllingDevices.map((device) => (
          <article className="controlling-devices-card__device" key={device.id}>
            <button
              className="controlling-devices-card__name"
              type="button"
              onClick={() => onViewDevice(device.id)}
            >
              {device.id}
            </button>
            <span className="controlling-devices-card__type">{device.type}</span>
            <div className="controlling-devices-card__detail">
              <span>Program</span>
              <span>{device.program}</span>
            </div>
            <div className="controlling-devices-card__detail">
              <span>Status</span>
              <span className="controlling-devices-card__online">
                <span aria-hidden="true" />
                {device.status}
              </span>
            </div>
          </article>
        ))}
      </div>
    </OverviewCard>
  )
}

const stateIcons: Record<EquipmentStateValue['icon'], LucideIcon> = {
  control: Settings2,
  occupancy: Building2,
  mode: Snowflake,
  fan: Fan,
  damper: Wind,
}

export function EquipmentStateCard() {
  const customizeDialog = useRef<HTMLDialogElement>(null)
  const [visibleFields, setVisibleFields] = useState<string[]>(
    () => operateOverviewData.equipmentState.map((item) => item.label),
  )

  return (
    <OverviewCard
      title="Equipment State"
      className="equipment-state-card"
      action={(
        <button
          className="equipment-state-card__customize"
          type="button"
          onClick={() => customizeDialog.current?.showModal()}
        >
          <Settings2 size={11} aria-hidden="true" />
          Customize
        </button>
      )}
    >
      <dl className="equipment-state-card__list">
        {operateOverviewData.equipmentState.filter((item) => visibleFields.includes(item.label)).map((item) => {
          const Icon = stateIcons[item.icon]
          return (
            <div className="equipment-state-card__row" key={item.label}>
              <Icon size={14} strokeWidth={2} aria-hidden="true" />
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          )
        })}
      </dl>
      <dialog className="equipment-state-customize" ref={customizeDialog} aria-labelledby="customize-state-heading">
        <header>
          <h3 id="customize-state-heading">Customize Equipment State</h3>
          <button type="button" aria-label="Close customization" title="Close" onClick={() => customizeDialog.current?.close()}>
            <X size={16} aria-hidden="true" />
          </button>
        </header>
        {operateOverviewData.equipmentState.map((item) => (
          <label key={item.label}>
            <input
              type="checkbox"
              checked={visibleFields.includes(item.label)}
              onChange={(event) => setVisibleFields((current) => event.target.checked
                ? [...current, item.label]
                : current.filter((field) => field !== item.label))}
            />
            {item.label}
          </label>
        ))}
        <button className="equipment-state-card__customize" type="button" onClick={() => customizeDialog.current?.close()}>Done</button>
      </dialog>
    </OverviewCard>
  )
}