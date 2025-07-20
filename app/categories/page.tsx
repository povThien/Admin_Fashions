"use client"

import { useState, useEffect, useCallback } from "react"
import BoCucAdmin from "@/components/layout/bo-cuc-admin"
import ThaoTacDanhMuc from "@/components/danh-muc/thao-tac-danh-muc"
import BangDanhMuc from "@/components/danh-muc/bang-danh-muc"
import { getCategories, deleteCategory } from "@/lib/categoryService"
import useAuthGuard from "@/app/hooks/useAuthGuard"

export default function CategoriesPage() {
  useAuthGuard();

  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 6,
    search: '',
  });

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const activeParams = Object.fromEntries(
        Object.entries(queryParams).filter(([_, value]) => value)
      );
      const response = await getCategories(activeParams);
      if (response.success) {
        setCategories(response.data);
        setPagination(response.pagination);
      } else {
        throw new Error(response.message || "Không thể tải danh sách danh mục");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSearch = (query: string) => {
    setQueryParams(prev => ({ ...prev, search: query, page: 1 }));
  };

  const handlePageChange = (page: number) => {  
    setQueryParams(prev => ({ ...prev, page }));
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        const res = await deleteCategory(id);
        if (res.success) {
          alert("Xóa danh mục thành công!");
          fetchCategories(); // Tải lại danh sách
        } else {
          throw new Error(res.message);
        }
      } catch (err: any) {
        alert(`Xóa thất bại: ${err.message}`);
      }
    }
  };

  return (
    <BoCucAdmin title="Quản lý danh mục">
      <ThaoTacDanhMuc onSearch={handleSearch} />

      {isLoading && <p className="text-center mt-4">Đang tải dữ liệu...</p>}
      {error && <p className="text-center mt-4 text-red-500">Lỗi: {error}</p>}

      {!isLoading && !error && (
        <BangDanhMuc
          categories={categories}
          pagination={pagination}
          onPageChange={handlePageChange}
          onDelete={handleDelete}
        />
      )}
    </BoCucAdmin>
  );
}