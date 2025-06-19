"use client"

import { useState } from "react"
import BoCucAdmin from "@/components/layout/bo-cuc-admin"
import ThaoTacNguoiDung from "@/components/nguoi-dung/thao-tac-nguoi-dung"
import TabLocNguoiDung from "@/components/nguoi-dung/tab-loc-nguoi-dung"
import BangNguoiDung from "@/components/nguoi-dung/bang-nguoi-dung"

// Mock data - remove the customer user
const mockUsers = [
  {
    id: "#AD-1001",
    name: "Admin User",
    email: "admin@example.com",
    phone: "0987654321",
    role: "admin",
    status: "active",
  },
  {
    id: "#SP-2001",
    name: "John Shipper",
    email: "john@shipper.com",
    phone: "0912345678",
    role: "shipper",
    status: "active",
  },
  {
    id: "#SP-2002",
    name: "Mike Driver",
    email: "mike@driver.com",
    phone: "0901234567",
    role: "shipper",
    status: "inactive",
  },
  // Remove the customer user entry
]

export default function UsersPage() {
  const [filteredUsers, setFilteredUsers] = useState(mockUsers)

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredUsers(mockUsers)
      return
    }

    const filtered = mockUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.id.toLowerCase().includes(query.toLowerCase()),
    )

    setFilteredUsers(filtered)
  }

  const handleFilterChange = (filter: string) => {
    if (filter === "all") {
      setFilteredUsers(mockUsers)
      return
    }

    // Remove 's' from the end of the filter to match role
    const roleFilter = filter.endsWith("s") ? filter.slice(0, -1) : filter

    const filtered = mockUsers.filter((user) => user.role === roleFilter)

    setFilteredUsers(filtered)
  }

  return (
    <BoCucAdmin title="Quản lý người dùng">
      <ThaoTacNguoiDung onSearch={handleSearch} />
      <TabLocNguoiDung onFilterChange={handleFilterChange} />
      <BangNguoiDung users={filteredUsers} />
    </BoCucAdmin>
  )
}
