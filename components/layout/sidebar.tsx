"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <aside className="w-64 bg-white shadow-md flex flex-col">
      {/* Brand */}
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-xl font-bold">
          <span className="text-primary">LUXE</span> ADMIN
        </h1>
        {onClose && (
          <button className="md:hidden text-gray-500" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>

      {/* User Profile */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-primary">
          <i className="fas fa-user"></i>
        </div>
        <div>
          <p className="font-medium">Quản trị viên</p>
          <p className="text-xs text-gray-500">Super Admin</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1 px-4">
          <Link
            href="/dashboard"
            className={`flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 ${isActive("/dashboard") ? "active-menu" : ""}`}
          >
            <i className="fas fa-tachometer-alt w-6 text-center mr-3"></i>
            <span>Bảng điều khiển</span>
          </Link>

          <Link
            href="/products"
            className={`flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 ${isActive("/products") ? "active-menu" : ""}`}
          >
            <i className="fas fa-tshirt w-6 text-center mr-3"></i>
            <span>Sản phẩm</span>
          </Link>

          <Link
            href="/categories"
            className={`flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 ${isActive("/categories") ? "active-menu" : ""}`}
          >
            <i className="fas fa-tags w-6 text-center mr-3"></i>
            <span>Danh mục</span>
          </Link>

          <Link
            href="/orders"
            className={`flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 ${isActive("/orders") ? "active-menu" : ""}`}
          >
            <i className="fas fa-shopping-bag w-6 text-center mr-3"></i>
            <span>Đơn hàng</span>
          </Link>

          <Link
            href="/users"
            className={`flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 ${isActive("/users") ? "active-menu" : ""}`}
          >
            <i className={`fas fa-user-cog w-6 text-center mr-3 ${isActive("/users") ? "text-primary" : ""}`}></i>
            <span>Người dùng</span>
          </Link>

          <Link
            href="/vouchers"
            className={`flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 ${isActive("/vouchers") ? "active-menu" : ""}`}
          >
            <i className={`fas fa-ticket-alt w-6 text-center mr-3 ${isActive("/vouchers") ? "text-primary" : ""}`}></i>
            <span>Voucher</span>
          </Link>

          <div className="px-3 pt-6 pb-2">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Phân tích</p>
          </div>

          <Link
            href="/reports"
            className={`flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 ${isActive("/reports") ? "active-menu" : ""}`}
          >
            <i className="fas fa-chart-line w-6 text-center mr-3"></i>
            <span>Báo cáo</span>
          </Link>

          <div className="px-3 pt-6 pb-2">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Cài đặt</p>
          </div>

          <Link
            href="/settings"
            className={`flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 ${isActive("/settings") ? "active-menu" : ""}`}
          >
            <i className="fas fa-cog w-6 text-center mr-3"></i>
            <span>Cài đặt</span>
          </Link>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100">
        <Link href="/logout" className="flex items-center text-gray-700 hover:text-primary">
          <i className="fas fa-sign-out-alt mr-3"></i>
          <span>Đăng xuất</span>
        </Link>
      </div>
    </aside>
  )
}
