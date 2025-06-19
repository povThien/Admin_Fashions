import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"

// Initialize the Poppins font - đúng theo HTML
const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600"],
})

export const metadata: Metadata = {
  title: "LUXE Admin",
  description: "Hệ thống quản lý LUXE",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={poppins.className}>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body style={{ backgroundColor: "#f9fafb" }}>{children}</body>
    </html>
  )
}
