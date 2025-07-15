"use client"

import { useState, useEffect, useCallback } from "react"
import BoCucAdmin from "@/components/layout/bo-cuc-admin"
import ThaoTacDonHang from "@/components/don-hang/thao-tac-don-hang"
import BangDonHang from "@/components/don-hang/bang-don-hang"
import { getOrders } from "@/lib/orderService"
import useAuthGuard from "../hooks/useAuthGuard"



export default function OrdersPage() {
  // THÊM MỚI: Hook để bảo vệ route, yêu cầu đăng nhập
  useAuthGuard();

  // THÊM MỚI: State để quản lý dữ liệu thật, trạng thái tải và lỗi
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // THÊM MỚI: State cho các tham số truy vấn (filters, search, pagination)
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 7,
    search: '',
    trang_thai_don_hang: '',
  });

  // THÊM MỚI: Hàm để fetch dữ liệu từ API, sử dụng useCallback để tối ưu
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Lọc ra các params có giá trị để không gửi các trường rỗng lên server
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
  }, [queryParams]); // Hàm này sẽ được tạo lại khi queryParams thay đổi

  // THÊM MỚI: useEffect để gọi API khi component được tải hoặc khi queryParams thay đổi
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);


  // CẬP NHẬT: Các hàm xử lý sự kiện sẽ cập nhật queryParams, kích hoạt useEffect chạy lại
  const handleSearch = (query: string) => {
    setQueryParams(prev => ({ ...prev, search: query, page: 1 }));
  };

  const handleStatusFilter = (status: string) => {
    setQueryParams(prev => ({ ...prev, trang_thai_don_hang: status === 'all' ? '' : status, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setQueryParams(prev => ({ ...prev, page }));
  };

  return (
    <BoCucAdmin title="Quản lý đơn hàng">
      <ThaoTacDonHang onSearch={handleSearch} onStatusFilter={handleStatusFilter} />

      {/* THÊM MỚI: Hiển thị UI dựa trên trạng thái loading và lỗi */}
      {isLoading && <p className="text-center mt-4">Đang tải dữ liệu...</p>}
      {error && <p className="text-center mt-4 text-red-500">Lỗi: {error}</p>}

      {/* CẬP NHẬT: Chỉ render bảng khi không loading và không có lỗi */}
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










// const mockOrders = [
//   {
//     id: "#LX-10025",
//     customer: "Nguyễn Văn A",
//     email: "nguyenvana@email.com",
//     date: "15/05/2025",
//     amount: "11.999.999₫",
//     status: "pending",
//   },
//   {
//     id: "#LX-10024",
//     customer: "Trần Thị B",
//     email: "tranthib@email.com",
//     date: "14/05/2025",
//     amount: "6.790.000₫",
//     status: "processing",
//   },
//   {
//     id: "#LX-10023",
//     customer: "Lê Văn C",
//     email: "levanc@email.com",
//     date: "12/05/2025",
//     amount: "4.599.000₫",
//     status: "delivered",
//   },
//   {
//     id: "#LX-10022",
//     customer: "Phạm Thị D",
//     email: "phamthid@email.com",
//     date: "10/05/2025",
//     amount: "10.990.000₫",
//     status: "completed",
//   },
//   {
//     id: "#LX-10021",
//     customer: "Hoàng Văn E",
//     email: "hoangvane@email.com",
//     date: "08/05/2025",
//     amount: "3.890.000₫",
//     status: "cancelled",
//   },
// ]

// export default function OrdersPage() {
//   const [filteredOrders, setFilteredOrders] = useState(mockOrders)

//   const handleSearch = (query: string) => {
//     if (!query) {
//       setFilteredOrders(mockOrders)
//       return
//     }

//     const filtered = mockOrders.filter(
//       (order) =>
//         order.id.toLowerCase().includes(query.toLowerCase()) ||
//         order.customer.toLowerCase().includes(query.toLowerCase()),
//     )

//     setFilteredOrders(filtered)
//   }

//   const handleStatusFilter = (status: string) => {
//     if (status === "all") {
//       setFilteredOrders(mockOrders)
//       return
//     }

//     const filtered = mockOrders.filter((order) => order.status === status)
//     setFilteredOrders(filtered)
//   }

//   return (
//     <BoCucAdmin title="Quản lý đơn hàng">
//       <ThaoTacDonHang onSearch={handleSearch} onStatusFilter={handleStatusFilter} />
//       <BangDonHang orders={filteredOrders} />
//     </BoCucAdmin>
//   )
// }



