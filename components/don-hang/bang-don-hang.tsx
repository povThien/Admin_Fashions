"use client"

import { Card, CardContent } from "@/components/ui/card"
import NhanTrangThai from "@/components/ui/nhan-trang-thai"
import NutThaoTac from "@/components/ui/nut-thao-tac"
import PhanTrang from "@/components/ui/phan-trang"
import { useRouter } from "next/navigation"

interface Order {
  id: string
  customer: string
  email: string
  date: string
  amount: string
  status: string
}

interface BangDonHangProps {
  orders: Order[]
}

export default function BangDonHang({ orders }: BangDonHangProps) {
  const router = useRouter()

  const handleDelete = (orderId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
      console.log("Delete order:", orderId)
      alert("Đã xóa đơn hàng!")
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đơn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đặt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{order.customer}</div>
                    <div className="text-xs text-gray-500">{order.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{order.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{order.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <NhanTrangThai status={order.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <NutThaoTac
                      viewUrl={`/orders/${order.id}`}
                      onEdit={() => router.push(`/orders/${order.id}`)}
                      onDelete={() => handleDelete(order.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PhanTrang
          currentPage={1}
          totalPages={3}
          totalItems={12}
          itemsPerPage={5}
          onPageChange={(page) => console.log("Page changed:", page)}
        />
      </CardContent>
    </Card>
  )
}
