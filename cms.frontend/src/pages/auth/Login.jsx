import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

function Login() {
    const navigate = useNavigate();

    // State Đăng nhập mặc định
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // STATES QUẢN LÝ LUỒNG QUÊN MẬT KHẨU 2 BƯỚC
    const [step, setStep] = useState(1); // 1: Đăng nhập, 2: Nhập Mail, 3: Nhập OTP & Mật khẩu mới
    const [forgotEmail, setForgotEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(''); setSuccessMessage('');

        if (!email.trim() || !password.trim()) {
            setError('⚠️ Vui lòng nhập đầy đủ cả Email và Mật khẩu!');
            return;
        }

        try {
            setLoading(true);
            const data = await authService.login(email.trim(), password.trim());
            localStorage.setItem('customer', JSON.stringify(data));
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || '⚠️ Tài khoản hoặc mật khẩu không chính xác.');
        } finally {
            setLoading(false);
        }
    };

    // XỬ LÝ BƯỚC 1: YÊU CẦU GỬI MÃ OTP 10 KÝ TỰ
    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setError(''); setSuccessMessage('');

        if (!forgotEmail.trim()) {
            setError('⚠️ Vui lòng nhập địa chỉ Email khôi phục!');
            return;
        }

        try {
            setLoading(true);
            const data = await authService.requestOtp(forgotEmail.trim().toLowerCase());
            setSuccessMessage(`👉 Mã xác thực 10 số của bạn là: ${data.otpCode} (Hãy copy mã này để đổi mật khẩu)`);
            setStep(3); // Đẩy mượt sang bước 3 nhập OTP
        } catch (err) {
            setError(err.response?.data?.message || '⚠️ Email không tồn tại trên hệ thống!');
        } finally {
            setLoading(false);
        }
    };

    // XỬ LÝ BƯỚC 2: XÁC THỰC MÃ VÀ ĐỔI MẬT KHẨU MỚI
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError(''); setSuccessMessage('');

        if (!otpCode.trim() || !newPassword.trim()) {
            setError('⚠️ Vui lòng nhập đầy đủ Mã xác thực và Mật khẩu mới!');
            return;
        }

        try {
            setLoading(true);
            const data = await authService.resetPassword(
                forgotEmail.trim().toLowerCase(),
                otpCode.trim(),
                newPassword.trim()
            );

            alert("🎉 " + data.message);
            setStep(1); // Trả về màn hình Login mặc định
            setEmail(forgotEmail.trim());
            setForgotEmail(''); setOtpCode(''); setNewPassword('');
        } catch (err) {
            setError(err.response?.data?.message || '⚠️ Mã xác thực không chính xác hoặc đã xảy ra lỗi hệ thống.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex-grow-1 bg-light py-5 d-flex align-items-center" style={{ minHeight: '80vh' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-5 col-lg-4">
                        <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>

                            {error && <div className="alert alert-danger py-2 small text-center">{error}</div>}
                            {successMessage && <div className="alert alert-info py-2 small text-center fw-bold">{successMessage}</div>}

                            {/* GIAO DIỆN KHỐI 1: NHẬP EMAIL NHẬN MÃ (STEP 2) */}
                            {step === 2 && (
                                <form onSubmit={handleRequestOtp}>
                                    <h4 className="text-center font-weight-bold mb-3" style={{ color: '#005088', fontSize: '18px' }}>QUÊN MẬT KHẨU</h4>
                                    <p className="text-muted small text-center mb-4">Nhập email tài khoản để nhận mã xác thực 10 ký tự dùng một lần.</p>
                                    <div className="form-group mb-4">
                                        <label className="small font-weight-bold text-secondary">Địa chỉ Email</label>
                                        <input type="email" className="form-control mt-1" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required placeholder="name@gmail.com" />
                                    </div>
                                    <button type="submit" className="btn btn-block text-white font-weight-bold w-100 mb-3" style={{ backgroundColor: '#005088', borderRadius: '25px', padding: '10px' }} disabled={loading}>
                                        {loading ? <span className="spinner-border spinner-border-sm"></span> : 'GỬI MÃ XÁC THỰC'}
                                    </button>
                                    <div className="text-center">
                                        <button type="button" className="btn btn-link text-decoration-none small p-0" style={{ color: '#11CAA0', fontSize: '13px' }} onClick={() => { setStep(1); setError(''); setSuccessMessage(''); }}>Quay lại Đăng nhập</button>
                                    </div>
                                </form>
                            )}

                            {/* GIAO DIỆN KHỐI 2: NHẬP OTP & ĐỔI MẬT KHẨU MỚI (STEP 3) */}
                            {step === 3 && (
                                <form onSubmit={handleResetPassword}>
                                    <h4 className="text-center font-weight-bold mb-2" style={{ color: '#005088', fontSize: '18px' }}>ĐẶT LẠI MẬT KHẨU</h4>

                                    <div className="text-center mb-3">
                                        <span className="badge bg-light text-dark p-2 border" style={{ fontSize: '13px', borderRadius: '6px' }}>
                                            <i className="fas fa-envelope text-primary mr-1"></i> Tài khoản: <strong className="text-primary">{forgotEmail}</strong>
                                        </span>
                                    </div>

                                    <div className="form-group mb-3">
                                        <label className="small font-weight-bold text-secondary">Mã xác thực (10 ký tự)</label>
                                        <input type="text" className="form-control mt-1" placeholder="Nhập mã 10 số..." value={otpCode} onChange={(e) => setOtpCode(e.target.value)} required />
                                    </div>

                                    <div className="form-group mb-4">
                                        <label className="small font-weight-bold text-secondary">Mật khẩu mới mong muốn</label>
                                        <input type="password" className="form-control mt-1" placeholder="Nhập mật khẩu mới..." value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                                    </div>

                                    <button type="submit" className="btn btn-block text-white font-weight-bold w-100 mb-3" style={{ backgroundColor: '#11CAA0', borderRadius: '25px', padding: '10px' }} disabled={loading}>
                                        {loading ? <span className="spinner-border spinner-border-sm"></span> : 'XÁC NHẬN ĐỔI MẬT KHẨU'}
                                    </button>

                                    <div className="text-center">
                                        <button type="button" className="btn btn-link text-decoration-none small text-secondary p-0" style={{ fontSize: '13px' }} onClick={() => { setStep(2); setError(''); setSuccessMessage(''); }}>Gửi lại mã khác</button>
                                    </div>
                                </form>
                            )}

                            {/* GIAO DIỆN KHỐI 3: MÀN HÌNH ĐĂNG NHẬP MẶC ĐỊNH (STEP 1) */}
                            {step === 1 && (
                                <>
                                    <h3 className="text-center font-weight-bold mb-4" style={{ color: '#005088' }}>ĐĂNG NHẬP</h3>
                                    <form onSubmit={handleLogin}>
                                        <div className="form-group mb-3">
                                            <label className="small font-weight-bold text-secondary">Địa chỉ Email</label>
                                            <input type="email" className="form-control mt-1" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your-email@gmail.com" />
                                        </div>
                                        <div className="form-group mb-2">
                                            <label className="small font-weight-bold text-secondary">Mật khẩu</label>
                                            <input type="password" className="form-control mt-1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="******" />
                                        </div>
                                        <div className="text-right mb-4 text-end">
                                            <button type="button" className="btn btn-link p-0 text-decoration-none small text-secondary font-italic" style={{ fontSize: '12px' }} onClick={() => { setStep(2); setError(''); setSuccessMessage(''); }}>
                                                Quên mật khẩu?
                                            </button>
                                        </div>
                                        <button type="submit" className="btn btn-block text-white font-weight-bold w-100" style={{ backgroundColor: '#11CAA0', borderRadius: '25px', padding: '10px' }} disabled={loading}>
                                            {loading ? <span className="spinner-border spinner-border-sm"></span> : 'ĐĂNG NHẬP'}
                                        </button>
                                    </form>
                                    <div className="text-center mt-4">
                                        <span className="small text-muted">Chưa có tài khoản? <a href="/register" style={{ color: '#005088', fontWeight: 'bold' }}>Đăng ký ngay</a></span>
                                    </div>
                                </>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Login;