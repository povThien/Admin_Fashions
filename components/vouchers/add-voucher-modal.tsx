"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface AddVoucherModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (voucherData: any) => void
}

export default function AddVoucherModal({ isOpen, onClose, onSave }: AddVoucherModalProps) {
  const [voucherCode, setVoucherCode] = useState("")
  const [voucherType, setVoucherType] = useState("")
  const [discountValue, setDiscountValue] = useState("")
  const [maxDiscount, setMaxDiscount] = useState("")
  const [minOrder, setMinOrder] = useState("")
  const [expiryDate, setExpiryDate] = useState("")

  useEffect(() => {
    if (isOpen) {
      // Set min date to today
      const today = new Date().toISOString().split("T")[0]
      document.getElementById("expiryDate")?.setAttribute("min", today)
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const voucherData = {
      code: voucherCode,
      type: voucherType,
      discountValue,
      maxDiscount: voucherType === "limited" ? maxDiscount : null,
      minOrder,
      expiryDate,
    }

    onSave(voucherData)
    resetForm()
  }

  const resetForm = () => {
    setVoucherCode("")
    setVoucherType("")
    setDiscountValue("")
    setMaxDiscount("")
    setMinOrder("")
    setExpiryDate("")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={onClose}></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          ​
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Thêm voucher mới</h3>
            <form id="voucherForm" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                {/* Voucher Code */}
                <div>
                  <label htmlFor="voucherCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Mã voucher
                  </label>
                  <input
                    type="text"
                    id="voucherCode"
                    name="voucherCode"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Voucher Type */}
                <div>
                  <label htmlFor="voucherType" className="block text-sm font-medium text-gray-700 mb-1">
                    Loại voucher
                  </label>
                  <select
                    id="voucherType"
                    name="voucherType"
                    value={voucherType}
                    onChange={(e) => setVoucherType(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Chọn loại</option>
                    <option value="percentage">Giảm theo %</option>
                    <option value="fixed">Giảm trực tiếp</option>
                    <option value="limited">Giảm có giới hạn</option>
                  </select>
                </div>

                {/* Discount Value */}
                <div>
                  <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700 mb-1">
                    Giá trị giảm
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      id="discountValue"
                      name="discountValue"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                      min="1"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <span className="inline-flex items-center px-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg text-gray-700">
                      {voucherType === "fixed" ? "₫" : "%"}
                    </span>
                  </div>
                </div>

                {/* Max Discount (for limited type) */}
                {voucherType === "limited" && (
                  <div>
                    <label htmlFor="maxDiscount" className="block text-sm font-medium text-gray-700 mb-1">
                      Giảm tối đa (VNĐ)
                    </label>
                    <input
                      type="number"
                      id="maxDiscount"
                      name="maxDiscount"
                      value={maxDiscount}
                      onChange={(e) => setMaxDiscount(e.target.value)}
                      min="1"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                )}

                {/* Minimum Order */}
                <div>
                  <label htmlFor="minOrder" className="block text-sm font-medium text-gray-700 mb-1">
                    Đơn hàng tối thiểu (VNĐ)
                  </label>
                  <input
                    type="number"
                    id="minOrder"
                    name="minOrder"
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Expiry Date */}
                <div>
                  <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày hết hạn
                  </label>
                  <input
                    type="date"
                    id="expiryDate"
                    name="expiryDate"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              form="voucherForm"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-white font-medium hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
            >
              Lưu voucher
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
