import { useState } from 'react'
import { X } from 'lucide-react'

function createInitialTask(task) {
  if (task) return { ...task, due_date: task.due_date || '' }

  return {
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending',
    due_date: '',
  }
}

function TaskForm({ task, onClose, onSave, isSaving }) {
  const [form, setForm] = useState(() => createInitialTask(task))
  const [error, setError] = useState('')

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function submit(event) {
    event.preventDefault()
    if (!form.title.trim()) {
      setError('A task title is required.')
      return
    }

    onSave({
      ...form,
      title: form.title.trim(),
      description: (form.description || '').trim() || null,
      due_date: form.due_date || null,
    })
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section className="task-modal" role="dialog" aria-modal="true" aria-labelledby="task-form-title">
        <div className="modal-header">
          <div>
            <p className="eyebrow">{task ? 'Update task' : 'New task'}</p>
            <h2 id="task-form-title">{task ? 'Edit task' : 'Create a task'}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} title="Close" aria-label="Close">
            <X size={20} />
          </button>
        </div>
        <form className="task-form" onSubmit={submit}>
          <label>
            <span>Title</span>
            <input name="title" value={form.title} onChange={updateField} maxLength="150" autoFocus />
          </label>
          <label>
            <span>Description <em>Optional</em></span>
            <textarea name="description" value={form.description || ''} onChange={updateField} maxLength="2000" rows="4" />
          </label>
          <div className="form-grid">
            <label>
              <span>Priority</span>
              <select name="priority" value={form.priority} onChange={updateField}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
            <label>
              <span>Status</span>
              <select name="status" value={form.status} onChange={updateField}>
                <option value="pending">Pending</option>
                <option value="in_progress">In progress</option>
                <option value="completed">Completed</option>
              </select>
            </label>
          </div>
          <label>
            <span>Due date <em>Optional</em></span>
            <input name="due_date" type="date" value={form.due_date || ''} onChange={updateField} />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="modal-actions">
            <button className="secondary-button" type="button" onClick={onClose}>Cancel</button>
            <button className="primary-button" type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : task ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default TaskForm