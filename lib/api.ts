// lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API || 'http://localhost:3000/api/admin';

// Hàm lấy token từ localStorage (hoặc nơi bạn lưu trữ token)
function getToken(): string | null {
    if (typeof window !== 'undefined') {
        const user = localStorage.getItem('user'); // <--- Lấy từ đây
        if (user) {
            try {
                const userData = JSON.parse(user);
                return userData.accessToken; // <--- Lấy accessToken từ đây
            } catch (e) {
                console.error("Lỗi parse user data từ localStorage", e);
                return null;
            }
        }
    }
    return null;
}

export async function fetcher<T = any>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any
): Promise<T> {
    const token = getToken();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['token'] = `Bearer ${token}`; // Hoặc 'Authorization': `Bearer ${token}` tùy backend
    }

    const config: RequestInit = {
        method,
        headers,
        cache: 'no-store', // Tắt cache cho các request API
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${url}`, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Lỗi không xác định.' }));
        const error = new Error(errorData.message || 'Có lỗi xảy ra khi fetch dữ liệu.');
        // @ts-ignore
        error.response = response;
        // @ts-ignore
        error.info = errorData;
        throw error;
    }

    return response.json();
}

// Hàm format tiền tệ (có thể đặt trong lib/utils.ts)
export const formatCurrency = (amount: number | string) => {
    if (amount === null || amount === undefined) return '';
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(Number(amount));
};