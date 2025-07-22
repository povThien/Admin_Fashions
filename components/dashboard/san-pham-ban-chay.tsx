// src/components/dashboard/san-pham-ban-chay.js

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type topProductType = {
  id_san_pham: string;
  ten_sp: string;
  thumbnail: string;
  so_luong_thang_nay: number;
};

export default function SanPhamBanChay({ topProducts }: { topProducts: topProductType[]; }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Top 10 Sản phẩm bán chạy nhất (Tổng)</CardTitle>
        <a href="/products" className="text-sm text-primary hover:underline">
          Xem tất cả
        </a>
      </CardHeader>
      <CardContent>
        {/* === THAY ĐỔI NẰM Ở ĐÂY === */}
        {/* Bọc danh sách trong một div có chiều cao cố định và thanh cuộn */}
        <div className="h-72 overflow-y-auto pr-2">
          <div className="space-y-4">
            {topProducts.map((product: topProductType, index) => (
              <div key={product.id_san_pham} className="flex items-center">
                <div className="flex items-center space-x-4">
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
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {product.ten_sp}
                    </h4>
                    <p className="text-xs text-gray-500">
                      Đã bán:{" "}
                      <span className="font-semibold text-gray-700">
                        {product.so_luong_thang_nay.toLocaleString("vi-VN")}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}