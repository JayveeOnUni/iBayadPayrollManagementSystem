interface Column<T> {
  key: string
  header: string
  render?: (row: T, index: number) => React.ReactNode
  className?: string
  headerClassName?: string
  width?: string
}

interface TableProps<T> {
  columns: Column<T>[]
  data: T[]
  isLoading?: boolean
  emptyMessage?: string
  rowKey?: (row: T, index: number) => string
  onRowClick?: (row: T) => void
  className?: string
}

export default function Table<T extends object>({
  columns,
  data,
  isLoading = false,
  emptyMessage = 'No records found.',
  rowKey,
  onRowClick,
  className = '',
}: TableProps<T>) {
  return (
    <div className={`w-full overflow-x-auto scrollbar-thin ${className}`} aria-busy={isLoading}>
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-neutral-20">
            {columns.map((col) => (
              <th
                key={col.key}
                className={[
                  'px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-70 whitespace-nowrap',
                  col.headerClassName ?? '',
                  col.width ?? '',
                ].join(' ')}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-border">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-4">
                    <div className="h-4 bg-neutral-30 rounded animate-pulse w-3/4" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-muted">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={rowKey ? rowKey(row, index) : index}
                className={[
                  'border-b border-border last:border-0',
                  'hover:bg-brand-50/45 transition-colors duration-100',
                  onRowClick ? 'cursor-pointer' : '',
                ].join(' ')}
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={[
                      'px-4 py-3.5 text-ink align-middle',
                      col.className ?? '',
                    ].join(' ')}
                  >
                    {col.render
                      ? col.render(row, index)
                      : String((row as Record<string, unknown>)[col.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  limit: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, total, limit, onPageChange }: PaginationProps) {
  const start = (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  return (
    <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted">
        Showing {total === 0 ? 0 : start}-{end} of {total}
      </p>
      <div className="flex flex-wrap items-center gap-1">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          type="button"
          className="min-h-9 rounded-md border border-border bg-white px-3 text-sm hover:bg-neutral-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          const p = i + 1
          return (
            <button
              type="button"
              key={p}
              onClick={() => onPageChange(p)}
              className={[
                'w-8 h-8 rounded-md text-sm',
                p === page
                  ? 'bg-brand text-white font-medium'
                  : 'border border-border bg-white text-ink hover:bg-neutral-20',
              ].join(' ')}
            >
              {p}
            </button>
          )
        })}
        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          type="button"
          className="min-h-9 rounded-md border border-border bg-white px-3 text-sm hover:bg-neutral-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}
