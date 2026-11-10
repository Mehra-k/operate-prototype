import { useState, useMemo, type Dispatch, type FormEvent, type SetStateAction } from 'react'
import { ChevronDown, Trash2, Plus } from 'lucide-react'
import type { EquipmentNote } from '../data/equipmentResources.ts'

type TimeFilter = 'all' | 'today' | 'last7' | 'last30' | 'custom'

type NotesTabProps = {
  notes: EquipmentNote[]
  onNotesChange: Dispatch<SetStateAction<EquipmentNote[]>>
}

export function NotesTab({ notes, onNotesChange: setNotes }: NotesTabProps) {
  const [searchText, setSearchText] = useState('')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')
  const [customDateFrom, setCustomDateFrom] = useState('')
  const [customDateTo, setCustomDateTo] = useState('')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const [filterOpen, setFilterOpen] = useState(false)
  const [showAddNote, setShowAddNote] = useState(false)
  const [draft, setDraft] = useState('')

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  function parseDateTime(dateStr: string, timeStr: string): Date {
    const monthMap: { [key: string]: number } = {
      'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
      'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11,
    }
    const [monthStr, dayStr, yearStr] = dateStr.split(' ')
    const month = monthMap[monthStr]
    const day = parseInt(dayStr.replace(',', ''), 10)
    const year = parseInt(yearStr, 10)
    
    const [hourStr, minuteStr] = timeStr.split(':')
    const hour = parseInt(hourStr, 10)
    const minute = parseInt(minuteStr.replace(/[APM]/g, ''), 10)

    return new Date(year, month, day, hour, minute)
  }

  const filteredNotes = useMemo(() => {
    let result = notes.slice()

    // Search filter
    if (searchText.trim()) {
      const query = searchText.toLowerCase()
      result = result.filter((note) => {
        const contentMatch = note.content.toLowerCase().includes(query)
        const authorMatch = note.author.toLowerCase().includes(query)
        const dateMatch = note.date.toLowerCase().includes(query)
        return contentMatch || authorMatch || dateMatch
      })
    }

    // Time filter
    if (timeFilter !== 'all') {
      result = result.filter((note) => {
        const noteDate = parseDateTime(note.date, note.time)
        
        if (timeFilter === 'today') {
          const noteToday = new Date(noteDate.getFullYear(), noteDate.getMonth(), noteDate.getDate())
          return noteToday.getTime() === today.getTime()
        } else if (timeFilter === 'last7') {
          const sevenDaysAgo = new Date(today)
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
          return noteDate >= sevenDaysAgo && noteDate <= now
        } else if (timeFilter === 'last30') {
          const thirtyDaysAgo = new Date(today)
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
          return noteDate >= thirtyDaysAgo && noteDate <= now
        } else if (timeFilter === 'custom') {
          if (!customDateFrom || !customDateTo) return true
          const from = new Date(customDateFrom)
          const to = new Date(customDateTo)
          to.setHours(23, 59, 59, 999)
          return noteDate >= from && noteDate <= to
        }
        return true
      })
    }

    // Sort
    result.sort((a, b) => {
      const dateA = parseDateTime(a.date, a.time)
      const dateB = parseDateTime(b.date, b.time)
      return sortOrder === 'newest' ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
    })

    return result
  }, [notes, searchText, timeFilter, customDateFrom, customDateTo, sortOrder])

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
      },
      ...current,
    ])
    setDraft('')
    setShowAddNote(false)
  }

  function deleteNote(noteId: string) {
    setNotes((current) => current.filter((note) => note.id !== noteId))
  }

  const hasActiveFilters = searchText.trim() !== '' || timeFilter !== 'all'
  const isCustomRangeValid = !customDateFrom || !customDateTo || new Date(customDateFrom) <= new Date(customDateTo)

  return (
    <div className="notes-tab">
      <header className="notes-tab__header">
        <div className="notes-tab__title-row">
          <h1 className="notes-tab__title">Notes</h1>
          <button
            className="notes-tab__add-btn"
            onClick={() => setShowAddNote(!showAddNote)}
            type="button"
            title="Add a new note"
          >
            <Plus size={16} aria-hidden="true" />
            Add Note
          </button>
        </div>

        {showAddNote && (
          <form className="notes-tab__add-form" onSubmit={addNote}>
            <textarea
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
                  setShowAddNote(false)
                }}
              >
                Cancel
              </button>
              <button type="submit" disabled={!draft.trim()}>
                Add note
              </button>
            </div>
          </form>
        )}

        <div className="notes-tab__controls">
          <input
            type="search"
            className="notes-tab__search"
            placeholder="Search notes"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

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
            <button
              type="button"
              onClick={() => {
                setSearchText('')
                setTimeFilter('all')
                setCustomDateFrom('')
                setCustomDateTo('')
              }}
              className="notes-tab__clear-all"
            >
              Clear all
            </button>
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
              <>
                <p>No notes yet.</p>
                <button
                  type="button"
                  onClick={() => setShowAddNote(true)}
                  className="notes-tab__empty-add-btn"
                >
                  Add your first note
                </button>
              </>
            ) : searchText.trim() || timeFilter !== 'all' ? (
              <>
                {searchText.trim() && !timeFilter.startsWith('last') && timeFilter !== 'today' ? (
                  <p>No notes match your search.</p>
                ) : (
                  <p>No notes match the selected filters.</p>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSearchText('')
                    setTimeFilter('all')
                    setCustomDateFrom('')
                    setCustomDateTo('')
                  }}
                  className="notes-tab__empty-clear-btn"
                >
                  Clear filters
                </button>
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
