"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface ThanhTimKiemProps {
  placeholder?: string
  onSearch?: (query: string) => void
  value?: string
  className?: string
}

export default function ThanhTimKiem({
  placeholder = "Tìm kiếm...",
  onSearch,
  value = "",
  className = "",
}: ThanhTimKiemProps) {
  // State local để quản lý giá trị input
  const [searchValue, setSearchValue] = useState(value)

  // Đồng bộ với prop value khi thay đổi từ bên ngoài
  useEffect(() => {
    setSearchValue(value)
  }, [value])

  // Hàm xử lý khi người dùng nhập
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchValue(newValue)

    // Gọi callback onSearch nếu có
    if (onSearch) {
      onSearch(newValue)
    }
  }

  // Hàm xử lý khi nhấn Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(searchValue)
    }
  }

  // Hàm xóa nội dung tìm kiếm
  const handleClear = () => {
    setSearchValue("")
    if (onSearch) {
      onSearch("")
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Icon tìm kiếm */}
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <i className="fas fa-search text-gray-400"></i>
      </div>

      {/* Input tìm kiếm */}
      <input
        type="text"
        value={searchValue}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      />

      {/* Nút xóa - chỉ hiển thị khi có nội dung */}
      {searchValue && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          type="button"
        >
          <i className="fas fa-times"></i>
        </button>
      )}
    </div>
  )
}
