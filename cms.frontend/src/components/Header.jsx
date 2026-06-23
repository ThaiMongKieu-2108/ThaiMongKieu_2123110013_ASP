import React, { useState, useEffect, useContext, useRef } from 'react';
// Import thành phần Link để chuyển trang mượt mà không bị tải lại trang (Hard-Reload)
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

function Header() {
    // Dùng hook useLocation của react-router-dom để bắt đường dẫn URL hiện tại
    const location = useLocation();
    const navigate = useNavigate();
    const { getCartCount } = useContext(CartContext);

    // State quản lý thông tin khách hàng đăng nhập hệ thống
    const [currentCustomer, setCurrentCustomer] = useState(null);

    // TỰ QUẢN LÝ ĐÓNG MỞ DROPDOWN TRONG REACT
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Tự động kiểm tra trạng thái đăng nhập từ Local Storage khi Header nạp lên màn hình
    useEffect(() => {
        const savedCustomer = localStorage.getItem('customer');
        if (savedCustomer) {
            try {
                // Chuyển chuỗi JSON string ngược lại thành đối tượng Object trong React
                setCurrentCustomer(JSON.parse(savedCustomer));
            } catch (error) {
                console.error("Lỗi phân tích dữ liệu khách hàng từ bộ nhớ:", error);
            }
        }
    }, []);

    // Đóng dropdown khi bấm ra ngoài vùng menu (Click Outside)
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Tự động đóng dropdown khi chuyển trang
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location]);

    // Hàm xử lý hành động Đăng xuất tài khoản
    const handleLogout = (e) => {
        e.preventDefault();

        // Xóa hoàn toàn mã định danh khách hàng ra khỏi bộ nhớ trình duyệt
        localStorage.removeItem('customer');

        // Reset lại trạng thái giao diện và đẩy người dùng về trang chủ
        setCurrentCustomer(null);
        navigate('/');
        window.location.reload(); // Làm tươi nhẹ bộ cục hệ thống
    };

    // Hàm xử lý giả lập khi bấm Tìm kiếm nhanh
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        alert("Chức năng tìm kiếm nhanh trên Header sẽ kết nối API Search ở các buổi sau!");
    };

    // Hàm hỗ trợ kiểm tra trang hiện tại để gán hiệu ứng làm sáng (Active) menu chuẩn v4
    const isActive = (path) => {
        // Nếu trùng khớp URL, trả về class 'active font-weight-bold text-primary', ngược lại trả về 'text-dark'
        return location.pathname === path ? 'active font-weight-bold text-primary' : 'text-dark';
    };

    return (
        <header className="main-header-wrapper bg-white shadow-sm sticky-top">

            {/* ──────────────────────────────────────────────────────── */}
            {/* TẦNG TIỆN ÍCH 1: THANH TOP BAR (Cú pháp chuẩn Bootstrap 4) */}
            {/* ──────────────────────────────────────────────────────── */}
            <div className="top-bar bg-dark py-2 text-white" style={{ fontSize: '13px' }}>
                <div className="container d-flex justify-content-between align-items-center">
                    {/* Bên trái: Hotline & Email (Sử dụng mr-3 chuẩn v4) */}
                    <div className="top-bar-left">
                        <span className="mr-3">
                            <i className="fas fa-phone-alt mr-1"></i> Hotline: 090x.xxx.xxx
                        </span>
                        <span>
                            <i className="fas fa-envelope mr-1"></i> Email: support@kieucms.retail
                        </span>
                    </div>

                    {/* Bên phải: Xử lý trạng thái Đăng nhập / Đăng ký hoặc Đăng xuất linh động */}
                    <div className="top-bar-right d-flex align-items-center">
                        {currentCustomer ? (
                            // NẾU ĐÃ ĐĂNG NHẬP THÀNH CÔNG: Điều khiển đóng mở bằng State của React thông qua ref
                            <div className="dropdown customer-logged-in position-relative" ref={dropdownRef}>
                                <button
                                    className="btn btn-link text-white font-weight-bold text-decoration-none dropdown-toggle p-0 border-0"
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    type="button"
                                    style={{ fontSize: '13px', verticalAlign: 'baseline shadow: none' }}
                                >
                                    <i className="fas fa-user-circle mr-1" style={{ color: '#11CAA0' }}></i>
                                    Chào, {currentCustomer.fullName || currentCustomer.Email || 'Khách hàng'}
                                </button>

                                {/* Menu cấp 2 kiểm soát hiển thị bằng class 'show' của Bootstrap */}
                                <div
                                    className={`dropdown-menu dropdown-menu-right mt-2 p-2 border-0 shadow-lg ${isMenuOpen ? 'show' : ''}`}
                                    style={{
                                        borderRadius: '8px',
                                        minWidth: '200px',
                                        right: 0,
                                        left: 'auto'
                                    }}
                                >
                                    <Link to="/profile" className="dropdown-item py-2 d-flex align-items-center text-secondary font-weight-bold" style={{ fontSize: '14px' }}>
                                        <i className="text-primary fas fa-id-card mr-2" style={{ fontSize: '16px', width: '20px' }}></i>
                                        Hồ sơ cá nhân
                                    </Link>

                                    <Link to="/my-orders" className="dropdown-item py-2 d-flex align-items-center text-secondary font-weight-bold" style={{ fontSize: '14px' }}>
                                        <i className="text-success fas fa-box-open mr-2" style={{ fontSize: '16px', width: '20px' }}></i>
                                        Đơn hàng của tôi
                                    </Link>

                                    <div className="dropdown-divider"></div>

                                    <a
                                        href="#logout"
                                        onClick={handleLogout}
                                        className="dropdown-item py-2 d-flex align-items-center text-danger font-weight-bold"
                                        style={{ fontSize: '14px' }}
                                    >
                                        <i className="fas fa-sign-out-alt mr-2" style={{ fontSize: '16px', width: '20px' }}></i>
                                        Đăng xuất
                                    </a>
                                </div>
                            </div>
                        ) : (
                            // NẾU CHƯA ĐĂNG NHẬP: Hiện cụm liên kết mặc định ban đầu
                            <>
                                <Link to="/login" className="text-white mr-3 text-decoration-none transition-link">
                                    <i className="fas fa-user mr-1"></i> Đăng nhập
                                </Link>
                                <Link to="/register" className="text-white text-decoration-none transition-link">
                                    <i className="fas fa-user-plus mr-1"></i> Đăng ký
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ──────────────────────────────────────────────────────── */}
            {/* TẦNG TIỆN ÍCH 2: KHU VỰC CHÍNH (Logo, Search Bar & Giỏ hàng) */}
            {/* ──────────────────────────────────────────────────────── */}
            <div className="main-header py-3 border-bottom">
                <div className="container">
                    <div className="row align-items-center">

                        {/* 1. Cột Logo Thương Hiệu */}
                        <div className="col-md-3 col-6">
                            <Link to="/" className="text-decoration-none">
                                <h3 className="font-weight-bold m-0" style={{ color: '#005088', letterSpacing: '1px' }}>
                                    Kieu<span style={{ color: '#11CAA0' }}>.BookWorld</span>
                                </h3>
                            </Link>
                        </div>

                        {/* 2. Cột Ô Tìm Kiếm Sản Phẩm */}
                        <div className="col-md-6 d-none d-md-block">
                            <form className="input-group" onSubmit={handleSearchSubmit}>
                                <input
                                    type="text"
                                    className="form-control border-right-0"
                                    placeholder="Tìm kiếm sách, văn phòng phẩm,..."
                                    style={{ borderRadius: '20px 0 0 20px', fontSize: '14px' }}
                                />
                                <div className="input-group-append">
                                    <button
                                        className="btn btn-primary border-left-0 px-4"
                                        type="submit"
                                        style={{
                                            borderRadius: '0 20px 20px 0',
                                            backgroundColor: '#005088',
                                            borderColor: '#005088'
                                        }}
                                    >
                                        <i className="fas fa-search"></i>
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* 3. Cột Giỏ Hàng Nhanh */}
                        <div className="col-md-3 col-6 text-right">
                            <Link to="/cart" className="btn position-relative p-2" style={{ color: '#005088', fontSize: '22px' }}>
                                <i className="fas fa-shopping-bag"></i>
                                <span className="badge badge-pill position-absolute" >
                                    {getCartCount()}
                                </span>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>

            {/* ──────────────────────────────────────────────────────── */}
            {/* TẦNG TIỆN ÍCH 3: THANH MENU ĐIỀU HƯỚNG CHÍNH (BOOTSTRAP 4.6.2) */}
            {/* ──────────────────────────────────────────────────────── */}
            <div className="main-navigation bg-white py-2">
                <div className="container">
                    <nav className="navbar navbar-expand p-0">
                        <ul className="navbar-nav w-100">

                            {/* Menu 1: Trang Chủ */}
                            <li className="nav-item mr-4">
                                <Link to="/" className={`nav-link p-0 text-decoration-none ${isActive('/')}`} style={{ transition: 'all 0.2s' }}>
                                    Trang Chủ
                                </Link>
                            </li>

                            {/* Menu 2: Cửa Hàng */}
                            <li className="nav-item mr-4">
                                <Link to="/shop" className={`nav-link p-0 text-decoration-none ${isActive('/shop')}`} style={{ transition: 'all 0.2s' }}>
                                    Cửa Hàng
                                </Link>
                            </li>

                            {/* Menu 3: Tin Tức / Blog */}
                            <li className="nav-item mr-4">
                                <Link to="/blog" className={`nav-link p-0 text-decoration-none ${isActive('/blog')}`} style={{ transition: 'all 0.2s' }}>
                                    Tin Tức / Blog
                                </Link>
                            </li>

                            {/* Menu 4: Về Chúng Tôi */}
                            <li className="nav-item">
                                <Link to="/about" className={`nav-link p-0 text-decoration-none ${isActive('/about')}`} style={{ transition: 'all 0.2s' }}>
                                    Về Chúng Tôi
                                </Link>
                            </li>

                        </ul>
                    </nav>
                </div>
            </div>

        </header>
    );
}

export default Header;