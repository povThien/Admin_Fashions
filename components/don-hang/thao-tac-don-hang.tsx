"use client"

import Link from "next/link"
import ThanhTimKiem from "@/components/ui/thanh-tim-kiem"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface ThaoTacDonHangProps {
  onSearch: (query: string) => void
  onStatusFilter: (status: string) => void
  onDateFilter: (dateRange: string) => void // THÊM MỚI: Prop để xử lý lọc theo ngày
}

export default function ThaoTacDonHang({ onSearch, onStatusFilter, onDateFilter }: ThaoTacDonHangProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      {/* Cập nhật để truyền prop onSearch */}
      <ThanhTimKiem
        placeholder="Tìm theo mã ĐH, email, SĐT..."
        onSearch={onSearch}
      />

      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        {/* Lọc theo trạng thái */}
        <Select onValueChange={(value) => onStatusFilter(value === 'all' ? '' : value)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Lọc theo trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="Chờ xác nhận">Chờ xác nhận</SelectItem>
            <SelectItem value="Đã xác nhận">Đã xác nhận</SelectItem>
            <SelectItem value="Shipper đã nhận hàng">Shipper đã nhận</SelectItem>
            {/* <SelectItem value="Đang giao hàng">Đang giao hàng</SelectItem> */}
            {/* <SelectItem value="Giao hàng thành công">Giao thành công</SelectItem> */}
            <SelectItem value="Hủy đơn hàng">Đã hủy</SelectItem>
          </SelectContent>
        </Select>

        {/* THÊM MỚI: Lọc theo ngày */}
        <Select onValueChange={(value) => onDateFilter(value === 'all' ? '' : value)}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Lọc theo ngày" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả ngày</SelectItem>
            <SelectItem value="today">Hôm nay</SelectItem>
            <SelectItem value="last7days">7 ngày qua</SelectItem>
            <SelectItem value="last30days">30 ngày qua</SelectItem>
            <SelectItem value="last90days">90 ngày qua</SelectItem>
            <SelectItem value="last1year">1 năm qua</SelectItem>
          </SelectContent>
        </Select>

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
