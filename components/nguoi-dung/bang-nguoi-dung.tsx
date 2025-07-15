"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import NhanVaiTro from "../ui/nhan-vai-tro"
import NhanTrangThai from "../ui/nhan-trang-thai"
import PhanTrang from "../ui/phan-trang"
import NutThaoTac from "../ui/nut-thao-tac"
import Image from "next/image"

// Cập nhật interface để khớp với dữ liệu backend
interface NguoiDung {
  _id: string
  ho_ten: string
  email: string
  so_dien_thoai: string
  vai_tro: string
  trang_thai: boolean
  avatar?: string
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  limit: number;
}

interface BangNguoiDungProps {
  users: NguoiDung[]
  pagination: Pagination | null
  onPageChange: (page: number) => void
  onDeleteSuccess: () => void; // Thêm callback
}

export default function BangNguoiDung({ users, pagination, onPageChange, onDeleteSuccess }: BangNguoiDungProps) {
  const router = useRouter();

  const handleEdit = (userId: string) => {
    router.push(`/users/${userId}/edit`); // Giả sử có trang edit
  }

  const handleDelete = async (userId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      // TODO: Gọi API xóa người dùng
      console.log("Xóa người dùng:", userId);
      alert("Chức năng xóa đang được phát triển. Dữ liệu sẽ được làm mới.");
      onDeleteSuccess(); // Tải lại danh sách
    }
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Điện thoại</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 relative">
                      <Image
                        src={user.avatar || 'https://placehold.co/40x40/EFEFEF/333333?text=A'}
                        alt={user.ho_ten}
                        fill
                        sizes="40px"
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium">{user.ho_ten}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{user.so_dien_thoai || 'N/A'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <NhanVaiTro role={user.vai_tro} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <NhanTrangThai status={user.trang_thai ? 'active' : 'inactive'} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <NutThaoTac
                    viewUrl={`/users/${user._id}`}
                  // onEdit={() => handleEdit(user._id)}
                  // onDelete={() => handleDelete(user._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <PhanTrang
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalUsers}
          itemsPerPage={pagination.limit}
          onPageChange={onPageChange}
        />
      )}
    </div>
  )
}
