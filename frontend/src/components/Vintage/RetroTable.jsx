import { motion } from 'framer-motion'

export default function RetroTable({
  columns,
  data,
  rowKey = 'id',
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
}) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton-editorial h-12 rounded-ed-sm"></div>
        ))}
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="card-editorial text-center py-12">
        <p className="text-ed-faint text-sm">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="overflow-x-auto rounded-ed border border-ed-border"
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-ed-border bg-ed-light">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 md:px-5 py-3 md:py-4 text-left text-[10px] md:text-xs font-bold text-ed-black uppercase tracking-widest"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <motion.tr
              key={row[rowKey] || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => onRowClick && onRowClick(row)}
              className="border-b border-ed-border hover:bg-ed-light/50 transition-colors cursor-pointer group"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 md:px-5 py-3 md:py-4 text-xs md:text-sm text-ed-body break-words"
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  )
}
