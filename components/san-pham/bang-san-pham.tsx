import { Card, CardContent } from "@/components/ui/card"
import NhanTrangThai from "@/components/ui/nhan-trang-thai"
import NutThaoTac from "@/components/ui/nut-thao-tac"
import PhanTrang from "@/components/ui/phan-trang"

interface Product {
  id: string
  name: string
  code: string
  category: string
  price: string
  stock: number
  status: string
  image: string
  brand?: string
}

interface BangSanPhamProps {
  products: Product[]
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export default function BangSanPham({
  products,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: BangSanPhamProps) {
  // Hàm xử lý các thao tác trên sản phẩm
  const handleView = (productId: string) => {
    console.log("Xem chi tiết sản phẩm:", productId)
    // TODO: Chuyển hướng đến trang chi tiết sản phẩm
  }

  const handleEdit = (productId: string) => {
    console.log("Chỉnh sửa sản phẩm:", productId)
    // TODO: Chuyển hướng đến trang chỉnh sửa sản phẩm
  }

  const handleDelete = (productId: string) => {
    console.log("Xóa sản phẩm:", productId)
    // TODO: Hiển thị modal xác nhận xóa
  }

  return (
    <Card>
      <CardContent className="p-0">
        {/* Kiểm tra nếu không có sản phẩm nào */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <i className="fas fa-search text-4xl"></i>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy sản phẩm nào</h3>
            <p className="text-gray-500">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để xem thêm kết quả</p>
          </div>
        ) : (
          <>
            {/* Bảng hiển thị sản phẩm */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-box"></i>
                        Sản phẩm
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-tags"></i>
                        Danh mục
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
                  {products.map((product, index) => (
                    <tr
                      key={product.id}
                      className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-25"}`}
                    >
                      {/* Cột thông tin sản phẩm */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {/* Hình ảnh sản phẩm */}
                          <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-lg overflow-hidden border">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                // Xử lý khi không load được ảnh
                                e.currentTarget.src = "/placeholder.svg?height=48&width=48"
                              }}
                            />
                          </div>
                          {/* Thông tin sản phẩm */}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-2">
                              <span>Mã: {product.code}</span>
                              {product.brand && (
                                <>
                                  <span>•</span>
                                  <span>{product.brand}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Cột danh mục */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {product.category}
                        </span>
                      </td>

                      {/* Cột giá */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.price}</td>

                      {/* Cột tồn kho */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-medium ${product.stock === 0
                                ? "text-red-600"
                                : product.stock <= 10
                                  ? "text-yellow-600"
                                  : "text-green-600"
                              }`}
                          >
                            {product.stock}
                          </span>
                          {/* Icon trạng thái tồn kho */}
                          {product.stock === 0 && (
                            <i className="fas fa-exclamation-triangle text-red-500 text-xs" title="Hết hàng"></i>
                          )}
                          {product.stock > 0 && product.stock <= 10 && (
                            <i className="fas fa-exclamation-circle text-yellow-500 text-xs" title="Sắp hết hàng"></i>
                          )}
                        </div>
                      </td>

                      {/* Cột trạng thái */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <NhanTrangThai status={product.status} />
                      </td>

                      {/* Cột thao tác */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <NutThaoTac
                          onView={() => handleView(product.id)}
                          onEdit={() => handleEdit(product.id)}
                          onDelete={() => handleDelete(product.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Component phân trang */}
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
