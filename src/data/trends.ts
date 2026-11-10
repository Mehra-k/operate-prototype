import type { KeyPoint } from './operateOverview.ts'
import { efStatusColors } from './statusColors.ts'

export type TrendSource = 'Current equipment' | 'Related equipment' | 'Wider site'

export type TrendSeriesOption = {
  id: string
  pointId: string
  name: string
  source: TrendSource
  unit: string
  axisId: 'left' | 'right'
  color: string
  values: number[]
}

export type TrendEvent = {
  id: string
  kind: 'Alarm started' | 'Override applied' | 'Setpoint changed'
  time: string
  timestamp: string
  pointName: string
  summary: string
  color: string
}

export type TrendPreset = {
  id: string
  name: string
  seriesIds: string[]
}

export const trendTimes = [
  '08:00',
  '09:03',
  '10:14',
  '12:00',
  '14:00',
  '16:00',
  '18:00',
  '20:00',
  '22:00',
  '00:00',
  '02:00',
  '04:00',
  '06:00',
  '08:00',
]

export const trendSeriesCatalog: TrendSeriesOption[] = [
  {
    id: 'airflow',
    pointId: 'airflow',
    name: 'Airflow',
    source: 'Current equipment',
    unit: 'cfm',
    axisId: 'left',
    color: '#347fbb',
    values: [1420, 1390, 1480, 1460, 1450, 1490, 1520, 1480, 1430, 1400, 1410, 1440, 1460, 1480],
  },
  {
    id: 'airflow-setpoint',
    pointId: 'airflow-setpoint',
    name: 'Airflow Setpoint',
    source: 'Current equipment',
    unit: 'cfm',
    axisId: 'left',
    color: '#159b83',
    values: [1500, 1500, 1500, 1450, 1450, 1450, 1500, 1500, 1500, 1450, 1450, 1450, 1500, 1500],
  },
  {
    id: 'reheat',
    pointId: 'reheat',
    name: 'Reheat',
    source: 'Current equipment',
    unit: '%',
    axisId: 'left',
    color: '#d88328',
    values: [22, 26, 29, 33, 30, 25, 22, 18, 15, 12, 11, 13, 16, 20],
  },
  {
    id: 'supply-air-temp',
    pointId: 'supply-air-temp',
    name: 'Supply Air Temperature',
    source: 'Current equipment',
    unit: '°F',
    axisId: 'right',
    color: '#238f78',
    values: [55.0, 54.8, 55.3, 55.2, 55.1, 54.9, 55.0, 55.3, 55.1, 54.8, 54.6, 54.9, 55.2, 55.3],
  },
  {
    id: 'discharge-air-temp',
    pointId: 'discharge-air-temp',
    name: 'Discharge Air Temperature',
    source: 'Current equipment',
    unit: '°F',
    axisId: 'right',
    color: '#4d79a5',
    values: [54.1, 54.3, 54.5, 54.4, 54.2, 54.0, 54.1, 54.3, 54.0, 53.8, 53.7, 53.9, 54.1, 54.2],
  },
  {
    id: 'duct-static-pressure',
    pointId: 'duct-static-pressure',
    name: 'Duct Static Pressure',
    source: 'Current equipment',
    unit: 'in wc',
    axisId: 'left',
    color: '#1676c5',
    values: [1.7, 1.6, 1.2, 1.3, 1.4, 1.5, 1.6, 1.5, 1.4, 1.3, 1.2, 1.3, 1.4, 1.2],
  },
  {
    id: 'co2',
    pointId: 'co2',
    name: 'CO2',
    source: 'Current equipment',
    unit: 'ppm',
    axisId: 'left',
    color: '#b85a3b',
    values: [820, 900, 1180, 1100, 980, 940, 880, 910, 960, 1020, 1100, 1180, 1130, 1180],
  },
  {
    id: 'supply-fan-speed',
    pointId: 'supply-fan-speed',
    name: 'Supply Fan Speed',
    source: 'Current equipment',
    unit: '%',
    axisId: 'left',
    color: '#548a4f',
    values: [74, 76, 78, 78, 77, 75, 74, 77, 78, 75, 74, 76, 77, 78],
  },
  {
    id: 'ahu-sa-02-airflow',
    pointId: 'ahu-sa-02-airflow',
    name: 'AHU-SA-02 · Airflow',
    source: 'Related equipment',
    unit: 'cfm',
    axisId: 'left',
    color: '#8a6ca8',
    values: [1310, 1290, 1340, 1360, 1320, 1380, 1400, 1370, 1350, 1300, 1280, 1310, 1330, 1360],
  },
  {
    id: 'vav-01-zone-temp',
    pointId: 'vav-01-zone-temp',
    name: 'VAV-01 · Zone Temp',
    source: 'Related equipment',
    unit: '°F',
    axisId: 'right',
    color: '#d18e44',
    values: [71.8, 72.0, 72.3, 72.8, 73.1, 73.0, 72.6, 72.1, 71.9, 71.7, 71.8, 72.0, 72.2, 72.4],
  },
  {
    id: 'vav-02-zone-temp',
    pointId: 'vav-02-zone-temp',
    name: 'VAV-02 · Zone Temp',
    source: 'Related equipment',
    unit: '°F',
    axisId: 'right',
    color: '#607d8b',
    values: [70.9, 71.1, 71.5, 72.0, 72.2, 72.1, 71.8, 71.4, 71.2, 70.9, 70.8, 71.0, 71.3, 71.6],
  },
  {
    id: 'east-office-co2',
    pointId: 'east-office-co2',
    name: 'East Office · CO2',
    source: 'Wider site',
    unit: 'ppm',
    axisId: 'left',
    color: '#6f8d3c',
    values: [690, 710, 740, 800, 860, 900, 870, 820, 780, 750, 730, 720, 740, 760],
  },
  {
    id: 'warehouse-airflow',
    pointId: 'warehouse-airflow',
    name: 'Warehouse · Airflow',
    source: 'Wider site',
    unit: 'cfm',
    axisId: 'left',
    color: '#bd6d8b',
    values: [1620, 1610, 1600, 1580, 1550, 1530, 1540, 1570, 1600, 1640, 1660, 1630, 1600, 1580],
  },
]

export const trendPointDetails: KeyPoint[] = [
  {
    id: 'airflow', pointName: 'Airflow', value: '1,480', unit: 'cfm',
    state: 'Normal', setpoint: '1,500 cfm', updated: '2 min ago', trend: 'up',
  },
  {
    id: 'airflow-setpoint', pointName: 'Airflow Setpoint', value: '1,500', unit: 'cfm',
    state: 'Normal', updated: '2 min ago', trend: 'up',
  },
  {
    id: 'reheat', pointName: 'Reheat', value: '20', unit: '%',
    state: 'Normal', updated: '2 min ago', trend: 'down',
  },
  {
    id: 'discharge-air-temp', pointName: 'Discharge Air Temperature', value: '54.2', unit: '°F',
    state: 'Normal', updated: '2 min ago', trend: 'down',
  },
  {
    id: 'ahu-sa-02-airflow', pointName: 'AHU-SA-02 · Airflow', value: '1,360', unit: 'cfm',
    state: 'Normal', updated: '2 min ago', trend: 'up',
  },
  {
    id: 'vav-01-zone-temp', pointName: 'VAV-01 · Zone Temp', value: '72.4', unit: '°F',
    state: 'Normal', updated: '2 min ago', trend: 'up',
  },
  {
    id: 'vav-02-zone-temp', pointName: 'VAV-02 · Zone Temp', value: '71.6', unit: '°F',
    state: 'Normal', updated: '2 min ago', trend: 'up',
  },
  {
    id: 'east-office-co2', pointName: 'East Office · CO2', value: '760', unit: 'ppm',
    state: 'Normal', updated: '2 min ago', trend: 'up',
  },
  {
    id: 'warehouse-airflow', pointName: 'Warehouse · Airflow', value: '1,580', unit: 'cfm',
    state: 'Normal', updated: '2 min ago', trend: 'down',
  },
]

export const trendPresets: TrendPreset[] = [
  {
    id: 'airflow-comparison',
    name: 'Airflow + Airflow Setpoint',
    seriesIds: ['airflow', 'airflow-setpoint'],
  },
  {
    id: 'reheat-comparison',
    name: 'Reheat + Supply Air Temperature + Discharge Air Temperature',
    seriesIds: ['reheat', 'supply-air-temp', 'discharge-air-temp'],
  },
]

export const trendEvents: TrendEvent[] = [
  {
    id: 'duct-pressure-alarm',
    kind: 'Alarm started',
    time: '10:14',
    timestamp: 'Oct 28, 2026, 10:14 AM',
    pointName: 'Duct Static Pressure',
    summary: 'Low alarm started below the 1.5 in wc threshold.',
    color: efStatusColors.alarm.primary,
  },
  {
    id: 'vav-02-override',
    kind: 'Override applied',
    time: '14:00',
    timestamp: 'Oct 28, 2026, 2:00 PM',
    pointName: 'VAV-02',
    summary: 'Override applied to VAV-02.',
    color: efStatusColors.override.primary,
  },
  {
    id: 'airflow-setpoint-change',
    kind: 'Setpoint changed',
    time: '18:00',
    timestamp: 'Oct 28, 2026, 6:00 PM',
    pointName: 'Airflow Setpoint',
    summary: 'Airflow Setpoint changed.',
    color: '#347fbb',
  },
]