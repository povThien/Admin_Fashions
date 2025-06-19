"use client"

import { useState } from "react"
import NutThaoTac from "../ui/nut-thao-tac"
import NhanVaiTro from "../ui/nhan-vai-tro"
import NhanTrangThai from "../ui/nhan-trang-thai"
import PhanTrang from "../ui/phan-trang"

interface NguoiDung {
  id: string
  name: string
  email: string
  phone: string
  role: string
  status: string
}

interface BangNguoiDungProps {
  users: NguoiDung[]
}

export default function BangNguoiDung({ users: initialUsers }: BangNguoiDungProps) {
  const [users] = useState<NguoiDung[]>(initialUsers)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const handleEdit = (userId: string) => {
    console.log("Edit user:", userId)
  }

  const handleDelete = (userId: string) => {
    console.log("Delete user:", userId)
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mã người dùng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Điện thoại
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vai trò
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
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                      <i className="fas fa-user text-primary"></i>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{user.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <NhanVaiTro role={user.role} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <NhanTrangThai status={user.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <NutThaoTac
                    viewUrl={`/users/${user.id}`}
                    onEdit={() => handleEdit(user.id)}
                    onDelete={() => handleDelete(user.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PhanTrang
        currentPage={currentPage}
        totalPages={Math.ceil(users.length / itemsPerPage)}
        totalItems={users.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
