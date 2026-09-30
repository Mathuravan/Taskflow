function StatCard({ label, value, tone, icon: Icon }) {
  return (
    <article className={`stat-card stat-card-${tone}`}>
      <div>
        <p className="stat-label">{label}</p>
        <strong className="stat-value">{value}</strong>
      </div>
      <span className="stat-icon" aria-hidden="true"><Icon size={20} /></span>
    </article>
  )
}

export default StatCard
