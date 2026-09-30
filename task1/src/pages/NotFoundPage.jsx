import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="not-found">
      <p className="eyebrow">404</p>
      <h1>That page is not here.</h1>
      <Link className="primary-button" to="/dashboard">Go to dashboard</Link>
    </main>
  )
}

export default NotFoundPage
