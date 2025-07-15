"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { getUserById } from "@/lib/userService"
import useAuthGuard from "@/app/hooks/useAuthGuard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import NhanVaiTro from "@/components/ui/nhan-vai-tro"
import NhanTrangThai from "@/components/ui/nhan-trang-thai"

export default function UserDetailPage() {
    useAuthGuard();
    const params = useParams();
    const router = useRouter();
    const userId = params.id as string;

    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        if (!userId) return;
        setIsLoading(true);
        try {
            const res = await getUserById(userId);
            if (res.success) {
                setUser(res.data);
            } else {
                throw new Error(res.message || "Không thể tải thông tin người dùng.");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('vi-VN');

    if (isLoading) return <div className="p-8 text-center">Đang tải dữ liệu...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Lỗi: {error}</div>;
    if (!user) return <div className="p-8 text-center">Không tìm thấy người dùng.</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-3xl mx-auto">
                <Button variant="outline" onClick={() => router.back()} className="mb-4">
                    &larr; Quay lại danh sách
                </Button>
                <Card>
                    <CardHeader className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border">
                            <Image
                                src={user.avatar || 'https://placehold.co/96x96/EFEFEF/333333?text=A'}
                                alt={`Avatar của ${user.ho_ten}`}
                                fill
                                sizes="96px"
                                className="object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-2xl">{user.ho_ten}</CardTitle>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <NhanVaiTro role={user.vai_tro} />
                                <NhanTrangThai status={user.trang_thai ? 'active' : 'inactive'} />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 border-t">
                        <h3 className="text-lg font-semibold mb-4">Thông tin chi tiết</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div className="p-3 bg-gray-50 rounded-md">
                                <p className="text-gray-500">Số điện thoại</p>
                                <p className="font-medium">{user.so_dien_thoai || 'Chưa cập nhật'}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-md">
                                <p className="text-gray-500">Ngày tham gia</p>
                                <p className="font-medium">{formatDate(user.created_at)}</p>
                            </div>
                            <div className="sm:col-span-2 p-3 bg-gray-50 rounded-md">
                                <p className="text-gray-500">Địa chỉ</p>
                                <p className="font-medium">{user.dia_chi || 'Chưa cập nhật'}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-md">
                                <p className="text-gray-500">Ngày sinh</p>
                                <p className="font-medium">{user.ngay_thang_nam_sinh ? formatDate(user.ngay_thang_nam_sinh) : 'Chưa cập nhật'}</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-md">
                                <p className="text-gray-500">Giới tính</p>
                                <p className="font-medium capitalize">{user.gioi_tinh || 'Chưa cập nhật'}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
