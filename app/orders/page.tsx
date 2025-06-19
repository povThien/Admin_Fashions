"use client"

import { useState } from "react"
import BoCucAdmin from "@/components/layout/bo-cuc-admin"
import ThaoTacDonHang from "@/components/don-hang/thao-tac-don-hang"
import BangDonHang from "@/components/don-hang/bang-don-hang"

const mockOrders = [
  {
    id: "#LX-10025",
    customer: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    date: "15/05/2025",
    amount: "11.999.999₫",
    status: "pending",
  },
  {
    id: "#LX-10024",
    customer: "Trần Thị B",
    email: "tranthib@email.com",
    date: "14/05/2025",
    amount: "6.790.000₫",
    status: "processing",
  },
  {
    id: "#LX-10023",
    customer: "Lê Văn C",
    email: "levanc@email.com",
    date: "12/05/2025",
    amount: "4.599.000₫",
    status: "delivered",
  },
  {
    id: "#LX-10022",
    customer: "Phạm Thị D",
    email: "phamthid@email.com",
    date: "10/05/2025",
    amount: "10.990.000₫",
    status: "completed",
  },
  {
    id: "#LX-10021",
    customer: "Hoàng Văn E",
    email: "hoangvane@email.com",
    date: "08/05/2025",
    amount: "3.890.000₫",
    status: "cancelled",
  },
]

export default function OrdersPage() {
  const [filteredOrders, setFilteredOrders] = useState(mockOrders)

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredOrders(mockOrders)
      return
    }

    const filtered = mockOrders.filter(
      (order) =>
        order.id.toLowerCase().includes(query.toLowerCase()) ||
        order.customer.toLowerCase().includes(query.toLowerCase()),
    )

    setFilteredOrders(filtered)
  }

  const handleStatusFilter = (status: string) => {
    if (status === "all") {
      setFilteredOrders(mockOrders)
      return
    }

    const filtered = mockOrders.filter((order) => order.status === status)
    setFilteredOrders(filtered)
  }

  return (
    <BoCucAdmin title="Quản lý đơn hàng">
      <ThaoTacDonHang onSearch={handleSearch} onStatusFilter={handleStatusFilter} />
      <BangDonHang orders={filteredOrders} />
    </BoCucAdmin>
  )
}
