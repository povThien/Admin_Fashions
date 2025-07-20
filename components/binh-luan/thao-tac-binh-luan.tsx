// components/binh-luan/thao-tac-binh-luan.tsx
"use client"

import ThanhTimKiem from "@/components/ui/thanh-tim-kiem"
import { ChangeEvent } from "react" // Import ChangeEvent để đảm bảo kiểu dữ liệu

interface ThaoTacBinhLuanProps {
  onFilterChange: (filters: { search?: string; an_hien?: string }) => void
}

export default function ThaoTacBinhLuan({ onFilterChange }: ThaoTacBinhLuanProps) {
  const handleSearch = (query: string) => {
    onFilterChange({ search: query });
  };

  const handleStatusFilter = (e: ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value;
    // Ánh xạ 'all' thành chuỗi rỗng để bỏ bộ lọc, ngược lại chuyển đổi thành boolean string
    const an_hien_value = status === 'all' ? '' : (status === 'Hiển Thị' ? 'true' : 'false');
    onFilterChange({ an_hien: an_hien_value });
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <ThanhTimKiem
        placeholder="Tìm kiếm bình luận..."
        onSearch={handleSearch} // Truyền handleSearch mới vào ThanhTimKiem
      />

      <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          onChange={handleStatusFilter}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="Hiển Thị">Hiển Thị</option>
          <option value="Tạm Ẩn">Đã ẩn</option>
        </select>

        {/* <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary">
          <option>Tất cả sản phẩm</option>
          <option>Áo thun nam</option>
          <option>Quần jeans nữ</option>
          <option>Giày thể thao</option>
        </select> */}
      </div>
    </div>
  )
}