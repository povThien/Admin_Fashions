"use client"

import { Card, CardContent } from "@/components/ui/card"
import NhanTrangThai from "@/components/ui/nhan-trang-thai"
import NutThaoTac from "@/components/ui/nut-thao-tac"
import PhanTrang from "@/components/ui/phan-trang"
import { useRouter } from "next/navigation"

// Định nghĩa lại các interface để khớp với dữ liệu từ API
interface Order {
  _id: string;
  ma_don_hang: string;
  ho_ten: string;
  email: string;
  created_at: string;
  tong_tien: number;
  trang_thai_don_hang: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  limit: number;
}

interface BangDonHangProps {
  orders: Order[];
  pagination: Pagination | null;
  onPageChange: (page: number) => void;
}

export default function BangDonHang({ orders, pagination, onPageChange }: BangDonHangProps) {
  const router = useRouter();

  const handleDelete = (orderId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) {
      // TODO: Gọi API xóa đơn hàng với orderId
      console.log("Xóa đơn hàng:", orderId);
      alert("Chức năng xóa đang được phát triển!");
    }
  };

  // Các hàm tiện ích để định dạng dữ liệu
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Hàm để ánh xạ trạng thái từ backend sang loại trạng thái của component UI
  const mapStatusToType = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'Chờ xác nhận': 'pending',
      'Đã xác nhận': 'processing',
      'Đang giao': 'shipping',
      'Shipper đã nhận hàng': 'shipping',
      'Đã giao': 'delivered',
      'Giao hàng thành công': 'completed',
      'Hủy đơn hàng': 'cancelled',
      'Giao hàng thất bại': 'cancelled',
      'Trả hàng và hoàn tiền': 'cancelled',
    };
    return statusMap[status] || 'default';
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">{order.ma_don_hang}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{order.ho_ten}</div>
                      <div className="text-xs text-gray-500">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(order.created_at)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{formatCurrency(order.tong_tien)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* SỬA LỖI Ở ĐÂY: Thay 'text' bằng 'customLabel' */}
                      <NhanTrangThai
                        status={mapStatusToType(order.trang_thai_don_hang)}
                        customLabel={order.trang_thai_don_hang}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <NutThaoTac
                        // viewUrl={`/orders/${order._id}`}
                        onEdit={() => router.push(`/orders/${order._id}`)}
                      // onDelete={() => handleDelete(order._id)}
                      />
                    </td> 
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Không tìm thấy đơn hàng nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {pagination && pagination.totalPages > 1 && (
          <PhanTrang
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalOrders}
            itemsPerPage={pagination.limit}
            onPageChange={onPageChange}
          />
        )}
      </CardContent>
    </Card>
  );
}
