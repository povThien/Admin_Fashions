import Link from "next/link"
import ThanhTimKiem from "@/components/ui/thanh-tim-kiem"

interface ThaoTacDanhMucProps {
  onSearch: (query: string) => void
}

export default function ThaoTacDanhMuc({ onSearch }: ThaoTacDanhMucProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <ThanhTimKiem placeholder="Tìm kiếm danh mục..." />

      <Link
        href="/categories/add"
        className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-opacity-90 flex items-center w-full md:w-auto justify-center"
      >
        <i className="fas fa-plus mr-2"></i>
        Thêm danh mục
      </Link>
    </div>
  )
}
