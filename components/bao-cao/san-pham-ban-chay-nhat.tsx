import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SanPhamBanChayNhat() {
  const products = [
    { name: "Đồng hồ cao cấp", sales: 128, revenue: "$6,912.00" },
    { name: "Ví da", sales: 96, revenue: "$4,224.00" },
    { name: "Khăn lụa", sales: 85, revenue: "$2,975.00" },
    { name: "Vòng tay vàng", sales: 64, revenue: "$5,760.00" },
    { name: "Áo len cashmere", sales: 52, revenue: "$3,640.00" },
  ]

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
              {products.map((product, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 whitespace-nowrap">{product.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{product.sales}</td>
                  <td className="px-4 py-3 whitespace-nowrap">{product.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
