"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { getBrandById, updateBrand } from "@/lib/brandService"
import useAuthGuard from "@/app/hooks/useAuthGuard"

export default function EditBrandPage() {
    useAuthGuard();
    const router = useRouter();
    const params = useParams();
    const brandId = params.id as string;

    const [formData, setFormData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBrand = useCallback(async () => {
        if (!brandId) return;
        try {
            const res = await getBrandById(brandId);
            if (res.success) setFormData(res.data);
            else throw new Error(res.message);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [brandId]);

    useEffect(() => {
        fetchBrand();
    }, [fetchBrand]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => (prev ? { ...prev, [name]: value } : null));
    };

    const handleStatusChange = (checked: boolean) => {
        setFormData((prev: any) => (prev ? { ...prev, an_hien: checked } : null));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData) return;
        setIsSubmitting(true);
        try {
            const result = await updateBrand(brandId, formData);
            if (result.success) {
                alert("Cập nhật thương hiệu thành công!");
                router.push("/brands");
            } else {
                throw new Error(result.message);
            }
        } catch (error: any) {
            alert(`Cập nhật thất bại: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <p className="text-center p-8">Đang tải dữ liệu...</p>;
    if (error) return <p className="text-center p-8 text-red-500">Lỗi: {error}</p>;
    if (!formData) return <p className="text-center p-8">Không tìm thấy dữ liệu.</p>;

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
                <h1 className="text-2xl font-semibold mb-6">Chỉnh sửa thương hiệu</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <Label htmlFor="ten_thuong_hieu">Tên thương hiệu</Label>
                        <Input id="ten_thuong_hieu" name="ten_thuong_hieu" value={formData.ten_thuong_hieu} onChange={handleInputChange} required />
                    </div>
                    <div>
                        <Label htmlFor="mo_ta">Mô tả</Label>
                        <Textarea id="mo_ta" name="mo_ta" value={formData.mo_ta} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="hinh">URL Hình ảnh</Label>
                        <Input id="hinh" name="hinh" value={formData.hinh} onChange={handleInputChange} />
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                        <Switch id="an_hien" checked={formData.an_hien} onCheckedChange={handleStatusChange} />
                        <Label htmlFor="an_hien">Hiển thị</Label>
                    </div>
                    <div className="flex justify-end space-x-3 mt-8">
                        <Button type="button" variant="outline" onClick={() => router.push("/brands")}>Hủy bỏ</Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}