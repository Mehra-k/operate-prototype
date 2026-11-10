import { useState, type Dispatch, type FormEvent, type SetStateAction } from 'react'
import { ChevronDown, Search, Trash2 } from 'lucide-react'
import { createEquipmentNote, type EquipmentNote } from '../data/equipmentResources.ts'

type TimeFilter = 'all' | 'today' | 'last7' | 'last30' | 'custom'
type NoteTypeFilter = 'all' | EquipmentNote['type']

type NotesTabProps = {
  notes: EquipmentNote[]
  onNotesChange: Dispatch<SetStateAction<EquipmentNote[]>>
}

export function NotesTab({ notes, onNotesChange: setNotes }: NotesTabProps) {
  const [searchText, setSearchText] = useState('')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')
  const [noteTypeFilter, setNoteTypeFilter] = useState<NoteTypeFilter>('all')
  const [customDateFrom, setCustomDateFrom] = useState('')
  const [customDateTo, setCustomDateTo] = useState('')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const [filterOpen, setFilterOpen] = useState(false)
  const [draft, setDraft] = useState('')

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const query = searchText.trim().toLowerCase()
  const filteredNotes = notes.filter((note) => {
    const matchesSearch = !query || [note.content, note.author, note.date, note.time, note.type.replace('-', ' ')]
      .some((value) => value.toLowerCase().includes(query))
    if (!matchesSearch || (noteTypeFilter !== 'all' && note.type !== noteTypeFilter)) return false

    const noteDate = new Date(note.datetime)
    if (timeFilter === 'today') return noteDate >= today && noteDate <= now
    if (timeFilter === 'last7' || timeFilter === 'last30') {
      const start = new Date(today)
      start.setDate(start.getDate() - (timeFilter === 'last7' ? 7 : 30))
      return noteDate >= start && noteDate <= now
    }
    if (timeFilter === 'custom') {
      const from = customDateFrom ? new Date(`${customDateFrom}T00:00:00`) : null
      const to = customDateTo ? new Date(`${customDateTo}T23:59:59.999`) : null
      return (!from || noteDate >= from) && (!to || noteDate <= to)
    }
    return true
  }).sort((first, second) => {
    const difference = new Date(first.datetime).getTime() - new Date(second.datetime).getTime()
    return sortOrder === 'newest' ? -difference : difference
  })

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

  const hasFilters = timeFilter !== 'all' || noteTypeFilter !== 'all'
  const hasActiveFilters = Boolean(query) || hasFilters
  const isCustomRangeValid = !customDateFrom || !customDateTo || new Date(customDateFrom) <= new Date(customDateTo)

  function clearFilters() {
    setTimeFilter('all')
    setNoteTypeFilter('all')
    setCustomDateFrom('')
    setCustomDateTo('')
  }

  return (
    <div className="notes-tab">
      <header className="notes-tab__header">
        <div className="notes-tab__title-row">
          <h1 className="notes-tab__title">Notes</h1>
        </div>

          <form className="notes-tab__add-form" onSubmit={addNote}>
            <textarea
              aria-label="Note"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Enter a note"
              className="notes-tab__add-textarea"
              required
            />
            <div className="notes-tab__add-actions">
              <button
                type="button"
                onClick={() => {
                  setDraft('')
                }}
              >
                Cancel
              </button>
              <button type="submit" disabled={!draft.trim()}>
                Add note
              </button>
            </div>
          </form>

        <div className="notes-tab__controls">
          <div className="notes-tab__search-wrapper">
            <Search size={16} aria-hidden="true" />
            <input
              type="search"
              className="notes-tab__search"
              aria-label="Search notes"
              placeholder="Search notes"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <div className="notes-tab__filter-sort">
            <div className="notes-tab__filter-wrapper">
              <button
                className="notes-tab__control-btn"
                onClick={() => setFilterOpen(!filterOpen)}
                type="button"
                aria-expanded={filterOpen}
              >
                Filter
                <ChevronDown size={16} aria-hidden="true" />
              </button>
              {filterOpen && (
                <div className="notes-tab__filter-menu">
                  <div className="notes-tab__filter-section">
                    <div className="notes-tab__filter-label">Note type</div>
                    {([
                      ['all', 'All Notes'],
                      ['system-generated', 'System generated Notes'],
                      ['user-generated', 'User generated Notes'],
                    ] as const).map(([value, label]) => (
                      <label key={value} className="notes-tab__filter-option">
                        <input type="radio" name="note-type-filter" value={value} checked={noteTypeFilter === value} onChange={() => setNoteTypeFilter(value)} />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                  <div className="notes-tab__filter-section">
                    <div className="notes-tab__filter-label">Time</div>
                    {(['all', 'today', 'last7', 'last30', 'custom'] as const).map((option) => (
                      <label key={option} className="notes-tab__filter-option">
                        <input
                          type="radio"
                          name="time-filter"
                          value={option}
                          checked={timeFilter === option}
                          onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                        />
                        <span>
                          {option === 'all' && 'All time'}
                          {option === 'today' && 'Today'}
                          {option === 'last7' && 'Last 7 days'}
                          {option === 'last30' && 'Last 30 days'}
                          {option === 'custom' && 'Custom date range'}
                        </span>
                      </label>
                    ))}
                  </div>

                  {timeFilter === 'custom' && (
                    <div className="notes-tab__filter-custom-range">
                      <div className="notes-tab__date-input-group">
                        <label htmlFor="custom-from">From</label>
                        <input
                          id="custom-from"
                          type="date"
                          value={customDateFrom}
                          onChange={(e) => setCustomDateFrom(e.target.value)}
                        />
                      </div>
                      <div className="notes-tab__date-input-group">
                        <label htmlFor="custom-to">To</label>
                        <input
                          id="custom-to"
                          type="date"
                          value={customDateTo}
                          onChange={(e) => setCustomDateTo(e.target.value)}
                        />
                      </div>
                      {!isCustomRangeValid && (
                        <div className="notes-tab__filter-error">
                          From date must be before To date
                        </div>
                      )}
                    </div>
                  )}

                  <div className="notes-tab__filter-actions">
                    <button
                      type="button"
                      onClick={() => setFilterOpen(false)}
                      className="notes-tab__filter-close"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="notes-tab__sort-wrapper">
              <select
                className="notes-tab__control-select"
                aria-label="Sort notes"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="notes-tab__active-filters">
            {searchText.trim() && (
              <div className="notes-tab__filter-chip">
                <span>Searching: "{searchText}"</span>
                <button
                  type="button"
                  onClick={() => setSearchText('')}
                  aria-label="Clear search"
                  className="notes-tab__chip-close"
                >
                  ×
                </button>
              </div>
            )}
            {timeFilter !== 'all' && (
              <div className="notes-tab__filter-chip">
                <span>
                  {timeFilter === 'today' && 'Today'}
                  {timeFilter === 'last7' && 'Last 7 days'}
                  {timeFilter === 'last30' && 'Last 30 days'}
                  {timeFilter === 'custom' && 'Custom range'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setTimeFilter('all')
                    setCustomDateFrom('')
                    setCustomDateTo('')
                  }}
                  aria-label="Clear time filter"
                  className="notes-tab__chip-close"
                >
                  ×
                </button>
              </div>
            )}
            {noteTypeFilter !== 'all' && (
              <div className="notes-tab__filter-chip">
                <span>{noteTypeFilter === 'system-generated' ? 'System generated Notes' : 'User generated Notes'}</span>
                <button type="button" onClick={() => setNoteTypeFilter('all')} aria-label="Clear note type filter" className="notes-tab__chip-close">×</button>
              </div>
            )}
            {hasFilters && <button type="button" onClick={clearFilters} className="notes-tab__clear-all">Clear filters</button>}
          </div>
        )}

        <div className="notes-tab__result-count">
          {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
        </div>
      </header>

      <div className="notes-tab__list">
        {filteredNotes.length === 0 ? (
          <div className="notes-tab__empty-state">
            {notes.length === 0 ? (
              <p>No notes yet.</p>
            ) : query || hasFilters ? (
              <>
                {query ? (
                  <p>No notes match your search.</p>
                ) : (
                  <p>No notes match the selected filters.</p>
                )}
                {query && <button type="button" onClick={() => setSearchText('')} className="notes-tab__empty-clear-btn">Clear search</button>}
                {hasFilters && <button type="button" onClick={clearFilters} className="notes-tab__empty-clear-btn">Clear filters</button>}
              </>
            ) : null}
          </div>
        ) : (
          filteredNotes.map((note) => (
            <NoteItemTabVersion
              key={note.id}
              note={note}
              onDelete={deleteNote}
            />
          ))
        )}
      </div>
    </div>
  )
}

function NoteItemTabVersion({
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
    <article className="notes-tab__note">
      <div className="notes-tab__note-header">
        <div className="notes-tab__note-avatar" aria-hidden="true">
          {initials}
        </div>
        <div className="notes-tab__note-meta">
          <strong className="notes-tab__note-author">{note.author}</strong>
          <time dateTime={note.datetime} className="notes-tab__note-datetime">
            {note.date} · {note.time}
          </time>
          <span className="notes-tab__note-datetime">{note.type === 'system-generated' ? 'System generated' : 'User generated'}</span>
        </div>
      </div>
      <div className="notes-tab__note-body">
        <p className="notes-tab__note-content">{note.content}</p>
      </div>
      <div className="notes-tab__note-footer">
        <button
          type="button"
          className="notes-tab__note-delete"
          aria-label={`Delete note by ${note.author}`}
          title="Delete note"
          onClick={() => onDelete(note.id)}
        >
          <Trash2 size={16} aria-hidden="true" />
          Delete
        </button>
      </div>
    </article>
  )
}
