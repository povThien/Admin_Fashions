"use client"

import { useState, useEffect, useCallback } from "react"
import BoCucAdmin from "@/components/layout/bo-cuc-admin"
import ThaoTacDonHang from "@/components/don-hang/thao-tac-don-hang"
import BangDonHang from "@/components/don-hang/bang-don-hang"
import { getOrders } from "@/lib/orderService"
import useAuthGuard from "@/app/hooks/useAuthGuard"
export default function OrdersPage() {
  useAuthGuard();

  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // BƯỚC 1: Thêm 'dateRange' vào state quản lý tham số truy vấn
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 7,
    search: '',
    trang_thai_don_hang: '',
    dateRange: '', // Thêm trường mới để quản lý bộ lọc ngày
  });

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const activeParams = Object.fromEntries(
        Object.entries(queryParams).filter(([_, value]) => value !== '')
      );

      const response = await getOrders(activeParams);
      if (response.success) {
        setOrders(response.data);
        setPagination(response.pagination);
      } else {
        throw new Error(response.message || "Không thể lấy dữ liệu đơn hàng");
      }
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi kết nối tới server.");
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSearch = (query: string) => {
    setQueryParams(prev => ({ ...prev, search: query, page: 1 }));
  };

  const handleStatusFilter = (status: string) => {
    setQueryParams(prev => ({ ...prev, trang_thai_don_hang: status, page: 1 }));
  };

  // BƯỚC 2: Tạo hàm xử lý sự kiện cho bộ lọc ngày
  const handleDateFilter = (dateRange: string) => {
    setQueryParams(prev => ({ ...prev, dateRange: dateRange, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setQueryParams(prev => ({ ...prev, page }));
  };

  return (
    <BoCucAdmin title="Quản lý đơn hàng">
      {/* BƯỚC 3: Truyền hàm xử lý onDateFilter vào component ThaoTacDonHang */}
      <ThaoTacDonHang
        onSearch={handleSearch}
        onStatusFilter={handleStatusFilter}
        onDateFilter={handleDateFilter}
      />

      {isLoading && <p className="text-center mt-4">Đang tải dữ liệu...</p>}
      {error && <p className="text-center mt-4 text-red-500">Lỗi: {error}</p>}

      {!isLoading && !error && (
        <BangDonHang
          orders={orders}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      )}
    </BoCucAdmin>
  );
}
