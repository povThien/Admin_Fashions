import axios from 'axios';

// Giả sử bạn đã có một file apiClient chung
const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Interceptor để tự động đính kèm token (giữ nguyên như cũ)
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

// --- CÁC HÀM API CHO THƯƠNG HIỆU ---

export const getBrands = async (params) => {
    try {
        const response = await apiClient.get('/admin/brands', { params });
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error("Lỗi khi lấy danh sách thương hiệu");
    }
};

export const addBrand = async (brandData) => {
    try {
        const response = await apiClient.post('/admin/brands', brandData);
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error("Lỗi khi thêm thương hiệu");
    }
};

export const getBrandById = async (id) => {
    try {
        const response = await apiClient.get(`/admin/brands/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error("Lỗi khi lấy chi tiết thương hiệu");
    }
};

export const updateBrand = async (id, brandData) => {
    try {
        const response = await apiClient.put(`/admin/brands/${id}`, brandData);
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error("Lỗi khi cập nhật thương hiệu");
    }
};

export const deleteBrand = async (id) => {
    try {
        const response = await apiClient.delete(`/admin/brands/${id}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || new Error("Lỗi khi xóa thương hiệu");
    }
};