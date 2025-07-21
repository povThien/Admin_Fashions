import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NhanTrangThai from "../ui/nhan-trang-thai";
import NutThaoTac from "../ui/nut-thao-tac";
import router from "next/router";

export default function DonHangGanDay({ orders }: any) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const mapStatusToType = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      "Chờ xác nhận": "pending",
      "Đã xác nhận": "processing",
      "Đang giao": "shipping",
      "Shipper đã nhận hàng": "shipping",
      "Đã giao": "delivered",
      "Giao hàng thành công": "completed",
      "Hủy đơn hàng": "cancelled",
      "Giao hàng thất bại": "cancelled",
      "Trả hàng và hoàn tiền": "cancelled",
    };
    return statusMap[status] || "default";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Đơn hàng gần đây</CardTitle>
        <a href="/orders" className="text-sm text-primary hover:underline">
          Xem tất cả
        </a>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mã đơn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đặt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length > 0 ? (
                orders.map((order: any) => (
                  <tr key={order._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                      {order.ma_don_hang}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm">{order.ho_ten}</div>
                      <div className="text-xs text-gray-500">{order.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {formatCurrency(order.tong_tien)}
                    </td>
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
                      // onEdit={() => router.push(`/orders/${order._id}`)} 
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Không tìm thấy đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
