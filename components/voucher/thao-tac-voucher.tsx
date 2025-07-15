"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ThaoTacVoucherProps {
  onSearch: (query: string) => void
  onFilterChange: (filters: { discount_type?: string; status?: string }) => void
  onAddVoucher: () => void
}

export default function ThaoTacVoucher({ onSearch, onFilterChange, onAddVoucher }: ThaoTacVoucherProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div className="relative w-full md:w-64">
        <Input
          type="text"
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Tìm kiếm mã voucher..."
          className="pl-10"
        />
        <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <Select onValueChange={(value) => onFilterChange({ discount_type: value === 'all' ? '' : value })}>
          <SelectTrigger><SelectValue placeholder="Lọc theo loại" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value="percent">Giảm theo %</SelectItem>
            <SelectItem value="fixed">Giảm trực tiếp</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => onFilterChange({ status: value === 'all' ? '' : value })}>
          <SelectTrigger><SelectValue placeholder="Lọc theo trạng thái" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Đang hoạt động</SelectItem>
            <SelectItem value="inactive">Tạm ẩn</SelectItem>
            <SelectItem value="expired">Hết hạn</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={onAddVoucher}>
          <i className="fas fa-plus mr-2"></i>
          Thêm voucher mới
        </Button>
      </div>
    </div>
  )
}
