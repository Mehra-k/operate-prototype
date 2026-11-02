import { Boxes } from 'lucide-react'

export function OperateHeader() {
  return (
    <header className="app-header">
      <div className="app-header__customer-brand" aria-label="acme co">
        <Boxes size={22} strokeWidth={1.8} aria-hidden="true" />
        <span>acme co</span>
      </div>
      <button className="app-header__profile" type="button" aria-label="User profile">
        JS
      </button>
    </header>
  )
}