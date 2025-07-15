"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { getCategoryById, updateCategory } from "@/lib/categoryService"
import useAuthGuard from "@/app/hooks/useAuthGuard"

export default function EditCategoryPage() {
    useAuthGuard();
    const router = useRouter();
    const params = useParams();
    const categoryId = params.id as string;

    const [formData, setFormData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Hàm định dạng ngày tháng cho input type="date"
    const formatDateForInput = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
    };

    // Tải dữ liệu voucher cần sửa
    const fetchCategory = useCallback(async () => {
        if (!categoryId) return;
        try {
            const res = await getCategoryById(categoryId);
            if (res.success) {
                setFormData(res.data);
            } else {
                throw new Error(res.message);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [categoryId]);

    useEffect(() => {
        fetchCategory();
    }, [fetchCategory]);

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
            const result = await updateCategory(categoryId, formData);
            if (result.success) {
                alert("Cập nhật danh mục thành công!");
                router.push("/categories");
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
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#f9fafb" }}>
            <div className="w-full max-w-3xl bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-xl font-medium">Chỉnh sửa danh mục</h1>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin cơ bản</h3>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="ten_loai">Tên danh mục</Label>
                                        <Input id="ten_loai" name="ten_loai" value={formData.ten_loai} onChange={handleInputChange} required />
                                    </div>
                                    <div>
                                        <Label htmlFor="mo_ta">Mô tả</Label>
                                        <Textarea id="mo_ta" name="mo_ta" value={formData.mo_ta} onChange={handleInputChange} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Hiển thị</h3>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="hinh">URL Hình ảnh</Label>
                                        <Input id="hinh" name="hinh" value={formData.hinh} onChange={handleInputChange} />
                                    </div>
                                    <div>
                                        <Label htmlFor="thu_tu">Thứ tự</Label>
                                        <Input id="thu_tu" name="thu_tu" type="number" value={formData.thu_tu} onChange={handleInputChange} />
                                    </div>
                                    <div className="flex items-center space-x-2 pt-2">
                                        <Switch id="an_hien" checked={formData.an_hien} onCheckedChange={handleStatusChange} />
                                        <Label htmlFor="an_hien">Hiển thị</Label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3 mt-8">
                            <Button type="button" variant="outline" onClick={() => router.push("/categories")}>Hủy bỏ</Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}