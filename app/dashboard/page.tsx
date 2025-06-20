"use client";
import BoCucAdmin from "@/components/layout/bo-cuc-admin"
import ThongKeTongQuan from "@/components/dashboard/thong-ke-tong-quan"
import DonHangGanDay from "@/components/dashboard/don-hang-gan-day"
import SanPhamBanChay from "@/components/dashboard/san-pham-ban-chay"
import ThaoTacNhanh from "@/components/dashboard/thao-tac-nhanh"
import useAuthGuard from "../hooks/useAuthGuard"

export default function DashboardPage() {
  useAuthGuard();
  return (
    <BoCucAdmin title="Tổng quan Dashboard">
      <ThongKeTongQuan />

      {/* Đơn hàng gần đây - chiếm toàn bộ chiều rộng */}
      <div className="mb-6">
        <DonHangGanDay />
      </div>

      {/* Sản phẩm bán chạy và Thao tác nhanh - nằm cạnh nhau */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SanPhamBanChay />
        <ThaoTacNhanh />
      </div>
    </BoCucAdmin>
  )
}
