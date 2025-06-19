type LoaiVaiTro = "admin" | "shipper" | "customer"

interface NhanVaiTroProps {
  role: LoaiVaiTro | string
}

export default function NhanVaiTro({ role }: NhanVaiTroProps) {
  let bgColor = "bg-gray-100"
  let textColor = "text-gray-800"
  let label = role

  switch (role) {
    case "admin":
      bgColor = "bg-purple-100"
      textColor = "text-purple-800"
      label = "Admin"
      break
    case "shipper":
      bgColor = "bg-blue-100"
      textColor = "text-blue-800"
      label = "Shipper"
      break
  }

  return <span className={`px-2 py-1 text-xs rounded-full ${bgColor} ${textColor}`}>{label}</span>
}
