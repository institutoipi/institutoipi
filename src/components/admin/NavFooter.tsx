import React from 'react'

/**
 * Substitui o botão de logout do nav, mantendo o logout oficial (link para a rota
 * padrão /admin/logout) e adicionando, ao lado direito, o ícone "Ir para o site".
 * O target nomeado abre o site em nova aba e reaproveita a mesma aba depois.
 */
export function NavFooter() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      <a
        href="/admin/logout"
        className="nav__log-out"
        aria-label="Sair"
        title="Sair"
        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <svg
          className="icon icon--logout"
          fill="none"
          height="20"
          width="20"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            className="stroke"
            d="M12 16H14.6667C15.0203 16 15.3594 15.8595 15.6095 15.6095C15.8595 15.3594 16 15.0203 16 14.6667V5.33333C16 4.97971 15.8595 4.64057 15.6095 4.39052C15.3594 4.14048 15.0203 4 14.6667 4H12M7.33333 13.3333L4 10M4 10L7.33333 6.66667M4 10H12"
            strokeLinecap="square"
          />
        </svg>
      </a>

      <a
        href="/"
        target="ipi-site"
        className="nav__log-out"
        aria-label="Ir para o site"
        title="Ir para o site"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'currentColor',
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </a>
    </div>
  )
}