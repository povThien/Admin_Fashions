"use client"

interface ModalBinhLuanProps {
  comment: any
  isOpen: boolean
  onClose: () => void
}

export default function ModalBinhLuan({ comment, isOpen, onClose }: ModalBinhLuanProps) {
  if (!isOpen || !comment) return null

  const handleApprove = () => {
    alert("Đã phê duyệt bình luận!")
    onClose()
  }

  const handleHide = () => {
    alert("Đã ẩn bình luận!")
    onClose()
  }

  const handleDelete = () => {
    if (confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
      alert("Đã xóa bình luận!")
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          ​
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Chi tiết bình luận</h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-primary">
                  <i className="fas fa-user"></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{comment.user}</h4>
                    <span className="text-xs text-gray-500">{comment.date}</span>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h5 className="font-medium text-sm mb-2">Thông tin sản phẩm</h5>
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                    <i className="fas fa-tshirt text-gray-400"></i>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{comment.product}</p>
                    <p className="text-xs text-gray-500">Mã SP: {comment.productCode}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h5 className="font-medium text-sm mb-2">Thay đổi trạng thái</h5>
                <div className="flex space-x-2">
                  <button
                    onClick={handleApprove}
                    className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded hover:bg-green-200"
                  >
                    <i className="fas fa-check mr-1"></i> Phê duyệt
                  </button>
                  <button
                    onClick={handleHide}
                    className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded hover:bg-yellow-200"
                  >
                    <i className="fas fa-eye-slash mr-1"></i> Ẩn bình luận
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded hover:bg-red-200"
                  >
                    <i className="fas fa-trash mr-1"></i> Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-white font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
