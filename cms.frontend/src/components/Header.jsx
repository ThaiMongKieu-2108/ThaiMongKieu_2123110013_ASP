import React, { useState, useEffect, useContext, useRef } from 'react';
// Import thành phần để chuyển trang mượt mà không bị tải lại trang
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const { getCartCount } = useContext(CartContext);

    // State quản lý thông tin khách hàng đăng nhập và từ khóa tìm kiếm
    const [currentCustomer, setCurrentCustomer] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState(''); // 🟢 State quản lý từ khóa search

    // Quản lý đóng mở Dropdown tài khoản cá nhân
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Tự động kiểm tra trạng thái đăng nhập từ Local Storage
    useEffect(() => {
        const savedCustomer = localStorage.getItem('customer');
        if (savedCustomer) {
            try {
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
        localStorage.removeItem('customer');
        setCurrentCustomer(null);
        navigate('/');
        window.location.reload();
    };

    // 🟢 HÀM XỬ LÝ TÌM KIẾM ĐIỀU HƯỚNG ĐỘNG
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchKeyword.trim()) {
            // Điều hướng người dùng sang trang /shop kèm theo tham số query search trên URL
            navigate(`/shop?search=${encodeURIComponent(searchKeyword.trim())}`);
        }
    };

    // Hàm kiểm tra trang hiện tại để gán hiệu ứng làm sáng (Active) menu
    const isActive = (path) => {
        return location.pathname === path ? 'active font-weight-bold text-primary' : 'text-dark';
    };

    return (
        <header className="main-header-wrapper bg-white shadow-sm sticky-top">

            {/* TẦNG TIỆN ÍCH 1: THANH TOP BAR */}
            <div className="top-bar bg-dark py-2 text-white" style={{ fontSize: '13px' }}>
                <div className="container d-flex justify-content-between align-items-center">
                    <div className="top-bar-left">
                        <span className="mr-3">
                            <i className="fas fa-phone-alt mr-1"></i> Hotline: 090x.xxx.xxx
                        </span>
                        <span>
                            <i className="fas fa-envelope mr-1"></i> Email: support@kieucms.retail
                        </span>
                    </div>

                    <div className="top-bar-right d-flex align-items-center">
                        {currentCustomer ? (
                            <div className="dropdown customer-logged-in position-relative" ref={dropdownRef}>
                                <button
                                    className="btn btn-link text-white font-weight-bold text-decoration-none dropdown-toggle p-0 border-0"
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    type="button"
                                    style={{ fontSize: '13px', verticalAlign: 'baseline', shadow: 'none' }}
                                >
                                    <i className="fas fa-user-circle mr-1" style={{ color: '#11CAA0' }}></i>
                                    Chào, {currentCustomer.fullName || 'Khách hàng'}
                                </button>

                                <div className={`dropdown-menu dropdown-menu-right mt-2 p-2 border-0 shadow-lg ${isMenuOpen ? 'show' : ''}`}
                                    style={{ borderRadius: '8px', minWidth: '200px', right: 0, left: 'auto' }}>
                                    <Link to="/profile" className="dropdown-item py-2 d-flex align-items-center text-secondary font-weight-bold" style={{ fontSize: '14px' }}>
                                        <i className="text-primary fas fa-id-card mr-2" style={{ fontSize: '16px', width: '20px' }}></i>
                                        Hồ sơ cá nhân
                                    </Link>
                                    <Link to="/my-orders" className="dropdown-item py-2 d-flex align-items-center text-secondary font-weight-bold" style={{ fontSize: '14px' }}>
                                        <i className="text-success fas fa-box-open mr-2" style={{ fontSize: '16px', width: '20px' }}></i>
                                        Đơn hàng của tôi
                                    </Link>
                                    <div className="dropdown-divider"></div>
                                    <a href="#logout" onClick={handleLogout} className="dropdown-item py-2 d-flex align-items-center text-danger font-weight-bold" style={{ fontSize: '14px' }}>
                                        <i className="fas fa-sign-out-alt mr-2" style={{ fontSize: '16px', width: '20px' }}></i>
                                        Đăng xuất
                                    </a>
                                </div>
                            </div>
                        ) : (
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

            {/* TẦNG TIỆN ÍCH 2: KHU VỰC TRUNG TÂM (Logo, Search & Giỏ hàng) */}
            <div className="main-header py-3 border-bottom">
                <div className="container">
                    <div className="row align-items-center">

                        {/* 1. Logo Thương Hiệu Kieu.BookWorld */}
                        <div className="col-md-3 col-6">
                            <Link to="/" className="text-decoration-none">
                                <h3 className="font-weight-bold m-0" style={{ color: '#005088', letterSpacing: '1px' }}>
                                    Kieu<span style={{ color: '#11CAA0' }}>.BookWorld</span>
                                </h3>
                            </Link>
                        </div>

                        {/* 2. Ô Tìm Kiếm Sách Kết Nối Điều Hướng */}
                        <div className="col-md-6 d-none d-md-block">
                            <form className="input-group" onSubmit={handleSearchSubmit}>
                                <input
                                    type="text"
                                    className="form-control border-right-0"
                                    placeholder="Tìm kiếm tên sách, tác giả, văn phòng phẩm..."
                                    value={searchKeyword}
                                    onChange={(e) => setSearchKeyword(e.target.value)} // 🟢 Cập nhật state khi gõ từ khóa
                                    style={{ borderRadius: '20px 0 0 20px', fontSize: '14px' }}
                                />
                                <div className="input-group-append">
                                    <button
                                        className="btn btn-primary border-left-0 px-4"
                                        type="submit"
                                        style={{ borderRadius: '0 20px 20px 0', backgroundColor: '#005088', borderColor: '#005088' }}
                                    >
                                        <i className="fas fa-search"></i>
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* 3. Biểu Tượng Giỏ Hàng Tích Hợp Bong Bóng Số Đỏ (Badge) */}
                        <div className="col-md-3 col-6 text-right">
                            <Link to="/cart" className="btn position-relative p-2" style={{ color: '#005088', fontSize: '24px' }}>
                                <i className="fas fa-shopping-cart"></i>
                                {/* 🟢 BONG BÓNG SỐ ĐỎ: Tự động render và cập nhật số lượng theo thời gian thực */}
                                {getCartCount() > 0 && (
                                    <span className="badge badge-danger badge-pill position-absolute"
                                        style={{ top: '0', right: '-2px', fontSize: '11px', padding: '4px 7px', boxShadow: '0 2px 5px rgba(219, 53, 69, 0.4)' }}>
                                        {getCartCount()}
                                    </span>
                                )}
                            </Link>
                        </div>

                    </div>
                </div>
            </div>

            {/* TẦNG TIỆN ÍCH 3: THANH ĐIỀU HƯỚNG MENU TĨNH */}
            <div className="main-navigation bg-white py-2">
                <div className="container">
                    <nav className="navbar navbar-expand p-0">
                        <ul className="navbar-nav w-100">
                            <li className="nav-item mr-4">
                                <Link to="/" className={`nav-link p-0 text-decoration-none ${isActive('/')}`}>Trang Chủ</Link>
                            </li>
                            <li className="nav-item mr-4">
                                <Link to="/shop" className={`nav-link p-0 text-decoration-none ${isActive('/shop')}`}>Cửa Hàng</Link>
                            </li>
                            <li className="nav-item mr-4">
                                <Link to="/blog" className={`nav-link p-0 text-decoration-none ${isActive('/blog')}`}>Tin Tức / Blog</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/about" className={`nav-link p-0 text-decoration-none ${isActive('/about')}`}>Về Chúng Tôi</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

        </header>
    );
}

export default Header;