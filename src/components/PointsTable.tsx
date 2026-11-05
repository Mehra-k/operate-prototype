import { Search, Settings } from 'lucide-react'
import { useState, useMemo } from 'react'
import { operateOverviewData, type KeyPoint } from '../data/operateOverview.ts'

type PointsTableProps = {
  onSelectPoint: (pointId: string) => void
}

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50]

export function PointsTable({ onSelectPoint }: PointsTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)

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
        point.state.toLowerCase().includes(query)
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

  const getStatusColor = (state: KeyPoint['state']) => {
    const stateMap: Record<KeyPoint['state'], string> = {
      'Normal': 'is-normal',
      'Low': 'is-alarm',
      'High': 'is-alarm',
      'Override': 'is-override',
      'Down': 'is-down',
      'Fault': 'is-fault',
      'Out of Service': 'is-oos',
    }
    return stateMap[state] || ''
  }

  const getStatusLabel = (state: KeyPoint['state']) => {
    if (state === 'Low' || state === 'High') {
      return 'Alarm'
    }
    if (state === 'Out of Service') {
      return 'Out of Service'
    }
    return state
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
        <button className="points-table__filter" aria-label="Filter points" type="button">
          <Settings size={18} aria-hidden="true" />
        </button>
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
                  <th>Point Name</th>
                  <th>Type</th>
                  <th>Current Value</th>
                  <th>Unit</th>
                  <th>Last Read</th>
                  <th>Status</th>
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
                    <td className="points-table__cell points-table__cell--type">
                      {point.type || '—'}
                    </td>
                    <td className="points-table__cell points-table__cell--value">
                      {point.value}
                    </td>
                    <td className="points-table__cell points-table__cell--unit">
                      {point.unit || '—'}
                    </td>
                    <td className="points-table__cell points-table__cell--updated">
                      {point.updated}
                    </td>
                    <td className="points-table__cell points-table__cell--status">
                      <span className={`points-table__status ${getStatusColor(point.state)}`}>
                        {getStatusLabel(point.state)}
                      </span>
                    </td>
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
