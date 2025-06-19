"use client"

import type React from "react"

import { useState } from "react"
import BoCucAdmin from "@/components/layout/bo-cuc-admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [formData, setFormData] = useState({
    // General Settings
    storeName: "LUXE Store",
    storeEmail: "admin@luxestore.com",
    storePhone: "0123456789",
    storeAddress: "123 Đường ABC, Quận 1, TP.HCM",
    currency: "VND",
    timezone: "Asia/Ho_Chi_Minh",

    // Email Settings
    emailHost: "smtp.gmail.com",
    emailPort: "587",
    emailUsername: "",
    emailPassword: "",
    emailFromName: "LUXE Store",
    emailFromAddress: "noreply@luxestore.com",

    // Payment Settings
    enableCOD: true,
    enableBankTransfer: true,
    enableMomo: false,
    enableZaloPay: false,
    bankName: "Vietcombank",
    bankAccount: "1234567890",
    bankOwner: "LUXE STORE",

    // Shipping Settings
    freeShippingThreshold: "500000",
    defaultShippingFee: "30000",
    enableExpressShipping: true,
    expressShippingFee: "50000",

    // Security Settings
    enableTwoFactor: false,
    sessionTimeout: "60",
    maxLoginAttempts: "5",

    // Notification Settings
    emailNotifications: true,
    orderNotifications: true,
    lowStockNotifications: true,
    customerNotifications: true,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Settings saved:", formData)
    alert("Cài đặt đã được lưu thành công!")
  }

  const tabs = [
    { id: "general", name: "Tổng quan", icon: "fas fa-cog" },
    { id: "email", name: "Email", icon: "fas fa-envelope" },
    { id: "payment", name: "Thanh toán", icon: "fas fa-credit-card" },
    { id: "shipping", name: "Vận chuyển", icon: "fas fa-truck" },
    { id: "security", name: "Bảo mật", icon: "fas fa-shield-alt" },
    { id: "notifications", name: "Thông báo", icon: "fas fa-bell" },
  ]

  return (
    <BoCucAdmin title="Cài đặt hệ thống">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <Card>
            <CardContent className="p-0">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-50 ${
                      activeTab === tab.id
                        ? "bg-primary bg-opacity-10 text-primary border-r-2 border-primary"
                        : "text-gray-700"
                    }`}
                  >
                    <i className={`${tab.icon} w-5 mr-3`}></i>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <form onSubmit={handleSubmit}>
            {/* General Settings */}
            {activeTab === "general" && (
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt tổng quan</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên cửa hàng</label>
                      <input
                        type="text"
                        name="storeName"
                        value={formData.storeName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email cửa hàng</label>
                      <input
                        type="email"
                        name="storeEmail"
                        value={formData.storeEmail}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                      <input
                        type="tel"
                        name="storePhone"
                        value={formData.storePhone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị tiền tệ</label>
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="VND">VND - Việt Nam Đồng</option>
                        <option value="USD">USD - US Dollar</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ cửa hàng</label>
                    <textarea
                      name="storeAddress"
                      value={formData.storeAddress}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Email Settings */}
            {activeTab === "email" && (
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt Email</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Host</label>
                      <input
                        type="text"
                        name="emailHost"
                        value={formData.emailHost}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
                      <input
                        type="text"
                        name="emailPort"
                        value={formData.emailPort}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <input
                        type="text"
                        name="emailUsername"
                        value={formData.emailUsername}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        name="emailPassword"
                        value={formData.emailPassword}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tên người gửi</label>
                      <input
                        type="text"
                        name="emailFromName"
                        value={formData.emailFromName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email người gửi</label>
                      <input
                        type="email"
                        name="emailFromAddress"
                        value={formData.emailFromAddress}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Settings */}
            {activeTab === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt thanh toán</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Phương thức thanh toán</h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="enableCOD"
                          checked={formData.enableCOD}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Thanh toán khi nhận hàng (COD)
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="enableBankTransfer"
                          checked={formData.enableBankTransfer}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Chuyển khoản ngân hàng
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="enableMomo"
                          checked={formData.enableMomo}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        Ví MoMo
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="enableZaloPay"
                          checked={formData.enableZaloPay}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        ZaloPay
                      </label>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Thông tin ngân hàng</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tên ngân hàng</label>
                        <input
                          type="text"
                          name="bankName"
                          value={formData.bankName}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Số tài khoản</label>
                        <input
                          type="text"
                          name="bankAccount"
                          value={formData.bankAccount}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Chủ tài khoản</label>
                        <input
                          type="text"
                          name="bankOwner"
                          value={formData.bankOwner}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Shipping Settings */}
            {activeTab === "shipping" && (
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt vận chuyển</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Miễn phí ship từ (VND)</label>
                      <input
                        type="number"
                        name="freeShippingThreshold"
                        value={formData.freeShippingThreshold}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phí ship mặc định (VND)</label>
                      <input
                        type="number"
                        name="defaultShippingFee"
                        value={formData.defaultShippingFee}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="enableExpressShipping"
                        checked={formData.enableExpressShipping}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Bật giao hàng nhanh
                    </label>
                  </div>

                  {formData.enableExpressShipping && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phí giao hàng nhanh (VND)</label>
                      <input
                        type="number"
                        name="expressShippingFee"
                        value={formData.expressShippingFee}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Security Settings */}
            {activeTab === "security" && (
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt bảo mật</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="enableTwoFactor"
                        checked={formData.enableTwoFactor}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Bật xác thực 2 bước
                    </label>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thời gian hết hạn phiên (phút)
                      </label>
                      <input
                        type="number"
                        name="sessionTimeout"
                        value={formData.sessionTimeout}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Số lần đăng nhập sai tối đa
                      </label>
                      <input
                        type="number"
                        name="maxLoginAttempts"
                        value={formData.maxLoginAttempts}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Cài đặt thông báo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="emailNotifications"
                        checked={formData.emailNotifications}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Gửi thông báo qua email
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="orderNotifications"
                        checked={formData.orderNotifications}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Thông báo đơn hàng mới
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="lowStockNotifications"
                        checked={formData.lowStockNotifications}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Thông báo hết hàng
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="customerNotifications"
                        checked={formData.customerNotifications}
                        onChange={handleInputChange}
                        className="mr-2"
                      />
                      Thông báo khách hàng mới
                    </label>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Save Button */}
            <div className="mt-6">
              <button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-yellow-600">
                <i className="fas fa-save mr-2"></i>
                Lưu cài đặt
              </button>
            </div>
          </form>
        </div>
      </div>
    </BoCucAdmin>
  )
}
