"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// Interface định nghĩa cấu trúc dữ liệu đơn hàng
interface OrderItem {
  id: number
  name: string
  code: string
  price: string
  quantity: number
  total: string
  image?: string
}

interface Customer {
  name: string
  email: string
  phone: string
  address: string
}

interface OrderData {
  id: string
  customer: Customer
  items: OrderItem[]
  summary: {
    subtotal: string
    shipping: string
    discount: string
    total: string
  }
  status: string
  orderDate: string
}

export default function ChiTietDonHangPage() {
  const router = useRouter()

  // State quản lý dữ liệu đơn hàng
  const [orderData, setOrderData] = useState<OrderData | null>(null)

  // State quản lý form cập nhật
  const [newStatus, setNewStatus] = useState("")
  const [shipperId, setShipperId] = useState("")

  // State quản lý loading
  const [isLoading, setIsLoading] = useState(true)

  // useEffect: Chạy khi component được mount để load dữ liệu
  useEffect(() => {
    // Giả lập việc load dữ liệu từ API
    const loadOrderData = async () => {
      try {
        setIsLoading(true)

        // Giả lập delay API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Dữ liệu mẫu khớp với HTML template
        const mockData: OrderData = {
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
        }

        setOrderData(mockData)
      } catch (error) {
        console.error("Lỗi khi load dữ liệu:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadOrderData()
  }, [])

  // Hàm xử lý cập nhật trạng thái đơn hàng
  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Giả lập API call cập nhật trạng thái
      console.log("Cập nhật trạng thái:", newStatus)
      console.log("ID Shipper:", shipperId)

      // Hiển thị thông báo thành công
      alert("Đã cập nhật trạng thái đơn hàng thành công!")

      // Reset form
      setNewStatus("")
      setShipperId("")
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error)
      alert("Có lỗi xảy ra khi cập nhật!")
    }
  }

  // Hàm xử lý in hóa đơn
  const handlePrint = () => {
    // Sử dụng window.print() để in trang hiện tại
    window.print()
  }

  // Hàm quay lại trang danh sách đơn hàng
  const handleGoBack = () => {
    router.push("/orders")
  }

  // Hiển thị loading khi đang tải dữ liệu
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  // Hiển thị lỗi nếu không có dữ liệu
  if (!orderData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">Không thể tải dữ liệu đơn hàng</p>
          <button onClick={handleGoBack} className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
            Quay lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* HEADER SECTION - Tiêu đề và nút in */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              {/* Nút quay lại */}
              <button
                onClick={handleGoBack}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
                title="Quay lại danh sách đơn hàng"
              >
                <i className="fas fa-arrow-left"></i>
              </button>

              {/* Tiêu đề trang */}
              <h1 className="text-2xl font-bold">Chi tiết đơn hàng {orderData.id}</h1>
            </div>

            {/* Nút in hóa đơn */}
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              title="In hóa đơn"
            >
              <i className="fas fa-print mr-2"></i>
              In hóa đơn
            </button>
          </div>

          {/* CUSTOMER INFORMATION SECTION - Thông tin khách hàng */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">Thông tin khách hàng</h3>

            {/* Grid layout 2 cột cho thông tin khách hàng */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Họ tên */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Họ tên</p>
                <p className="font-medium">{orderData.customer.name}</p>
              </div>

              {/* Email */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium">{orderData.customer.email}</p>
              </div>

              {/* Số điện thoại */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Số điện thoại</p>
                <p className="font-medium">{orderData.customer.phone}</p>
              </div>

              {/* Địa chỉ */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Địa chỉ</p>
                <p className="font-medium">{orderData.customer.address}</p>
              </div>
            </div>
          </div>

          {/* ORDER DETAILS SECTION - Chi tiết đơn hàng */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">Chi tiết đơn hàng</h3>

            {/* Bảng sản phẩm với responsive design */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Table Header */}
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

                {/* Table Body */}
                <tbody className="bg-white divide-y divide-gray-200">
                  {orderData.items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      {/* Cột sản phẩm với hình ảnh và thông tin */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {/* Placeholder cho hình ảnh sản phẩm */}
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                            <i className="fas fa-image text-gray-400"></i>
                          </div>

                          {/* Thông tin sản phẩm */}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500">Mã: {item.code}</div>
                          </div>
                        </div>
                      </td>

                      {/* Cột đơn giá */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.price}</td>

                      {/* Cột số lượng */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>

                      {/* Cột thành tiền */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ORDER SUMMARY SECTION - Tổng kết đơn hàng */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">Tổng kết đơn hàng</h3>

            {/* Các dòng tính toán */}
            <div className="space-y-3 max-w-md ml-auto">
              {/* Tạm tính */}
              <div className="flex justify-between">
                <span className="font-medium">Tạm tính:</span>
                <span className="font-medium">{orderData.summary.subtotal}</span>
              </div>

              {/* Phí vận chuyển */}
              <div className="flex justify-between">
                <span className="font-medium">Phí vận chuyển:</span>
                <span className="font-medium">{orderData.summary.shipping}</span>
              </div>

              {/* Giảm giá */}
              <div className="flex justify-between">
                <span className="font-medium">Giảm giá:</span>
                <span className="font-medium text-red-600">-{orderData.summary.discount}</span>
              </div>

              {/* Đường kẻ phân cách */}
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-bold">Tổng cộng:</span>
                  <span className="text-lg font-bold text-yellow-600">{orderData.summary.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ORDER STATUS SECTION - Trạng thái đơn hàng */}
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4 pb-2 border-b border-gray-200">Trạng thái đơn hàng</h3>

            {/* Grid layout cho trạng thái */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Trạng thái hiện tại */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Trạng thái hiện tại</p>
                <div className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md font-medium">
                  {orderData.status}
                </div>
              </div>

              {/* Ngày đặt hàng */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Ngày đặt hàng</p>
                <p className="font-medium">{orderData.orderDate}</p>
              </div>
            </div>
          </div>

          {/* UPDATE FORM SECTION - Form cập nhật đơn hàng */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium mb-4">Cập nhật đơn hàng</h3>

            <form onSubmit={handleStatusUpdate} className="space-y-4">
              {/* Dropdown cập nhật trạng thái */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cập nhật trạng thái</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  required
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

              {/* Input ID Shipper */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Shipper (nếu có)</label>
                <input
                  type="text"
                  value={shipperId}
                  onChange={(e) => setShipperId(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Nhập ID shipper"
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                {/* Nút Hủy */}
                <button
                  type="button"
                  onClick={() => {
                    setNewStatus("")
                    setShipperId("")
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>

                {/* Nút Lưu thay đổi */}
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                >
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
