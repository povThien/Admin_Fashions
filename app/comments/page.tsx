// app/admin/comments/page.tsx
"use client"

import { useState, useEffect } from "react"
import BoCucAdmin from "@/components/layout/bo-cuc-admin"
import ThaoTacBinhLuan from "@/components/binh-luan/thao-tac-binh-luan"
import BangBinhLuan from "@/components/binh-luan/bang-binh-luan"
import ModalBinhLuan from "@/components/binh-luan/modal-binh-luan"
import { toast, Toaster } from "react-hot-toast"

// Import các hàm và kiểu dữ liệu từ service
import {
  getComments,
  updateComment,
  deleteComment,
  Comment,
  Pagination,
  CommentFilters
} from "@/lib/commentService" // <-- Đảm bảo đường dẫn này chính xác

export default function CommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);

  const [filters, setFilters] = useState<CommentFilters>({
    page: 1,
    limit: 5,
    search: '',
    an_hien: '', // Đây sẽ là 'true', 'false', hoặc ''
    diem: ''
  });

  useEffect(() => {
    const fetchAndSetComments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getComments(filters);
        if (response.success) {
          setComments(response.data);
          setPagination(response.pagination);
        } else {
          throw new Error(response.message || "Lỗi không xác định từ server");
        }
      } catch (err: any) {
        setError(err.message);
        setComments([]);
        setPagination(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndSetComments();
  }, [filters]);

  const handleFilterChange = (newFilters: Partial<CommentFilters>) => {
    // Đặt lại về trang 1 khi các bộ lọc thay đổi (tìm kiếm hoặc trạng thái)
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Hàm kích hoạt tải lại dữ liệu bằng cách tạo một tham chiếu mới cho state `filters`
  const refreshData = () => {
    setFilters(prev => ({ ...prev }));
  }

  const handleUpdateComment = async (commentId: string, updateData: Partial<Comment>) => {
    const toastId = toast.loading('Đang cập nhật...');
    try {
      const result = await updateComment(commentId, updateData);
      if (result.success) {
        toast.success(result.message || "Cập nhật thành công!", { id: toastId });
        refreshData();
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Cập nhật thất bại.", { id: toastId });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bình luận này? Thao tác này không thể hoàn tác.")) return;

    const toastId = toast.loading('Đang xóa...');
    try {
      const result = await deleteComment(commentId);
      if (result.success) {
        toast.success(result.message || "Xóa bình luận thành công!", { id: toastId });
        refreshData();
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Xóa bình luận thất bại.", { id: toastId });
    }
  };

  const handleViewComment = (comment: Comment) => {
    setSelectedComment(comment);
    setIsModalOpen(true);
  };

  return (
    <BoCucAdmin title="Quản lý Bình luận">
      <Toaster position="top-right" reverseOrder={false} />

      <ThaoTacBinhLuan onFilterChange={handleFilterChange} />

      {isLoading && <p className="text-center mt-4">Đang tải dữ liệu...</p>}
      {error && <p className="text-center mt-4 text-red-500">Lỗi: {error}</p>}

      {!isLoading && !error && (
        <BangBinhLuan
          comments={comments}
          pagination={pagination}
          loading={isLoading}
          onViewComment={handleViewComment}
          onUpdateComment={handleUpdateComment}
          onDeleteComment={handleDeleteComment}
          onPageChange={handlePageChange}
        />
      )}

      <ModalBinhLuan
        comment={selectedComment}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdateComment={handleUpdateComment}
        onDeleteComment={handleDeleteComment}
      />
    </BoCucAdmin>
  )
}