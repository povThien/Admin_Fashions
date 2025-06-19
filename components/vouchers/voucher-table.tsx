"use client"

import { useState } from "react"
import ActionButtons from "../ui/action-buttons"
import StatusBadge from "../ui/status-badge"
import Pagination from "../ui/pagination"

interface Voucher {
  id: string
  code: string
  type: string
  discount: string
  minOrder: string
  expiry: string
  status: string
}

interface VoucherTableProps {
  vouchers: Voucher[]
}

export default function VoucherTable({ vouchers: initialVouchers }: VoucherTableProps) {
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
                  <StatusBadge status={voucher.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <ActionButtons
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

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(vouchers.length / itemsPerPage)}
        totalItems={vouchers.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
