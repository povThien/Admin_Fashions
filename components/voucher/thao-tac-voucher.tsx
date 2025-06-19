"use client"

import type React from "react"

import { useState } from "react"

interface ThaoTacVoucherProps {
  onSearch: (query: string) => void
  onAddVoucher: () => void
}

export default function ThaoTacVoucher({ onSearch, onAddVoucher }: ThaoTacVoucherProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [voucherType, setVoucherType] = useState("")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch(query)
  }

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVoucherType(e.target.value)
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div className="relative w-full md:w-64">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Tìm kiếm voucher..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <select
          value={voucherType}
          onChange={handleTypeChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Lọc theo loại</option>
          <option value="percentage">Giảm theo %</option>
          <option value="fixed">Giảm trực tiếp</option>
          <option value="limited">Giảm có giới hạn</option>
        </select>
        <button
          onClick={onAddVoucher}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-yellow-600 flex items-center justify-center"
        >
          <i className="fas fa-plus mr-2"></i>
          Thêm voucher mới
        </button>
      </div>
    </div>
  )
}
