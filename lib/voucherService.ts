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
 * Lấy danh sách voucher từ backend
 */
export const getVouchers = async (params: any) => {
    try {
        const response = await apiClient.get('/admin/vouchers', { params });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error("Lỗi khi lấy danh sách voucher");
    }
};

/**
 * Thêm một voucher mới
 */
export const addVoucher = async (voucherData: any) => {
    try {
        const response = await apiClient.post('/admin/vouchers', voucherData);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error("Lỗi khi thêm voucher");
    }
};

/**
 * Lấy chi tiết một voucher bằng ID
 */
export const getVoucherById = async (id: string) => {
    try {
        const response = await apiClient.get(`/admin/vouchers/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error("Lỗi khi lấy chi tiết voucher");
    }
};

/**
 * Cập nhật một voucher
 */
export const updateVoucher = async (id: string, voucherData: any) => {
    try {
        const response = await apiClient.put(`/admin/vouchers/${id}`, voucherData);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error("Lỗi khi cập nhật voucher");
    }
};


/**
 * Xóa một voucher
 */
export const deleteVoucher = async (id: string) => {
    try {
        const response = await apiClient.delete(`/admin/vouchers/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error("Lỗi khi xóa voucher");
    }
};
