import { useRef, useState, type Dispatch, type FormEvent, type ReactNode, type SetStateAction } from 'react'
import {
  Archive,
  ChevronUp,
  Download,
  FileSpreadsheet,
  FileText,
  Expand,
  Trash2,
  Upload,
  X,
} from 'lucide-react'
import {
  createEquipmentNote,
  type EquipmentDocument,
  type EquipmentNote,
} from '../data/equipmentResources.ts'

const equipmentImage = new URL('../assets/air-handling-unit.jpg', import.meta.url).href

export type EquipmentNotesProps = {
  notes: EquipmentNote[]
  onNotesChange: Dispatch<SetStateAction<EquipmentNote[]>>
  onViewAllNotes: () => void
  notesOpen?: boolean
  onToggleNotes?: (open: boolean) => void
}

function NotesPanel({ notes, onNotesChange: setNotes, onViewAllNotes, onToggleNotes }: EquipmentNotesProps) {
  const [draft, setDraft] = useState('')
  const recentNotes = notes.slice().sort((first, second) =>
    new Date(second.datetime).getTime() - new Date(first.datetime).getTime(),
  ).slice(0, 5)

  function addNote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const content = draft.trim()
    if (!content) return

    setNotes((current) => [createEquipmentNote(content), ...current])
    setDraft('')
  }


  function deleteNote(noteId: string) {
    setNotes((current) => current.filter((note) => note.id !== noteId))
  }

  return (
    <section className="equipment-resource-panel notes-panel" aria-labelledby="notes-heading">
      <header className="equipment-resource-panel__header">
        <h2 id="notes-heading">Notes</h2>
        {onToggleNotes && (
          <button
            className="notes-panel__collapse-btn"
            onClick={() => onToggleNotes(false)}
            aria-label="Collapse Notes panel"
            type="button"
            title="Collapse Notes"
          >
            <ChevronUp size={20} aria-hidden="true" />
          </button>
        )}
      </header>
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
            }}>
              Cancel
            </button>
            <button type="submit" disabled={!draft.trim()}>Add note</button>
          </div>
      </form>
      <div className="notes-panel__list">
        {recentNotes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            onDelete={deleteNote}
          />
        ))}
        {notes.length > 5 && (
          <button type="button" className="notes-panel__show-more" onClick={onViewAllNotes}>Show more</button>
        )}
      </div>
    </section>
  )
}

function NoteItem({
  note,
  onDelete,
}: {
  note: EquipmentNote
  onDelete: (noteId: string) => void
}) {
  const initials = note.author
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

  return (
    <article className="notes-panel__note">
      <div className="notes-panel__avatar" aria-hidden="true">{initials}</div>
      <div className="notes-panel__note-body">
        <div className="notes-panel__note-meta">
          <strong>{note.author}</strong>
          <time dateTime={note.datetime}>{note.date}, {note.time}</time>
        </div>
        <p>{note.content}</p>
      </div>
      <div className="notes-panel__note-actions">
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

export function DocumentsPanel({
  documents,
  onDocumentsChange,
  selectedDocumentId,
  onSelectDocument,
}: {
  documents: EquipmentDocument[]
  onDocumentsChange: Dispatch<SetStateAction<EquipmentDocument[]>>
  selectedDocumentId: string | null
  onSelectDocument: (documentId: string | null) => void
}) {
  const [previewDocument, setPreviewDocument] = useState<EquipmentDocument | null>(null)
  const [uploadError, setUploadError] = useState('')
  const previewDialog = useRef<HTMLDialogElement>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  function addFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (documents.some((document) => document.name.toLowerCase() === file.name.toLowerCase())) {
      setUploadError('A file with this name already exists.')
      return
    }
    setUploadError('')
    const extension = file.name.includes('.') ? file.name.split('.').pop()?.toUpperCase() : undefined
    const size = file.size < 1024 ? `${file.size} B` : file.size < 1024 * 1024 ? `${(file.size / 1024).toFixed(1)} KB` : `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    onDocumentsChange((current) => [...current, { id: crypto.randomUUID(), name: file.name, type: extension || file.type || 'File', size, file }])
  }

  function openPreview(document: EquipmentDocument, event: React.MouseEvent) {
    event.stopPropagation()
    setPreviewDocument(document)
    previewDialog.current?.showModal()
  }

  function closePreview() {
    previewDialog.current?.close()
    setPreviewDocument(null)
  }

  function handleDownload(document: EquipmentDocument, event: React.MouseEvent) {
    event.stopPropagation()
    if (document.file) {
      const url = URL.createObjectURL(document.file)
      const link = window.document.createElement('a')
      link.href = url
      link.download = document.name
      link.click()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      return
    }
    // For prototype: show a browser download dialog for actual files if available
    // Otherwise just trigger the browser's download mechanism
    console.log(`Download triggered for: ${document.name}`)
    // In a real app, this would trigger a backend download or link to actual file
  }

  return (
    <>
      <section className="equipment-resource-panel documents-panel" aria-labelledby="documents-heading">
        <header className="equipment-resource-panel__header">
          <div className="documents-panel__heading"><h2 id="documents-heading">Files</h2><span>{documents.length}</span></div>
          <button type="button" className="equipment-resource-panel__header-action" onClick={() => fileInput.current?.click()}><Upload size={12} aria-hidden="true" /> Upload a file</button>
          <input ref={fileInput} type="file" hidden onChange={addFile} aria-label="Select a file to upload" />
        </header>
        {uploadError && <p role="alert">{uploadError}</p>}
        <div className="documents-panel__list">
          {documents.map((document) => (
            <div
              className={`documents-panel__row${selectedDocumentId === document.id ? ' is-selected' : ''}`}
              key={document.id}
            >
              <button
                className="documents-panel__document"
                type="button"
                aria-pressed={selectedDocumentId === document.id}
                onClick={() => onSelectDocument(document.id)}
              >
                <span className={`documents-panel__icon is-${document.type.toLowerCase()}`}>
                  <DocumentIcon type={document.type} />
                </span>
                <span className="documents-panel__details">
                  <strong>{document.name}</strong>
                  <small>{document.type} · {document.size}</small>
                </span>
              </button>
              <div className="documents-panel__actions">
                <button
                  className="documents-panel__action"
                  type="button"
                  title={`Preview ${document.name}`}
                  aria-label={`Preview ${document.name}`}
                  onClick={(e) => openPreview(document, e)}
                >
                  <Expand size={16} aria-hidden="true" />
                </button>
                <button
                  className="documents-panel__action"
                  type="button"
                  title={`Download ${document.name}`}
                  aria-label={`Download ${document.name}`}
                  onClick={(e) => handleDownload(document, e)}
                >
                  <Download size={16} aria-hidden="true" />
                </button>
                <button
                  className="documents-panel__action"
                  type="button"
                  title={`Delete ${document.name}`}
                  aria-label={`Delete ${document.name}`}
                  onClick={() => {
                    onDocumentsChange((current) => current.filter((entry) => entry.id !== document.id))
                    if (selectedDocumentId === document.id) onSelectDocument(null)
                  }}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <dialog className="documents-preview-dialog" ref={previewDialog} aria-labelledby="preview-heading">
        {previewDocument && (
          <>
            <header className="documents-preview-dialog__header">
              <h2 id="preview-heading">Preview: {previewDocument.name}</h2>
              <button
                type="button"
                aria-label="Close preview"
                title="Close"
                onClick={closePreview}
              >
                <X size={16} aria-hidden="true" />
              </button>
            </header>
            <div className="documents-preview-dialog__content">
              {previewDocument.id === 'equipment-photos' ? (
                <div className="documents-preview-dialog__image-gallery">
                  <img
                    src={equipmentImage}
                    alt="Equipment photo 1 of 3"
                    className="documents-preview-dialog__preview-image"
                  />
                  <img
                    src={equipmentImage}
                    alt="Equipment photo 2 of 3"
                    className="documents-preview-dialog__preview-image"
                  />
                  <img
                    src={equipmentImage}
                    alt="Equipment photo 3 of 3"
                    className="documents-preview-dialog__preview-image"
                  />
                  <p className="documents-preview-dialog__note">Equipment Photos (3 images)</p>
                </div>
              ) : (
                <div className="documents-preview-dialog__placeholder">
                  <FileIcon type={previewDocument.type} size={48} />
                  <p><strong>{previewDocument.name}</strong></p>
                  <p className="documents-preview-dialog__file-info">
                    {previewDocument.type} file · {previewDocument.size}
                  </p>
                  <p className="documents-preview-dialog__message">
                    Document preview not available in this prototype.
                  </p>
                </div>
              )}
            </div>
            <footer className="documents-preview-dialog__footer">
              <button type="button" onClick={closePreview} className="documents-preview-dialog__close">
                Close
              </button>
            </footer>
          </>
        )}
      </dialog>
    </>
  )
}

function FileIcon({ type, size }: { type: EquipmentDocument['type']; size: number }): ReactNode {
  if (type === 'XLSX') return <FileSpreadsheet size={size} aria-hidden="true" />
  if (type === 'ZIP') return <Archive size={size} aria-hidden="true" />
  return <FileText size={size} aria-hidden="true" />
}

export function EquipmentResources({ notes, onNotesChange, onViewAllNotes, onToggleNotes }: EquipmentNotesProps) {
  return (
    <div className="equipment-resources">
      <NotesPanel notes={notes} onNotesChange={onNotesChange} onViewAllNotes={onViewAllNotes} onToggleNotes={onToggleNotes} />
    </div>
  )
}