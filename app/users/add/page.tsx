"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addUser } from "@/lib/userService"
import useAuthGuard from "@/app/hooks/useAuthGuard"

export default function AddUserPage() {
  useAuthGuard();
  const router = useRouter();
  const [formData, setFormData] = useState({
    ho_ten: "",
    email: "",
    mat_khau: "",
    so_dien_thoai: "",
    dia_chi: "",
    vai_tro: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, vai_tro: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.mat_khau) {
      alert("Vui lòng nhập mật khẩu.");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await addUser(formData);
      if (result.success) {
        alert("Thêm người dùng thành công!");
        router.push("/users");
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      alert(`Thêm người dùng thất bại: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h1 className="text-xl font-medium">Thêm người dùng mới</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="ho_ten">Họ và tên</Label>
                <Input id="ho_ten" name="ho_ten" value={formData.ho_ten} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="mat_khau">Mật khẩu</Label>
                <Input id="mat_khau" name="mat_khau" type="password" value={formData.mat_khau} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="so_dien_thoai">Số điện thoại</Label>
                <Input id="so_dien_thoai" name="so_dien_thoai" value={formData.so_dien_thoai} onChange={handleInputChange} />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="dia_chi">Địa chỉ</Label>
                <Input id="dia_chi" name="dia_chi" value={formData.dia_chi} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="vai_tro">Vai trò</Label>
                <Select name="vai_tro" value={formData.vai_tro} onValueChange={handleRoleChange}>
                  <SelectTrigger id="vai_tro"><SelectValue placeholder="Chọn vai trò" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="shipper">Shipper</SelectItem>
                    <SelectItem value="khach_hang">Khách hàng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 p-6 border-t bg-gray-50 rounded-b-lg">
            <Button type="button" variant="outline" onClick={() => router.back()}>Hủy bỏ</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Đang lưu...' : 'Lưu người dùng'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
