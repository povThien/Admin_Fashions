"use client"

import { Card, CardContent } from "@/components/ui/card"

interface AdvancedFilter {
    product: string
    size: string
    color: string
    priceRange: {
        min: number
        max: number
    }
    stockStatus: string
    status: string
}

interface ProductVariant {
    id: string
    productId: string
    productName: string
    size: string
    color: string
    price: number
    stock: number
    status: string
}

interface LocNangCaoBienTheProps {
    filter: AdvancedFilter
    onFilterChange: (filter: Partial<AdvancedFilter>) => void
    variants: ProductVariant[]
}

export default function LocNangCaoBienThe({ filter, onFilterChange, variants }: LocNangCaoBienTheProps) {
    // Lấy danh sách sản phẩm unique
    const uniqueProducts = Array.from(
        new Map(variants.map((v) => [v.productId, { id: v.productId, name: v.productName }])).values(),
    )

    // Lấy danh sách kích thước unique
    const uniqueSizes = Array.from(new Set(variants.map((v) => v.size))).sort()

    // Lấy danh sách màu sắc unique
    const uniqueColors = Array.from(new Set(variants.map((v) => v.color))).sort()

    // Hàm xử lý thay đổi khoảng giá
    const handlePriceRangeChange = (field: "min" | "max", value: string) => {
        const numValue = Number.parseInt(value) || 0
        onFilterChange({
            priceRange: {
                ...filter.priceRange,
                [field]: numValue,
            },
        })
    }

    // Hàm format giá tiền
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN").format(price)
    }

    // Đếm số bộ lọc đang được áp dụng
    const activeFiltersCount = [
        filter.product,
        filter.size,
        filter.color,
        filter.stockStatus,
        filter.status,
        filter.priceRange.min > 0 || filter.priceRange.max < 20000000,
    ].filter(Boolean).length

    return (
        <Card className="mb-6">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                        <i className="fas fa-filter text-blue-600"></i>
                        Bộ lọc nâng cao
                        {activeFiltersCount > 0 && (
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                                {activeFiltersCount}
                            </span>
                        )}
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                    {/* Lọc theo sản phẩm */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <i className="fas fa-cube mr-1"></i>
                            Sản phẩm
                        </label>
                        <select
                            value={filter.product}
                            onChange={(e) => onFilterChange({ product: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Tất cả sản phẩm</option>
                            {uniqueProducts.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Lọc theo kích thước */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <i className="fas fa-ruler-horizontal mr-1"></i>
                            Kích thước
                        </label>
                        <select
                            value={filter.size}
                            onChange={(e) => onFilterChange({ size: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Tất cả kích thước</option>
                            {uniqueSizes.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Lọc theo màu sắc */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <i className="fas fa-palette mr-1"></i>
                            Màu sắc
                        </label>
                        <select
                            value={filter.color}
                            onChange={(e) => onFilterChange({ color: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Tất cả màu sắc</option>
                            {uniqueColors.map((color) => (
                                <option key={color} value={color}>
                                    {color}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Lọc theo trạng thái tồn kho */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <i className="fas fa-warehouse mr-1"></i>
                            Tồn kho
                        </label>
                        <select
                            value={filter.stockStatus}
                            onChange={(e) => onFilterChange({ stockStatus: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Tất cả</option>
                            <option value="in-stock">Còn hàng ({">"} 10)</option>
                            <option value="low-stock">Sắp hết (1-10)</option>
                            <option value="out-of-stock">Hết hàng (0)</option>
                        </select>
                    </div>

                    {/* Lọc theo trạng thái */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <i className="fas fa-toggle-on mr-1"></i>
                            Trạng thái
                        </label>
                        <select
                            value={filter.status}
                            onChange={(e) => onFilterChange({ status: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Tất cả</option>
                            <option value="active">Đang bán</option>
                            <option value="inactive">Ngừng bán</option>
                            <option value="out_of_stock">Hết hàng</option>
                            <option value="low_stock">Sắp hết</option>
                        </select>
                    </div>
                </div>

                {/* Khoảng giá */}
                <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        <i className="fas fa-dollar-sign mr-1"></i>
                        Khoảng giá (VND)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <input
                                type="number"
                                placeholder="Giá từ"
                                value={filter.priceRange.min || ""}
                                onChange={(e) => handlePriceRangeChange("min", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <input
                                type="number"
                                placeholder="Giá đến"
                                value={filter.priceRange.max === 20000000 ? "" : filter.priceRange.max}
                                onChange={(e) => handlePriceRangeChange("max", e.target.value || "20000000")}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        Từ {formatPrice(filter.priceRange.min)} đến {formatPrice(filter.priceRange.max)}
                    </div>
                </div>

                {/* Hiển thị các tag bộ lọc đang áp dụng */}
                {activeFiltersCount > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm text-gray-600">Đang lọc:</span>
                            {filter.product && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Sản phẩm: {uniqueProducts.find((p) => p.id === filter.product)?.name}
                                    <button
                                        onClick={() => onFilterChange({ product: "" })}
                                        className="ml-1 text-blue-600 hover:text-blue-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {filter.size && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Size: {filter.size}
                                    <button
                                        onClick={() => onFilterChange({ size: "" })}
                                        className="ml-1 text-green-600 hover:text-green-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {filter.color && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    Màu: {filter.color}
                                    <button
                                        onClick={() => onFilterChange({ color: "" })}
                                        className="ml-1 text-purple-600 hover:text-purple-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {filter.stockStatus && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Tồn kho:{" "}
                                    {filter.stockStatus === "in-stock"
                                        ? "Còn hàng"
                                        : filter.stockStatus === "low-stock"
                                            ? "Sắp hết"
                                            : "Hết hàng"}
                                    <button
                                        onClick={() => onFilterChange({ stockStatus: "" })}
                                        className="ml-1 text-yellow-600 hover:text-yellow-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                            {filter.status && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    Trạng thái: {filter.status === "active" ? "Đang bán" : "Ngừng bán"}
                                    <button
                                        onClick={() => onFilterChange({ status: "" })}
                                        className="ml-1 text-gray-600 hover:text-gray-800"
                                    >
                                        ×
                                    </button>
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}