import { useRef, useState, type ReactNode } from 'react'
import {
  Building2,
  ChevronDown,
  ChevronUp,
  Fan,
  Pencil,
  Settings2,
  Snowflake,
  Trash2,
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

type FieldInformationEntry = {
  id: string
  title: string
  value: string
  custom: boolean
}

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
  const [information, setInformation] = useState<FieldInformationEntry[]>(() => [
    { id: 'location', title: 'Location', value: fieldInformation.location, custom: false },
    { id: 'access', title: 'Access', value: fieldInformation.access, custom: false },
    { id: 'orientation', title: 'Orientation', value: fieldInformation.orientation, custom: false },
  ])
  const [fieldDraft, setFieldDraft] = useState<FieldInformationEntry[]>([])
  const [fieldInformationOpen, setFieldInformationOpen] = useState(true)
  const editDialog = useRef<HTMLDialogElement>(null)
  const nextFieldId = useRef(0)

  function cancelFieldInformation() {
    setFieldDraft(information.map((field) => ({ ...field })))
    editDialog.current?.close()
  }

  function updateField(id: string, changes: Partial<Pick<FieldInformationEntry, 'title' | 'value'>>) {
    setFieldDraft((current) => current.map((field) => field.id === id ? { ...field, ...changes } : field))
  }

  function saveFieldInformation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (fieldDraft.some((field) => !field.title.trim())) return
    setInformation(fieldDraft.map((field) => ({ ...field, title: field.title.trim() })))
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
              <h3 className="combined-info-card__subheading" id="field-information-heading">
                <button className="combined-info-card__field-toggle" type="button" aria-expanded={fieldInformationOpen} aria-controls="field-information-content" onClick={() => setFieldInformationOpen((open) => !open)}>
                  Field Information
                  {fieldInformationOpen ? <ChevronUp size={12} aria-hidden="true" /> : <ChevronDown size={12} aria-hidden="true" />}
                </button>
              </h3>
              {fieldInformationOpen && (
                <button className="equipment-resource-panel__header-action" type="button" onClick={() => {
                  setFieldDraft(information.map((field) => ({ ...field })))
                  editDialog.current?.showModal()
                }}>
                  <Pencil size={12} aria-hidden="true" />
                  Edit
                </button>
              )}
            </div>
            <div className="field-information-panel__body" id="field-information-content" hidden={!fieldInformationOpen}>
              <img
                className="field-information-panel__photo"
                src={equipmentImage}
                alt="Representative air-handling unit"
                title="Representative equipment photo by P199, Wikimedia Commons, public domain"
                width={320}
                height={240}
              />
              <dl className="field-information-panel__list">
                {information.map((field) => (
                  <div key={field.id}>
                    <dt>{field.title}</dt>
                    <dd>{field.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </OverviewCard>
      <dialog className="equipment-state-customize field-information-panel__edit" ref={editDialog} aria-labelledby="edit-field-information-heading" onCancel={() => setFieldDraft(information.map((field) => ({ ...field })))}>
        <header>
          <h3 id="edit-field-information-heading">Edit Field Information</h3>
          <button type="button" title="Close" aria-label="Close field information editor" onClick={cancelFieldInformation}><X size={16} aria-hidden="true" /></button>
        </header>
        <form onSubmit={saveFieldInformation}>
          <div className="field-information-panel__edit-fields">
            {fieldDraft.map((field) => (
              <div className="field-information-panel__edit-field" key={field.id}>
                <label>Field title<input value={field.title} onChange={(event) => updateField(field.id, { title: event.target.value })} required /></label>
                <label>Field value{field.id === 'orientation'
                  ? <textarea value={field.value} onChange={(event) => updateField(field.id, { value: event.target.value })} />
                  : <input value={field.value} onChange={(event) => updateField(field.id, { value: event.target.value })} />}</label>
                {field.custom && <button className="equipment-state-card__customize" type="button" aria-label={`Delete ${field.title || 'custom field'}`} title="Delete field" onClick={() => setFieldDraft((current) => current.filter((entry) => entry.id !== field.id))}><Trash2 size={12} aria-hidden="true" /> Delete</button>}
              </div>
            ))}
            <button type="button" className="equipment-state-card__customize" onClick={() => {
              nextFieldId.current += 1
              setFieldDraft((current) => [...current, { id: `custom-${nextFieldId.current}`, title: '', value: '', custom: true }])
            }}>+ Add field</button>
          </div>
          <footer>
            <button type="button" className="equipment-state-card__customize" onClick={cancelFieldInformation}>Cancel</button>
            <button type="submit" className="equipment-state-card__customize" disabled={fieldDraft.some((field) => !field.title.trim())}>Save</button>
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
              <span>Program/Sequence</span>
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