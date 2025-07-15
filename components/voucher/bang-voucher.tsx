"use client"

import { useRouter } from "next/navigation"
import NhanTrangThai from "../ui/nhan-trang-thai"
import NutThaoTac from "../ui/nut-thao-tac"

interface Voucher {
  _id: string;
  code: string;
  discount_type: 'percent' | 'fixed';
  discount_value: number;
  max_discount_value?: number;
  min_order_value: number;
  end_date: string;
  is_active: boolean;
  start_date: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalVouchers: number;
  limit: number;
}

interface BangVoucherProps {
  vouchers: Voucher[];
  pagination: Pagination | null;
  onPageChange: (page: number) => void;
  onDelete: (id: string) => void;
}

export default function BangVoucher({ vouchers, pagination, onPageChange, onDelete }: BangVoucherProps) {
  const router = useRouter();

  const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('vi-VN');

  const formatDiscount = (voucher: Voucher) => {
    if (voucher.discount_type === 'percent') {
      let text = `Giảm ${voucher.discount_value}%`;
      if (voucher.max_discount_value) {
        text += ` (tối đa ${formatCurrency(voucher.max_discount_value)})`;
      }
      return text;
    }
    return `Giảm ${formatCurrency(voucher.discount_value)}`;
  };

  const determineStatus = (voucher: Voucher) => {
    const now = new Date();
    const endDate = new Date(voucher.end_date);
    if (endDate < now) return { type: 'expired', text: 'Hết hạn' };
    if (!voucher.is_active) return { type: 'inactive', text: 'Tạm ẩn' };
    return { type: 'active', text: 'Hoạt động' };
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giảm giá</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đơn tối thiểu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hết hạn</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vouchers.map((voucher) => {
              const status = determineStatus(voucher);
              return (
                <tr key={voucher._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">{voucher.code}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDiscount(voucher)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{voucher.min_order_value > 0 ? formatCurrency(voucher.min_order_value) : 'Không yêu cầu'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(voucher.end_date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <NhanTrangThai status={status.type} customLabel={status.text} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <NutThaoTac
                      onEdit={() => router.push(`/vouchers/${voucher._id}/edit`)}
                      onDelete={() => onDelete(voucher._id)}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* SỬA LỖI Ở ĐÂY: Cập nhật lại cấu trúc phân trang */}
      {pagination && pagination.totalVouchers > 0 && (
        <div className="p-4 flex items-center justify-between border-t">
          <span className="text-sm text-gray-700">
            Hiển thị {((pagination.currentPage - 1) * pagination.limit) + 1}
            {' '} đến {Math.min(pagination.currentPage * pagination.limit, pagination.totalVouchers)}
            {' '} trong {pagination.totalVouchers} kết quả
          </span>

          {pagination.totalPages > 1 && (
            <div className="flex items-center gap-1">
              {/* Nút về trang trước */}
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                «
              </button>

              {/* Các nút số trang */}
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-1 border rounded-md text-sm ${pagination.currentPage === page
                      ? 'bg-gray-200 text-gray-800 border-gray-300'
                      : 'hover:bg-gray-100'
                    }`}
                >
                  {page}
                </button>
              ))}

              {/* Nút đến trang sau */}
              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                »
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
