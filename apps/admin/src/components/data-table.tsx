import Image from 'next/image';

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode;
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
}: {
  columns: Column<T>[];
  rows: T[];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-left dark:border-gray-800 dark:bg-gray-900">
            {columns.map((col) => (
              <th key={String(col.key)} className="whitespace-nowrap px-4 py-3 font-medium text-gray-500">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100 last:border-0 dark:border-gray-900">
              {columns.map((col) => (
                <td key={String(col.key)} className="whitespace-nowrap px-4 py-3">
                  {col.render ? col.render(row) : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function ProductThumb({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="h-11 w-11 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <Image src={src} alt={alt} width={44} height={44} className="h-full w-full object-cover" />
    </div>
  );
}

export function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-1 text-amber-500">
      {'★'.repeat(Math.round(rating))}
      <span className="text-gray-400">{'★'.repeat(5 - Math.round(rating))}</span>
      <span className="ml-1 text-xs text-gray-500">{rating.toFixed(1)}</span>
    </span>
  );
}
