import axios from 'axios';

// Giả sử bạn đã có một file apiClient chung, nếu không, có thể tạo lại ở đây
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
 * Lấy danh sách người dùng từ backend
 */
export const getUsers = async (params: any) => {
    try {
        const response = await apiClient.get('/admin/users', { params });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error("Lỗi khi lấy danh sách người dùng");
    }
};

/**
 * Thêm một người dùng mới
 */
export const addUser = async (userData: any) => {
    try {
        const response = await apiClient.post('/admin/users', userData);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error("Lỗi khi thêm người dùng");
    }
};

/**
 * Lấy chi tiết một người dùng
 */
export const getUserById = async (id: string) => {
    try {
        const response = await apiClient.get(`/admin/users/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error("Lỗi khi lấy chi tiết người dùng");
    }
};
