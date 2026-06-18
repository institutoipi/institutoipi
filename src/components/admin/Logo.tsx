export function AdminLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <img
        src="/logo_ipi.png"
        alt="IPI"
        style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
        <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.08em' }}>
          INSTITUTO IPI
        </span>
        <span style={{ fontSize: '10px', opacity: 0.5, letterSpacing: '0.04em' }}>
          Políticas Internacionais
        </span>
      </div>
    </div>
  )
}
