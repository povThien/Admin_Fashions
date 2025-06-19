"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AddUserPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    status: "active",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form data:", formData)
    alert("Người dùng đã được thêm thành công!")
    router.push("/users")
  }

  const handleCancel = () => {
    router.push("/users")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#f9fafb" }}>
      <div className="w-full max-w-3xl bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-medium">Thêm người dùng mới</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin cơ bản</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="user-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      id="user-name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="user-email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="user-email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Nhập email"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="user-phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      id="user-phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="user-role" className="block text-sm font-medium text-gray-700 mb-1">
                      Vai trò
                    </label>
                    <select
                      id="user-role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      required
                    >
                      <option value="">Chọn vai trò</option>
                      <option value="admin">Admin</option>
                      <option value="shipper">Shipper</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Trạng thái</h3>
                <div className="flex items-center">
                  <input
                    id="active-status"
                    name="status"
                    type="radio"
                    value="active"
                    checked={formData.status === "active"}
                    onChange={handleStatusChange}
                    className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300"
                  />
                  <label htmlFor="active-status" className="ml-2 block text-sm text-gray-900">
                    Hoạt động
                  </label>
                </div>
                <div className="flex items-center mt-2">
                  <input
                    id="inactive-status"
                    name="status"
                    type="radio"
                    value="inactive"
                    checked={formData.status === "inactive"}
                    onChange={handleStatusChange}
                    className="h-4 w-4 text-yellow-500 focus:ring-yellow-500 border-gray-300"
                  />
                  <label htmlFor="inactive-status" className="ml-2 block text-sm text-gray-900">
                    Tạm khóa
                  </label>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 mt-8">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
              >
                Hủy bỏ
              </button>
              <button type="submit" className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                Lưu người dùng
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
