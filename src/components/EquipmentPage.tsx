import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

export type EquipmentTab = 'Operate' | 'Points' | 'Trends' | 'Associated Documents'

type EquipmentPageProps = {
  equipmentName: string
  equipmentPath: string[]
  activeTab: EquipmentTab
  onTabChange: (tab: EquipmentTab) => void
  headerContent?: ReactNode
  children?: ReactNode
  notesOpen?: boolean
  onToggleNotes?: (open: boolean) => void
}

const projectBreadcrumbs = ['All Projects', 'ABC Systems Project']

export function EquipmentPage({
  equipmentName,
  equipmentPath,
  activeTab,
  onTabChange,
  headerContent,
  children,
  notesOpen = true,
  onToggleNotes,
}: EquipmentPageProps) {
  const breadcrumbs = [...projectBreadcrumbs, ...equipmentPath]

  return (
    <main className="equipment-page">
      <header className="equipment-page__sticky-header">
        <nav className="equipment-page__breadcrumbs" aria-label="Breadcrumb">
          {breadcrumbs.map((item, index) => (
            <span className="equipment-page__breadcrumb" key={`${item}-${index}`}>
              {index > 0 && <ChevronRight size={11} aria-hidden="true" />}
              <span>{item}</span>
            </span>
          ))}
        </nav>
        <h1 className="equipment-page__title">{equipmentName}</h1>
        <p className="equipment-page__mobile-location">
          {equipmentPath.slice(-3, -1).join(' · ')}
        </p>
      </header>
      <div className="equipment-page__scrollable">
        <div className="equipment-page__header">
          <div className="equipment-page__header-content-wrapper">
            {headerContent}
          </div>
          {activeTab === 'Operate' && !notesOpen && onToggleNotes && (
            <button
              className="equipment-page__notes-open-btn"
              onClick={() => onToggleNotes(true)}
              aria-label="Open Notes panel"
              type="button"
            >
              <span>Notes</span>
            </button>
          )}
          <div className="equipment-page__tabs" role="tablist" aria-label="Equipment views">
            {(['Operate', 'Points', 'Trends', 'Associated Documents'] as const).map((tab) => (
              <button
                className={`equipment-page__tab${activeTab === tab ? ' is-active' : ''}`}
                id={`tab-${tab.toLowerCase().replaceAll(' ', '-')}`}
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                aria-controls="equipment-page-content"
                onClick={() => onTabChange(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <section
          className="equipment-page__content"
          id="equipment-page-content"
          role="tabpanel"
          aria-labelledby={`tab-${activeTab.toLowerCase().replaceAll(' ', '-')}`}
          aria-label={`${activeTab} content`}
        >
          {children}
        </section>
      </div>
    </main>
  )
}