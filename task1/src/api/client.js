import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('taskflow_token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const authApi = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  me: () => api.get('/auth/me'),
}

export const taskApi = {
  list: (filters = {}) => {
    const params = {}

    if (filters.search?.trim()) {
      params.search = filters.search.trim()
    }

    if (filters.status) {
      params.status = filters.status
    }

    if (filters.priority) {
      params.priority = filters.priority
    }

    return api.get('/tasks', { params })
  },

  create: (payload) => api.post('/tasks', payload),

  update: (taskId, payload) => api.patch(`/tasks/${taskId}`, payload),

  remove: (taskId) => api.delete(`/tasks/${taskId}`),
}

export const dashboardApi = {
  stats: () => api.get('/dashboard/stats'),
}

export default api
