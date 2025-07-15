"use client";

import { useState, useEffect, useCallback } from "react";
import BoCucAdmin from "@/components/layout/bo-cuc-admin";
import ThaoTacBienThe from "@/components/bien-the/thao-tac-bien-the";
import BangBienThe from "@/components/bien-the/bang-bien-the";
import { getVariants } from "@/lib/productService"; // Import service

export default function VariantsPage() {
    const [variants, setVariants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Hàm gọi API lấy danh sách biến thể
    const fetchVariants = useCallback(async () => {
        setIsLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: 10,
                search: searchQuery,
            };
            const res = await getVariants(params);
            if (res.success) {
                setVariants(res.data);
                setPagination(res.pagination);
            }
        } catch (error) {
            console.error("Failed to fetch variants:", error);
            alert("Lỗi khi tải dữ liệu biến thể!");
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, searchQuery]);

    useEffect(() => {
        fetchVariants();
    }, [fetchVariants]);

    // Các hàm xử lý sự kiện
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleResetFilters = () => {
        setSearchQuery("");
        setCurrentPage(1);
    };

    return (
        <BoCucAdmin title="Quản lý biến thể sản phẩm">
            <ThaoTacBienThe
                onSearch={handleSearch}
                searchQuery={searchQuery}
                onToggleAdvancedFilter={() => { }} // Nâng cấp sau nếu cần
                showAdvancedFilter={false}
                onResetFilters={handleResetFilters}
                totalResults={pagination.totalItems}
            />

            <BangBienThe
                isLoading={isLoading}
                variants={variants}
                pagination={pagination}
                onPageChange={handlePageChange}
            // Thêm các hàm xử lý edit/delete nếu cần
            />
        </BoCucAdmin>
    );
}