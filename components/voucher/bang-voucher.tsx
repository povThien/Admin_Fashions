"use client"

import { useState } from "react"
import NutThaoTac from "../ui/nut-thao-tac"
import NhanTrangThai from "../ui/nhan-trang-thai"
import PhanTrang from "../ui/phan-trang"

interface Voucher {
  id: string
  code: string
  type: string
  discount: string
  minOrder: string
  expiry: string
  status: string
}

interface BangVoucherProps {
  vouchers: Voucher[]
}

export default function BangVoucher({ vouchers: initialVouchers }: BangVoucherProps) {
  const [vouchers] = useState<Voucher[]>(initialVouchers)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleEdit = (voucherId: string) => {
    console.log("Edit voucher:", voucherId)
  }

  const handleDelete = (voucherId: string) => {
    console.log("Delete voucher:", voucherId)
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Giảm giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đơn tối thiểu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hết hạn
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vouchers.map((voucher) => (
              <tr key={voucher.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">{voucher.code}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{voucher.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{voucher.discount}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{voucher.minOrder}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{voucher.expiry}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <NhanTrangThai status={voucher.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <NutThaoTac
                    viewUrl={`/vouchers/${voucher.id}`}
                    onEdit={() => handleEdit(voucher.id)}
                    onDelete={() => handleDelete(voucher.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PhanTrang
        currentPage={currentPage}
        totalPages={Math.ceil(vouchers.length / itemsPerPage)}
        totalItems={vouchers.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
