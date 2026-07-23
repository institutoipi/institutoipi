export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <div className="mb-12 max-w-2xl">
        <div className="h-3 w-32 animate-pulse rounded bg-surface-2" />
        <div className="mt-4 h-10 w-64 animate-pulse rounded bg-surface-2" />
        <div className="mt-4 h-4 w-full max-w-md animate-pulse rounded bg-surface-2" />
      </div>
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-4">
            <div className="aspect-video w-full animate-pulse rounded-lg bg-surface-2" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-surface-2" />
            <div className="h-3 w-full animate-pulse rounded bg-surface-2" />
          </div>
        ))}
      </div>
    </main>
  )
}
