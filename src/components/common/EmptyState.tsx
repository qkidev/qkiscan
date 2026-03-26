export function EmptyState({ title }: { title: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-surface px-4 py-12 text-center text-slate-600 dark:text-slate-300">
      {title}
    </div>
  )
}
