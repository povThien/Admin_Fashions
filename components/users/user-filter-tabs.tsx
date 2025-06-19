"use client"

import { useState } from "react"

interface UserFilterTabsProps {
  onFilterChange: (filter: string) => void
}

export default function UserFilterTabs({ onFilterChange }: UserFilterTabsProps) {
  const [activeTab, setActiveTab] = useState("all")

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    onFilterChange(tab)
  }

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="-mb-px flex space-x-8">
        <button
          onClick={() => handleTabChange("all")}
          className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === "all"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Tất cả người dùng
        </button>
        <button
          onClick={() => handleTabChange("shippers")}
          className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === "shippers"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Shippers
        </button>
        <button
          onClick={() => handleTabChange("customers")}
          className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === "customers"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Khách hàng
        </button>
      </nav>
    </div>
  )
}
