export default function ProductSkeleton({ count = 4 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ background: 'var(--white)', borderRadius: 'var(--radius)', padding: '0.75rem', boxShadow: 'var(--shadow)' }}>
          <div
            className="skeleton"
            style={{ aspectRatio: '3/4', borderRadius: 'var(--radius-sm)', marginBottom: '1.1rem' }}
          />
          <div style={{ padding: '0 0.4rem 0.4rem' }}>
            <div className="skeleton" style={{ height: '12px', width: '40%', marginBottom: '8px' }} />
            <div className="skeleton" style={{ height: '18px', width: '75%', marginBottom: '8px' }} />
            <div className="skeleton" style={{ height: '16px', width: '30%' }} />
          </div>
        </div>
      ))}
    </>
  )
}
