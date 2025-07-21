"use client"

import { Card, CardContent } from "@/components/ui/card"
import NhanTrangThai from "@/components/ui/nhan-trang-thai"
import PhanTrang from "@/components/ui/phan-trang"
import { Comment, Pagination } from "@/lib/commentService"
import { format } from 'date-fns';

interface BangBinhLuanProps {
  comments: Comment[];
  pagination: Pagination | null;
  loading: boolean;
  onViewComment: (comment: Comment) => void;
  onUpdateComment: (commentId: string, updateData: Partial<Comment>) => void;
  onDeleteComment: (commentId: string) => void;
  onPageChange: (page: number) => void;
}

export default function BangBinhLuan({
  comments,
  pagination,
  loading,
  onViewComment,
  onUpdateComment,
  onDeleteComment,
  onPageChange
}: BangBinhLuanProps) {

  const getStatusInfo = (an_hien: boolean) => {
    return an_hien
      ? { text: "Đang hiển thị", status: "Hiển Thị" }
      : { text: "Đã ẩn", status: "Tạm Ẩn" };
  };

  if (loading) {
    return <div className="text-center py-10">Đang tải dữ liệu...</div>;
  }

  if (!comments.length) {
    return <div className="text-center py-10">Không tìm thấy bình luận nào.</div>;
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nội dung</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đăng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {comments.map((comment) => {
                const statusInfo = getStatusInfo(comment.an_hien);
                return (
                  <tr key={comment._id}>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate" title={comment.noi_dung}>{comment.noi_dung}</div>
                      {comment.diem && (
                        <div className="text-xs text-yellow-500">
                          {'★'.repeat(comment.diem)}{'☆'.repeat(5 - (comment.diem || 0))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{comment.id_san_pham?.ten_sp || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{comment.id_customer?.ho_ten || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{comment.id_customer?.email || 'N/A'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(comment.created_at), 'dd/MM/yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <NhanTrangThai status={statusInfo.status} text={statusInfo.text} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => onViewComment(comment)} className="text-primary hover:text-primary/80 mr-3" title="Xem chi tiết">
                        <i className="fas fa-edit"></i>
                      </button>

                      {comment.an_hien ? (
                        <button onClick={() => onUpdateComment(comment._id, { an_hien: false })} className="text-gray-500 hover:text-gray-700 mr-3" title="Ẩn bình luận">
                          <i className="fas fa-eye-slash"></i>
                        </button>
                      ) : (
                        <button onClick={() => onUpdateComment(comment._id, { an_hien: true })} className="text-blue-500 hover:text-blue-700 mr-3" title="Hiển thị lại">
                          <i className="fas fa-undo"></i>
                        </button>
                      )}

                      <button onClick={() => onDeleteComment(comment._id)} className="text-red-500 hover:text-red-700" title="Xóa bình luận">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {pagination && pagination.totalPages > 1 && (
          <PhanTrang
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalComments}
            itemsPerPage={pagination.limit}
            onPageChange={onPageChange}
          />
        )}
      </CardContent>
    </Card>
  )
}
