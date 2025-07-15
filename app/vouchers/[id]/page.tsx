"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import useAuthGuard from "@/app/hooks/useAuthGuard"
import { getVoucherById, updateVoucher } from "@/lib/voucherService"

export default function EditVoucherPage() {
    useAuthGuard();
    const router = useRouter();
    const params = useParams();
    const voucherId = params.id as string;

    const [formData, setFormData] = useState({
        code: "",
        description: "",
        discount_type: "percent",
        discount_value: "",
        max_discount_value: "",
        min_order_value: "",
        start_date: "",
        end_date: "",
        is_active: true,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Hàm định dạng ngày tháng cho input type="date"
    const formatDateForInput = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toISOString().split('T')[0];
    };

    // Tải dữ liệu voucher cần sửa
    const fetchVoucher = useCallback(async () => {
        if (!voucherId) return;
        try {
            const result = await getVoucherById(voucherId);
            if (result.success) {
                const voucher = result.data;
                setFormData({
                    ...voucher,
                    start_date: formatDateForInput(voucher.start_date),
                    end_date: formatDateForInput(voucher.end_date),
                });
            } else {
                throw new Error(result.message);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [voucherId]);

    useEffect(() => {
        fetchVoucher();
    }, [fetchVoucher]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTypeChange = (value: 'percent' | 'fixed') => {
        setFormData(prev => ({ ...prev, discount_type: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Không gửi mã 'code' vì API không cho phép cập nhật
            const { code, ...updateData } = formData;
            const result = await updateVoucher(voucherId, updateData);
            if (result.success) {
                alert("Cập nhật voucher thành công!");
                router.push("/vouchers");
            } else {
                throw new Error(result.message);
            }
        } catch (error: any) {
            alert(`Cập nhật thất bại: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center">Đang tải thông tin voucher...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Lỗi: {error}</div>;

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <form onSubmit={handleSubmit}>
                <Card className="max-w-3xl mx-auto">
                    <CardHeader>
                        <CardTitle>Chỉnh sửa Voucher</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <Label htmlFor="code">Mã voucher (Không thể thay đổi)</Label>
                            <Input id="code" name="code" value={formData.code} disabled />
                        </div>
                        <div>
                            <Label htmlFor="description">Mô tả</Label>
                            <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} />
                        </div>
                        <div>
                            <Label>Loại giảm giá</Label>
                            <Select value={formData.discount_type} onValueChange={handleTypeChange}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="percent">Giảm theo %</SelectItem>
                                    <SelectItem value="fixed">Giảm trực tiếp (VNĐ)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="discount_value">Giá trị giảm</Label>
                            <Input id="discount_value" name="discount_value" type="number" min="0" value={formData.discount_value} onChange={handleInputChange} required />
                        </div>
                        {formData.discount_type === 'percent' && (
                            <div>
                                <Label htmlFor="max_discount_value">Giảm tối đa (VNĐ)</Label>
                                <Input id="max_discount_value" name="max_discount_value" type="number" min="0" value={formData.max_discount_value} onChange={handleInputChange} placeholder="Bỏ trống nếu không giới hạn" />
                            </div>
                        )}
                        <div>
                            <Label htmlFor="min_order_value">Đơn hàng tối thiểu (VNĐ)</Label>
                            <Input id="min_order_value" name="min_order_value" type="number" min="0" value={formData.min_order_value} onChange={handleInputChange} placeholder="Bỏ trống nếu không yêu cầu" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="start_date">Ngày bắt đầu</Label>
                                <Input id="start_date" name="start_date" type="date" value={formData.start_date} onChange={handleInputChange} required />
                            </div>
                            <div>
                                <Label htmlFor="end_date">Ngày hết hạn</Label>
                                <Input id="end_date" name="end_date" type="date" value={formData.end_date} onChange={handleInputChange} min={formData.start_date} required />
                            </div>
                        </div>
                        <div>
                            <Label>Trạng thái</Label>
                            <Select value={formData.is_active ? 'true' : 'false'} onValueChange={(value) => setFormData(p => ({ ...p, is_active: value === 'true' }))}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">Hoạt động</SelectItem>
                                    <SelectItem value="false">Tạm ẩn</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => router.back()}>Hủy</Button>
                        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Đang lưu...' : 'Lưu thay đổi'}</Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
