"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useAuthGuard from "@/app/hooks/useAuthGuard"
import { createOrder } from "@/lib/orderService" // Import hàm API mới

export default function AddOrderPage() {
  useAuthGuard();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State cho thông tin khách hàng
  const [customerInfo, setCustomerInfo] = useState({
    ho_ten: '',
    email: '',
    sdt: '',
    dia_chi_giao_hang: '',
    ghi_chu: '',
    phuong_thuc_thanh_toan: 'COD' // SỬA LỖI: Đặt giá trị mặc định là chữ HOA
  });

  // State cho danh sách sản phẩm
  const [items, setItems] = useState([{ id_variant: '', so_luong: 1 }]);

  // Hàm xử lý thay đổi thông tin khách hàng
  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  // Hàm xử lý thay đổi thông tin sản phẩm
  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [name]: value };
    setItems(newItems);
  };

  // Hàm thêm một dòng sản phẩm mới
  const addItemRow = () => {
    setItems([...items, { id_variant: '', so_luong: 1 }]);
  };

  // Hàm xóa một dòng sản phẩm
  const removeItemRow = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // Hàm xử lý khi submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderData = {
      ...customerInfo,
      variants: items.map(item => ({
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
        throw new Error(result.message || 'Có lỗi xảy ra');
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

            {/* Chi tiết đơn hàng */}
            <section>
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Chi tiết đơn hàng</h3>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="flex items-end gap-2 p-2 border rounded-md">
                    <div className="flex-grow"><Label>SKU sản phẩm</Label><Input name="id_variant" value={item.id_variant} onChange={(e) => handleItemChange(index, e)} placeholder="Nhập SKU của biến thể" required /></div>
                    <div className="w-24"><Label>Số lượng</Label><Input name="so_luong" type="number" min="1" value={item.so_luong} onChange={(e) => handleItemChange(index, e)} required /></div>
                    <Button type="button" variant="destructive" size="sm" onClick={() => removeItemRow(index)}>Xóa</Button>
                  </div>
                ))}
                <Button type="button" variant="outline" onClick={addItemRow}>+ Thêm sản phẩm</Button>
              </div>
            </section>

            {/* Thông tin khác */}
            <section>
              <h3 className="text-lg font-semibold mb-4 border-b pb-2">Thông tin khác</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Phương thức thanh toán</Label>
                  <Select name="phuong_thuc_thanh_toan" value={customerInfo.phuong_thuc_thanh_toan} onValueChange={(value) => setCustomerInfo(p => ({ ...p, phuong_thuc_thanh_toan: value }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {/* SỬA LỖI: Chuyển value sang chữ HOA để khớp với enum của backend */}
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
