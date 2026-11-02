import { useState } from 'react'
import {
  Maximize2,
  Minimize2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import {
  relatedEquipment,
  type RelatedEquipmentNode,
} from '../data/equipment.ts'

type RelatedEquipmentProps = {
  currentEquipmentId: string
  previousEquipmentName?: string
  onSelectEquipment: (equipmentId: string) => void
  onBack: () => void
}

function EquipmentNode({
  node,
  currentEquipmentId,
  onSelect,
}: {
  node: RelatedEquipmentNode
  currentEquipmentId: string
  onSelect: (equipmentId: string) => void
}) {
  const isCurrent = currentEquipmentId === node.id
  const showsStatus = node.relationship === 'Served Space'

  return (
    <button
      className={`related-equipment__node is-${node.status}${isCurrent ? ' is-current' : ''}`}
      type="button"
      aria-current={isCurrent ? 'page' : undefined}
      onClick={() => onSelect(node.id)}
    >
      <span>{node.name}</span>
      <small>{isCurrent ? 'Current Equipment' : node.relationship}</small>
      {showsStatus && (
        <small className="related-equipment__node-status">
          {node.status.charAt(0).toUpperCase() + node.status.slice(1)}
        </small>
      )}
    </button>
  )
}

const statusLegend = [
  { status: 'normal', label: 'Normal' },
  { status: 'alarm', label: 'Alarm' },
  { status: 'override', label: 'Override' },
  { status: 'offline', label: 'Offline' },
] as const

export function RelatedEquipment({
  currentEquipmentId,
  previousEquipmentName,
  onSelectEquipment,
  onBack,
}: RelatedEquipmentProps) {
  const [expanded, setExpanded] = useState(false)
  const [zoom, setZoom] = useState(100)

  function changeZoom(amount: number) {
    setZoom((current) => Math.min(150, Math.max(60, current + amount)))
  }

  return (
    <section
      className={`related-equipment${expanded ? ' is-expanded' : ''}`}
      aria-labelledby="related-equipment-heading"
    >
      <header className="related-equipment__header">
        <h2 id="related-equipment-heading">Related Equipment</h2>
        {previousEquipmentName && (
          <button
            className="related-equipment__back"
            type="button"
            onClick={onBack}
          >
            Back to {previousEquipmentName}
          </button>
        )}
        <button
          className="related-equipment__expand"
          type="button"
          aria-expanded={expanded}
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </header>
      <div className="related-equipment__canvas">
        <div
          className="related-equipment__diagram"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          <svg
            className="related-equipment__connections"
            viewBox="0 0 1000 260"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d="M500 43V58H350V70M500 58H650V70" />
            <path d="M650 120V154H370M650 154H930M370 154V174M510 154V174M650 154V174M790 154V174M930 154V174" />
          </svg>
          <div className="related-equipment__upstream">
            <EquipmentNode
              node={relatedEquipment.upstream}
              currentEquipmentId={currentEquipmentId}
              onSelect={onSelectEquipment}
            />
          </div>
          <div className="related-equipment__ahu-row">
            <EquipmentNode
              node={relatedEquipment.sibling}
              currentEquipmentId={currentEquipmentId}
              onSelect={onSelectEquipment}
            />
            <EquipmentNode
              node={relatedEquipment.current}
              currentEquipmentId={currentEquipmentId}
              onSelect={onSelectEquipment}
            />
          </div>
          <div className="related-equipment__served-spaces">
            {relatedEquipment.servedSpaces.map((node) => (
              <EquipmentNode
                key={node.id}
                node={node}
                currentEquipmentId={currentEquipmentId}
                onSelect={onSelectEquipment}
              />
            ))}
            <div className="related-equipment__more-vavs">
              <strong>+9 more VAVs</strong>
              <small>Served Space</small>
            </div>
          </div>
        </div>
      </div>
      <div className="related-equipment__mobile-list" aria-label="Related equipment list">
        {[
          relatedEquipment.upstream,
          relatedEquipment.sibling,
          relatedEquipment.current,
          ...relatedEquipment.servedSpaces,
        ].map((node) => (
          <EquipmentNode
            key={node.id}
            node={node}
            currentEquipmentId={currentEquipmentId}
            onSelect={onSelectEquipment}
          />
        ))}
      </div>
      <footer className="related-equipment__footer">
        <div className="related-equipment__legend" aria-label="Equipment status legend">
          {statusLegend.map(({ status, label }) => (
            <span className={`related-equipment__legend-item is-${status}`} key={status}>
              <span aria-hidden="true" />
              {label}
            </span>
          ))}
        </div>
        <div className="related-equipment__controls" aria-label="Diagram controls">
          <button
            type="button"
            aria-label="Zoom out"
            title="Zoom out"
            onClick={() => changeZoom(-10)}
          >
            <ZoomOut size={12} />
          </button>
          <span>{zoom}%</span>
          <button
            type="button"
            aria-label="Zoom in"
            title="Zoom in"
            onClick={() => changeZoom(10)}
          >
            <ZoomIn size={12} />
          </button>
          <button
            className="related-equipment__reset"
            type="button"
            onClick={() => setZoom(100)}
          >
            <RotateCcw size={11} />
            Reset
          </button>
        </div>
      </footer>
    </section>
  )
}