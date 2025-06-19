"use client"

import { useState } from "react"
import ActionButtons from "../ui/action-buttons"
import RoleBadge from "../ui/role-badge"
import StatusBadge from "../ui/status-badge"
import Pagination from "../ui/pagination"

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: string
  status: string
}

interface UserTableProps {
  users: User[]
}

export default function UserTable({ users: initialUsers }: UserTableProps) {
  const [users] = useState<User[]>(initialUsers)
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
                User ID
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
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={user.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <ActionButtons
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

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(users.length / itemsPerPage)}
        totalItems={users.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
