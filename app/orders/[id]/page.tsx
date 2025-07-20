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

    // Hàm tải dữ liệu đơn hàng từ API
    const fetchData = useCallback(async () => {
        if (!orderId) return;
        setIsLoading(true);
        try {
            const orderRes = await getOrderById(orderId);
            if (orderRes.success) {
                setOrder(orderRes.data);
                if (orderRes.data.trang_thai_don_hang) {
                    setSelectedStatus(orderRes.data.trang_thai_don_hang);
                }
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

    // Logic để xác định các trạng thái tiếp theo mà Admin có thể chọn
    const getNextAvailableStatuses = (currentStatus: string): string[] => {
        const statusFlow: { [key: string]: string[] } = {
            'Chờ xác nhận': ['Đã xác nhận', 'Hủy đơn hàng'],
            'Đã xác nhận': ['Shipper đã nhận hàng', 'Hủy đơn hàng'],
            // YÊU CẦU: Khi shipper đã nhận, admin chỉ có thể hủy đơn
            'Shipper đã nhận hàng': ['Hủy đơn hàng'],
            'Đang giao hàng': ['Giao hàng thành công', 'Giao hàng thất bại', 'Hủy đơn hàng'],
        };
        return statusFlow[currentStatus] || [];
    };

    // Hàm xử lý khi nhấn nút "Lưu thay đổi"
    const handleUpdate = async () => {
        if (!selectedStatus || selectedStatus === order.trang_thai_don_hang) {
            alert("Vui lòng chọn một trạng thái mới để cập nhật.");
            return;
        }

        const payload: { trang_thai_don_hang: string; id_shipper?: string } = {
            trang_thai_don_hang: selectedStatus,
        };

        if (selectedStatus === 'Đã xác nhận' && !order.id_shipper) {
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

                // YÊU CẦU: Tự động chuyển trang sau khi cập nhật các trạng thái quan trọng
                if (selectedStatus === 'Shipper đã nhận hàng' || selectedStatus === 'Hủy đơn hàng') {
                    router.push('/orders');
                } else {
                    fetchData(); // Tải lại dữ liệu cho các trạng thái khác
                }
            } else {
                throw new Error(res.message);
            }
        } catch (err: any) {
            alert(`Cập nhật thất bại: ${err.message}`);
        } finally {
            setIsUpdating(false);
        }
    };

    const formatCurrency = (amount: number = 0) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    const mapStatusToType = (status: string): string => {
        const statusMap: { [key: string]: string } = {
            'Chờ xác nhận': 'pending',
            'Đã xác nhận': 'processing',
            'Shipper đã nhận hàng': 'shipping',
            'Đang giao hàng': 'shipping',
            'Giao hàng thành công': 'active',
            'Hủy đơn hàng': 'inactive',
            'Giao hàng thất bại': 'inactive',
        };
        return statusMap[status] || 'default';
    };

    if (isLoading) return <div className="p-8 text-center">Đang tải dữ liệu...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Lỗi: {error}</div>;
    if (!order) return <div className="p-8 text-center">Không tìm thấy đơn hàng.</div>;

    const availableStatuses = getNextAvailableStatuses(order.trang_thai_don_hang);
    const customerName = order.ho_ten || order.id_customer?.ho_ten || 'Khách vãng lai';
    const customerEmail = order.email || order.id_customer?.email || 'Không có';
    const customerPhone = order.sdt || order.id_customer?.sdt || 'Không có';

    const subTotal = order.chi_tiet.reduce((acc: number, item: any) => acc + (item.gia_ban || item.gia) * item.so_luong, 0);
    const shippingFee = order.phi_van_chuyen || 0;
    const discountAmount = order.gia_giam || 0;
    const finalTotal = subTotal + shippingFee - discountAmount;

    return (
        <div className="bg-gray-50 p-4 md:p-8 min-h-screen">
            <div className="bg-white rounded-lg shadow-sm p-6 max-w-5xl mx-auto">
                <div className="flex justify-between items-center pb-4 mb-6 border-b">
                    <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{order.ma_don_hang}</h1>
                    <Button variant="outline" onClick={() => window.print()}>
                        <i className="fas fa-print mr-2"></i>In hóa đơn
                    </Button>
                </div>

                <div className="space-y-8">
                    <section>
                        <h2 className="text-lg font-semibold mb-4">Thông tin khách hàng</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                            <div><p className="text-gray-500">Họ tên</p><p className="font-medium">{customerName}</p></div>
                            <div><p className="text-gray-500">Email</p><p className="font-medium">{customerEmail}</p></div>
                            <div><p className="text-gray-500">Số điện thoại</p><p className="font-medium">{customerPhone}</p></div>
                            <div><p className="text-gray-500">Địa chỉ</p><p className="font-medium">{order.dia_chi_giao_hang}</p></div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-4">Chi tiết đơn hàng</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-500 uppercase text-xs border-b">
                                        <th className="py-2 font-medium">Sản phẩm</th>
                                        <th className="py-2 font-medium text-right">Đơn giá</th>
                                        <th className="py-2 font-medium text-center">Số lượng</th>
                                        <th className="py-2 font-medium text-right">Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.chi_tiet.map((item: any, index: number) => {
                                        const variantInfo = item.id_variant;
                                        const isVariantPopulated = typeof variantInfo === 'object' && variantInfo !== null;

                                        const salePrice = item.gia_ban ?? item.gia;
                                        const originalPrice = item.gia_goc;
                                        const hasDiscount = originalPrice && originalPrice > salePrice;

                                        return (
                                            <tr key={index} className="border-b">
                                                <td className="py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 relative">
                                                            <Image
                                                                src={isVariantPopulated ? variantInfo.hinh_chinh : '/placeholder.svg'}
                                                                alt={isVariantPopulated ? variantInfo.ten_sp : 'Hình ảnh'}
                                                                fill sizes="48px" className="object-cover rounded"
                                                                onError={(e) => { e.currentTarget.src = 'https://placehold.co/48x48/eee/ccc?text=Lỗi' }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <div className="font-medium">{isVariantPopulated ? variantInfo.ten_sp : 'Sản phẩm không xác định'}</div>
                                                            <div className="text-xs text-gray-500">Mã: {isVariantPopulated ? variantInfo.sku : 'N/A'}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-right">
                                                    {hasDiscount && (
                                                        <span className="text-gray-500 line-through mr-2">
                                                            {formatCurrency(originalPrice)}
                                                        </span>
                                                    )}
                                                    <span className={hasDiscount ? "text-red-600 font-bold" : ""}>
                                                        {formatCurrency(salePrice)}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-center">{item.so_luong}</td>
                                                <td className="py-4 text-right font-medium">{formatCurrency(salePrice * item.so_luong)}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-lg font-semibold mb-4">Tổng kết đơn hàng</h2>
                        <div className="flex justify-end">
                            <div className="w-full max-w-xs space-y-2 text-sm">
                                <div className="flex justify-between"><span>Tạm tính:</span> <span>{formatCurrency(subTotal)}</span></div>
                                <div className="flex justify-between"><span>Phí vận chuyển:</span> <span>{formatCurrency(shippingFee)}</span></div>
                                <div className="flex justify-between"><span>Giảm giá:</span> <span className="text-red-500">-{formatCurrency(discountAmount)}</span></div>
                                <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                                    <span>Tổng cộng:</span>
                                    <span className="text-primary">{formatCurrency(finalTotal)}</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="border-t pt-8 space-y-8">
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Trạng thái & Vận chuyển</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                                <div>
                                    <p className="text-sm text-gray-500">Trạng thái hiện tại</p>
                                    <div className="mt-1">
                                        <NhanTrangThai status={mapStatusToType(order.trang_thai_don_hang)} customLabel={order.trang_thai_don_hang} />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Ngày đặt hàng</p>
                                    <p className="font-medium">{formatDate(order.created_at)}</p>
                                </div>
                                {order.id_shipper && (
                                    <div>
                                        <p className="text-sm text-gray-500">Shipper</p>
                                        <p className="font-medium">{order.id_shipper.ho_ten} ({order.id_shipper.sdt})</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {availableStatuses.length > 0 && (
                            <div>
                                <h2 className="text-lg font-semibold mb-4">Cập nhật đơn hàng</h2>
                                <div className="space-y-4 max-w-md">
                                    <div>
                                        <Label htmlFor="status-select" className="text-sm font-medium">Cập nhật trạng thái</Label>
                                        <Select onValueChange={setSelectedStatus} value={selectedStatus}>
                                            <SelectTrigger id="status-select"><SelectValue placeholder="Chọn trạng thái mới" /></SelectTrigger>
                                            <SelectContent>
                                                {availableStatuses.map(status => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {selectedStatus === 'Đã xác nhận' && (
                                        <div>
                                            <Label htmlFor="shipper-id" className="text-sm font-medium">Gán ID Shipper</Label>
                                            <Input
                                                id="shipper-id" type="text" value={shipperId}
                                                onChange={(e) => setShipperId(e.target.value)}
                                                placeholder="Nhập ID shipper để xác nhận"
                                            />
                                        </div>
                                    )}

                                    <div className="flex justify-end gap-2 pt-2">
                                        <Button variant="outline" onClick={() => setSelectedStatus(order.trang_thai_don_hang)}>Hủy</Button>
                                        <Button onClick={handleUpdate} disabled={isUpdating}>
                                            {isUpdating ? 'Đang lưu...' : 'Lưu thay đổi'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}
