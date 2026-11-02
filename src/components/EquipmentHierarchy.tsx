import { useMemo, useState } from 'react'
import {
  Building2,
  Box,
  ChevronDown,
  ChevronRight,
  Layers,
  Search,
  Wind,
} from 'lucide-react'
import type { EquipmentNodeKind, EquipmentTreeNode } from '../data/equipment.ts'

type EquipmentHierarchyProps = {
  nodes: EquipmentTreeNode[]
  selectedNodeId: string
  onSelect: (nodeId: string) => void
}

const nodeIcons: Record<EquipmentNodeKind, typeof Building2> = {
  site: Building2,
  building: Building2,
  floor: Layers,
  equipment: Wind,
}

function filterTree(
  nodes: EquipmentTreeNode[],
  query: string,
): EquipmentTreeNode[] {
  if (!query) return nodes

  return nodes.flatMap((node) => {
    const children = node.children ? filterTree(node.children, query) : []
    if (node.name.toLowerCase().includes(query) || children.length > 0) {
      return [{ ...node, children }]
    }
    return []
  })
}

function collectParentIds(nodes: EquipmentTreeNode[]): Set<string> {
  const expandedIds = new Set<string>()

  function visit(items: EquipmentTreeNode[]) {
    for (const item of items) {
      if (item.children?.length) {
        expandedIds.add(item.id)
        visit(item.children)
      }
    }
  }

  visit(nodes)
  return expandedIds
}

function TreeNode({
  node,
  depth,
  expandedIds,
  selectedNodeId,
  onToggle,
  onSelect,
}: {
  node: EquipmentTreeNode
  depth: number
  expandedIds: Set<string>
  selectedNodeId: string
  onToggle: (nodeId: string) => void
  onSelect: (nodeId: string) => void
}) {
  const hasChildren = Boolean(node.children?.length)
  const expanded = expandedIds.has(node.id)
  const Icon = nodeIcons[node.kind] ?? Box

  return (
    <li className="equipment-tree__branch">
      <div
        className={`equipment-tree__row${selectedNodeId === node.id ? ' is-selected' : ''}`}
        style={{ paddingLeft: 8 + depth * 12 }}
      >
        <button
          className="equipment-tree__expander"
          type="button"
          aria-label={`${expanded ? 'Collapse' : 'Expand'} ${node.name}`}
          aria-expanded={hasChildren ? expanded : undefined}
          disabled={!hasChildren}
          onClick={() => onToggle(node.id)}
        >
          {hasChildren ? (
            expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />
          ) : null}
        </button>
        <button
          className="equipment-tree__label"
          type="button"
          aria-current={selectedNodeId === node.id ? 'page' : undefined}
          onClick={() => onSelect(node.id)}
        >
          <Icon size={12} strokeWidth={1.8} aria-hidden="true" />
          <span>{node.name}</span>
          {node.alarm && (
            <span className="equipment-tree__alarm" aria-label="In alarm" />
          )}
        </button>
      </div>
      {hasChildren && expanded && (
        <ul className="equipment-tree__children">
          {node.children?.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expandedIds={expandedIds}
              selectedNodeId={selectedNodeId}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

export function EquipmentHierarchy({
  nodes,
  selectedNodeId,
  onSelect,
}: EquipmentHierarchyProps) {
  const [query, setQuery] = useState('')
  const [expandedIds, setExpandedIds] = useState(
    () => new Set(['riverside-complex', 'tower-a', 'floor-1']),
  )
  const filteredNodes = useMemo(
    () => filterTree(nodes, query.trim().toLowerCase()),
    [nodes, query],
  )
  const visibleExpandedIds = query
    ? collectParentIds(filteredNodes)
    : expandedIds

  function toggleNode(nodeId: string) {
    setExpandedIds((current) => {
      const next = new Set(current)
      if (next.has(nodeId)) next.delete(nodeId)
      else next.add(nodeId)
      return next
    })
  }

  return (
    <aside className="equipment-tree" aria-label="Equipment hierarchy">
      <label className="equipment-tree__search">
        <Search size={14} aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search equipment"
          aria-label="Search equipment"
        />
      </label>
      <ul className="equipment-tree__roots">
        {filteredNodes.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            depth={0}
            expandedIds={visibleExpandedIds}
            selectedNodeId={selectedNodeId}
            onToggle={toggleNode}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </aside>
  )
}