"use client"

import { useState } from "react"
import BoCucAdmin from "@/components/layout/bo-cuc-admin"
import ThaoTacBinhLuan from "@/components/binh-luan/thao-tac-binh-luan"
import BangBinhLuan from "@/components/binh-luan/bang-binh-luan"
import ModalBinhLuan from "@/components/binh-luan/modal-binh-luan"

const mockComments = [
  {
    id: "1",
    content: "Sản phẩm rất đẹp, chất lượng tốt hơn mong đợi",
    product: "Áo thun nam cao cấp",
    productCode: "#SP0012",
    user: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    date: "15/05/2025",
    status: "approved",
  },
  {
    id: "2",
    content: "Không đúng như hình ảnh, màu sắc khác xa so với thực tế",
    product: "Quần jeans nữ",
    productCode: "#SP0045",
    user: "Trần Thị B",
    email: "tranthib@email.com",
    date: "18/05/2025",
    status: "pending",
  },
  {
    id: "3",
    content: "Sản phẩm tệ, không xứng đáng với giá tiền",
    product: "Giày thể thao",
    productCode: "#SP0078",
    user: "Phạm Văn C",
    email: "phamvanc@email.com",
    date: "20/05/2025",
    status: "hidden",
  },
]

export default function CommentsPage() {
  const [filteredComments, setFilteredComments] = useState(mockComments)
  const [selectedComment, setSelectedComment] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredComments(mockComments)
      return
    }

    const filtered = mockComments.filter(
      (comment) =>
        comment.content.toLowerCase().includes(query.toLowerCase()) ||
        comment.user.toLowerCase().includes(query.toLowerCase()) ||
        comment.product.toLowerCase().includes(query.toLowerCase()),
    )

    setFilteredComments(filtered)
  }

  const handleStatusFilter = (status: string) => {
    if (status === "all") {
      setFilteredComments(mockComments)
      return
    }

    const filtered = mockComments.filter((comment) => comment.status === status)
    setFilteredComments(filtered)
  }

  const handleViewComment = (comment: any) => {
    setSelectedComment(comment)
    setIsModalOpen(true)
  }

  return (
    <BoCucAdmin title="Quản lý Bình luận">
      <ThaoTacBinhLuan onSearch={handleSearch} onStatusFilter={handleStatusFilter} />
      <BangBinhLuan comments={filteredComments} onViewComment={handleViewComment} />

      <ModalBinhLuan comment={selectedComment} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </BoCucAdmin>
  )
}
