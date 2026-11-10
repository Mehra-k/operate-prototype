import { getKeyPoint, type KeyPoint } from './operateOverview.ts'
import { trendEvents, trendSeriesCatalog, type TrendSource } from './trends.ts'
import { efStatusColors } from './statusColors.ts'

export type OverviewTrendSeries = {
  id: string
  pointId: string
  name: string
  source: TrendSource
  unit: string
  color: string
  values: number[]
  setpoint?: boolean
}

export type OverviewTrendView = {
  id: string
  name: string
  seriesIds: string[]
  custom: boolean
}

export type OverviewTrendState = {
  views: OverviewTrendView[]
  activeViewId: string
}

export type TrendSample = {
  timestamp: number
  values: Record<string, number>
}

export type OverviewTrendEvent = {
  id: string
  kind: string
  timestamp: number
  description: string
  color: string
}

const pressure = getKeyPoint('duct-static-pressure')!
const pressureSetpoint = Number.parseFloat(pressure.setpoint!)

export const pressureSetpointDetails: KeyPoint = {
  id: 'duct-static-pressure-sp',
  pointName: 'Duct Static Pressure SP',
  value: String(pressureSetpoint),
  unit: pressure.unit,
  state: 'Normal',
  updated: pressure.updated,
  trend: 'up',
}

export const overviewTrendSeries: OverviewTrendSeries[] = [
  ...trendSeriesCatalog.map((series) => ({ ...series })),
  {
    id: pressureSetpointDetails.id,
    pointId: pressureSetpointDetails.id,
    name: pressureSetpointDetails.pointName,
    source: 'Current equipment',
    unit: pressure.unit,
    color: '#728291',
    values: Array.from({ length: 14 }, () => pressureSetpoint),
    setpoint: true,
  },
]

export const overviewTrendPresets: OverviewTrendView[] = [
  {
    id: 'pressure-comparison',
    name: 'Point Trend – Duct Static Pressure',
    seriesIds: ['duct-static-pressure', 'duct-static-pressure-sp'],
    custom: false,
  },
  {
    id: 'reheat-comparison',
    name: 'Reheat + Supply Air Temperature + Discharge Air Temperature',
    seriesIds: ['reheat', 'supply-air-temp', 'discharge-air-temp'],
    custom: false,
  },
]

export const overviewTrendRanges = [
  { value: '4h', label: 'Last 4 Hours', hours: 4 },
  { value: '12h', label: 'Last 12 Hours', hours: 12 },
  { value: '24h', label: 'Last 24 Hours', hours: 24 },
  { value: '7d', label: 'Last 7 Days', hours: 168 },
] as const

export type OverviewTrendRange = (typeof overviewTrendRanges)[number]['value']

export const overviewTrendEnd = Date.parse('2026-10-29T08:00:00Z')
const sampleInterval = 30 * 60 * 1000

export const overviewTrendSamples: TrendSample[] = Array.from({ length: 337 }, (_, sampleIndex) => {
  const timestamp = overviewTrendEnd - (336 - sampleIndex) * sampleInterval
  const phase = ((timestamp - (overviewTrendEnd - 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000) + 7) % 1
  const values: Record<string, number> = {}

  for (const series of overviewTrendSeries) {
    const position = phase * (series.values.length - 1)
    const lowerIndex = Math.floor(position)
    const upperIndex = Math.min(lowerIndex + 1, series.values.length - 1)
    const fraction = position - lowerIndex
    const interpolated = series.values[lowerIndex] + (series.values[upperIndex] - series.values[lowerIndex]) * fraction
    values[series.id] = Number(interpolated.toFixed(series.unit === 'cfm' || series.unit === 'ppm' ? 0 : 2))
    if (sampleIndex === 336) values[series.id] = series.values.at(-1)!
  }

  return { timestamp, values }
})

export const overviewTrendEvents: OverviewTrendEvent[] = [
  {
    id: trendEvents[0].id,
    kind: trendEvents[0].kind,
    timestamp: Date.parse('2026-10-28T10:14:00Z'),
    description: trendEvents[0].summary,
    color: trendEvents[0].color,
  },
  {
    id: 'pressure-override',
    kind: 'Override applied',
    timestamp: Date.parse('2026-10-28T14:00:00Z'),
    description: 'Local mock override event recorded during equipment troubleshooting.',
    color: efStatusColors.override.primary,
  },
  {
    id: 'pressure-sp-change',
    kind: 'Setpoint changed',
    timestamp: Date.parse('2026-10-28T18:00:00Z'),
    description: `Duct Static Pressure SP confirmed at ${pressureSetpoint} ${pressure.unit}.`,
    color: '#728291',
  },
]

export function formatTrendTimestamp(timestamp: number, dateOnly = false) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'short',
    day: 'numeric',
    ...(dateOnly ? {} : { hour: 'numeric', minute: '2-digit' }),
  }).format(timestamp)
}