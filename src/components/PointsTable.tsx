import { Search, Settings } from 'lucide-react'
import { useState, useMemo } from 'react'
import { getPointStatuses, operateOverviewData } from '../data/operateOverview.ts'
import { PointStatusChips } from './PointStatusChips.tsx'

type PointsTableProps = {
  onSelectPoint: (pointId: string) => void
}

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50]
const columns = ['Point Name', 'Type', 'Current Value', 'Unit', 'Last Read', 'Status', 'Controlling Device', 'Device Point Name'] as const
type PointColumn = (typeof columns)[number]

export function PointsTable({ onSelectPoint }: PointsTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [visibleColumns, setVisibleColumns] = useState<PointColumn[]>(columns.slice(0, 6))

  const filteredPoints = useMemo(() => {
    if (!searchQuery.trim()) {
      return operateOverviewData.keyPoints
    }

    const query = searchQuery.toLowerCase()
    return operateOverviewData.keyPoints.filter((point) => {
      return (
        point.pointName.toLowerCase().includes(query) ||
        point.id.toLowerCase().includes(query) ||
        (point.type && point.type.toLowerCase().includes(query)) ||
        point.value.toLowerCase().includes(query) ||
        point.unit.toLowerCase().includes(query) ||
        getPointStatuses(point).some((status) => status.toLowerCase().includes(query)) ||
        (point.controllingDevice?.toLowerCase().includes(query) ?? false) ||
        (point.devicePointName?.toLowerCase().includes(query) ?? false)
      )
    })
  }, [searchQuery])

  const totalPages = Math.ceil(filteredPoints.length / itemsPerPage)
  const startIdx = (currentPage - 1) * itemsPerPage
  const endIdx = startIdx + itemsPerPage
  const visiblePoints = filteredPoints.slice(startIdx, endIdx)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value))
    setCurrentPage(1)
  }

  return (
    <section className="points-table-wrapper" aria-labelledby="points-tab-heading">
      <div className="points-table__search-container">
        <div className="points-table__search">
          <Search size={16} aria-hidden="true" className="points-table__search-icon" />
          <input
            type="text"
            placeholder="Search points"
            value={searchQuery}
            onChange={handleSearch}
            className="points-table__search-input"
            aria-label="Search points"
          />
        </div>
        <div className="points-table__settings">
          <button className="points-table__filter" aria-label="Column settings" aria-expanded={settingsOpen} type="button" onClick={() => setSettingsOpen((open) => !open)}>
            <Settings size={18} aria-hidden="true" />
          </button>
          {settingsOpen && (
            <div className="points-table__column-menu" role="group" aria-label="Columns">
              <strong>Columns</strong>
              {columns.map((column) => (
                <label key={column}>
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(column)}
                    disabled={column === 'Point Name'}
                    onChange={(event) => setVisibleColumns((current) => event.target.checked ? [...current, column] : current.filter((entry) => entry !== column))}
                  />
                  {column}
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {filteredPoints.length === 0 ? (
        <div className="points-table__empty">
          <p>No points match your search.</p>
          {searchQuery.trim() && (
            <button
              className="points-table__clear-search"
              onClick={() => {
                setSearchQuery('')
                setCurrentPage(1)
              }}
              type="button"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="points-table__container">
            <table className="points-table" role="table">
              <thead>
                <tr>
                  {columns.filter((column) => visibleColumns.includes(column)).map((column) => <th key={column}>{column}</th>)}
                </tr>
              </thead>
              <tbody>
                {visiblePoints.map((point) => (
                  <tr key={point.id} className="points-table__row">
                    <td className="points-table__cell points-table__cell--name">
                      <button
                        className="points-table__point-link"
                        onClick={() => onSelectPoint(point.id)}
                        type="button"
                      >
                        {point.pointName}
                      </button>
                    </td>
                    {visibleColumns.includes('Type') && <td className="points-table__cell points-table__cell--type">
                      {point.type || '—'}
                    </td>}
                    {visibleColumns.includes('Current Value') && <td className="points-table__cell points-table__cell--value">
                      {point.value}
                    </td>}
                    {visibleColumns.includes('Unit') && <td className="points-table__cell points-table__cell--unit">
                      {point.unit || '—'}
                    </td>}
                    {visibleColumns.includes('Last Read') && <td className="points-table__cell points-table__cell--updated">
                      {point.updated}
                    </td>}
                    {visibleColumns.includes('Status') && <td className="points-table__cell points-table__cell--status"><PointStatusChips point={point} /></td>}
                    {visibleColumns.includes('Controlling Device') && <td className="points-table__cell">{point.controllingDevice || '-'}</td>}
                    {visibleColumns.includes('Device Point Name') && <td className="points-table__cell">{point.devicePointName || '-'}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="points-table__footer">
            <div className="points-table__item-count">
              {filteredPoints.length} {filteredPoints.length === 1 ? 'item' : 'items'}
            </div>

            <div className="points-table__items-per-page">
              <label htmlFor="items-select">Items per page:</label>
              <select
                id="items-select"
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="points-table__items-select"
              >
                {ITEMS_PER_PAGE_OPTIONS.map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div className="points-table__pagination">
              <button
                className="points-table__pagination-btn"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                type="button"
                aria-label="First page"
              >
                &#171;
              </button>
              <button
                className="points-table__pagination-btn"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                type="button"
                aria-label="Previous page"
              >
                &#8249;
              </button>
              <span className="points-table__page-info">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                className="points-table__pagination-btn"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                type="button"
                aria-label="Next page"
              >
                &#8250;
              </button>
              <button
                className="points-table__pagination-btn"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                type="button"
                aria-label="Last page"
              >
                &#187;
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  )
}
