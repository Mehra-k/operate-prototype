import type { ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'

type EquipmentPageProps = {
  equipmentName: string
  equipmentPath: string[]
  activeTab: 'Operate' | 'Points' | 'Trends'
  onTabChange: (tab: 'Operate' | 'Points' | 'Trends') => void
  headerContent?: ReactNode
  children?: ReactNode
}

const projectBreadcrumbs = ['All Projects', 'ABC Systems Project']

export function EquipmentPage({
  equipmentName,
  equipmentPath,
  activeTab,
  onTabChange,
  headerContent,
  children,
}: EquipmentPageProps) {
  const breadcrumbs = [...projectBreadcrumbs, ...equipmentPath]

  return (
    <main className="equipment-page">
      <header className="equipment-page__header">
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
        {headerContent}
        <div className="equipment-page__tabs" role="tablist" aria-label="Equipment views">
          {(['Operate', 'Points', 'Trends'] as const).map((tab) => (
            <button
              className={`equipment-page__tab${activeTab === tab ? ' is-active' : ''}`}
              id={`tab-${tab.toLowerCase()}`}
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
      </header>
      <section
        className="equipment-page__content"
        id="equipment-page-content"
        role="tabpanel"
        aria-labelledby={`tab-${activeTab.toLowerCase()}`}
        aria-label={`${activeTab} content`}
      >
        {children}
      </section>
    </main>
  )
}