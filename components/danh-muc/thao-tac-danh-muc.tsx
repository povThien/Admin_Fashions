"use client"

import Link from "next/link"
import ThanhTimKiem from "@/components/ui/thanh-tim-kiem"
import { Button } from "@/components/ui/button"

interface ThaoTacDanhMucProps {
  onSearch: (query: string) => void
}

export default function ThaoTacDanhMuc({ onSearch }: ThaoTacDanhMucProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      {/* SỬA LỖI Ở ĐÂY:
        Truyền prop 'onSearch' vào component ThanhTimKiem.
        Tôi giả định component ThanhTimKiem của bạn nhận một prop tên là 'onSearch'.
        Nếu nó dùng tên khác (ví dụ: onChange), bạn hãy thay đổi cho phù hợp.
      */}
      <ThanhTimKiem
        placeholder="Tìm kiếm theo tên danh mục..."
        onSearch={onSearch}
      />

      <Link href="/categories/add" passHref>
        <Button className="w-full md:w-auto">
          <i className="fas fa-plus mr-2"></i>
          Thêm danh mục
        </Button>
      </Link>
    </div>
  )
}
