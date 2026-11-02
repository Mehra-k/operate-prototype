import {
  Building2,
  ChevronRight,
  Fan,
  Settings2,
  Snowflake,
  Wind,
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
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={`overview-card ${className}`}>
      <h2 className="overview-card__title">{title}</h2>
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
      <button
        className="controlling-devices-card__details-link"
        type="button"
        onClick={() => onViewDevice(operateOverviewData.controllingDevices[0].id)}
      >
        View device details
        <ChevronRight size={12} aria-hidden="true" />
      </button>
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
  return (
    <OverviewCard title="Equipment State" className="equipment-state-card">
      <dl className="equipment-state-card__list">
        {operateOverviewData.equipmentState.map((item) => {
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
    </OverviewCard>
  )
}