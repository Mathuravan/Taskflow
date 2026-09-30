import { useState } from 'react'
import { CheckSquare2 } from 'lucide-react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../context/AuthContext.jsx'

function errorMessage(error) {
  const detail = error.response?.data?.detail

  if (typeof detail === 'string') {
    return detail
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => item?.msg || 'Request validation failed.')
      .join(' ')
  }

  return 'Something went wrong. Please try again.'
}

function AuthPage({ mode }) {
  const isRegistering = mode === 'register'
  const { token, isLoading, login, register } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const destination = location.state?.from?.pathname || '/dashboard'

  if (!isLoading && token) {
    return <Navigate to="/dashboard" replace />
  }

  function updateForm(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function submit(event) {
    event.preventDefault()
    setError('')

    if (isRegistering && form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      const credentials = { email: form.email.trim(), password: form.password }
      if (isRegistering) {
        await register(credentials)
      } else {
        await login(credentials)
      }
      navigate(destination, { replace: true })
    } catch (requestError) {
      setError(errorMessage(requestError))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-brand-panel">
        <div className="auth-brand">
          <span className="brand-mark large"><CheckSquare2 size={29} /></span>
          <span>TaskFlow</span>
        </div>
        <div className="auth-intro">
          <p className="eyebrow">Personal workbench</p>
          <h1>Make today feel manageable.</h1>
          <p>Plan the work that matters, then let the next clear action lead.</p>
        </div>
      </section>
      <section className="auth-form-panel">
        <div className="auth-form-wrap">
          <p className="eyebrow">{isRegistering ? 'Create account' : 'Welcome back'}</p>
          <h2>{isRegistering ? 'Start your workspace' : 'Sign in to TaskFlow'}</h2>
          <form className="auth-form" onSubmit={submit}>
            <label>
              <span>Email address</span>
              <input name="email" type="email" value={form.email} onChange={updateForm} autoComplete="email" required />
            </label>
            <label>
              <span>Password</span>
              <input name="password" type="password" value={form.password} onChange={updateForm} autoComplete={isRegistering ? 'new-password' : 'current-password'} minLength="8" required />
            </label>
            {isRegistering && (
              <label>
                <span>Confirm password</span>
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={updateForm} autoComplete="new-password" minLength="8" required />
              </label>
            )}
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="primary-button wide-button" type="submit" disabled={submitting}>
              {submitting ? 'Please wait...' : isRegistering ? 'Create account' : 'Sign in'}
            </button>
          </form>
          <p className="auth-switch">
            {isRegistering ? 'Already have an account?' : 'New to TaskFlow?'}{' '}
            <Link to={isRegistering ? '/login' : '/register'}>
              {isRegistering ? 'Sign in' : 'Create an account'}
            </Link>
          </p>
        </div>
      </section>
    </main>
  )
}

export default AuthPage
