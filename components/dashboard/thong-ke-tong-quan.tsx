import { Card, CardContent } from "@/components/ui/card"

export default function ThongKeTongQuan() {
  const stats = [
    {
      title: "Tổng sản phẩm",
      value: "1,024",
      icon: "fas fa-tshirt",
      color: "blue",
      bgColor: "bg-blue-50",
      textColor: "text-blue-500",
    },
    {
      title: "Đơn hàng hôm nay",
      value: "24",
      icon: "fas fa-shopping-bag",
      color: "green",
      bgColor: "bg-green-50",
      textColor: "text-green-500",
    },
    {
      title: "Khách hàng mới",
      value: "12",
      icon: "fas fa-users",
      color: "purple",
      bgColor: "bg-purple-50",
      textColor: "text-purple-500",
    },
    {
      title: "Doanh thu hôm nay",
      value: "$5,280",
      icon: "fas fa-dollar-sign",
      color: "yellow",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-full ${stat.bgColor} ${stat.textColor} mr-4`}>
                <i className={`${stat.icon} text-lg`}></i>
              </div>
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
