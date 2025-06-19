"use client"

import type React from "react"

import { useState } from "react"
import Sidebar from "./sidebar"
import Header from "./header"

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar */}
      <div className={`md:hidden fixed inset-0 z-40 ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={toggleSidebar}></div>
        <div className="relative flex h-full">
          <Sidebar onClose={toggleSidebar} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Header title={title} onMenuClick={toggleSidebar} />
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}
