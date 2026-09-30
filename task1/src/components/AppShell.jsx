import { CheckSquare2, LogOut } from 'lucide-react'

import { useAuth } from '../context/AuthContext.jsx'

function AppShell({ children }) {
  const { user, logout } = useAuth()

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/dashboard" aria-label="TaskFlow dashboard">
          <span className="brand-mark"><CheckSquare2 size={20} /></span>
          <span>TaskFlow</span>
        </a>
        <div className="account-menu">
          <span className="account-email">{user?.email}</span>
          <button className="icon-button" type="button" onClick={logout} title="Sign out" aria-label="Sign out">
            <LogOut size={18} />
          </button>
        </div>
      </header>
      <main className="app-main">{children}</main>
    </div>
  )
}

export default AppShell
