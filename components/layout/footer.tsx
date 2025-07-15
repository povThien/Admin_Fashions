export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-6 mt-4">
      <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
        <div className="mb-2 md:mb-0">
          <p>
            &copy; 2025 <span className="font-medium text-primary">LUXE ADMIN</span>. Tất cả quyền được bảo lưu.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <a href="#" className="hover:text-primary transition-colors">
            Hỗ trợ
          </a>
          <span className="text-gray-300">|</span>
          <a href="#" className="hover:text-primary transition-colors">
            Điều khoản
          </a>
          <span className="text-gray-300">|</span>
          <a href="#" className="hover:text-primary transition-colors">
            Bảo mật
          </a>
        </div>
      </div>
    </footer>
  )
}
