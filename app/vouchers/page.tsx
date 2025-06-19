"use client"

import { useState } from "react"
import BoCucAdmin from "@/components/layout/bo-cuc-admin"
import ThaoTacVoucher from "@/components/voucher/thao-tac-voucher"
import BangVoucher from "@/components/voucher/bang-voucher"
import ModalThemVoucher from "@/components/voucher/modal-them-voucher"

// Mock data
const mockVouchers = [
  {
    id: "1",
    code: "SUMMER20",
    type: "Giảm theo %",
    discount: "Giảm 20%",
    minOrder: "Không yêu cầu",
    expiry: "31/12/2025",
    status: "active",
  },
  {
    id: "2",
    code: "VIP50K",
    type: "Giảm trực tiếp",
    discount: "Giảm 50,000₫",
    minOrder: "500,000₫",
    expiry: "30/06/2025",
    status: "active",
  },
  {
    id: "3",
    code: "LUXE20",
    type: "Giảm có giới hạn",
    discount: "Giảm 20% (tối đa 100,000₫)",
    minOrder: "Không yêu cầu",
    expiry: "15/08/2025",
    status: "active",
  },
  {
    id: "4",
    code: "WEL100K",
    type: "Giảm trực tiếp",
    discount: "Giảm 100,000₫",
    minOrder: "1,000,000₫",
    expiry: "31/12/2025",
    status: "expired",
  },
]

export default function VouchersPage() {
  const [filteredVouchers, setFilteredVouchers] = useState(mockVouchers)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredVouchers(mockVouchers)
      return
    }

    const filtered = mockVouchers.filter(
      (voucher) =>
        voucher.code.toLowerCase().includes(query.toLowerCase()) ||
        voucher.type.toLowerCase().includes(query.toLowerCase()),
    )

    setFilteredVouchers(filtered)
  }

  const handleAddVoucher = () => {
    setIsModalOpen(true)
  }

  const handleSaveVoucher = (voucherData: any) => {
    console.log("Saving voucher:", voucherData)
    // Here you would typically send this data to your API
    // and then update the vouchers list

    setIsModalOpen(false)
    alert("Thêm voucher thành công!")
  }

  return (
    <BoCucAdmin title="Quản lý Voucher">
      <ThaoTacVoucher onSearch={handleSearch} onAddVoucher={handleAddVoucher} />
      <BangVoucher vouchers={filteredVouchers} />

      <ModalThemVoucher isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveVoucher} />
    </BoCucAdmin>
  )
}
