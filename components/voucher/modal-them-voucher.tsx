"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Textarea } from "../ui/textarea"

interface ModalThemVoucherProps {
  isOpen: boolean
  onClose: () => void
  onSave: (voucherData: any) => void
}

export default function ModalThemVoucher({ isOpen, onClose, onSave }: ModalThemVoucherProps) {
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discount_type: "percent",
    discount_value: "",
    max_discount_value: "",
    min_order_value: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    if (isOpen) {
      const today = new Date().toISOString().split("T")[0];
      setFormData(prev => ({ ...prev, start_date: today }));
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTypeChange = (value: 'percent' | 'fixed') => {
    setFormData(prev => ({ ...prev, discount_type: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose(); // Đóng modal sau khi lưu
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg m-4">
          <form onSubmit={handleSubmit}>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Thêm voucher mới</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="code">Mã voucher</Label>
                  <Input id="code" name="code" value={formData.code} onChange={handleInputChange} required />
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
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>Hủy bỏ</Button>
              <Button type="submit">Lưu voucher</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
