"use client";

import { useState, useEffect, useCallback, ChangeEvent, Dispatch, SetStateAction } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { searchProducts } from '@/lib/orderService';
import debounce from 'lodash.debounce';

// --- Định nghĩa các kiểu dữ liệu (Types) ---

// Kiểu cho một sản phẩm trong giỏ hàng/đơn hàng
interface OrderItem {
    id_variant: string;
    so_luong: number;
}

// Kiểu cho một kết quả tìm kiếm sản phẩm trả về từ API
interface SearchResultVariant {
    _id: string;
    ten_sp: string;
    sku: string;
    kich_thuoc: string;
    mau_sac: string;
    hinh_chinh: string;
    so_luong_ton: number;
}

// Kiểu cho props của component
interface OrderItemsManagerProps {
    items: OrderItem[];
    setItems: Dispatch<SetStateAction<OrderItem[]>>;
}

export default function OrderItemsManager({ items, setItems }: OrderItemsManagerProps) {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [searchResults, setSearchResults] = useState<SearchResultVariant[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showResults, setShowResults] = useState<boolean>(false);

    // Hàm tìm kiếm sản phẩm, sử dụng debounce để chỉ gọi API sau khi người dùng ngừng gõ 500ms
    const debouncedSearch = useCallback(
        debounce(async (term: string) => {
            if (term.length < 2) {
                setSearchResults([]);
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            try {
                const response = await searchProducts(term);
                if (response.success) {
                    setSearchResults(response.data);
                } else {
                    setSearchResults([]);
                }
            } catch (error) {
                console.error("Search failed:", error);
                setSearchResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 500),
        []
    );

    useEffect(() => {
        debouncedSearch(searchTerm);
    }, [searchTerm, debouncedSearch]);

    // Xử lý khi chọn một sản phẩm từ kết quả tìm kiếm
    const handleSelectProduct = (variant: SearchResultVariant) => {
        const existingItem = items.find(item => item.id_variant === variant.sku);
        if (existingItem) {
            // Nếu sản phẩm đã có, chỉ tăng số lượng lên 1
            const updatedItems = items.map(item =>
                item.id_variant === variant.sku
                    ? { ...item, so_luong: Number(item.so_luong) + 1 }
                    : item
            );
            setItems(updatedItems);
        } else {
            // Nếu chưa có, thêm sản phẩm mới với số lượng là 1
            setItems([...items, { id_variant: variant.sku, so_luong: 1 }]);
        }
        // Dọn dẹp ô tìm kiếm và kết quả
        setSearchTerm('');
        setSearchResults([]);
        setShowResults(false);
    };

    // Cập nhật thông tin một item (chủ yếu là số lượng)
    const handleItemChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const updatedItems = [...items];
        const currentItem = updatedItems[index];
        if (name === 'so_luong') {
            updatedItems[index] = { ...currentItem, [name]: Number(value) };
        } else {
            updatedItems[index] = { ...currentItem, [name]: value };
        }
        setItems(updatedItems);
    };

    // Xóa một sản phẩm khỏi đơn hàng
    const removeItemRow = (index: number) => {
        const updatedItems = items.filter((_, i) => i !== index);
        setItems(updatedItems);
    };

    return (
        <section>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Chi tiết đơn hàng</h3>

            {/* --- KHUNG TÌM KIẾM SẢN PHẨM --- */}
            <div className="relative mb-4">
                <Label htmlFor="search-product">Tìm kiếm sản phẩm</Label>
                <Input
                    id="search-product"
                    placeholder="Nhập tên sản phẩm hoặc SKU..."
                    value={searchTerm}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setSearchTerm(e.target.value);
                        setShowResults(true);
                    }}
                    onBlur={() => setTimeout(() => setShowResults(false), 200)}
                    autoComplete="off"
                />
                {showResults && (searchTerm.length > 1) && (
                    <div className="absolute z-10 w-full bg-white border rounded-md mt-1 max-h-60 overflow-y-auto shadow-lg">
                        {isLoading && <div className="p-3 text-sm text-gray-500">Đang tìm...</div>}
                        {!isLoading && searchResults.length === 0 && searchTerm.length > 1 && (
                            <div className="p-3 text-sm text-gray-500">Không tìm thấy sản phẩm phù hợp.</div>
                        )}
                        {!isLoading && searchResults.map((variant) => (
                            <div
                                key={variant._id}
                                className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3 border-b"
                                onMouseDown={() => handleSelectProduct(variant)}
                            >
                                <img src={variant.hinh_chinh || 'https://placehold.co/40x40/f1f5f9/334155?text=?'} alt={variant.ten_sp} className="w-10 h-10 object-cover rounded" />
                                <div className="flex-grow">
                                    <p className="font-semibold text-sm">{variant.ten_sp}</p>
                                    <p className="text-xs text-gray-600">
                                        SKU: {variant.sku} | {variant.kich_thuoc} / {variant.mau_sac} | Tồn kho: {variant.so_luong_ton}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* --- DANH SÁCH SẢN PHẨM ĐÃ CHỌN TRONG ĐƠN HÀNG --- */}
            <div className="space-y-2">
                {items.map((item, index) => (
                    <div key={item.id_variant + index} className="flex items-end gap-2 p-2 border rounded-md bg-gray-50">
                        <div className="flex-grow">
                            <Label>SKU sản phẩm</Label>
                            <Input name="id_variant" value={item.id_variant} readOnly className="bg-gray-200" />
                        </div>
                        <div className="w-24">
                            <Label>Số lượng</Label>
                            <Input name="so_luong" type="number" min="1" value={item.so_luong} onChange={(e) => handleItemChange(index, e)} required />
                        </div>
                        <Button type="button" variant="destructive" size="sm" onClick={() => removeItemRow(index)}>Xóa</Button>
                    </div>
                ))}
                {items.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">Chưa có sản phẩm nào trong đơn hàng.</p>
                )}
            </div>
        </section>
    );
}
