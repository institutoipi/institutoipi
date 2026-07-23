/**
 * Rate limiter simples em memória (janela deslizante por chave).
 * Suficiente para um único container. Se escalar para múltiplas instâncias,
 * trocar por Redis/Postgres.
 */
const hits = new Map<string, number[]>()

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  if (arr.length >= max) {
    hits.set(key, arr)
    return false // bloqueado
  }
  arr.push(now)
  hits.set(key, arr)
  return true // permitido
}

// Limpeza periódica para não vazar memória (chaves antigas).
if (typeof setInterval !== 'undefined') {
  setInterval(
    () => {
      const now = Date.now()
      for (const [k, arr] of hits) {
        const fresh = arr.filter((t) => now - t < 3_600_000)
        if (fresh.length === 0) hits.delete(k)
        else hits.set(k, fresh)
      }
    },
    10 * 60_000,
  ).unref?.()
}
