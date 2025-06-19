"use client"

import { Card, CardContent } from "@/components/ui/card"
import NhanTrangThai from "@/components/ui/nhan-trang-thai"
import PhanTrang from "@/components/ui/phan-trang"

interface Comment {
  id: string
  content: string
  product: string
  productCode: string
  user: string
  email: string
  date: string
  status: string
}

interface BangBinhLuanProps {
  comments: Comment[]
  onViewComment: (comment: Comment) => void
}

export default function BangBinhLuan({ comments, onViewComment }: BangBinhLuanProps) {
  const getStatusText = (status: string) => {
    switch (status) {
      case "approved":
        return "Đã phê duyệt"
      case "pending":
        return "Chờ phê duyệt"
      case "hidden":
        return "Đã ẩn"
      default:
        return status
    }
  }

  const handleApprove = (commentId: string) => {
    alert("Đã phê duyệt bình luận!")
  }

  const handleHide = (commentId: string) => {
    alert("Đã ẩn bình luận!")
  }

  const handleRestore = (commentId: string) => {
    alert("Đã khôi phục bình luận!")
  }

  const handleDelete = (commentId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
      alert("Đã xóa bình luận!")
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nội dung
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đăng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comments.map((comment) => (
                <tr key={comment.id}>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">{comment.content}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{comment.product}</div>
                    <div className="text-xs text-gray-500">{comment.productCode}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{comment.user}</div>
                    <div className="text-xs text-gray-500">{comment.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{comment.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <NhanTrangThai status={comment.status} text={getStatusText(comment.status)} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => onViewComment(comment)} className="text-primary hover:text-primary/80 mr-3">
                      <i className="fas fa-eye"></i>
                    </button>

                    {comment.status === "pending" && (
                      <button
                        onClick={() => handleApprove(comment.id)}
                        className="text-green-500 hover:text-green-700 mr-3"
                      >
                        <i className="fas fa-check"></i>
                      </button>
                    )}

                    {comment.status === "approved" && (
                      <button onClick={() => handleHide(comment.id)} className="text-gray-500 hover:text-gray-700 mr-3">
                        <i className="fas fa-eye-slash"></i>
                      </button>
                    )}

                    {comment.status === "hidden" && (
                      <button
                        onClick={() => handleRestore(comment.id)}
                        className="text-blue-500 hover:text-blue-700 mr-3"
                      >
                        <i className="fas fa-undo"></i>
                      </button>
                    )}

                    <button onClick={() => handleDelete(comment.id)} className="text-red-500 hover:text-red-700">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <PhanTrang
          currentPage={1}
          totalPages={4}
          totalItems={12}
          itemsPerPage={3}
          onPageChange={(page) => console.log("Page changed:", page)}
        />
      </CardContent>
    </Card>
  )
}
