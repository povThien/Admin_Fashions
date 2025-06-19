import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function ThaoTacNhanh() {
  const actions = [
    {
      title: "Thêm sản phẩm",
      icon: "fas fa-plus",
      href: "/products/add",
    },
    {
      title: "Thêm danh mục",
      icon: "fas fa-tag",
      href: "/categories/add",
    },
    {
      title: "Xem báo cáo",
      icon: "fas fa-chart-line",
      href: "/reports",
    },
    {
      title: "Cài đặt",
      icon: "fas fa-cog",
      href: "/settings",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thao tác nhanh</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="p-4 border border-gray-200 rounded-lg flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-primary bg-opacity-10 text-primary rounded-full flex items-center justify-center mb-2">
                <i className={action.icon}></i>
              </div>
              <span className="text-sm text-center">{action.title}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
