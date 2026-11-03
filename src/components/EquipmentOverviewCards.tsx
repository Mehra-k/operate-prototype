import { useRef, useState, type ReactNode } from 'react'
import {
  Building2,
  Compass,
  Fan,
  MapPin,
  Pencil,
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
import { fieldInformation } from '../data/equipmentResources.ts'

const equipmentImage = new URL('../assets/air-handling-unit.jpg', import.meta.url).href

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
  const [information, setInformation] = useState(fieldInformation)
  const [fieldDraft, setFieldDraft] = useState(fieldInformation)
  const editDialog = useRef<HTMLDialogElement>(null)

  function saveFieldInformation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setInformation({ location: fieldDraft.location.trim(), access: fieldDraft.access.trim(), orientation: fieldDraft.orientation.trim() })
    editDialog.current?.close()
  }

  return (
    <>
      <OverviewCard 
        title="Equipment Properties & Field Information" 
        className="equipment-properties-card combined-info-card"
      >
        <div className="combined-info-card__content">
          <div className="combined-info-card__properties">
            <h3 className="combined-info-card__subheading">Equipment Properties</h3>
            <dl className="equipment-properties-card__list">
              {operateOverviewData.properties.map((property) => (
                <div className="equipment-properties-card__row" key={property.label}>
                  <dt>{property.label}</dt>
                  <dd>{property.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="combined-info-card__field-info">
            <div className="combined-info-card__field-heading">
              <h3 className="combined-info-card__subheading">Field Information</h3>
              <button className="equipment-resource-panel__header-action" type="button" onClick={() => {
                setFieldDraft(information)
                editDialog.current?.showModal()
              }}>
                <Pencil size={12} aria-hidden="true" />
                Edit
              </button>
            </div>
            <div className="field-information-panel__body">
              <img
                className="field-information-panel__photo"
                src={equipmentImage}
                alt="Representative air-handling unit"
                title="Representative equipment photo by P199, Wikimedia Commons, public domain"
                width={320}
                height={240}
              />
              <dl className="field-information-panel__list">
                <div>
                  <MapPin size={13} aria-hidden="true" />
                  <dt>Location</dt>
                  <dd>{information.location}</dd>
                </div>
                <div>
                  <MapPin size={13} aria-hidden="true" />
                  <dt>Access</dt>
                  <dd>{information.access}</dd>
                </div>
                <div>
                  <Compass size={13} aria-hidden="true" />
                  <dt>Orientation</dt>
                  <dd>{information.orientation}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </OverviewCard>
      <dialog className="equipment-state-customize field-information-panel__edit" ref={editDialog} aria-labelledby="edit-field-information-heading">
        <header>
          <h3 id="edit-field-information-heading">Edit Field Information</h3>
          <button type="button" title="Close" aria-label="Close field information editor" onClick={() => editDialog.current?.close()}><X size={16} aria-hidden="true" /></button>
        </header>
        <form onSubmit={saveFieldInformation}>
          <label>Location<input value={fieldDraft.location} onChange={(event) => setFieldDraft((current) => ({ ...current, location: event.target.value }))} required /></label>
          <label>Access<input value={fieldDraft.access} onChange={(event) => setFieldDraft((current) => ({ ...current, access: event.target.value }))} required /></label>
          <label>Orientation<textarea value={fieldDraft.orientation} onChange={(event) => setFieldDraft((current) => ({ ...current, orientation: event.target.value }))} required /></label>
          <footer>
            <button type="button" className="equipment-state-card__customize" onClick={() => editDialog.current?.close()}>Cancel</button>
            <button type="submit" className="equipment-state-card__customize" disabled={!fieldDraft.location.trim() || !fieldDraft.access.trim() || !fieldDraft.orientation.trim()}>Save</button>
          </footer>
        </form>
      </dialog>
    </>
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