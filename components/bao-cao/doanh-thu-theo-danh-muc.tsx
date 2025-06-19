"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DoanhThuTheoDanhMuc() {
  const chartRef = useRef<HTMLCanvasElement>(null)

  const categories = [
    { name: "Đồng hồ", amount: "$8,120.00", percentage: "32.8%", color: "bg-blue-500" },
    { name: "Trang sức", amount: "$6,840.00", percentage: "27.6%", color: "bg-green-500" },
    { name: "Phụ kiện", amount: "$5,460.00", percentage: "22.0%", color: "bg-purple-500" },
    { name: "Quần áo", amount: "$4,360.00", percentage: "17.6%", color: "bg-yellow-500" },
  ]

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        // Simple pie chart placeholder
        ctx.fillStyle = "#3B82F6"
        ctx.beginPath()
        ctx.arc(120, 120, 80, 0, Math.PI * 0.656)
        ctx.lineTo(120, 120)
        ctx.fill()

        ctx.fillStyle = "#10B981"
        ctx.beginPath()
        ctx.arc(120, 120, 80, Math.PI * 0.656, Math.PI * 1.208)
        ctx.lineTo(120, 120)
        ctx.fill()

        ctx.fillStyle = "#8B5CF6"
        ctx.beginPath()
        ctx.arc(120, 120, 80, Math.PI * 1.208, Math.PI * 1.648)
        ctx.lineTo(120, 120)
        ctx.fill()

        ctx.fillStyle = "#F59E0B"
        ctx.beginPath()
        ctx.arc(120, 120, 80, Math.PI * 1.648, Math.PI * 2)
        ctx.lineTo(120, 120)
        ctx.fill()
      }
    }
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu theo danh mục</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 rounded-lg mb-4">
          <canvas ref={chartRef} width="240" height="240" className="mx-auto"></canvas>
        </div>

        <div className="space-y-2">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className={`w-3 h-3 ${category.color} rounded-full mr-2`}></span>
                <span>{category.name}</span>
              </div>
              <span>
                {category.amount} ({category.percentage})
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
