"use client"
import BoCucAdmin from "@/components/layout/bo-cuc-admin"
import ThongKeDoanhThu from "@/components/bao-cao/thong-ke-doanh-thu"
import BieuDoDoanhThu from "@/components/bao-cao/bieu-do-doanh-thu"
import SanPhamBanChayNhat from "@/components/bao-cao/san-pham-ban-chay-nhat"
import DoanhThuTheoDanhMuc from "@/components/bao-cao/doanh-thu-theo-danh-muc"

export default function ReportsPage() {
  return (
    <BoCucAdmin title="Báo cáo doanh thu">
      <div className="space-y-6">
        {/* Bộ lọc ngày */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex space-x-2 w-full md:w-auto">
            <input
              type="date"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="flex items-center">đến</span>
            <input
              type="date"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90">Áp dụng</button>
          </div>

          <div className="flex space-x-2 w-full md:w-auto">
            <select
              defaultValue="Tháng này"
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option>Hôm nay</option>
              <option>Tuần này</option>
              <option>Tháng này</option>
              <option>Năm nay</option>
              <option>Tùy chỉnh</option>
            </select>
            <button className="border border-primary text-primary px-4 py-2 rounded-lg hover:bg-primary hover:text-white">
              <i className="fas fa-download mr-2"></i>Xuất báo cáo
            </button>
          </div>
        </div>

        <ThongKeDoanhThu />
        <BieuDoDoanhThu />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SanPhamBanChayNhat />
          <DoanhThuTheoDanhMuc />
        </div>
      </div>
    </BoCucAdmin>
  )
}
