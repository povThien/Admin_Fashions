import { Card, CardContent } from "@/components/ui/card"
import NhanTrangThai from "@/components/ui/nhan-trang-thai"
import NutThaoTac from "@/components/ui/nut-thao-tac"
import PhanTrang from "@/components/ui/phan-trang"

interface ProductVariant {
    id: string
    productId: string
    productName: string
    productImage: string
    sku: string
    size: string
    color: string
    price: number
    salePrice?: number
    stock: number
    status: string
    createdAt: string
    updatedAt: string
}

interface BangBienTheProps {
    variants: ProductVariant[]
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    onPageChange: (page: number) => void
}

export default function BangBienThe({
    variants,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
}: BangBienTheProps) {
    // Hàm xử lý các thao tác
    const handleView = (variantId: string) => {
        console.log("Xem chi tiết biến thể:", variantId)
    }

    const handleEdit = (variantId: string) => {
        console.log("Chỉnh sửa biến thể:", variantId)
    }

    const handleDelete = (variantId: string) => {
        console.log("Xóa biến thể:", variantId)
    }

    // Hàm format giá tiền
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price)
    }

    // Hàm lấy màu cho trạng thái tồn kho
    const getStockStatusColor = (stock: number) => {
        if (stock === 0) return "text-red-600"
        if (stock <= 10) return "text-yellow-600"
        return "text-green-600"
    }

    return (
        <Card>
            <CardContent className="p-0">
                {variants.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <i className="fas fa-search text-4xl"></i>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy biến thể nào</h3>
                        <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để xem thêm kết quả</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <i className="fas fa-cube"></i>
                                                Sản phẩm
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <i className="fas fa-barcode"></i>
                                                Mã Hàng
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <i className="fas fa-palette"></i>
                                                Thuộc tính
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <i className="fas fa-dollar-sign"></i>
                                                Giá
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <i className="fas fa-warehouse"></i>
                                                Tồn kho
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <i className="fas fa-toggle-on"></i>
                                                Trạng thái
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <i className="fas fa-cogs"></i>
                                                Thao tác
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {variants.map((variant, index) => (
                                        <tr
                                            key={variant.id}
                                            className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-25"}`}
                                        >
                                            {/* Cột sản phẩm */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-lg overflow-hidden border">
                                                        <img
                                                            src={variant.productImage || "/placeholder.svg"}
                                                            alt={variant.productName}
                                                            className="h-full w-full object-cover"
                                                            onError={(e) => {
                                                                e.currentTarget.src = "/placeholder.svg?height=48&width=48"
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 line-clamp-2">{variant.productName}</div>
                                                        <div className="text-xs text-gray-500">ID: {variant.productId}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Cột SKU */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-mono text-gray-900">{variant.sku}</div>
                                            </td>

                                            {/* Cột thuộc tính */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col gap-1">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        <i className="fas fa-ruler-horizontal mr-1"></i>
                                                        {variant.size}
                                                    </span>
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                        <i className="fas fa-circle mr-1"></i>
                                                        {variant.color}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Cột giá */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    {variant.salePrice ? (
                                                        <>
                                                            <span className="text-sm font-medium text-red-600">{formatPrice(variant.salePrice)}</span>
                                                            <span className="text-xs text-gray-500 line-through">{formatPrice(variant.price)}</span>
                                                        </>
                                                    ) : (
                                                        <span className="text-sm font-medium text-gray-900">{formatPrice(variant.price)}</span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Cột tồn kho */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-medium ${getStockStatusColor(variant.stock)}`}>{variant.stock}</span>
                                                    {variant.stock === 0 && (
                                                        <i className="fas fa-exclamation-triangle text-red-500 text-xs" title="Hết hàng"></i>
                                                    )}
                                                    {variant.stock > 0 && variant.stock <= 10 && (
                                                        <i className="fas fa-exclamation-circle text-yellow-500 text-xs" title="Sắp hết hàng"></i>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Cột trạng thái */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <NhanTrangThai status={variant.status} />
                                            </td>

                                            {/* Cột thao tác */}
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <NutThaoTac
                                                    onView={() => handleView(variant.id)}
                                                    onEdit={() => handleEdit(variant.id)}
                                                    onDelete={() => handleDelete(variant.id)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <PhanTrang
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            itemsPerPage={itemsPerPage}
                            onPageChange={onPageChange}
                        />
                    </>
                )}
            </CardContent>
        </Card>
    )
}