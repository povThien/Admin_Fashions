import axios from 'axios';

// --- Định nghĩa các kiểu dữ liệu ---
export interface Comment {
    _id: string;
    noi_dung: string;
    id_san_pham: {
        _id: string;
        ten_sp: string;
        slug: string;

    };
    id_customer: {
        _id: string;
        username: string;
        email: string;
        ho_ten: string;
        avatar: string;
    };
    diem: number | null;
    an_hien: boolean;
    created_at: string;
    parent_id: string | null;
}

export interface Pagination {
    currentPage: number;
    limit: number;
    totalComments: number;
    totalPages: number;
}

export interface CommentFilters {
    page?: number;
    limit?: number;
    search?: string;
    an_hien?: string;
    diem?: string;
}

// --- Cấu hình Axios Client ---
// Lưu ý: Phần này nên được đặt trong một file dùng chung (ví dụ: lib/apiClient.ts)
// để tránh lặp lại code ở mỗi service.
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Interceptor để tự động đính kèm token vào mỗi request
apiClient.interceptors.request.use(
    (config) => {
        // Lấy state từ localStorage (giả định dùng redux-persist)
        const persistState = localStorage.getItem('persist:root');
        if (persistState) {
            try {
                const authState = JSON.parse(JSON.parse(persistState).auth);
                const token = authState.currentUser?.access_token;
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
            } catch (e) {
                console.error("Lỗi khi parse dữ liệu auth từ localStorage", e);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);


// --- Các hàm giao tiếp với API Bình luận ---

/**
 * Lấy danh sách bình luận với bộ lọc và phân trang
 */
export const getComments = async (params: CommentFilters = {}) => {
    try {
        const response = await apiClient.get('/admin/comments', { params });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error("Lỗi khi lấy danh sách bình luận");
    }
};

/**
 * Lấy chi tiết một bình luận bằng ID
 */
export const getCommentById = async (id: string) => {
    try {
        const response = await apiClient.get(`/admin/comments/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error("Lỗi khi lấy chi tiết bình luận");
    }
};

/**
 * Cập nhật một bình luận bằng ID
 */
export const updateComment = async (id: string, updateData: Partial<Comment>) => {
    try {
        const response = await apiClient.put(`/admin/comments/${id}`, updateData);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error("Lỗi khi cập nhật bình luận");
    }
};

/**
 * Xóa một bình luận bằng ID
 */
export const deleteComment = async (id: string) => {
    try {
        const response = await apiClient.delete(`/admin/comments/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error("Lỗi khi xóa bình luận");
    }
};
