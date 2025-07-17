"use client"

import { useEffect, useRef } from "react"
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// ✅ Đăng ký các phần cần thiết cho Line chart
Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
)

export default function BieuDoDoanhThu({data} : any) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        // Hủy biểu đồ cũ nếu có
        if (chartInstanceRef.current) {
          chartInstanceRef.current.destroy()
        }

        chartInstanceRef.current = new Chart(ctx, {
          type: "line", // ✅ loại biểu đồ là 'line'
          data: {
            labels: data?.dailyRevenue?.map((item: any) => item.date) || ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"],
            datasets: [
              {

                label: "Doanh thu (triệu VNĐ)",
                data: data?.dailyRevenue?.map((item: any) => item.totalRevenue / 1000000) || [0, 0, 0, 0, 0, 0, 0],
                borderColor: "#EBBD5B", // 🟢 Custom line color (green)
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointHoverRadius: 6,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: true, position: "top" },
              title: { display: false },
            },
            scales: {
              x: { title: { display: true } },
              y: {
                max: Math.max(...data?.dailyRevenue?.map((item: any) => item.totalRevenue / 1000000) || [0, 0, 0, 0, 0, 0, 0]) * 1.5,
                beginAtZero: true,
                title: { display: true, text: "Doanh thu (triệu)" },
              },
            },
          },
        })
      }
    }

    return () => {
      chartInstanceRef.current?.destroy()
    }
  }, [data])

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
        <div className="h-80 rounded-lg relative">
          <canvas ref={chartRef} className="w-full h-full"></canvas>
        </div>
      </CardContent>
    </Card>
  )
}
