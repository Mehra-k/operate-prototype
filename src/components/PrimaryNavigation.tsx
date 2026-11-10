import {
  Bell,
  Building2,
  CalendarDays,
  ChartLine,
  CircleHelp,
  FileText,
  House,
  LogOut,
  Network,
  Settings,
  type LucideIcon,
} from 'lucide-react'

type NavigationItem = {
  label: string
  icon: LucideIcon
  badge?: number
}

type PrimaryNavigationProps = {
  activeItem: string
  onSelect: (label: string) => void
  alarmCount?: number
}

const getPrimaryItems = (alarmCount?: number): NavigationItem[] => [
  { label: 'Home', icon: House },
  { label: 'Equipment', icon: Building2 },
  { label: 'Alarms & Faults', icon: Bell, badge: alarmCount },
  { label: 'Schedules', icon: CalendarDays },
  { label: 'Command Center', icon: Network },
  { label: 'Reports', icon: FileText },
  { label: 'Trends', icon: ChartLine },
]

const utilityItems: NavigationItem[] = [
  { label: 'Settings', icon: Settings },
  { label: 'Help', icon: CircleHelp },
  { label: 'Sign out', icon: LogOut },
]

function NavigationButton({
  item,
  active,
  onSelect,
}: {
  item: NavigationItem
  active: boolean
  onSelect: (label: string) => void
}) {
  const Icon = item.icon

  return (
    <button
      className={`primary-navigation__item${active ? ' is-active' : ''}`}
      type="button"
      aria-current={active ? 'page' : undefined}
      onClick={() => onSelect(item.label)}
    >
      <Icon size={16} strokeWidth={2} aria-hidden="true" />
      <span className="primary-navigation__label-badge">
        <span>{item.label}</span>
        {item.badge && item.badge > 0 && (
          <span className="primary-navigation__badge" aria-label={`${item.badge} active alarm${item.badge > 1 ? 's' : ''}`}>
            {item.badge}
          </span>
        )}
      </span>
    </button>
  )
}

export function PrimaryNavigation({
  activeItem,
  onSelect,
  alarmCount,
}: PrimaryNavigationProps) {
  const primaryItems = getPrimaryItems(alarmCount)

  return (
    <nav className="primary-navigation" aria-label="Primary navigation">
      <div className="primary-navigation__main">
        {primaryItems.map((item) => (
          <NavigationButton
            key={item.label}
            item={item}
            active={activeItem === item.label}
            onSelect={onSelect}
          />
        ))}
      </div>
      <div className="primary-navigation__utilities">
        {utilityItems.map((item) => (
          <NavigationButton
            key={item.label}
            item={item}
            active={activeItem === item.label}
            onSelect={onSelect}
          />
        ))}
      </div>
    </nav>
  )
}