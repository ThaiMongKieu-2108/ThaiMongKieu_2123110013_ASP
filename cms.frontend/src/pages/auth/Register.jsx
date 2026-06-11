import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        FullName: '',
        Email: '',
        Phone: '',
        Address: '',
        Password: '',
        ConfirmPassword: '' // Trường phụ chỉ dùng để so khớp ở Frontend
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- LOGIC VALIDATION CỐT LÕI (BẮT LỖI FORM) ---
    const validateForm = () => {
        const { FullName, Email, Phone, Address, Password, ConfirmPassword } = formData;

        if (!FullName.trim() || !Email.trim() || !Phone.trim() || !Address.trim() || !Password.trim()) {
            setError('⚠️ Vui lòng điền đầy đủ thông tin vào tất cả các ô bắt buộc!');
            return false;
        }

        // Kiểm tra định dạng Email chuẩn
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(Email)) {
            setError('⚠️ Định dạng Email không hợp lệ (Ví dụ: tên_ban@gmail.com)!');
            return false;
        }

        // Kiểm tra độ dài số điện thoại phù hợp quy chuẩn đầu số Việt Nam
        if (Phone.length < 9 || Phone.length > 11) {
            setError('⚠️ Số điện thoại phải chứa từ 9 đến 11 ký số!');
            return false;
        }

        // Bắt lỗi độ dài an toàn mật khẩu tối thiểu
        if (Password.length < 6) {
            setError('⚠️ Mật khẩu phải chứa ít nhất từ 6 ký tự để đảm bảo an toàn!');
            return false;
        }

        // Kiểm tra mật khẩu lặp lại
        if (Password !== ConfirmPassword) {
            setError('⚠️ Mật khẩu nhập lại không khớp với mật khẩu đã tạo!');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Nếu không vượt qua các bước kiểm tra, dừng lệnh gửi
        if (!validateForm()) return;

        try {
            // Đóng gói dữ liệu sạch chuẩn xác theo cấu trúc Class Customer của Backend
            const cleanData = {
                FullName: formData.FullName,
                Email: formData.Email,
                Phone: formData.Phone,
                Address: formData.Address,
                Password: formData.Password
            };

            // Gọi dịch vụ gửi lệnh POST lên api/Customers/register
            await authService.register(cleanData);

            setSuccess('🎉 Đăng ký tài khoản thành công! Hệ thống đang chuyển hướng tới trang đăng nhập...');

            // Chờ hiệu ứng chuyển hướng sau 2 giây
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            // Hiển thị thông báo lỗi chi tiết được trả về từ Controller Backend (Ví dụ: Email trùng)
            setError(err.response?.data?.message || '⚠️ Đăng ký thất bại. Vui lòng kiểm tra lại đường truyền kết nối mạng!');
        }
    };

    return (
        <>
            <main className="flex-grow-1 bg-light py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-6 col-lg-5">
                            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>
                                <h3 className="text-center font-weight-bold mb-4" style={{ color: '#005088', letterSpacing: '0.5px' }}>
                                    ĐĂNG KÝ TÀI KHOẢN
                                </h3>

                                {error && <div className="alert alert-danger py-2 small text-center">{error}</div>}
                                {success && <div className="alert alert-success py-2 small text-center">{success}</div>}

                                <form onSubmit={handleSubmit}>
                                    <div className="form-group mb-3">
                                        <label className="small font-weight-bold text-secondary">Họ và tên *</label>
                                        <input type="text" name="FullName" className="form-control" placeholder="Nguyễn Văn A" value={formData.FullName} onChange={handleChange} style={{ borderRadius: '8px' }} />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="small font-weight-bold text-secondary">Địa chỉ Email *</label>
                                        <input type="email" name="Email" className="form-control" placeholder="nguyenvana@gmail.com" value={formData.Email} onChange={handleChange} style={{ borderRadius: '8px' }} />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="small font-weight-bold text-secondary">Số điện thoại *</label>
                                        <input type="text" name="Phone" className="form-control" placeholder="09xxxxxxxx" value={formData.Phone} onChange={handleChange} style={{ borderRadius: '8px' }} />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="small font-weight-bold text-secondary">Địa chỉ nhận hàng *</label>
                                        <input type="text" name="Address" className="form-control" placeholder="Số nhà, tên đường, quận/huyện..." value={formData.Address} onChange={handleChange} style={{ borderRadius: '8px' }} />
                                    </div>
                                    <div className="form-group mb-3">
                                        <label className="small font-weight-bold text-secondary">Mật khẩu *</label>
                                        <input type="password" name="Password" className="form-control" placeholder="Tối thiểu từ 6 ký tự trở lên" value={formData.Password} onChange={handleChange} style={{ borderRadius: '8px' }} />
                                    </div>
                                    <div className="form-group mb-4">
                                        <label className="small font-weight-bold text-secondary">Nhập lại mật khẩu *</label>
                                        <input type="password" name="ConfirmPassword" className="form-control" placeholder="Trùng khớp mật khẩu phía trên" value={formData.ConfirmPassword} onChange={handleChange} style={{ borderRadius: '8px' }} />
                                    </div>

                                    <button type="submit" className="btn btn-block text-white font-weight-bold shadow-sm" style={{ backgroundColor: '#11CAA0', borderRadius: '25px', padding: '11px', transition: '0.3s' }}>
                                        TẠO TÀI KHOẢN MỚI
                                    </button>
                                </form>

                                <div className="text-center mt-3">
                                    <span className="small text-muted">Bạn đã có tài khoản rồi? <a href="/login" style={{ color: '#005088', fontWeight: 'bold' }}>Đăng nhập ngay</a></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Register;