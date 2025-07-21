"use client"

import { persistor, RootState } from "@/app/redux/store"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import Cookies from "js-cookie";
import { logoutUser } from "@/app/redux/authSlice"

interface ThanhBenProps {
  onClose?: () => void
}

export default function ThanhBen({ onClose }: ThanhBenProps) {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }
  // Lấy thông tin người dùng từ redux store
  const customer: any = useSelector((state: RootState) => state.auth.currentUser);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    // 1. Xóa cookie
    Cookies.remove("user");

    // 2. RESET Redux slice
    dispatch(logoutUser());

    // 3. Xóa redux-persist storage (async)
    await persistor.purge();

    // 4. Chờ một chút (đảm bảo mọi thứ đã sạch) rồi redirect
    setTimeout(() => {
      window.location.replace("http://localhost:3003/sign-in?logout=true");
    }, 100);
  };
  return (
    <aside className="w-64 bg-white shadow-md flex flex-col h-screen">
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
        <div className="w-10 h-10 rounded-full overflow-hidden border border-[#ebbd5b] bg-gray-200">
          {customer &&
            <img
              src={customer.avatar || 'https://res.cloudinary.com/dohwmkapy/image/upload/v1749871081/default-avatar_rwg8qu.webp'}
              alt={customer.ho_ten || 'Avatar'}
              className="object-cover object-center"
            />
          }
        </div>
        <div>
          {
            customer &&
            // src={customer.hinh || "/placeholder.svg"}
            <p className="font-medium">{customer.ho_ten}</p>
          }
          <p className="text-xs text-gray-500">Super Admin</p>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto py-4 no-scrollbar">
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
            <span>Sản phẩm & biến thể </span>
          </Link>

          {/* <Link
            href="/variants"  
            className={`flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 ${isActive("/variants") ? "active-menu" : ""}`}
          >
            <i className="fas fa-layer-group w-6 text-center mr-3"></i>
            <span>Biến thể sản phẩm</span>
          </Link> */}

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

          <Link
            href="/comments"
            className={`flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 ${isActive("/comments") ? "active-menu" : ""}`}
          >
            <i className={`fas fa-comment w-6 text-center mr-3 ${isActive("/comments") ? "text-primary" : ""}`}></i>
            <span> Bình Luận </span>
          </Link>
          <Link
            href="/brands"
            className={`flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 ${isActive("/brands") ? "active-menu" : ""}`}
          >
            <i className={`fas fa-venus-mars w-6 text-center mr-3 ${isActive("/brands") ? "text-primary" : ""}`}></i>
            <span> Thương Hiệu </span>
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

          {/* <Link
            href="/setting"
            className={`flex items-center px-3 py-3 rounded-lg text-gray-700 hover:bg-gray-50 ${isActive("/setting") ? "active-menu" : ""}`}
          >
            <i className="fas fa-cog w-6 text-center mr-3"></i>
            <span>Cài đặt</span>
          </Link> */}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100">
        <button className="flex items-center text-gray-700 hover:text-[#EBBD5B] transition-colors"
          onClick={handleLogout}
        >
          <i className="fas fa-sign-out-alt mr-3"></i>
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  )
}
