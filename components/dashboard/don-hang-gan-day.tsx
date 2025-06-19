import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import NhanTrangThai from "@/components/ui/nhan-trang-thai"

export default function DonHangGanDay() {
  const orders = [
    {
      id: "#LUXE-1001",
      customer: "Emma Johnson",
      date: "Hôm nay, 10:30 AM",
      amount: "$349.99",
      status: "completed",
    },
    {
      id: "#LUXE-1002",
      customer: "Michael Smith",
      date: "Hôm nay, 9:15 AM",
      amount: "$199.50",
      status: "processing",
    },
    {
      id: "#LUXE-1003",
      customer: "Sarah Williams",
      date: "Hôm nay, 8:45 AM",
      amount: "$599.00",
      status: "pending",
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Đơn hàng gần đây</CardTitle>
        <a href="/orders" className="text-sm text-primary hover:underline">
          Xem tất cả
        </a>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đơn hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{order.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{order.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <NhanTrangThai status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
