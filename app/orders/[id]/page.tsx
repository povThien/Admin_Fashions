"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image";
import { getOrderById, updateOrderStatus } from "@/lib/orderService"
import NhanTrangThai from "@/components/ui/nhan-trang-thai"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useAuthGuard from "@/app/hooks/useAuthGuard";

export default function OrderDetailPage() {
  useAuthGuard();

  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [shipperId, setShipperId] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchData = useCallback(async () => {
    if (!orderId) return;
    setIsLoading(true);
    try {
      const orderRes = await getOrderById(orderId);
      if (orderRes.success) {
        setOrder(orderRes.data);
      } else {
        throw new Error(orderRes.message || "Không thể tải dữ liệu đơn hàng.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getNextAvailableStatuses = (currentStatus: string): string[] => {
    if (currentStatus === 'Chờ xác nhận') return ['Đã xác nhận'];
    if (currentStatus === 'Đã xác nhận') return ['Shipper đã nhận hàng'];
    return [];
  };

  const handleUpdate = async () => {
    if (!selectedStatus) {
      alert("Vui lòng chọn trạng thái mới.");
      return;
    }

    const payload: { trang_thai_don_hang: string; id_shipper?: string } = {
      trang_thai_don_hang: selectedStatus,
    };

    if (selectedStatus === 'Đã xác nhận') {
      if (!shipperId.trim()) {
        alert("Vui lòng nhập ID shipper để xác nhận đơn hàng.");
        return;
      }
      payload.id_shipper = shipperId.trim();
    }

    setIsUpdating(true);
    try {
      const res = await updateOrderStatus(orderId, payload);
      if (res.success) {
        alert("Cập nhật thành công!");
        setOrder(res.data);
        setSelectedStatus("");
        setShipperId("");
      } else {
        throw new Error(res.message);
      }
    } catch (err: any) {
      alert(`Cập nhật thất bại: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('vi-VN');
  const mapStatusToType = (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'Chờ xác nhận': 'pending',
      'Đã xác nhận': 'processing',
      'Shipper đã nhận hàng': 'shipping',
    };
    return statusMap[status] || 'default';
  };

  if (isLoading) return <div className="p-4 text-center">Đang tải dữ liệu đơn hàng...</div>;
  if (error) return <div className="p-4 text-center text-red-500">Lỗi: {error}</div>;
  if (!order) return <div className="p-4 text-center">Không tìm thấy đơn hàng.</div>;

  const availableStatuses = getNextAvailableStatuses(order.trang_thai_don_hang);

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <CardTitle>Chi tiết đơn hàng #{order.ma_don_hang}</CardTitle>
          <Button variant="outline" onClick={() => window.print()}>In hóa đơn</Button>
        </CardHeader>
        <CardContent className="pt-6 space-y-8">
          {/* Phần thông tin khách hàng */}
          <section>
            <h3 className="font-semibold text-lg mb-4">Thông tin khách hàng</h3>
            <div className="grid gap-2 md:grid-cols-2">
              {/* SỬA LỖI Ở ĐÂY: Kiểm tra cả 2 nơi để lấy họ tên */}
              <div><strong>Họ tên:</strong> {order.ho_ten || order.id_customer?.ho_ten || 'Không có'}</div>
              <div><strong>Email:</strong> {order.email || order.id_customer?.email || 'Không có'}</div>
              <div><strong>SĐT:</strong> {order.sdt || order.id_customer?.sdt || 'Không có'}</div>
              <div><strong>Địa chỉ:</strong> {order.dia_chi_giao_hang}</div>
            </div>
          </section>

          {/* Phần Chi tiết đơn hàng */}
          <section>
            <h3 className="font-semibold text-lg mb-4">Chi tiết đơn hàng</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500 uppercase text-xs">
                    <th className="py-2 font-medium">Sản phẩm</th>
                    <th className="py-2 font-medium text-right">Đơn giá</th>
                    <th className="py-2 font-medium text-center">Số lượng</th>
                    <th className="py-2 font-medium text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {order.chi_tiet.map((item: any, index: number) => {
                    // SỬA LỖI Ở ĐÂY: Kiểm tra xem id_variant có phải là object không
                    const isVariantPopulated = typeof item.id_variant === 'object' && item.id_variant !== null;

                    return (
                      <tr key={index} className="border-b">
                        <td className="py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-md flex-shrink-0">
                              <Image
                                src={isVariantPopulated ? item.id_variant.hinh_chinh : '/placeholder.svg'}
                                alt={isVariantPopulated ? item.id_variant.ten_sp : 'Hình ảnh sản phẩm'}
                                width={64}
                                height={64}
                                className="object-cover w-full h-full rounded-md"
                              />
                            </div>
                            <div>
                              <div className="font-medium">{isVariantPopulated ? item.id_variant.ten_sp : 'Sản phẩm không xác định'}</div>
                              <div className="text-xs text-gray-500">Mã: {isVariantPopulated ? item.id_variant.sku : 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-right">{formatCurrency(item.gia)}</td>
                        <td className="py-4 text-center">x {item.so_luong}</td>
                        <td className="py-4 text-right font-medium">{formatCurrency(item.gia * item.so_luong)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* Phần tổng kết đơn hàng */}
          <section className="flex justify-end">
            <div className="w-full max-w-sm space-y-2">
              <div className="flex justify-between"><span>Tạm tính:</span> <span>{formatCurrency(order.tong_tien)}</span></div>
              <div className="flex justify-between"><span>Phí vận chuyển:</span> <span>{formatCurrency(order.phi_van_chuyen || 0)}</span></div>
              <div className="flex justify-between"><span>Giảm giá:</span> <span className="text-red-500">-{formatCurrency(order.gia_giam || 0)}</span></div>
              <div className="flex justify-between font-bold text-xl border-t pt-2 mt-2">
                <span>Tổng cộng:</span>
                <span className="text-primary">{formatCurrency(order.tong_tien + (order.phi_van_chuyen || 0) - (order.gia_giam || 0))}</span>
              </div>
            </div>
          </section>

          {/* Phần trạng thái và cập nhật */}
          <section>
            <div className="grid gap-6 md:grid-cols-2 mb-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Trạng thái đơn hàng</h3>
                <div className="flex items-center gap-4">
                  <NhanTrangThai
                    status={mapStatusToType(order.trang_thai_don_hang)}
                    customLabel={order.trang_thai_don_hang}
                  />
                  <span>(Ngày đặt: {formatDate(order.created_at)})</span>
                </div>
              </div>
            </div>

            {availableStatuses.length > 0 && (
              <Card className="p-4 bg-gray-50 border">
                <h3 className="font-semibold text-lg mb-4">Cập nhật đơn hàng</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="status-select">Chọn trạng thái mới</Label>
                    <Select onValueChange={setSelectedStatus} value={selectedStatus}>
                      <SelectTrigger id="status-select"><SelectValue placeholder="-- Chọn trạng thái --" /></SelectTrigger>
                      <SelectContent>
                        {availableStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedStatus === 'Đã xác nhận' && (
                    <div>
                      <Label htmlFor="shipper-id">ID Shipper</Label>
                      <Input
                        id="shipper-id"
                        type="text"
                        value={shipperId}
                        onChange={(e) => setShipperId(e.target.value)}
                        placeholder="Nhập ID shipper"
                      />
                    </div>
                  )}

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => { setSelectedStatus(''); setShipperId(''); }}>Hủy</Button>
                    <Button onClick={handleUpdate} disabled={isUpdating}>
                      {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
