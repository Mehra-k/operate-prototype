const alarm = { primary: '#BE2434', secondary: '#FB6265' } as const
const communicationFailure = { primary: '#C0570D', secondary: '#EAB448' } as const

export const efStatusColors = {
  alarm,
  down: communicationFailure,
  fault: communicationFailure,
  'out-of-service': alarm,
  override: { primary: '#9781E2', secondary: '#9781E2' },
  'unacknowledged-alarm': alarm,
  disabled: { primary: '#505050', secondary: '#CCCCCC' },
  stale: { primary: '#FDB813', secondary: '#FDB813' },
  ok: { primary: '#358600', secondary: '#A7D987' },
} as const

export function applyEfStatusColors(root: HTMLElement) {
  for (const [status, palette] of Object.entries(efStatusColors)) {
    root.style.setProperty(`--ef-status-${status}-primary`, palette.primary)
    root.style.setProperty(`--ef-status-${status}-secondary`, palette.secondary)
  }
}