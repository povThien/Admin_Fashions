"use client"

import { useState, useMemo } from "react"
import BoCucAdmin from "@/components/layout/bo-cuc-admin"
import ThaoTacBienThe from "@/components/bien-the/thao-tac-bien-the"
import BangBienThe from "@/components/bien-the/bang-bien-the"
import LocNangCaoBienThe from "@/components/bien-the/loc-nang-cao-bien-the"

// Interface cho bộ lọc nâng cao
interface AdvancedFilter {
    product: string
    size: string
    color: string
    priceRange: {
        min: number
        max: number
    }
    stockStatus: string
    status: string
}

// Interface cho biến thể sản phẩm
interface ProductVariant {
    id: string
    productId: string
    productName: string
    productImage: string
    sku: string
    size: string
    color: string
    price: number
    salePrice?: number
    stock: number
    status: string
    createdAt: string
    updatedAt: string
}

export default function VariantsPage() {
    // State cho từ khóa tìm kiếm
    const [searchQuery, setSearchQuery] = useState("")

    // State cho trang hiện tại
    const [currentPage, setCurrentPage] = useState(1)

    // Số biến thể trên mỗi trang
    const itemsPerPage = 10

    // State cho việc hiển thị bộ lọc nâng cao
    const [showAdvancedFilter, setShowAdvancedFilter] = useState(false)

    // State cho bộ lọc nâng cao
    const [advancedFilter, setAdvancedFilter] = useState<AdvancedFilter>({
        product: "",
        size: "",
        color: "",
        priceRange: {
            min: 0,
            max: 20000000,
        },
        stockStatus: "",
        status: "",
    })

    // Mock data cho biến thể sản phẩm
    const [variants] = useState<ProductVariant[]>([
        {
            id: "1",
            productId: "prod1",
            productName: "Áo thun nam basic",
            productImage: "/placeholder.svg?height=60&width=60",
            sku: "AT001-M-RED",
            size: "M",
            color: "Đỏ",
            price: 299000,
            salePrice: 249000,
            stock: 50,
            status: "active",
            createdAt: "2024-01-15",
            updatedAt: "2024-01-20",
        },
        // Thêm các biến thể khác...
        {
            id: "2",
            productId: "234234",
            productName: "Áo thun nam 234234",
            productImage: "/placeholder.svg?height=60&width=60",
            sku: "AT001-M-blue",
            size: "M",
            color: "Xanh",
            price: 299000,
            salePrice: 249000,
            stock: 2,
            status: "active",
            createdAt: "2024-01-15",
            updatedAt: "2024-01-20",
        },
        // Thêm các biến thể khác...
    ])

    // Các hàm xử lý sự kiện
    const handleSearch = (query: string) => {
        setSearchQuery(query)
        setCurrentPage(1)
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleAdvancedFilterChange = (newFilter: Partial<AdvancedFilter>) => {
        setAdvancedFilter((prev) => ({
            ...prev,
            ...newFilter,
        }))
        setCurrentPage(1)
    }

    const handleResetFilters = () => {
        setSearchQuery("")
        setAdvancedFilter({
            product: "",
            size: "",
            color: "",
            priceRange: {
                min: 0,
                max: 20000000,
            },
            stockStatus: "",
            status: "",
        })
        setCurrentPage(1)
    }

    // Logic lọc và phân trang
    const filteredVariants = useMemo(() => {
        let result = [...variants]

        // Lọc theo từ khóa tìm kiếm
        if (searchQuery.trim()) {
            result = result.filter(
                (variant) =>
                    variant.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    variant.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    variant.size.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    variant.color.toLowerCase().includes(searchQuery.toLowerCase()),
            )
        }

        // Áp dụng các bộ lọc nâng cao
        if (advancedFilter.product) {
            result = result.filter((variant) => variant.productId === advancedFilter.product)
        }

        if (advancedFilter.size) {
            result = result.filter((variant) => variant.size === advancedFilter.size)
        }

        if (advancedFilter.color) {
            result = result.filter((variant) => variant.color === advancedFilter.color)
        }

        // Lọc theo khoảng giá
        result = result.filter(
            (variant) => variant.price >= advancedFilter.priceRange.min && variant.price <= advancedFilter.priceRange.max,
        )

        // Lọc theo trạng thái tồn kho
        if (advancedFilter.stockStatus) {
            if (advancedFilter.stockStatus === "in-stock") {
                result = result.filter((variant) => variant.stock > 10)
            } else if (advancedFilter.stockStatus === "low-stock") {
                result = result.filter((variant) => variant.stock > 0 && variant.stock <= 10)
            } else if (advancedFilter.stockStatus === "out-of-stock") {
                result = result.filter((variant) => variant.stock === 0)
            }
        }

        // Lọc theo trạng thái
        if (advancedFilter.status) {
            result = result.filter((variant) => variant.status === advancedFilter.status)
        }

        return result
    }, [searchQuery, advancedFilter, variants])

    // Tính toán dữ liệu cho phân trang
    const paginationData = useMemo(() => {
        const totalItems = filteredVariants.length
        const totalPages = Math.ceil(totalItems / itemsPerPage)
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        const currentItems = filteredVariants.slice(startIndex, endIndex)

        return {
            currentItems,
            totalItems,
            totalPages,
            currentPage,
            itemsPerPage,
        }
    }, [filteredVariants, currentPage, itemsPerPage])

    return (
        <BoCucAdmin title="Quản lý biến thể sản phẩm">
            {/* Component thanh công cụ */}
            <ThaoTacBienThe
                onSearch={handleSearch}
                searchQuery={searchQuery}
                onToggleAdvancedFilter={() => setShowAdvancedFilter(!showAdvancedFilter)}
                showAdvancedFilter={showAdvancedFilter}
                onResetFilters={handleResetFilters}
                totalResults={paginationData.totalItems}
            />

            {/* Component bộ lọc nâng cao */}
            {showAdvancedFilter && (
                <LocNangCaoBienThe filter={advancedFilter} onFilterChange={handleAdvancedFilterChange} variants={variants} />
            )}

            {/* Component bảng biến thể */}
            <BangBienThe
                variants={paginationData.currentItems}
                currentPage={paginationData.currentPage}
                totalPages={paginationData.totalPages}
                totalItems={paginationData.totalItems}
                itemsPerPage={paginationData.itemsPerPage}
                onPageChange={handlePageChange}
            />
        </BoCucAdmin>
    )
}