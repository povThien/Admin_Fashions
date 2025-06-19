"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function BieuDoDoanhThu() {
  const chartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (chartRef.current) {
      // Simulate Chart.js initialization
      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        // This would be where Chart.js code goes
        // For now, we'll just draw a simple placeholder
        ctx.fillStyle = "#EBBD5B"
        ctx.fillRect(0, 0, chartRef.current.width, chartRef.current.height)
        ctx.fillStyle = "white"
        ctx.font = "16px Arial"
        ctx.textAlign = "center"
        ctx.fillText("Biểu đồ doanh thu", chartRef.current.width / 2, chartRef.current.height / 2)
      }
    }
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tổng quan doanh thu</CardTitle>
        <div className="flex space-x-2">
          <button className="px-3 py-1 bg-primary text-white rounded-md text-sm">Hàng ngày</button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">Hàng tuần</button>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">Hàng tháng</button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 rounded-lg">
          <canvas ref={chartRef} className="w-full h-full"></canvas>
        </div>
      </CardContent>
    </Card>
  )
}
