import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SanPhamBanChay() {
  const products = [
    {
      id: "1",
      name: "Đồng hồ Chronograph LUXE",
      sales: 45,
      revenue: "11.599.000₫",
      image: "/placeholder.svg?height=64&width=64",
      trend: "up",
      trendValue: "+12%",
    },
    {
      id: "2",
      name: "Túi da cao cấp",
      sales: 32,
      revenue: "3.500.000₫",
      image: "/placeholder.svg?height=64&width=64",
      trend: "up",
      trendValue: "+8%",
    },
    {
      id: "3",
      name: "Áo thun nam cao cấp",
      sales: 28,
      revenue: "1.999.999₫",
      image: "/placeholder.svg?height=64&width=64",
      trend: "down",
      trendValue: "-3%",
    },
    {
      id: "4",
      name: "Quần jean nam",
      sales: 24,
      revenue: "2.500.000₫",
      image: "/placeholder.svg?height=64&width=64",
      trend: "up",
      trendValue: "+5%",
    },
    {
      id: "5",
      name: "Kính mát thời trang",
      sales: 18,
      revenue: "1.200.000₫",
      image: "/placeholder.svg?height=64&width=64",
      trend: "stable",
      trendValue: "0%",
    },
  ]

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
          {products.map((product, index) => (
            <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary bg-opacity-20 rounded-full flex items-center justify-center text-primary font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-md overflow-hidden">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
                  <p className="text-xs text-gray-500">{product.sales} đã bán</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{product.revenue}</div>
                <div
                  className={`text-xs flex items-center ${
                    product.trend === "up"
                      ? "text-green-600"
                      : product.trend === "down"
                        ? "text-red-600"
                        : "text-gray-500"
                  }`}
                >
                  <i
                    className={`fas ${
                      product.trend === "up" ? "fa-arrow-up" : product.trend === "down" ? "fa-arrow-down" : "fa-minus"
                    } mr-1`}
                  ></i>
                  {product.trendValue}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
