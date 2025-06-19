"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"

export default function EditOrderPage() {
  const params = useParams()
  const router = useRouter()
  const [orderData, setOrderData] = useState<any>(null)
  const [status, setStatus] = useState("")
  const [shipperId, setShipperId] = useState("")

  useEffect(() => {
    // Mock data loading
    setOrderData({
      id: "#LX-10025",
      customer: {
        name: "Nguyễn Văn A",
        email: "nguyenvana@email.com",
        phone: "0987654321",
        address: "123 Đường ABC, Quận 1, TP.HCM",
      },
      items: [
        {
          id: 1,
          name: "Áo thun nam cao cấp",
          code: "SP-001",
          price: "1.999.999₫",
          quantity: 2,
          total: "3.999.998₫",
        },
        {
          id: 2,
          name: "Quần jean nam",
          code: "SP-002",
          price: "2.500.000₫",
          quantity: 1,
          total: "2.500.000₫",
        },
      ],
      summary: {
        subtotal: "6.499.998₫",
        shipping: "30.000₫",
        discount: "500.000₫",
        total: "6.029.998₫",
      },
      status: "Chờ xử lý",
      orderDate: "15/05/2025",
    })
  }, [params.id])

  const handleStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Đã cập nhật trạng thái đơn hàng!")
    router.push("/orders")
  }

  const handlePrint = () => {
    window.print()
  }

  const handleCancel = () => {
    router.push("/orders")
  }

  if (!orderData) {
    return <div>Loading...</div>
  }

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Chi tiết đơn hàng {orderData.id}</h1>
            <button onClick={handlePrint} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
              <i className="fas fa-print mr-2"></i>In hóa đơn
            </button>
          </div>

          {/* Customer Information */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">Thông tin khách hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Họ tên</p>
                <p className="font-medium">{orderData.customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium">{orderData.customer.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                <p className="font-medium">{orderData.customer.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Địa chỉ</p>
                <p className="font-medium">{orderData.customer.address}</p>
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">Chi tiết đơn hàng</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sản phẩm
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Đơn giá
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số lượng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thành tiền
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orderData.items.map((item: any) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md"></div>
                          <div className="ml-4">
                            <div className="text-sm font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500">Mã: {item.code}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{item.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">Tổng kết đơn hàng</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Tạm tính:</span>
                <span className="font-medium">{orderData.summary.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Phí vận chuyển:</span>
                <span className="font-medium">{orderData.summary.shipping}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Giảm giá:</span>
                <span className="font-medium">{orderData.summary.discount}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="text-lg font-bold">Tổng cộng:</span>
                <span className="text-lg font-bold">{orderData.summary.total}</span>
              </div>
            </div>
          </div>

          {/* Order Status */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">Trạng thái đơn hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Trạng thái hiện tại</p>
                <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md">
                  {orderData.status}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Ngày đặt hàng</p>
                <p className="font-medium">{orderData.orderDate}</p>
              </div>
            </div>
          </div>

          {/* Update Form */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium mb-4">Cập nhật đơn hàng</h3>
            <form className="space-y-4" onSubmit={handleStatusUpdate}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cập nhật trạng thái</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  <option value="">Chọn trạng thái mới</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="preparing">Đang chuẩn bị</option>
                  <option value="shipping">Đang giao hàng</option>
                  <option value="delivered">Đã giao hàng</option>
                  <option value="completed">Đã hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Shipper (nếu có)</label>
                <input
                  type="text"
                  value={shipperId}
                  onChange={(e) => setShipperId(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Nhập ID shipper"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button type="submit" className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
