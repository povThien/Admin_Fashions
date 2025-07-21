"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { addBrand } from "@/lib/brandService"
import useAuthGuard from "@/app/hooks/useAuthGuard"

export default function AddBrandPage() {
    useAuthGuard();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        ten_thuong_hieu: "",
        mo_ta: "",
        hinh: "",
        an_hien: true,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = (checked: boolean) => {
        setFormData((prev) => ({ ...prev, an_hien: checked }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const result = await addBrand(formData);
            if (result.success) {
                alert("Thêm thương hiệu thành công!");
                router.push("/brands");
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
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-semibold mb-6">Thêm thương hiệu mới</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="ten_thuong_hieu">Tên thương hiệu</Label>
                        <Input id="ten_thuong_hieu" name="ten_thuong_hieu" value={formData.ten_thuong_hieu} onChange={handleInputChange} placeholder="Nhập tên thương hiệu" required />
                    </div>
                    <div>
                        <Label htmlFor="mo_ta">Mô tả</Label>
                        <Textarea id="mo_ta" name="mo_ta" value={formData.mo_ta} onChange={handleInputChange} placeholder="Nhập mô tả ngắn" />
                    </div>
                    <div>
                        <Label htmlFor="hinh">URL Hình ảnh</Label>
                        <Input id="hinh" name="hinh" value={formData.hinh} onChange={handleInputChange} placeholder="https://example.com/image.jpg" />
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                        <Switch id="an_hien" checked={formData.an_hien} onCheckedChange={handleStatusChange} />
                        <Label htmlFor="an_hien">Hiển thị</Label>
                    </div>
                    <div className="flex justify-end space-x-3 mt-8">
                        <Button type="button" variant="outline" onClick={() => router.push("/brands")}>Hủy bỏ</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Đang lưu...' : 'Lưu thương hiệu'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}