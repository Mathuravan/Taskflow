import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle2, Clock3, ListTodo, Plus } from 'lucide-react'

import { dashboardApi, taskApi } from '../api/client.js'
import AppShell from '../components/AppShell.jsx'
import StatCard from '../components/StatCard.jsx'
import TaskFilters from '../components/TaskFilters.jsx'
import TaskForm from '../components/TaskForm.jsx'
import TaskList from '../components/TaskList.jsx'

const EMPTY_STATS = {
  total_tasks: 0,
  pending_tasks: 0,
  in_progress_tasks: 0,
  completed_tasks: 0,
  overdue_tasks: 0,
}

function requestError(error) {
  const detail = error.response?.data?.detail

  if (typeof detail === 'string') {
    return detail
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => item?.msg || 'Request validation failed.')
      .join(' ')
  }

  return 'We could not update your tasks. Please try again.'
}

function DashboardPage() {
  const [tasks, setTasks] = useState([])
  const [stats, setStats] = useState(EMPTY_STATS)
  const [filters, setFilters] = useState({ search: '', status: '', priority: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [modalTask, setModalTask] = useState(undefined)
  const [refreshIndex, setRefreshIndex] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const delay = filters.search ? 250 : 0
    const timer = window.setTimeout(async () => {
      setIsLoading(true)
      setError('')
      try {
        const [tasksResponse, statsResponse] = await Promise.all([
          taskApi.list(filters),
          dashboardApi.stats(),
        ])
        if (active) {
          setTasks(tasksResponse.data)
          setStats(statsResponse.data)
        }
      } catch (requestFailure) {
        if (active) setError(requestError(requestFailure))
      } finally {
        if (active) setIsLoading(false)
      }
    }, delay)

    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [filters, refreshIndex])

  function refresh() {
    setRefreshIndex((current) => current + 1)
  }

  async function saveTask(payload) {
    setIsSaving(true)
    setError('')
    try {
      if (modalTask) {
        await taskApi.update(modalTask.id, payload)
      } else {
        await taskApi.create(payload)
      }
      setModalTask(undefined)
      refresh()
    } catch (requestFailure) {
      setError(requestError(requestFailure))
    } finally {
      setIsSaving(false)
    }
  }

  async function changeStatus(task, status) {
    setError('')
    try {
      await taskApi.update(task.id, { status })
      refresh()
    } catch (requestFailure) {
      setError(requestError(requestFailure))
    }
  }

  async function deleteTask(task) {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return

    setError('')
    try {
      await taskApi.remove(task.id)
      refresh()
    } catch (requestFailure) {
      setError(requestError(requestFailure))
    }
  }

  return (
    <AppShell>
      <section className="dashboard-heading">
        <div>
          <p className="eyebrow">Overview</p>
          <h1>Your tasks</h1>
          <p className="dashboard-subtitle">A focused view of what needs your attention.</p>
        </div>
        <button className="primary-button" type="button" onClick={() => setModalTask(null)}>
          <Plus size={18} /> New task
        </button>
      </section>

      <section className="stats-grid" aria-label="Task statistics">
        <StatCard label="Total tasks" value={stats.total_tasks} tone="blue" icon={ListTodo} />
        <StatCard label="Pending" value={stats.pending_tasks} tone="amber" icon={Clock3} />
        <StatCard label="In progress" value={stats.in_progress_tasks} tone="violet" icon={AlertTriangle} />
        <StatCard label="Completed" value={stats.completed_tasks} tone="green" icon={CheckCircle2} />
        <StatCard label="Overdue" value={stats.overdue_tasks} tone="rose" icon={AlertTriangle} />
      </section>

      <section className="task-section" aria-labelledby="tasks-heading">
        <div className="section-heading">
          <div>
            <h2 id="tasks-heading">Task list</h2>
            <p>{tasks.length} visible {tasks.length === 1 ? 'task' : 'tasks'}</p>
          </div>
        </div>
        <TaskFilters
          filters={filters}
          onChange={(nextFilters) => setFilters((current) => ({ ...current, ...nextFilters }))}
          onClear={() => setFilters({ search: '', status: '', priority: '' })}
        />
        {error && <p className="page-error" role="alert">{error}</p>}
        <TaskList
          tasks={tasks}
          isLoading={isLoading}
          onEdit={(task) => setModalTask(task)}
          onDelete={deleteTask}
          onStatusChange={changeStatus}
        />
      </section>

      {modalTask !== undefined && (
        <TaskForm key={modalTask?.id || 'new'}
          task={modalTask}
          onClose={() => setModalTask(undefined)}
          onSave={saveTask}
          isSaving={isSaving}
        />
      )}
    </AppShell>
  )
}

export default DashboardPage
