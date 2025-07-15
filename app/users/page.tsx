"use client"

import { useState, useEffect, useCallback } from "react"
import BoCucAdmin from "@/components/layout/bo-cuc-admin"
import ThaoTacNguoiDung from "@/components/nguoi-dung/thao-tac-nguoi-dung"
import TabLocNguoiDung from "@/components/nguoi-dung/tab-loc-nguoi-dung"
import BangNguoiDung from "@/components/nguoi-dung/bang-nguoi-dung"
import { getUsers } from "@/lib/userService" // Import service
import useAuthGuard from "@/app/hooks/useAuthGuard"

export default function UsersPage() {
  useAuthGuard();

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State cho các tham số truy vấn
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 6,
    search: '',
    vai_tro: '',
  });

  // Hàm gọi API
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const activeParams = Object.fromEntries(
        Object.entries(queryParams).filter(([_, value]) => value !== '')
      );
      const response = await getUsers(activeParams);
      if (response.success) {
        setUsers(response.data);
        setPagination(response.pagination);
      } else {
        throw new Error(response.message || "Không thể lấy dữ liệu người dùng");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Xử lý tìm kiếm
  const handleSearch = (query: string) => {
    setQueryParams(prev => ({ ...prev, search: query, page: 1 }));
  };

  // Xử lý lọc theo vai trò từ các tab
  const handleFilterChange = (filter: string) => {
    const roleMap: { [key: string]: string } = {
      all: '',
      shippers: 'shipper',
      customers: 'khach_hang',
      admins: 'admin' // Thêm nếu cần
    };
    setQueryParams(prev => ({ ...prev, vai_tro: roleMap[filter] || '', page: 1 }));
  };

  // Xử lý phân trang
  const handlePageChange = (page: number) => {
    setQueryParams(prev => ({ ...prev, page }));
  };

  return (
    <BoCucAdmin title="Quản lý người dùng">
      <ThaoTacNguoiDung onSearch={handleSearch} />
      <TabLocNguoiDung onFilterChange={handleFilterChange} />

      {isLoading && <p className="text-center mt-4">Đang tải dữ liệu...</p>}
      {error && <p className="text-center mt-4 text-red-500">Lỗi: {error}</p>}

      {!isLoading && !error && (
        <BangNguoiDung
          users={users}
          pagination={pagination}
          onPageChange={handlePageChange}
          onDeleteSuccess={fetchUsers} // Callback để tải lại dữ liệu sau khi xóa
        />
      )}
    </BoCucAdmin>
  )
}
