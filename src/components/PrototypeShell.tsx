import type { ReactNode } from 'react'

type PrototypeShellProps = {
  children: ReactNode
}

export function PrototypeShell({ children }: PrototypeShellProps) {
  return <div className="app-shell">{children}</div>
}