import { useState, type FormEvent } from 'react'
import {
  Archive,
  Camera,
  Check,
  Compass,
  FileSpreadsheet,
  FileText,
  MapPin,
  Plus,
  Trash2,
} from 'lucide-react'
import {
  equipmentDocuments,
  fieldInformation,
  initialEquipmentNotes,
  type EquipmentDocument,
  type EquipmentNote,
} from '../data/equipmentResources.ts'

function NotesPanel() {
  const [notes, setNotes] = useState(initialEquipmentNotes)
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [draft, setDraft] = useState('')

  function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const content = draft.trim()
    if (!content) return

    const createdAt = new Date()
    const date = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(createdAt)
    const time = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    }).format(createdAt)

    setNotes((current) => [
      {
        id: `note-${createdAt.getTime()}`,
        content,
        author: 'Jon Smith',
        date,
        time,
        datetime: createdAt.toISOString(),
        resolved: false,
      },
      ...current,
    ])
    setDraft('')
    setIsAddingNote(false)
  }

  function markResolved(noteId: string) {
    setNotes((current) => current.map((note) =>
      note.id === noteId ? { ...note, resolved: true } : note,
    ))
  }

  function deleteNote(noteId: string) {
    setNotes((current) => current.filter((note) => note.id !== noteId))
  }

  return (
    <section className="equipment-resource-panel notes-panel" aria-labelledby="notes-heading">
      <header className="equipment-resource-panel__header">
        <h2 id="notes-heading">Notes</h2>
        <button
          className="equipment-resource-panel__header-action"
          type="button"
          aria-expanded={isAddingNote}
          onClick={() => setIsAddingNote((current) => !current)}
        >
          <Plus size={12} aria-hidden="true" />
          Add Note
        </button>
      </header>
      {isAddingNote && (
        <form className="notes-panel__form" onSubmit={addNote}>
          <label htmlFor="equipment-note-draft">Note</label>
          <textarea
            id="equipment-note-draft"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Enter a note"
            required
          />
          <div className="notes-panel__form-actions">
            <button type="button" onClick={() => {
              setDraft('')
              setIsAddingNote(false)
            }}>
              Cancel
            </button>
            <button type="submit" disabled={!draft.trim()}>Add note</button>
          </div>
        </form>
      )}
      <div className="notes-panel__list">
        {notes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            onResolve={markResolved}
            onDelete={deleteNote}
          />
        ))}
      </div>
    </section>
  )
}

function NoteItem({
  note,
  onResolve,
  onDelete,
}: {
  note: EquipmentNote
  onResolve: (noteId: string) => void
  onDelete: (noteId: string) => void
}) {
  const initials = note.author
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

  return (
    <article className={`notes-panel__note${note.resolved ? ' is-resolved' : ''}`}>
      <div className="notes-panel__avatar" aria-hidden="true">{initials}</div>
      <div className="notes-panel__note-body">
        <div className="notes-panel__note-meta">
          <strong>{note.author}</strong>
          <time dateTime={note.datetime}>{note.date}, {note.time}</time>
          {note.resolved && <span className="notes-panel__resolved-label">Resolved</span>}
        </div>
        <p>{note.content}</p>
      </div>
      <div className="notes-panel__note-actions">
        {!note.resolved && (
          <button
            type="button"
            aria-label={`Resolve note by ${note.author}`}
            title="Resolve note"
            onClick={() => onResolve(note.id)}
          >
            <Check size={12} aria-hidden="true" />
          </button>
        )}
        <button
          type="button"
          aria-label={`Delete note by ${note.author}`}
          title="Delete note"
          onClick={() => onDelete(note.id)}
        >
          <Trash2 size={12} aria-hidden="true" />
        </button>
      </div>
    </article>
  )
}

function DocumentIcon({ type }: { type: EquipmentDocument['type'] }) {
  if (type === 'XLSX') return <FileSpreadsheet size={16} aria-hidden="true" />
  if (type === 'ZIP') return <Archive size={16} aria-hidden="true" />
  return <FileText size={16} aria-hidden="true" />
}

function DocumentsPanel() {
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null)

  return (
    <section className="equipment-resource-panel documents-panel" aria-labelledby="documents-heading">
      <header className="equipment-resource-panel__header">
        <h2 id="documents-heading">Associated Documents</h2>
        <span>{equipmentDocuments.length}</span>
      </header>
      <div className="documents-panel__list">
        {equipmentDocuments.map((document) => (
          <button
            className={`documents-panel__document${selectedDocumentId === document.id ? ' is-selected' : ''}`}
            type="button"
            key={document.id}
            aria-pressed={selectedDocumentId === document.id}
            onClick={() => setSelectedDocumentId(document.id)}
          >
            <span className={`documents-panel__icon is-${document.type.toLowerCase()}`}>
              <DocumentIcon type={document.type} />
            </span>
            <span className="documents-panel__details">
              <strong>{document.name}</strong>
              <small>{document.type} · {document.size}</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

function FieldInformationPanel() {
  return (
    <section className="equipment-resource-panel field-information-panel" aria-labelledby="field-information-heading">
      <header className="equipment-resource-panel__header">
        <h2 id="field-information-heading">Field Information</h2>
      </header>
      <div className="field-information-panel__photo" role="img" aria-label="Equipment photo placeholder">
        <Camera size={19} aria-hidden="true" />
        <span>Equipment photo</span>
      </div>
      <dl className="field-information-panel__list">
        <div>
          <MapPin size={13} aria-hidden="true" />
          <dt>Location</dt>
          <dd>{fieldInformation.location}</dd>
        </div>
        <div>
          <MapPin size={13} aria-hidden="true" />
          <dt>Access</dt>
          <dd>{fieldInformation.access}</dd>
        </div>
        <div>
          <Compass size={13} aria-hidden="true" />
          <dt>Orientation</dt>
          <dd>{fieldInformation.orientation}</dd>
        </div>
      </dl>
    </section>
  )
}

export function EquipmentResources() {
  return (
    <div className="equipment-resources">
      <DocumentsPanel />
      <NotesPanel />
      <FieldInformationPanel />
    </div>
  )
}