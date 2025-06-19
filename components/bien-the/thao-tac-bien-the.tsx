"use client"

import Link from "next/link"
import ThanhTimKiem from "@/components/ui/thanh-tim-kiem"

interface ThaoTacBienTheProps {
    onSearch: (query: string) => void
    searchQuery: string
    onToggleAdvancedFilter: () => void
    showAdvancedFilter: boolean
    onResetFilters: () => void
    totalResults: number
}

export default function ThaoTacBienThe({
    onSearch,
    searchQuery,
    onToggleAdvancedFilter,
    showAdvancedFilter,
    onResetFilters,
    totalResults,
}: ThaoTacBienTheProps) {
    return (
        <div className="space-y-4 mb-6">
            {/* Header với breadcrumb */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Link href="/dashboard" className="hover:text-gray-700">
                        <i className="fas fa-home"></i>
                    </Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">Biến thể sản phẩm</span>
                </div>
            </div>

            {/* Thanh công cụ chính */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                {/* Thanh tìm kiếm */}
                <div className="flex-1 max-w-md">
                    <ThanhTimKiem
                        placeholder="Tìm kiếm theo tên sản phẩm, SKU, kích thước, màu sắc..."
                        onSearch={onSearch}
                        value={searchQuery}
                    />
                </div>

                {/* Các nút chức năng */}
                <div className="flex flex-wrap gap-2">
                    {/* Nút bộ lọc nâng cao */}
                    <button
                        onClick={onToggleAdvancedFilter}
                        className={`px-4 py-2 border rounded-lg flex items-center gap-2 transition-colors ${showAdvancedFilter
                                ? "bg-blue-50 border-blue-300 text-blue-700"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50"
                            }`}
                    >
                        <i className="fas fa-filter"></i>
                        Lọc nâng cao
                        {showAdvancedFilter ? (
                            <i className="fas fa-chevron-up text-xs"></i>
                        ) : (
                            <i className="fas fa-chevron-down text-xs"></i>
                        )}
                    </button>

                    {/* Nút reset bộ lọc */}
                    {(searchQuery || showAdvancedFilter) && (
                        <button
                            onClick={onResetFilters}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                            <i className="fas fa-times"></i>
                            Xóa bộ lọc
                        </button>
                    )}

                    {/* Nút xuất Excel */}
                    <button className="px-4 py-2 border border-green-300 rounded-lg text-green-700 hover:bg-green-50 flex items-center gap-2">
                        <i className="fas fa-file-excel"></i>
                        Xuất Excel
                    </button>

                    {/* Nút import Excel */}
                    <button className="px-4 py-2 border border-blue-300 rounded-lg text-blue-700 hover:bg-blue-50 flex items-center gap-2">
                        <i className="fas fa-file-import"></i>
                        Import Excel
                    </button>

                    {/* Nút thêm biến thể */}
                    <Link
                        href="/variants/add"
                        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 flex items-center gap-2"
                    >
                        <i className="fas fa-plus"></i>
                        Thêm biến thể
                    </Link>
                </div>
            </div>

            {/* Thông tin kết quả */}
            <div className="flex items-center justify-between text-sm text-gray-600">
                <span>
                    Tìm thấy <strong className="text-gray-900">{totalResults}</strong> biến thể
                    {searchQuery && (
                        <span>
                            {" "}
                            cho từ khóa "<strong className="text-blue-600">{searchQuery}</strong>"
                        </span>
                    )}
                </span>

                {showAdvancedFilter && (
                    <span className="text-blue-600 flex items-center gap-1">
                        <i className="fas fa-info-circle"></i>
                        Đang sử dụng bộ lọc nâng cao
                    </span>
                )}
            </div>
        </div>
    )
}