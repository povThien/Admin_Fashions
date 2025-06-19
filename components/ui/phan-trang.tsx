"use client"

interface PhanTrangProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export default function PhanTrang({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }: PhanTrangProps) {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const pages = []
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i)
  }

  return (
    <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-gray-500">
        Hiển thị <span className="font-medium">{startItem}</span> đến <span className="font-medium">{endItem}</span>{" "}
        trong <span className="font-medium">{totalItems}</span> kết quả
      </div>
      <div className="flex space-x-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          «
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 border border-gray-300 rounded ${
              page === currentPage ? "bg-gray-100 text-gray-800" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-50 disabled:opacity-50"
        >
          »
        </button>
      </div>
    </div>
  )
}
