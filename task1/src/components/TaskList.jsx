import { CalendarDays, Check, Circle, Pencil, Trash2 } from 'lucide-react'

const STATUS_LABELS = {
  pending: 'Pending',
  in_progress: 'In progress',
  completed: 'Completed',
}

function formatDate(value) {
  if (!value) return 'No due date'
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    .format(new Date(`${value}T00:00:00`))
}

function TaskList({ tasks, isLoading, onEdit, onDelete, onStatusChange }) {
  if (isLoading) {
    return <div className="task-state">Loading tasks...</div>
  }

  if (!tasks.length) {
    return <div className="task-state">No tasks match these filters.</div>
  }

  return (
    <div className="task-list">
      {tasks.map((task) => {
        const isOverdue = task.due_date && task.status !== 'completed'
          && task.due_date < new Date().toISOString().slice(0, 10)

        return (
          <article className={`task-row ${task.status === 'completed' ? 'is-completed' : ''}`} key={task.id}>
            <button
              className="completion-toggle"
              type="button"
              title={task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
              aria-label={task.status === 'completed' ? 'Mark as pending' : 'Mark as completed'}
              onClick={() => onStatusChange(task, task.status === 'completed' ? 'pending' : 'completed')}
            >
              {task.status === 'completed' ? <Check size={17} /> : <Circle size={18} />}
            </button>
            <div className="task-copy">
              <h3>{task.title}</h3>
              {task.description && <p>{task.description}</p>}
              <div className="task-meta">
                <span className={`priority-pill priority-${task.priority}`}>{task.priority}</span>
                <span className="status-text">{STATUS_LABELS[task.status]}</span>
                <span className={isOverdue ? 'due-date overdue' : 'due-date'}>
                  <CalendarDays size={14} /> {formatDate(task.due_date)}
                </span>
              </div>
            </div>
            <div className="task-actions">
              <button className="icon-button" type="button" onClick={() => onEdit(task)} title="Edit task" aria-label="Edit task">
                <Pencil size={17} />
              </button>
              <button className="icon-button danger-icon" type="button" onClick={() => onDelete(task)} title="Delete task" aria-label="Delete task">
                <Trash2 size={17} />
              </button>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default TaskList
