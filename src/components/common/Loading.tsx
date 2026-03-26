export function Loading({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-600 dark:text-slate-300">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent"
        aria-hidden
      />
      {label ? <p className="text-sm">{label}</p> : null}
    </div>
  )
}
