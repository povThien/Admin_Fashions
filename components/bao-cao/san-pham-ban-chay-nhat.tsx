import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMemo } from "react"

export default function SanPhamBanChayNhat({data}: any) {

  const products = useMemo(() => {
  if (!data || !Array.isArray(data.topProducts)) return [];
  return data.topProducts.map((product: any) => ({
    name: product.ten_sp,
    sales: product.totalSold,
    revenue: "đ " + product.totalRevenue.toLocaleString("vi-VN"),
  }));
}, [data]);
console.log("📊 Data nhận được:", data);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sản phẩm bán chạy nhất</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bán ra
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doanh thu
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
  {products.length === 0 ? (
    <tr>
      <td colSpan={3} className="px-4 py-3 text-center text-gray-500">
        Không có dữ liệu
      </td>
    </tr>
  ) : (
    products.map((product, index) => (
      <tr key={index}>
        <td className="px-4 py-3 whitespace-nowrap">{product.name}</td>
        <td className="px-4 py-3 whitespace-nowrap">{product.sales}</td>
        <td className="px-4 py-3 whitespace-nowrap">{product.revenue}</td>
      </tr>
    ))
  )}
</tbody>

          </table>
        </div>
      </CardContent>
    </Card>
  )
}
