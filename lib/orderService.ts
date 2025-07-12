import axios from 'axios';

interface OrderParams {
    page?: number;
    limit?: number;
    search?: string;
    trang_thai_don_hang?: string;
}

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Interceptor để đính kèm token vào request
apiClient.interceptors.request.use(
    (config) => {
        const persistState = localStorage.getItem('persist:root');

        // --- BẮT ĐẦU CODE DEBUG ---
        console.log("--- DEBUG INTERCEPTOR ---");
        console.log("1. Dữ liệu thô từ localStorage ('persist:root'):", persistState);
        // --- KẾT THÚC CODE DEBUG ---

        if (persistState) {
            try {
                const authState = JSON.parse(JSON.parse(persistState).auth);
                const token = authState.currentUser?.access_token;

                // --- BẮT ĐẦU CODE DEBUG ---
                console.log("2. Dữ liệu authState sau khi parse:", authState);
                console.log("3. Đối tượng currentUser:", authState.currentUser);
                console.log("4. Token được tìm thấy:", token);
                // --- KẾT THÚC CODE DEBUG ---

                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                    console.log("5. Đã đính kèm Header Authorization."); // Thêm log xác nhận
                } else {
                    console.log("5. KHÔNG tìm thấy token, không đính kèm header."); // Thêm log xác nhận
                }
            } catch (e) {
                console.error("Lỗi khi parse dữ liệu từ localStorage:", e);
            }
        } else {
            console.log("Không tìm thấy 'persist:root' trong localStorage.");
        }

        console.log("--- KẾT THÚC DEBUG ---");
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor để xử lý response lỗi
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && [401, 403].includes(error.response.status)) {
            console.error("Lỗi xác thực hoặc hết hạn. Tự động đăng xuất.");
            localStorage.removeItem('persist:root');
            if (typeof window !== 'undefined') {
                window.location.href = '/sign-in';
            }
        }
        return Promise.reject(error);
    }
);


// --- CÁC HÀM API ---

export const getOrders = async (params: OrderParams) => {
    try {
        const response = await apiClient.get('/admin/order', { params });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error("Lỗi khi lấy danh sách đơn hàng");
    }
};

export const getOrderById = async (id: string) => {
    try {
        const response = await apiClient.get(`/admin/order/${id}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error("Lỗi khi lấy chi tiết đơn hàng");
    }
};

export const updateOrderStatus = async (id: string, payload: { trang_thai_don_hang: string; id_shipper?: string }) => {
    try {
        const response = await apiClient.put(`/admin/order/${id}/status`, payload);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || new Error("Lỗi khi cập nhật trạng thái");
    }
};

export const getShippers = async () => {
    try {
        // Tạm thời trả về dữ liệu mẫu. Khi có API thật, hãy thay thế
        console.warn("Sử dụng dữ liệu shipper mẫu. Cần tạo API /api/admin/users?vai_tro=shipper.");
        return {
            success: true,
            data: [
                { _id: "66832de0dbaff710229731a3f", ho_ten: "Shipper A" },
                { _id: "6684e90403f1e13838535a3e", ho_ten: "Shipper B" },
            ]
        };
    } catch (error: any) {
        throw error.response?.data || new Error("Lỗi khi lấy danh sách shipper");
    }
}