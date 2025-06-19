"use client"

import Link from "next/link"
import ThanhTimKiem from "@/components/ui/thanh-tim-kiem"

interface ThaoTacDonHangProps {
  onSearch: (query: string) => void
  onStatusFilter: (status: string) => void
}

export default function ThaoTacDonHang({ onSearch, onStatusFilter }: ThaoTacDonHangProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <ThanhTimKiem placeholder="Tìm kiếm đơn hàng..." />

      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          onChange={(e) => onStatusFilter(e.target.value)}
        >
          <option value="all">Lọc theo trạng thái</option>
          <option value="pending">Chờ xử lý</option>
          <option value="processing">Đang xử lý</option>
          <option value="delivered">Đã giao hàng</option>
          <option value="completed">Đã nhận</option>
          <option value="cancelled">Đã hủy</option>
        </select>

        <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
          <option>7 ngày gần đây</option>
          <option>30 ngày gần đây</option>
          <option>90 ngày gần đây</option>
          <option>Năm nay</option>
        </select>

        <Link
          href="/orders/add"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-yellow-600 flex items-center justify-center"
        >
          <i className="fas fa-plus mr-2"></i>
          Tạo đơn hàng mới
        </Link>
      </div>
    </div>
  )
}
