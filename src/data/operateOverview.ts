export type ActiveAlarm = {
  id: string
  condition: string
  timestamp: string
  duration: string
}

export type EquipmentProperty = {
  label: string
  value: string
}

export type ControllingDevice = {
  id: string
  type: string
  program: string
  status: 'Connected'
}

export type EquipmentStateValue = {
  label: string
  value: string
  icon: 'control' | 'occupancy' | 'mode' | 'fan' | 'damper'
}

export type PointFilter = 'alarm' | 'override'

export const overriddenPointId = 'supply-fan-speed'

export function formatPointValue(value: string | number, unit: string) {
  return unit === '%' ? `${value}%` : `${value} ${unit}`
}

export type KeyPoint = {
  id: string
  pointName: string
  value: string
  unit: string
  state: 'Normal' | 'Low' | 'High' | 'Override'
  setpoint?: string
  updated: string
  trend: 'up' | 'down'
}

export const operateOverviewData = {
  activeAlarmCount: 2,
  alarmDescription: 'These 2 points have 2 active alarms that require attention.',
  activeAlarms: [
    {
      id: 'duct-static-pressure',
      condition: 'Low (< 1.5 in wc)',
      timestamp: 'Oct 28, 2026, 10:14 AM',
      duration: '3h 48m',
    },
    {
      id: 'co2',
      condition: 'High (> 1,000 ppm)',
      timestamp: 'Oct 28, 2026, 9:03 AM',
      duration: '5h 0m',
    },
  ] satisfies ActiveAlarm[],
  properties: [
    { label: 'Equipment Name', value: 'AHU-SA-01' },
    { label: 'Type', value: 'AHU' },
    { label: 'Subtype', value: 'Built-Up' },
    { label: 'Assigned Space', value: 'Floor 1 - Tower A' },
    { label: 'Sequence', value: 'AHU Standard v2.3' },
    { label: 'Description', value: 'Supply Air AHU serving Tower A Floor 1' },
    { label: 'Last Updated', value: 'Oct 28, 2026, 2:02 PM' },
  ] satisfies EquipmentProperty[],
  controllingDevices: [
    {
      id: 'EYC-303',
      type: 'Distech Controller',
      program: 'AHU Standard v2.3',
      status: 'Connected',
    },
    {
      id: 'EYC-304',
      type: 'Distech I/O Module',
      program: '-',
      status: 'Connected',
    },
  ] satisfies ControllingDevice[],
  equipmentState: [
    { label: 'Control Mode', value: 'Auto', icon: 'control' },
    { label: 'Occupancy', value: 'Occupied', icon: 'occupancy' },
    { label: 'Operating Mode', value: 'Cooling', icon: 'mode' },
    { label: 'Fan Status', value: 'Running', icon: 'fan' },
    { label: 'Outdoor Air Damper', value: '25% Open', icon: 'damper' },
  ] satisfies EquipmentStateValue[],
  operationalRollup: [
    { key: 'healthy', label: 'Healthy', count: 11, total: 14 },
    { key: 'alarm', label: 'In Alarm', count: 2, total: 14, filter: 'alarm' },
    { key: 'override', label: 'In Override', count: 1, total: 14, filter: 'override' },
  ],
  keyPoints: [
    {
      id: 'zone-temp',
      pointName: 'Zone Temp',
      value: '72.4',
      unit: '°F',
      state: 'Normal',
      setpoint: '72.0 °F',
      updated: '2 min ago',
      trend: 'up',
    },
    {
      id: 'supply-air-temp',
      pointName: 'Supply Air Temp',
      value: '55.3',
      unit: '°F',
      state: 'Normal',
      setpoint: '55.0 °F',
      updated: '2 min ago',
      trend: 'up',
    },
    {
      id: 'duct-static-pressure',
      pointName: 'Duct Static Pressure',
      value: '1.2',
      unit: 'in wc',
      state: 'Low',
      setpoint: '1.5 in wc',
      updated: '2 min ago',
      trend: 'down',
    },
    {
      id: 'supply-fan-speed',
      pointName: 'Supply Fan Speed',
      value: '78',
      unit: '%',
      state: 'Override',
      setpoint: '75 %',
      updated: '1 min ago',
      trend: 'up',
    },
    {
      id: 'co2',
      pointName: 'CO2',
      value: '1,180',
      unit: 'ppm',
      state: 'High',
      setpoint: '1,000 ppm',
      updated: '2 min ago',
      trend: 'up',
    },
    {
      id: 'outdoor-air-damper',
      pointName: 'Outdoor Air Damper',
      value: '25',
      unit: '%',
      state: 'Normal',
      updated: '2 min ago',
      trend: 'up',
    },
    {
      id: 'return-air-temp',
      pointName: 'Return Air Temp',
      value: '71.2',
      unit: '°F',
      state: 'Normal',
      updated: '2 min ago',
      trend: 'up',
    },
    {
      id: 'mixed-air-temp',
      pointName: 'Mixed Air Temp',
      value: '62.1',
      unit: '°F',
      state: 'Normal',
      updated: '2 min ago',
      trend: 'up',
    },
  ] satisfies KeyPoint[],
}

export function getKeyPoint(pointId: string) {
  return operateOverviewData.keyPoints.find((point) => point.id === pointId)
}