import React from 'react'

/**
 * Provider global do admin que enxuga a barra do live preview: esconde os
 * controles de "device" (Responsive, dimensões, zoom) que não fazem sentido
 * para um blog, mantendo o "Open in new window".
 *
 * Injeta um <style> em vez de importar CSS para não esbarrar na restrição de
 * global CSS do Next em componentes fora do layout.
 */
export function PreviewToolbarStyles({ children }: { children?: React.ReactNode }) {
  return (
    <>
      <style>{`
        .live-preview-toolbar-controls__breakpoint,
        .live-preview-toolbar-controls__device-size,
        .live-preview-toolbar-controls__zoom {
          display: none !important;
        }
      `}</style>
      {children}
    </>
  )
}
