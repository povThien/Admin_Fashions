"use client"
import Image from 'next/image'
import { Comment } from "@/lib/commentService"
import { format } from 'date-fns';

interface ModalBinhLuanProps {
  comment: Comment | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateComment: (commentId: string, updateData: Partial<Comment>) => void;
  onDeleteComment: (commentId: string) => void;
}

export default function ModalBinhLuan({ comment, isOpen, onClose, onUpdateComment, onDeleteComment }: ModalBinhLuanProps) {
  if (!isOpen || !comment) return null;

  const handleUpdateAndClose = (updateData: Partial<Comment>) => {
    onUpdateComment(comment._id, updateData);
    onClose();
  };

  const handleDeleteAndClose = () => {
    onDeleteComment(comment._id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Chi tiết bình luận</h3>
            <div className="space-y-4">
              {/* User Info */}
              <div className="flex items-start space-x-4">


                <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                  {comment.id_customer?.avatar && (
                    <Image
                      src={comment.id_customer.avatar}
                      alt="User Avatar"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  )}
                </div>


                <div className="flex-1">
                  <div className="flex items-center justify-between">

                    <h4 className="font-medium">{comment.id_customer?.ho_ten}</h4>
                    <span className="text-xs text-gray-500">{format(new Date(comment.created_at), 'dd/MM/yyyy HH:mm')}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{comment.noi_dung}</p>
                  {comment.diem && (
                    <div className="text-sm text-yellow-500 mt-1">
                      {'★'.repeat(comment.diem)}{'☆'.repeat(5 - (comment.diem || 0))}
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="border-t border-gray-200 pt-4">
                <h5 className="font-medium text-sm mb-2">Thông tin sản phẩm</h5>
                <div className="flex items-center space-x-3">
                  {/* <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                    {comment.id_san_pham?.hinh_chinh && (
                      <Image
                        src={comment.id_san_pham.hinh_chinh}
                        alt="User Avatar"
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    )}
                  </div> */}
                  <div>
                    <p className="text-sm font-medium">{comment.id_san_pham?.ten_sp || 'N/A'}</p>
                    <p className="text-xs text-gray-500">Slug: {comment.id_san_pham?.slug || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-gray-200 pt-4">
                <h5 className="font-medium text-sm mb-2">Thao tác nhanh</h5>
                <div className="flex flex-wrap gap-2">
                  {comment.an_hien ? (
                    <button onClick={() => handleUpdateAndClose({ an_hien: false })} className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded hover:bg-yellow-200">
                      <i className="fas fa-eye-slash mr-1"></i> Ẩn bình luận
                    </button>
                  ) : (
                    <button onClick={() => handleUpdateAndClose({ an_hien: true })} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded hover:bg-blue-200">
                      <i className="fas fa-undo mr-1"></i> Hiển thị lại
                    </button>
                  )}
                  <button onClick={handleDeleteAndClose} className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded hover:bg-red-200">
                    <i className="fas fa-trash mr-1"></i> Xóa vĩnh viễn
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" onClick={onClose} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-white font-medium hover:bg-primary/90 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div >
  )
}
