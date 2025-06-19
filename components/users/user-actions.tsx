"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"

interface UserActionsProps {
  onSearch: (query: string) => void
}

export default function UserActions({ onSearch }: UserActionsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [role, setRole] = useState("")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch(query)
  }

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value)
  }

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div className="relative w-full md:w-64">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Tìm kiếm người dùng..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <select
          value={role}
          onChange={handleRoleChange}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Lọc theo vai trò</option>
          <option value="admin">Admin</option>
          <option value="shipper">Shipper</option>
        </select>
        <Link
          href="/users/add"
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-yellow-600 flex items-center justify-center"
        >
          <i className="fas fa-plus mr-2"></i>
          Thêm người dùng mới
        </Link>
      </div>
    </div>
  )
}
