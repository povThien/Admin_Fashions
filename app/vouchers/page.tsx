"use client"

import { useState, useEffect, useCallback } from "react"
import BoCucAdmin from "@/components/layout/bo-cuc-admin"
import ThaoTacVoucher from "@/components/voucher/thao-tac-voucher"
import BangVoucher from "@/components/voucher/bang-voucher"
import ModalThemVoucher from "@/components/voucher/modal-them-voucher"
import { getVouchers, addVoucher, deleteVoucher } from "@/lib/voucherService"
import useAuthGuard from "@/app/hooks/useAuthGuard"

export default function VouchersPage() {
  useAuthGuard();

  const [vouchers, setVouchers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 7,
    search: '',
    discount_type: '',
    status: '',
  });

  const fetchVouchers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const activeParams = Object.fromEntries(
        Object.entries(queryParams).filter(([_, value]) => value)
      );
      const response = await getVouchers(activeParams);
      if (response.success) {
        setVouchers(response.data);
        setPagination(response.pagination);
      } else {
        throw new Error(response.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchVouchers();
  }, [fetchVouchers]);

  const handleSearch = (query: string) => {
    setQueryParams(prev => ({ ...prev, search: query, page: 1 }));
  };

  const handleFilterChange = (filters: { discount_type?: string; status?: string }) => {
    setQueryParams(prev => ({ ...prev, ...filters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setQueryParams(prev => ({ ...prev, page }));
  };

  const handleSaveVoucher = async (voucherData: any) => {
    try {
      const result = await addVoucher(voucherData);
      if (result.success) {
        alert("Thêm voucher thành công!");
        setIsModalOpen(false);
        fetchVouchers(); // Tải lại danh sách voucher
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      alert(`Thêm voucher thất bại: ${error.message}`);
    }
  };

  const handleDeleteVoucher = async (voucherId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa voucher này không?")) {
      try {
        const result = await deleteVoucher(voucherId);
        if (result.success) {
          alert("Xóa voucher thành công!");
          fetchVouchers(); // Tải lại danh sách
        } else {
          throw new Error(result.message);
        }
      } catch (error: any) {
        alert(`Xóa voucher thất bại: ${error.message}`);
      }
    }
  };

  return (
    <BoCucAdmin title="Quản lý Voucher">
      <ThaoTacVoucher onSearch={handleSearch} onFilterChange={handleFilterChange} onAddVoucher={() => setIsModalOpen(true)} />

      {isLoading && <p className="text-center mt-4">Đang tải dữ liệu...</p>}
      {error && <p className="text-center mt-4 text-red-500">Lỗi: {error}</p>}

      {!isLoading && !error && (
        <BangVoucher
          vouchers={vouchers}
          pagination={pagination}
          onPageChange={handlePageChange}
          onDelete={handleDeleteVoucher}
        />
      )}

      <ModalThemVoucher isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveVoucher} />
    </BoCucAdmin>
  )
}
