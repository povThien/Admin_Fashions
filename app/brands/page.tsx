"use client"

import { useState, useEffect, useCallback } from "react"
import BoCucAdmin from "@/components/layout/bo-cuc-admin"
import ThaoTacThuongHieu from "@/components/thuong-hieu/thao-tac-thuong-hieu"
import BangThuongHieu from "@/components/thuong-hieu/bang-thuong-hieu"
import { getBrands, deleteBrand } from "@/lib/brandService"
import useAuthGuard from "@/app/hooks/useAuthGuard"

export default function BrandsPage() {
    useAuthGuard();

    const [brands, setBrands] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [queryParams, setQueryParams] = useState({
        page: 1,
        limit: 6,
        search: '',
    });

    const fetchBrands = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const activeParams = Object.fromEntries(
                Object.entries(queryParams).filter(([_, value]) => value)
            );
            const response = await getBrands(activeParams);
            if (response.success) {
                setBrands(response.data);
                setPagination(response.pagination);
            } else {
                throw new Error(response.message || "Không thể tải danh sách thương hiệu");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [queryParams]);

    useEffect(() => {
        fetchBrands();
    }, [fetchBrands]);

    const handleSearch = (query: string) => {
        setQueryParams(prev => ({ ...prev, search: query, page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setQueryParams(prev => ({ ...prev, page }));
    };

    const handleDelete = async (id: string) => {
        if (confirm("Bạn có chắc chắn muốn xóa thương hiệu này?")) {
            try {
                const res = await deleteBrand(id);
                if (res.success) {
                    alert("Xóa thương hiệu thành công!");
                    fetchBrands(); // Tải lại danh sách
                } else {
                    throw new Error(res.message);
                }
            } catch (err: any) {
                alert(`Xóa thất bại: ${err.message}`);
            }
        }
    };

    return (
        <BoCucAdmin title="Quản lý thương hiệu">
            <ThaoTacThuongHieu onSearch={handleSearch} />

            {isLoading && <p className="text-center mt-4">Đang tải dữ liệu...</p>}
            {error && <p className="text-center mt-4 text-red-500">Lỗi: {error}</p>}

            {!isLoading && !error && (
                <BangThuongHieu
                    brands={brands}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onDelete={handleDelete}
                />
            )}
        </BoCucAdmin>
    );
}