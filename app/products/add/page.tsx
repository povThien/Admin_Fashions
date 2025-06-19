"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AddProductPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    status: "active",
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form data:", formData)
    alert("Sản phẩm đã được lưu thành công!")
    router.push("/products")
  }

  const handleCancel = () => {
    router.push("/products")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#f9fafb" }}>
      <div className="w-full max-w-3xl bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-medium">Thêm sản phẩm mới</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin cơ bản</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Tên sản phẩm
                    </label>
                    <input
                      type="text"
                      id="product-name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Nhập tên sản phẩm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="product-category" className="block text-sm font-medium text-gray-700 mb-1">
                      Danh mục
                    </label>
                    <select
                      id="product-category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      required
                    >
                      <option value="">Chọn danh mục</option>
                      <option value="watches">Đồng hồ</option>
                      <option value="jewelry">Trang sức</option>
                      <option value="accessories">Phụ kiện</option>
                      <option value="bags">Túi xách</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="product-price" className="block text-sm font-medium text-gray-700 mb-1">
                      Giá (VND)
                    </label>
                    <input
                      type="number"
                      id="product-price"
                      name="price"
                      min="0"
                      step="1000"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Nhập giá sản phẩm"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="product-description" className="block text-sm font-medium text-gray-700 mb-1">
                      Mô tả
                    </label>
                    <textarea
                      id="product-description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                      placeholder="Nhập mô tả sản phẩm"
                    />
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Hình ảnh</h3>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-3"></i>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click để tải lên</span> hoặc kéo thả
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, JPEG (Kích thước tối đa: 5MB)</p>
                      </div>
                    )}
                    <input
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
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
                    Đang bán
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
                    Ngừng bán
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
                Lưu sản phẩm
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
