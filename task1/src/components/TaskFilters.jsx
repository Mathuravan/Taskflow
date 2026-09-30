import { Search, SlidersHorizontal, X } from 'lucide-react'

function TaskFilters({ filters, onChange, onClear }) {
  return (
    <section className="filter-bar" aria-label="Filter tasks">
      <div className="search-field">
        <Search size={18} aria-hidden="true" />
        <input
          aria-label="Search tasks"
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
          placeholder="Search tasks"
        />
      </div>
      <div className="filter-selects">
        <SlidersHorizontal className="filter-icon" size={18} aria-hidden="true" />
        <label>
          <span className="sr-only">Status</span>
          <select
            aria-label="Filter by status"
            value={filters.status}
            onChange={(event) => onChange({ status: event.target.value })}
          >
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
        </label>
        <label>
          <span className="sr-only">Priority</span>
          <select
            aria-label="Filter by priority"
            value={filters.priority}
            onChange={(event) => onChange({ priority: event.target.value })}
          >
            <option value="">All priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
      </div>
      {(filters.search || filters.status || filters.priority) && (
        <button className="clear-button" type="button" onClick={onClear}>
          <X size={16} /> Clear
        </button>
      )}
    </section>
  )
}

export default TaskFilters
