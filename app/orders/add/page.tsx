"use client"

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useAuthGuard from "@/app/hooks/useAuthGuard";
import { createOrder } from "@/lib/orderService";
import OrderItemsManager from "@/components/don-hang/OrderItemsManager";

// --- Định nghĩa kiểu dữ liệu ---
interface CustomerInfo {
  ho_ten: string;
  email: string;
  sdt: string;
  dia_chi_giao_hang: string;
  ghi_chu: string;
  phuong_thuc_thanh_toan: string;
}

interface OrderItem {
  id_variant: string;
  so_luong: number;
}

export default function AddOrderPage() {
  useAuthGuard();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    ho_ten: '',
    email: '',
    sdt: '',
    dia_chi_giao_hang: '',
    ghi_chu: '',
    phuong_thuc_thanh_toan: 'COD'
  });

  const [items, setItems] = useState<OrderItem[]>([]);

  const handleCustomerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (items.length === 0) {
      alert("Vui lòng thêm ít nhất một sản phẩm vào đơn hàng.");
      return;
    }

    setIsSubmitting(true);

    const orderData = {
      ...customerInfo,
      chi_tiet: items.map(item => ({
        id_variant: item.id_variant,
        so_luong: Number(item.so_luong)
      })),
    };

    try {
      const result = await createOrder(orderData);
      if (result.success) {
        alert('Tạo đơn hàng thành công!');
        router.push('/orders');
      } else {
        throw new Error(result.message || 'Có lỗi xảy ra khi tạo đơn hàng');
      }
    } catch (error: any) {
      alert(`Tạo đơn hàng thất bại: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <form onSubmit={handleSubmit}>
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Tạo đơn hàng thủ công</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Thông tin khách hàng */}
            <section>
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Thông tin khách hàng</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label htmlFor="ho_ten">Họ tên</Label><Input id="ho_ten" name="ho_ten" value={customerInfo.ho_ten} onChange={handleCustomerChange} required /></div>
                <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" value={customerInfo.email} onChange={handleCustomerChange} required placeholder="Bắt buộc để tìm khách hàng" /></div>
                <div><Label htmlFor="sdt">Số điện thoại</Label><Input id="sdt" name="sdt" value={customerInfo.sdt} onChange={handleCustomerChange} required /></div>
                <div><Label htmlFor="dia_chi_giao_hang">Địa chỉ giao hàng</Label><Input id="dia_chi_giao_hang" name="dia_chi_giao_hang" value={customerInfo.dia_chi_giao_hang} onChange={handleCustomerChange} required /></div>
              </div>
            </section>

            {/* Tích hợp component OrderItemsManager */}
            <OrderItemsManager items={items} setItems={setItems} />

            {/* Thông tin khác */}
            <section>
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Thông tin khác</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Phương thức thanh toán</Label>
                  <Select name="phuong_thuc_thanh_toan" value={customerInfo.phuong_thuc_thanh_toan} onValueChange={(value: string) => setCustomerInfo(p => ({ ...p, phuong_thuc_thanh_toan: value }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COD">Thanh toán khi nhận hàng (COD)</SelectItem>
                      <SelectItem value="VNPay">Thanh toán qua VNPay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label htmlFor="ghi_chu">Ghi chú</Label><Input id="ghi_chu" name="ghi_chu" value={customerInfo.ghi_chu} onChange={handleCustomerChange} /></div>
              </div>
            </section>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>Hủy</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Đang tạo...' : 'Tạo đơn hàng'}</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
