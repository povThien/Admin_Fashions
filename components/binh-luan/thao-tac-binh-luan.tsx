"use client"

import ThanhTimKiem from "@/components/ui/thanh-tim-kiem"

interface ThaoTacBinhLuanProps {
  onSearch: (query: string) => void
  onStatusFilter: (status: string) => void
}

export default function ThaoTacBinhLuan({ onSearch, onStatusFilter }: ThaoTacBinhLuanProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <ThanhTimKiem placeholder="Tìm kiếm bình luận..." />

      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          onChange={(e) => onStatusFilter(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="approved">Đã phê duyệt</option>
          <option value="pending">Chờ phê duyệt</option>
          <option value="hidden">Đã ẩn</option>
        </select>

        <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
          <option>Tất cả sản phẩm</option>
          <option>Áo thun nam</option>
          <option>Quần jeans nữ</option>
          <option>Giày thể thao</option>
        </select>
      </div>
    </div>
  )
}
