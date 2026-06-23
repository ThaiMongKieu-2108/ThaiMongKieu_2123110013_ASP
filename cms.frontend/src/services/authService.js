import axiosClient from '../api/axiosClient';

const authService = {
    /**
     * 1. Đăng ký tài khoản khách hàng mới
     * Các trường truyền đi: FullName, Email, Phone, Address, Password
     */
    register: async (customerData) => {
        try {
            const response = await axiosClient.post('/Customers/register', customerData);
            return response.data || response;
        } catch (error) {
            console.error("Lỗi API Register:", error);
            throw error;
        }
    },

    /**
     * 2. Đăng nhập hệ thống bằng Email và Password
     */
    // --- Kiểm tra lại hàm login trong src/services/authService.js ---
    login: async (email, password) => {
        try {
            // TRUYỀN ĐÚNG: Đối tượng gồm { email, password } làm tham số thứ 2 của hàm .post()
            const response = await axiosClient.post('/Customers/login', {
                email: email,
                password: password
            });
            return response.data || response;
        } catch (error) {
            console.error("Lỗi API Login:", error);
            throw error;
        }
    },

    // Luồng 1: Gửi email yêu cầu cấp mã xác thực 10 ký tự
    requestOtp: async (email) => {
        try {
            const response = await axiosClient.post('/Customers/request-otp', { email });
            return response.data || response;
        } catch (error) {
            console.error("Lỗi API Request OTP:", error);
            throw error;
        }
    },

    // Luồng 2: Truyền mã OTP kèm theo mật khẩu mới để lưu đè dữ liệu
    resetPassword: async (email, otpCode, newPassword) => {
        try {
            const response = await axiosClient.post('/Customers/reset-password', {
                email: email,
                otpCode: otpCode,
                newPassword: newPassword
            });
            return response.data || response;
        } catch (error) {
            console.error("Lỗi API Reset Password:", error);
            throw error;
        }
    }
};

export default authService;