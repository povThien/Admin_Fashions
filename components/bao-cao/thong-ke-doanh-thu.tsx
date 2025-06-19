import { Card, CardContent } from "@/components/ui/card"

export default function ThongKeDoanhThu() {
  const stats = [
    {
      title: "Tổng doanh thu",
      value: "$24,780.00",
      change: "+12.5%",
      changeType: "increase",
      icon: "fas fa-dollar-sign",
      bgColor: "bg-green-100",
      textColor: "text-green-600",
    },
    {
      title: "Tổng đơn hàng",
      value: "1,245",
      change: "+8.3%",
      changeType: "increase",
      icon: "fas fa-shopping-bag",
      bgColor: "bg-blue-100",
      textColor: "text-blue-600",
    },
    {
      title: "Giá trị đơn hàng TB",
      value: "$136.00",
      change: "+3.9%",
      changeType: "increase",
      icon: "fas fa-chart-pie",
      bgColor: "bg-purple-100",
      textColor: "text-purple-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                <p className={`text-sm mt-2 ${stat.changeType === "increase" ? "text-green-500" : "text-red-500"}`}>
                  <i className={`fas ${stat.changeType === "increase" ? "fa-arrow-up" : "fa-arrow-down"} mr-1`}></i>
                  {stat.change} so với tháng trước
                </p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-full ${stat.textColor}`}>
                <i className={`${stat.icon} text-lg`}></i>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
