"use client"

interface HeaderProps {
  title: string
  onMenuClick?: () => void
}

export default function Header({ title, onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      <div className="flex items-center">
        {onMenuClick && (
          <button className="md:hidden text-gray-500 mr-4" onClick={onMenuClick}>
            <i className="fas fa-bars"></i>
          </button>
        )}
        <h1 className="text-xl font-medium">{title}</h1>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-500 hover:text-primary relative">
          <i className="fas fa-bell"></i>
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-primary">
            <i className="fas fa-user"></i>
          </div>
        </div>
      </div>
    </header>
  )
}
