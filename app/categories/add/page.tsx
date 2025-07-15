"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { addCategory } from "@/lib/categoryService"
import useAuthGuard from "@/app/hooks/useAuthGuard"

export default function AddCategoryPage() {
  useAuthGuard();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State cho form, khớp với schema của backend
  const [formData, setFormData] = useState({
    ten_loai: "",
    mo_ta: "",
    hinh: "", // Backend đang nhận URL hình ảnh
    thu_tu: 0,
    an_hien: true,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'thu_tu' ? parseInt(value) || 0 : value,
    }));
  };

  const handleStatusChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      an_hien: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await addCategory(formData);
      if (result.success) {
        alert("Thêm danh mục thành công!");
        router.push("/categories");
      } else {
        throw new Error(result.message || "Có lỗi không xác định xảy ra.");
      }
    } catch (error: any) {
      alert(`Thêm thất bại: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#f9fafb" }}>
      <div className="w-full max-w-3xl bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-medium">Thêm danh mục mới</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin cơ bản</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="ten_loai">Tên danh mục</Label>
                    <Input
                      id="ten_loai"
                      name="ten_loai"
                      value={formData.ten_loai}
                      onChange={handleInputChange}
                      placeholder="Nhập tên danh mục"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="mo_ta">Mô tả</Label>
                    <Textarea
                      id="mo_ta"
                      name="mo_ta"
                      value={formData.mo_ta}
                      onChange={handleInputChange}
                      placeholder="Nhập mô tả ngắn"
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Hiển thị</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="hinh">URL Hình ảnh</Label>
                    <Input
                      id="hinh"
                      name="hinh"
                      value={formData.hinh}
                      onChange={handleInputChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="thu_tu">Thứ tự</Label>
                    <Input
                      id="thu_tu"
                      name="thu_tu"
                      type="number"
                      value={formData.thu_tu}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch id="an_hien" checked={formData.an_hien} onCheckedChange={handleStatusChange} />
                    <Label htmlFor="an_hien">Hiển thị</Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 mt-8">
              <Button type="button" variant="outline" onClick={() => router.push("/categories")}>
                Hủy bỏ
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Đang lưu...' : 'Lưu danh mục'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
