import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password.trim()) {
            setError('⚠️ Vui lòng nhập đầy đủ cả Email và Mật khẩu!');
            return;
        }

        try {
            setLoading(true);
            const data = await authService.login(email, password);

            // --- LOGIC CỐT LÕI THEO YÊU CẦU ĐỒ ÁN ---
            // Lưu thông tin Customer vào bộ nhớ trình duyệt dưới dạng JSON string
            localStorage.setItem('customer', JSON.stringify(data));

            // Chuyển hướng quay về lại trang chủ dưới trạng thái đã đăng nhập
            navigate('/');
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || '⚠️ Đăng nhập thất bại! Vui lòng kiểm tra lại tài khoản.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <main className="flex-grow-1 bg-light py-5 d-flex align-items-center">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-5 col-lg-4">
                            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>
                                <h3 className="text-center font-weight-bold mb-4" style={{ color: '#005088' }}>ĐĂNG NHẬP</h3>

                                {error && <div className="alert alert-danger py-2 small text-center">{error}</div>}

                                <form onSubmit={handleLogin}>
                                    <div className="form-group mb-3">
                                        <label className="small font-weight-bold text-secondary">Địa chỉ Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="your-email@gmail.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            style={{ borderRadius: '8px' }}
                                        />
                                    </div>
                                    <div className="form-group mb-4">
                                        <label className="small font-weight-bold text-secondary">Mật khẩu</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            placeholder="******"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            style={{ borderRadius: '8px' }}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-block text-white font-weight-bold"
                                        style={{ backgroundColor: '#11CAA0', borderRadius: '25px', padding: '10px' }}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <span className="spinner-border spinner-border-sm" role="status"></span>
                                        ) : 'ĐĂNG NHẬP'}
                                    </button>
                                </form>
                                <div className="text-center mt-3">
                                    <span className="small text-muted">Chưa có tài khoản? <a href="/register" style={{ color: '#005088', fontWeight: 'bold' }}>Đăng ký ngay</a></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

export default Login;