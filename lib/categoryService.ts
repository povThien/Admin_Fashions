import axios from 'axios';

// Giả sử bạn đã có một file apiClient chung
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Interceptor để tự động đính kèm token
apiClient.interceptors.request.use(
    (config) => {
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

/**
 * Lấy danh sách danh mục từ backend
 */
export const getCategories = async (params: any) => {
    try {
        const response = await apiClient.get('/admin/categories', { params });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error("Lỗi khi lấy danh sách danh mục");
    }
};

/**
 * Thêm một danh mục mới
 */
export const addCategory = async (categoryData: any) => {
    try {
        const response = await apiClient.post('/admin/categories', categoryData);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error("Lỗi khi thêm danh mục");
    }
};

/**
 * Lấy chi tiết một danh mục bằng ID
 */
export const getCategoryById = async (id: string) => {
    try {
        const response = await apiClient.get(`/admin/categories/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error("Lỗi khi lấy chi tiết danh mục");
    }
};

/**
 * Cập nhật một danh mục
 */
export const updateCategory = async (id: string, categoryData: any) => {
    try {
        const response = await apiClient.put(`/admin/categories/${id}`, categoryData);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error("Lỗi khi cập nhật danh mục");
    }
};

/**
 * Xóa một danh mục
 */
export const deleteCategory = async (id: string) => {
    try {
        const response = await apiClient.delete(`/admin/categories/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error("Lỗi khi xóa danh mục");
    }
};
