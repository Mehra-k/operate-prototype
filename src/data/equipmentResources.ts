export type EquipmentNote = {
  id: string
  content: string
  author: string
  date: string
  time: string
  datetime: string
  resolved: boolean
}

export type EquipmentDocument = {
  id: string
  name: string
  type: 'PDF' | 'XLSX' | 'ZIP'
  size: string
}

export const initialEquipmentNotes: EquipmentNote[] = [
  {
    id: 'co2-investigation',
    content: 'Investigating CO2 sensor readings. Compare with VAV-02.',
    author: 'Andrew Thibado',
    date: 'Oct 27, 2026',
    time: '4:21 PM',
    datetime: '2026-10-27T16:21:00',
    resolved: false,
  },
  {
    id: 'filter-maintenance',
    content: 'Scheduled maintenance next week. Filters to be replaced.',
    author: 'Jon Smith',
    date: 'Oct 26, 2026',
    time: '10:15 AM',
    datetime: '2026-10-26T10:15:00',
    resolved: false,
  },
  {
    id: 'pressure-recurring',
    content: 'Recurring low duct static pressure. Monitor after filter change.',
    author: 'Brent Lowe',
    date: 'Oct 20, 2026',
    time: '9:03 AM',
    datetime: '2026-10-20T09:03:00',
    resolved: false,
  },
]

export const equipmentDocuments: EquipmentDocument[] = [
  { id: 'sequence-of-operations', name: 'Sequence of Operations.pdf', type: 'PDF', size: '1.2 MB' },
  { id: 'ahu-drawing', name: 'AHU-SA-01 Drawing.pdf', type: 'PDF', size: '3.4 MB' },
  { id: 'point-list', name: 'Point List.xlsx', type: 'XLSX', size: '245 KB' },
  { id: 'maintenance-manual', name: 'Maintenance Manual.pdf', type: 'PDF', size: '4.1 MB' },
  { id: 'equipment-photos', name: 'Equipment Photos (3)', type: 'ZIP', size: '12.8 MB' },
]

export const fieldInformation = {
  location: 'Mechanical Room 1A, North Wall',
  access: 'Remove ceiling tile #4',
  orientation: 'Face supply fan (left to right: OA, Filter, Fan)',
}