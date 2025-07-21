import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type topProductType = {
  id_san_pham: string;
  ten_sp: string;
  thumbnail: string;
  so_luong_thang_nay: number;
  so_luong_thang_truoc: number;
  thay_doi_phan_tram: number;
  doanh_thu_thang_nay: number;
};
export default function SanPhamBanChay({
  topProducts,
}: {
  topProducts: topProductType[];
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sản phẩm bán chạy</CardTitle>
        <a href="/products" className="text-sm text-primary hover:underline">
          Xem tất cả
        </a>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topProducts.map((product: topProductType, index) => (
            <div
              key={product.id_san_pham}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary bg-opacity-20 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={product.thumbnail || "/placeholder.svg"}
                    alt={product.ten_sp}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {product.ten_sp}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {product.so_luong_thang_nay} đã bán
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  ₫ {product.doanh_thu_thang_nay.toLocaleString("vi-VN")}
                </div>
                <div
                  className={`text-xs flex items-center ${
                    product.thay_doi_phan_tram > 0
                      ? "text-green-600"
                      : product.thay_doi_phan_tram < 0
                      ? "text-red-600"
                      : "text-gray-500"
                  }`}
                >
                  <i
                    className={`fas ${
                      product.thay_doi_phan_tram > 0
                        ? "fa-arrow-up"
                        : product.thay_doi_phan_tram < 0
                        ? "fa-arrow-down"
                        : "fa-minus"
                    } mr-1`}
                  ></i>
                  {product.thay_doi_phan_tram}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
