"use client";
import BoCucAdmin from "@/components/layout/bo-cuc-admin";
import ThongKeTongQuan from "@/components/dashboard/thong-ke-tong-quan";
import DonHangGanDay from "@/components/dashboard/don-hang-gan-day";
import SanPhamBanChay from "@/components/dashboard/san-pham-ban-chay";
import ThaoTacNhanh from "@/components/dashboard/thao-tac-nhanh";
import useAuthGuard from "../hooks/useAuthGuard";
import { useEffect, useState } from "react";
import {
  getDashboardSummary,
  getDashboardTopProductsMonth,
} from "@/lib/dashboardService";
import { getOrders } from "@/lib/orderService";

export default function DashboardPage() {
  useAuthGuard();

  const [summary, setSummary] = useState({
    total_orders: 0,
    total_users: 0,
    total_products: 0,
    today_revenue: 0,
  });

  const [orders, setOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      const summary = await getDashboardSummary();
      setSummary(summary);
    };

    const fetchOrders = async () => {
      const response = await getOrders({
        page: 1,
        limit: 7,
        trang_thai_don_hang: "",
        dateRange: "today",
      });
      if (response.success) {
        setOrders(response.data);
      } else {
        throw new Error(response.message || "Không thể lấy dữ liệu đơn hàng");
      }
    };

    const fetchTopProducts = async () => {
      const response = await getDashboardTopProductsMonth();
      setTopProducts(response.data);
    };

    fetchOrders();
    fetchSummary();
    fetchTopProducts();
  }, []);
  return (
    <BoCucAdmin title="Tổng quan Dashboard">
      <ThongKeTongQuan summary={summary} />

      {/* Đơn hàng gần đây - chiếm toàn bộ chiều rộng */}
      <div className="mb-6">
        <DonHangGanDay orders={orders} />
      </div>

      {/* Sản phẩm bán chạy và Thao tác nhanh - nằm cạnh nhau */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SanPhamBanChay topProducts={topProducts} />
        <ThaoTacNhanh />
      </div>
    </BoCucAdmin>
  );
}
