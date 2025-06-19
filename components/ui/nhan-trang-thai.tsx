type LoaiTrangThai = "active" | "inactive" | "pending" | "expired"

interface NhanTrangThaiProps {
  status: LoaiTrangThai | string
  customLabel?: string
}

export default function NhanTrangThai({ status, customLabel }: NhanTrangThaiProps) {
  let bgColor = "bg-gray-100"
  let textColor = "text-gray-800"
  let label = customLabel || status

  switch (status) {
    case "active":
      bgColor = "bg-green-100"
      textColor = "text-green-800"
      label = customLabel || "Đang hoạt động"
      break
    case "inactive":
      bgColor = "bg-yellow-100"
      textColor = "text-yellow-800"
      label = customLabel || "Không hoạt động"
      break
    case "pending":
      bgColor = "bg-blue-100"
      textColor = "text-blue-800"
      label = customLabel || "Đang chờ"
      break
    case "expired":
      bgColor = "bg-red-100"
      textColor = "text-red-800"
      label = customLabel || "Hết hạn"
      break
  }

  return <span className={`px-2 py-1 text-xs rounded-full ${bgColor} ${textColor}`}>{label}</span>
}
