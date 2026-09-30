import { Navigate, useLocation } from 'react-router-dom'

import { useAuth } from '../context/AuthContext.jsx'

function ProtectedRoute({ children }) {
  const { token, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div className="page-loader">Loading TaskFlow...</div>
  }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
