"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import NhanTrangThai from "../ui/nhan-trang-thai"
import NutThaoTac from "../ui/nut-thao-tac"
import PhanTrang from "../ui/phan-trang"

interface Category {
  id: number;
  _id: string;
  ten_loai: string;
  mo_ta: string;
  hinh?: string;
  an_hien: boolean;
  productCount?: number; // Thêm trường này để khớp với dữ liệu mẫu ban đầu của bạn
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

interface BangDanhMucProps {
  categories: Category[];
  pagination: Pagination | null;
  onPageChange: (page: number) => void;
  onDelete: (id: string) => void;
}

export default function BangDanhMuc({ categories, pagination, onPageChange, onDelete }: BangDanhMucProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Mô tả</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md overflow-hidden">
                      <Image
                        src={category.hinh || "/placeholder.svg"}
                        alt={category.ten_loai}
                        width={40} height={40}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium">{category.ten_loai}</div>
                      <div className="text-xs text-gray-500">ID: {category.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">{category.mo_ta}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <NhanTrangThai status={category.an_hien ? 'active' : 'inactive'} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <NutThaoTac
                    onEdit={() => router.push(`/categories/${category.id}/edit`)}
                    onDelete={() => onDelete(category.id.toString())}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalItems > 0 && (
        <div className="p-4 border-t flex justify-between items-center">
          <span className="text-sm text-gray-700">
            Hiển thị {((pagination.currentPage - 1) * pagination.limit) + 1}
            {' '} đến {Math.min(pagination.currentPage * pagination.limit, pagination.totalItems)}
            {' '} trong {pagination.totalItems} kết quả
          </span>
          {pagination.totalPages > 1 && (
            <PhanTrang
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={onPageChange}
            />
          )}
        </div>
      )}
    </div>
  )
}