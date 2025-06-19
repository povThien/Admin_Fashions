"use client"

import type React from "react"

import { useState } from "react"
import ThanhBen from "./thanh-ben"
import TieuDe from "./tieu-de"
import Footer from "./footer"

interface BoCucAdminProps {
  children: React.ReactNode
  title: string
}

export default function BoCucAdmin({ children, title }: BoCucAdminProps) {
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
          <ThanhBen onClose={toggleSidebar} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <ThanhBen />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        <TieuDe title={title} onMenuClick={toggleSidebar} />
        <div className="flex-1 p-6">{children}</div>
        <Footer />
      </main>
    </div>
  )
}
