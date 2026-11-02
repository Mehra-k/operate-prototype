export type EquipmentNodeKind = 'site' | 'building' | 'floor' | 'equipment'

export type EquipmentTreeNode = {
  id: string
  name: string
  kind: EquipmentNodeKind
  alarm?: boolean
  children?: EquipmentTreeNode[]
}

export type RelatedEquipmentStatus = 'normal' | 'alarm' | 'override' | 'offline'

export type RelatedEquipmentNode = {
  id: string
  name: string
  relationship: string
  status: RelatedEquipmentStatus
}

export const relatedEquipment = {
  upstream: {
    id: 'chiller-ch-01',
    name: 'Chiller CH-01',
    relationship: 'Upstream Source',
    status: 'normal',
  },
  sibling: {
    id: 'ahu-sa-02',
    name: 'AHU-SA-02',
    relationship: 'Sibling System',
    status: 'normal',
  },
  current: {
    id: 'ahu-sa-01',
    name: 'AHU-SA-01',
    relationship: 'Current Equipment',
    status: 'normal',
  },
  servedSpaces: [
    { id: 'vav-01', name: 'VAV-01', relationship: 'Served Space', status: 'alarm' },
    { id: 'vav-02', name: 'VAV-02', relationship: 'Served Space', status: 'override' },
    { id: 'vav-03', name: 'VAV-03', relationship: 'Served Space', status: 'normal' },
    { id: 'vav-04', name: 'VAV-04', relationship: 'Served Space', status: 'normal' },
  ],
} satisfies {
  upstream: RelatedEquipmentNode
  sibling: RelatedEquipmentNode
  current: RelatedEquipmentNode
  servedSpaces: RelatedEquipmentNode[]
}

export const relatedEquipmentIds = new Set([
  relatedEquipment.upstream.id,
  relatedEquipment.sibling.id,
  relatedEquipment.current.id,
  ...relatedEquipment.servedSpaces.map((node) => node.id),
])

export const equipmentHierarchy: EquipmentTreeNode[] = [
  {
    id: 'riverside-complex',
    name: 'Riverside Complex',
    kind: 'site',
    children: [
      {
        id: 'tower-a',
        name: 'Tower A',
        kind: 'building',
        children: [
          {
            id: 'floor-1',
            name: 'Floor 1',
            kind: 'floor',
            children: [
              { id: 'ahu-sa-01', name: 'AHU-SA-01', kind: 'equipment', alarm: true },
              { id: 'ahu-sa-02', name: 'AHU-SA-02', kind: 'equipment' },
              { id: 'chiller-ch-01', name: 'Chiller CH-01', kind: 'equipment' },
              { id: 'vav-01', name: 'VAV-01', kind: 'equipment' },
              { id: 'vav-02', name: 'VAV-02', kind: 'equipment' },
              { id: 'vav-03', name: 'VAV-03', kind: 'equipment' },
              { id: 'vav-04', name: 'VAV-04', kind: 'equipment' },
              { id: 'ahu-2', name: 'AHU 2', kind: 'equipment' },
              { id: 'chws', name: 'CHWS', kind: 'equipment' },
            ],
          },
          { id: 'second-floor', name: 'Second Floor', kind: 'floor' },
          { id: 'third-floor', name: 'Third Floor', kind: 'floor' },
        ],
      },
      { id: 'south-office', name: 'South Office', kind: 'building' },
      { id: 'east-office', name: 'East Office', kind: 'building' },
      { id: 'warehouse', name: 'Warehouse', kind: 'building' },
    ],
  },
]

export function findEquipmentPath(
  nodes: EquipmentTreeNode[],
  nodeId: string,
  ancestors: EquipmentTreeNode[] = [],
): EquipmentTreeNode[] | null {
  for (const node of nodes) {
    const path = [...ancestors, node]
    if (node.id === nodeId) return path

    if (node.children) {
      const childPath = findEquipmentPath(node.children, nodeId, path)
      if (childPath) return childPath
    }
  }

  return null
}