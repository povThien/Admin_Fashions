"use client"

import Link from "next/link"
import ThanhTimKiem from "@/components/ui/thanh-tim-kiem"

interface ThaoTacSanPhamProps {
  onSearch: (query: string) => void
  searchQuery: string
  onToggleAdvancedFilter: () => void
  showAdvancedFilter: boolean
  onResetFilters: () => void
  totalResults: number
}

export default function ThaoTacSanPham({
  onSearch,
  searchQuery,
  onToggleAdvancedFilter,
  showAdvancedFilter,
  onResetFilters,
  totalResults,
}: ThaoTacSanPhamProps) {
  return (
    <div className="space-y-4 mb-6">
      {/* Hàng đầu tiên: Tìm kiếm và các nút chức năng */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        {/* Thanh tìm kiếm */}
        <div className="flex-1 max-w-md">
          <ThanhTimKiem
            placeholder="Tìm kiếm theo tên, mã sản phẩm, danh mục..."
            onSearch={onSearch}
            value={searchQuery}
          />
        </div>

        {/* Các nút chức năng */}
        <div className="flex flex-wrap gap-2">
          {/* Nút bộ lọc nâng cao */}
          <button
            onClick={onToggleAdvancedFilter}
            className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-colors ${
              showAdvancedFilter
                ? "bg-blue-50 border-blue-300 text-blue-700"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <i className="fas fa-filter"></i>
            Lọc nâng cao
            {showAdvancedFilter && <i className="fas fa-chevron-up text-xs"></i>}
            {!showAdvancedFilter && <i className="fas fa-chevron-down text-xs"></i>}
          </button>

          {/* Nút reset bộ lọc - chỉ hiển thị khi có filter hoặc search */}
          {(searchQuery || showAdvancedFilter) && (
            <button
              onClick={onResetFilters}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <i className="fas fa-times"></i>
              Xóa bộ lọc
            </button>
          )}

          {/* Nút thêm sản phẩm */}
          <Link
            href="/products/add"
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 flex items-center gap-2"
          >
            <i className="fas fa-plus"></i>
            Thêm sản phẩm
          </Link>
        </div>
      </div>

      {/* Hàng thứ hai: Hiển thị số kết quả tìm được */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Tìm thấy <strong>{totalResults}</strong> sản phẩm
          {searchQuery && (
            <span>
              {" "}
              cho từ khóa "<strong>{searchQuery}</strong>"
            </span>
          )}
        </span>

        {/* Hiển thị trạng thái bộ lọc */}
        {showAdvancedFilter && (
          <span className="text-blue-600">
            <i className="fas fa-info-circle mr-1"></i>
            Đang sử dụng bộ lọc nâng cao
          </span>
        )}
      </div>
    </div>
  )
}
