import { Card, CardContent } from "@/components/ui/card"
import NhanTrangThai from "@/components/ui/nhan-trang-thai"
import NutThaoTac from "@/components/ui/nut-thao-tac"
import PhanTrang from "@/components/ui/phan-trang"
import { formatCurrency, fetcher } from "@/lib/api" // Import formatCurrency và fetcher
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

interface Product {
  _id: string;
  id: number;
  ten_sp: string;
  id_loai: { id: number; ten_loai: string };
  id_thuong_hieu: { id: number; ten_thuong_hieu: string } | null;
  variants: {
    sku: string;
    gia: number;
    gia_km: number | null;
    so_luong: number;
    hinh_chinh: string; // Sử dụng hinh_chinh của variant
  }[];
  an_hien: boolean; // an_hien (true/false)
  // Các trường khác có thể thêm vào nếu cần hiển thị
}

interface BangSanPhamProps {
  products: Product[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onDeleteSuccess: () => void; // Callback để refetch dữ liệu sau khi xóa
}

export default function BangSanPham({
  products,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onDeleteSuccess,
}: BangSanPhamProps) {
  const router = useRouter();

  const handleView = (productId: number) => {
    // Để xem chi tiết sản phẩm, bạn có thể tạo một trang riêng hoặc modal
    console.log("Xem chi tiết sản phẩm:", productId);
    // Ví dụ: router.push(`/products/${productId}`);
    toast.info("Chức năng xem chi tiết sẽ được phát triển sau.");
  };

  const handleEdit = (productId: number) => {
    console.log("Chỉnh sửa sản phẩm:", productId);
    router.push(`/products/${productId}/edit`);
  };

  const handleDelete = async (productId: number) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm có ID: ${productId} này không?`)) {
      try {
        await fetcher(`/products/${productId}`, 'DELETE');
        toast.success("Sản phẩm đã được xóa thành công!");
        onDeleteSuccess(); // Gọi lại hàm refetch dữ liệu
      } catch (err: any) {
        toast.error("Lỗi khi xóa sản phẩm: " + (err.info?.message || err.message));
        console.error("Error deleting product:", err);
      }
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
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
                  {products.map((product, index) => {
                    // Tính tổng số lượng tồn kho và giá thấp nhất từ các biến thể
                    const totalStock = product.variants.reduce((sum, v) => sum + v.so_luong, 0);
                    const minPrice = product.variants.length > 0
                      ? Math.min(...product.variants.map(v => v.gia_km !== null && v.gia_km > 0 ? v.gia_km : v.gia))
                      : 0;
                    const displayPrice = formatCurrency(minPrice);
                    const mainImage = product.variants[0]?.hinh_chinh || product.hinh_anh?.[0] || "/placeholder.svg";

                    return (
                      <tr
                        key={product.id}
                        className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-25"}`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-lg overflow-hidden border">
                              <img
                                src={mainImage}
                                alt={product.ten_sp}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = "/placeholder.svg";
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 line-clamp-2">{product.ten_sp}</div>
                              <div className="text-xs text-gray-500 flex items-center gap-2">
                                <span>ID: {product.id}</span> {/* Sử dụng ID từ backend */}
                                {product.id_thuong_hieu && product.id_thuong_hieu.ten_thuong_hieu && (
                                  <>
                                    <span>•</span>
                                    <span>{product.id_thuong_hieu.ten_thuong_hieu}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {product.id_loai ? product.id_loai.ten_loai : "N/A"}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{displayPrice}</td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-medium ${totalStock === 0
                                ? "text-red-600"
                                : totalStock <= 10
                                  ? "text-yellow-600"
                                  : "text-green-600"
                                }`}
                            >
                              {totalStock}
                            </span>
                            {totalStock === 0 && (
                              <i className="fas fa-exclamation-triangle text-red-500 text-xs" title="Hết hàng"></i>
                            )}
                            {totalStock > 0 && totalStock <= 10 && (
                              <i className="fas fa-exclamation-circle text-yellow-500 text-xs" title="Sắp hết hàng"></i>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <NhanTrangThai status={product.an_hien ? "active" : "inactive"} />
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <NutThaoTac
                            onView={() => handleView(product.id)}
                            onEdit={() => handleEdit(product.id)}
                            onDelete={() => handleDelete(product.id)}
                          />
                        </td>
                      </tr>
                    );
                  })}
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
  );
}