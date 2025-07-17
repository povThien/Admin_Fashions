"use client"

import { useState, useMemo } from "react"
import BoCucAdmin from "@/components/layout/bo-cuc-admin"
import ThaoTacSanPham from "@/components/san-pham/thao-tac-san-pham"
import BangSanPham from "@/components/san-pham/bang-san-pham"
import LocNangCao from "@/components/san-pham/loc-nang-cao"

// Dữ liệu mẫu sản phẩm - mở rộng để test phân trang
const mockProducts = [
  {
    id: "1",
    name: "Đồng hồ Chronograph LUXE",
    code: "SP-001",
    category: "Đồng hồ",
    price: "11.599.000₫",
    priceNumber: 11599000, // Thêm giá dạng số để lọc
    stock: 25,
    status: "active",
    image: "/placeholder.svg?height=64&width=64",
    brand: "LUXE",
    createdDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Túi da cao cấp",
    code: "SP-002",
    category: "Túi xách",
    price: "3.500.000₫",
    priceNumber: 3500000,
    stock: 15,
    status: "active",
    image: "/placeholder.svg?height=64&width=64",
    brand: "LUXE",
    createdDate: "2024-01-20",
  },
  {
    id: "3",
    name: "Áo thun nam cao cấp",
    code: "SP-003",
    category: "Quần áo",
    price: "1.999.999₫",
    priceNumber: 1999999,
    stock: 50,
    status: "active",
    image: "/placeholder.svg?height=64&width=64",
    brand: "Fashion",
    createdDate: "2024-02-01",
  },
  {
    id: "4",
    name: "Quần jean nam",
    code: "SP-004",
    category: "Quần áo",
    price: "2.500.000₫",
    priceNumber: 2500000,
    stock: 30,
    status: "active",
    image: "/placeholder.svg?height=64&width=64",
    brand: "Denim",
    createdDate: "2024-02-05",
  },
  {
    id: "5",
    name: "Kính mát thời trang",
    code: "SP-005",
    category: "Phụ kiện",
    price: "1.200.000₫",
    priceNumber: 1200000,
    stock: 0,
    status: "inactive",
    image: "/placeholder.svg?height=64&width=64",
    brand: "Sunglasses",
    createdDate: "2024-02-10",
  },
  // Thêm nhiều sản phẩm để test phân trang
  {
    id: "6",
    name: "Giày thể thao nam",
    code: "SP-006",
    category: "Giày dép",
    price: "3.200.000₫",
    priceNumber: 3200000,
    stock: 20,
    status: "active",
    image: "/placeholder.svg?height=64&width=64",
    brand: "Sport",
    createdDate: "2024-02-15",
  },
  {
    id: "7",
    name: "Ví da nam cao cấp",
    code: "SP-007",
    category: "Phụ kiện",
    price: "800.000₫",
    priceNumber: 800000,
    stock: 35,
    status: "active",
    image: "/placeholder.svg?height=64&width=64",
    brand: "Leather",
    createdDate: "2024-02-20",
  },
  {
    id: "8",
    name: "Áo sơ mi công sở",
    code: "SP-008",
    category: "Quần áo",
    price: "1.500.000₫",
    priceNumber: 1500000,
    stock: 40,
    status: "active",
    image: "/placeholder.svg?height=64&width=64",
    brand: "Office",
    createdDate: "2024-02-25",
  },
]

// Interface cho bộ lọc nâng cao
interface AdvancedFilter {
  category: string
  brand: string
  priceRange: {
    min: number
    max: number
  }
  stockStatus: string
  status: string
}

export default function ProductsPage() {
  // State cho từ khóa tìm kiếm
  const [searchQuery, setSearchQuery] = useState("")

  // State cho trang hiện tại
  const [currentPage, setCurrentPage] = useState(1)

  // Số sản phẩm trên mỗi trang
  const itemsPerPage = 5

  // State cho việc hiển thị bộ lọc nâng cao
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false)

  // State cho bộ lọc nâng cao
  const [advancedFilter, setAdvancedFilter] = useState<AdvancedFilter>({
    category: "",
    brand: "",
    priceRange: {
      min: 0,
      max: 20000000, // 20 triệu VND
    },
    stockStatus: "",
    status: "",
  })

  // Hàm xử lý tìm kiếm - được gọi khi người dùng nhập từ khóa
  const handleSearch = (query: string) => {
    setSearchQuery(query) // Cập nhật từ khóa tìm kiếm
    setCurrentPage(1) // Reset về trang đầu khi tìm kiếm
  }

  // Hàm xử lý thay đổi trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Hàm xử lý cập nhật bộ lọc nâng cao
  const handleAdvancedFilterChange = (newFilter: Partial<AdvancedFilter>) => {
    setAdvancedFilter((prev) => ({
      ...prev, // Giữ nguyên các giá trị cũ
      ...newFilter, // Cập nhật các giá trị mới
    }))
    setCurrentPage(1) // Reset về trang đầu khi lọc
  }

  // Hàm reset tất cả bộ lọc
  const handleResetFilters = () => {
    setSearchQuery("")
    setAdvancedFilter({
      category: "",
      brand: "",
      priceRange: {
        min: 0,
        max: 20000000,
      },
      stockStatus: "",
      status: "",
    })
    setCurrentPage(1)
  }

  // useMemo để tối ưu hiệu suất - chỉ tính toán lại khi dependencies thay đổi
  const filteredProducts = useMemo(() => {
    let result = [...mockProducts] // Tạo bản copy để không thay đổi dữ liệu gốc

    // Bước 1: Lọc theo từ khóa tìm kiếm
    if (searchQuery.trim()) {
      result = result.filter(
        (product) =>
          // Tìm kiếm trong tên sản phẩm (không phân biệt hoa thường)
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          // Tìm kiếm trong mã sản phẩm
          product.code
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          // Tìm kiếm trong danh mục
          product.category
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      )
    }

    // Bước 2: Lọc theo danh mục
    if (advancedFilter.category) {
      result = result.filter((product) => product.category === advancedFilter.category)
    }

    // Bước 3: Lọc theo thương hiệu
    if (advancedFilter.brand) {
      result = result.filter((product) => product.brand === advancedFilter.brand)
    }

    // Bước 4: Lọc theo khoảng giá
    result = result.filter(
      (product) =>
        product.priceNumber >= advancedFilter.priceRange.min && product.priceNumber <= advancedFilter.priceRange.max,
    )

    // Bước 5: Lọc theo trạng thái tồn kho
    if (advancedFilter.stockStatus) {
      if (advancedFilter.stockStatus === "in-stock") {
        result = result.filter((product) => product.stock > 0)
      } else if (advancedFilter.stockStatus === "out-of-stock") {
        result = result.filter((product) => product.stock === 0)
      } else if (advancedFilter.stockStatus === "low-stock") {
        result = result.filter((product) => product.stock > 0 && product.stock <= 10)
      }
    }

    // Bước 6: Lọc theo trạng thái sản phẩm
    if (advancedFilter.status) {
      result = result.filter((product) => product.status === advancedFilter.status)
    }

    return result
  }, [searchQuery, advancedFilter]) // Chỉ tính toán lại khi searchQuery hoặc advancedFilter thay đổi

  // Tính toán dữ liệu cho phân trang
  const paginationData = useMemo(() => {
    const totalItems = filteredProducts.length // Tổng số sản phẩm sau khi lọc
    const totalPages = Math.ceil(totalItems / itemsPerPage) // Tổng số trang
    const startIndex = (currentPage - 1) * itemsPerPage // Chỉ số bắt đầu
    const endIndex = startIndex + itemsPerPage // Chỉ số kết thúc
    const currentItems = filteredProducts.slice(startIndex, endIndex) // Sản phẩm của trang hiện tại

    return {
      currentItems,
      totalItems,
      totalPages,
      currentPage,
      itemsPerPage,
    }
  }, [filteredProducts, currentPage, itemsPerPage])

  return (
    <BoCucAdmin title="Quản lý sản phẩm">
      {/* Component thanh công cụ với tìm kiếm và nút thêm sản phẩm */}
      <ThaoTacSanPham
        onSearch={handleSearch}
        searchQuery={searchQuery}
        onToggleAdvancedFilter={() => setShowAdvancedFilter(!showAdvancedFilter)}
        showAdvancedFilter={showAdvancedFilter}
        onResetFilters={handleResetFilters}
        totalResults={paginationData.totalItems}
      />

      {/* Component bộ lọc nâng cao - chỉ hiển thị khi showAdvancedFilter = true */}
      {showAdvancedFilter && (
        <LocNangCao
          filter={advancedFilter}
          onFilterChange={handleAdvancedFilterChange}
          products={mockProducts} // Truyền toàn bộ sản phẩm để lấy danh sách danh mục, thương hiệu
        />
      )}

      {/* Component bảng sản phẩm với dữ liệu đã được lọc và phân trang */}
      <BangSanPham
        products={paginationData.currentItems}
        currentPage={paginationData.currentPage}
        totalPages={paginationData.totalPages}
        totalItems={paginationData.totalItems}
        itemsPerPage={paginationData.itemsPerPage}
        onPageChange={handlePageChange}
      />
    </BoCucAdmin>
  )
}
