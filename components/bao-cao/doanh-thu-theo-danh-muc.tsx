"use client"

import { useEffect, useMemo, useRef } from "react"
import {
  Chart,
  ArcElement,
  Tooltip,
  Legend,
  PieController, // 👈 import this
} from "chart.js"

Chart.register(
  ArcElement,
  Tooltip,
  Legend,
  PieController // 👈 register this
)
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DoanhThuTheoDanhMuc({data}: any) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstanceRef = useRef<Chart | null>(null)

  function randomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  const categories = useMemo(() => {
    if (!data?.revenueByCategory || !data?.current?.totalRevenue) return [];

    const total = data.current.totalRevenue;
    if (total === 0) return [];

    return data.revenueByCategory.map((c: any) => ({
      name: c.ten_loai,
      amount: c.totalRevenue,
      percentage: (c.totalRevenue / (data?.revenueByCategory.reduce((a: any, b: any) => a + b.totalRevenue, 0) ?? 1)) * 100 + '%',
      color: randomColor(),
    })) ?? [];
  }, [data]);


  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d")
      if (!ctx) return

      // Destroy existing chart if present
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
      }

      chartInstanceRef.current = new Chart(ctx, {
        type: "pie",
        data: {
          labels: categories.map((c) => c.name),
          datasets: [
            {
              data: categories.map((c) => c.amount),
              backgroundColor: categories.map((c) => c.color),
              borderColor: "#fff",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          cutout: "60%", // 👈 This makes it a donut chart
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx) =>
                  `${ctx.label}: ${ctx.raw.toLocaleString("vi-VN")} VNĐ`,
              },
            },
          },
        },
      })
    }

    return () => {
      chartInstanceRef.current?.destroy()
    }
  }, [categories])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu theo danh mục</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 mb-4 relative">
          <canvas ref={chartRef} className="w-full h-full mx-auto" />
        </div>

        <div className="space-y-2">
          {categories.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center">
                <span
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: category.color }}
                />
                <span>{category.name}</span>
              </div>
              <span>
                {category.amount.toLocaleString("vi-VN")} ({category.percentage})
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
