import { Card, CardContent } from "@/components/ui/card"
import NhanTrangThai from "@/components/ui/nhan-trang-thai"
import NutThaoTac from "@/components/ui/nut-thao-tac"
import PhanTrang from "@/components/ui/phan-trang"

interface Category {
  id: string
  name: string
  code: string
  description: string
  productCount: number
  status: string
  image: string
}

interface BangDanhMucProps {
  categories: Category[]
}

export default function BangDanhMuc({ categories }: BangDanhMucProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Mô tả
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Số sản phẩm
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
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md overflow-hidden">
                        <img
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium">{category.name}</div>
                        <div className="text-xs text-gray-500">{category.code}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">{category.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{category.productCount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <NhanTrangThai status={category.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <NutThaoTac
                      onView={() => console.log("View", category.id)}
                      onEdit={() => console.log("Edit", category.id)}
                      onDelete={() => console.log("Delete", category.id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PhanTrang
          currentPage={1}
          totalPages={1}
          totalItems={4}
          itemsPerPage={4}
          onPageChange={(page) => console.log("Page changed:", page)}
        />
      </CardContent>
    </Card>
  )
}
