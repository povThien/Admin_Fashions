"use client"

import { useState } from "react"
import BoCucAdmin from "@/components/layout/bo-cuc-admin"
import ThaoTacDanhMuc from "@/components/danh-muc/thao-tac-danh-muc"
import BangDanhMuc from "@/components/danh-muc/bang-danh-muc"

const mockCategories = [
  {
    id: "1",
    name: "Đồng hồ",
    code: "LUX-WATCH",
    description: "Dòng đồng hồ cao cấp, sang trọng",
    productCount: 24,
    status: "active",
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "2",
    name: "Trang sức",
    code: "LUX-JEWELRY",
    description: "Trang sức phong cách tinh tế",
    productCount: 18,
    status: "active",
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "3",
    name: "Túi xách",
    code: "LUX-BAG",
    description: "Túi da cao cấp thời thượng",
    productCount: 12,
    status: "active",
    image: "/placeholder.svg?height=64&width=64",
  },
  {
    id: "4",
    name: "Mắt kính",
    code: "LUX-EYEWEAR",
    description: "Kính mát thời trang cao cấp",
    productCount: 8,
    status: "inactive",
    image: "/placeholder.svg?height=64&width=64",
  },
]

export default function CategoriesPage() {
  const [filteredCategories, setFilteredCategories] = useState(mockCategories)

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredCategories(mockCategories)
      return
    }

    const filtered = mockCategories.filter(
      (category) =>
        category.name.toLowerCase().includes(query.toLowerCase()) ||
        category.code.toLowerCase().includes(query.toLowerCase()),
    )

    setFilteredCategories(filtered)
  }

  return (
    <BoCucAdmin title="Quản lý danh mục">
      <ThaoTacDanhMuc onSearch={handleSearch} />
      <BangDanhMuc categories={filteredCategories} />
    </BoCucAdmin>
  )
}
