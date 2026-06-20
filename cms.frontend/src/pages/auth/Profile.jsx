import React from 'react';
import { Link } from 'react-router-dom';



function Profile() {
    // 1. Đọc phiên làm việc của khách hàng từ LocalStorage
    const customerString = localStorage.getItem('customer');
    const customer = customerString ? JSON.parse(customerString) : null;


    // UX Guard: Nếu cố tình gõ URL /profile khi chưa đăng nhập -> Chặn lại và yêu cầu Login
    if (!customer) {
        return (
            <div className="container py-5 text-center">
                <div className="alert alert-warning my-5 p-4 d-inline-block shadow-sm" style={{ borderRadius: '12px' }}>
                    <h5 className="font-weight-bold text-dark">⛔ BẠN CHƯA ĐĂNG NHẬP HỆ THỐNG</h5>
                    <p className="text-secondary small">Vui lòng đăng nhập tài khoản thành viên để truy cập hồ sơ cá nhân.</p>
                    <Link to="/login" className="btn btn-primary btn-sm font-weight-bold px-4" style={{ backgroundColor: '#005088', borderRadius: '6px' }}>
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>
        );
    }


    return (
        <div className="profile-page bg-light min-vh-100 d-flex flex-column">


            <div className="container my-4 flex-grow-1">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        {/* Khung Card bọc toàn bộ thông tin Profile */}
                        <div className="card shadow-sm border-0" style={{ borderRadius: '15px', overflow: 'hidden' }}>


                            {/* Khối Header màu sắc nhận diện của Card */}
                            <div className="p-4 text-center text-white" style={{ backgroundColor: '#005088' }}>
                                <div className="avatar-wrapper mb-2" style={{ fontSize: '60px' }}>
                                    <i className="fas fa-user-id"></i>
                                </div>
                                <h4 className="m-0 font-weight-bold text-uppercase" style={{ letterSpacing: '0.5px' }}>
                                    Hồ Sơ Thành Viên
                                </h4>
                                <span className="badge badge-pill badge-light mt-1 text-primary small px-3">
                                    Mã số: #{customer.id}
                                </span>
                            </div>


                            {/* Khối Body hiển thị chi tiết dữ liệu thực thể Customer */}
                            <div className="card-body p-4 bg-white">
                                <div className="profile-info-row mb-3 pb-3 border-bottom d-flex align-items-center">
                                    <div className="icon-box text-center text-muted mr-3" style={{ width: '30px', fontSize: '18px' }}>
                                        <i className="fas fa-user"></i>
                                    </div>
                                    <div>
                                        <label className="text-muted small m-0 d-block font-weight-bold">Họ và Tên</label>
                                        <span className="text-dark font-weight-bold">{customer.fullName}</span>
                                    </div>
                                </div>


                                <div className="profile-info-row mb-3 pb-3 border-bottom d-flex align-items-center">
                                    <div className="icon-box text-center text-muted mr-3" style={{ width: '30px', fontSize: '18px' }}>
                                        <i className="fas fa-envelope"></i>
                                    </div>
                                    <div>
                                        <label className="text-muted small m-0 d-block font-weight-bold">Địa chỉ Email</label>
                                        <span className="text-dark font-weight-bold">{customer.email}</span>
                                    </div>
                                </div>


                                <div className="profile-info-row mb-3 pb-3 border-bottom d-flex align-items-center">
                                    <div className="icon-box text-center text-muted mr-3" style={{ width: '30px', fontSize: '18px' }}>
                                        <i className="fas fa-phone-alt"></i>
                                    </div>
                                    <div>
                                        <label className="text-muted small m-0 d-block font-weight-bold">Số điện thoại</label>
                                        <span className="text-dark font-weight-bold">{customer.phone || "Chưa cập nhật"}</span>
                                    </div>
                                </div>


                                <div className="profile-info-row mb-4 d-flex align-items-center">
                                    <div className="icon-box text-center text-muted mr-3" style={{ width: '30px', fontSize: '18px' }}>
                                        <i className="fas fa-map-marked-alt"></i>
                                    </div>
                                    <div>
                                        <label className="text-muted small m-0 d-block font-weight-bold">Địa chỉ nhận hàng mặc định</label>
                                        <span className="text-secondary small font-weight-bold">{customer.address || "Chưa cập nhật địa chỉ giao hàng"}</span>
                                    </div>
                                </div>


                                {/* Nút bấm điều hướng hành động nhanh */}
                                <div className="row mt-4">
                                    <div className="col-6">
                                        <Link to="/my-orders" className="btn btn-outline-primary btn-sm btn-block font-weight-bold py-2" style={{ borderRadius: '8px' }}>
                                            <i className="fas fa-box-open mr-1"></i> Xem đơn hàng
                                        </Link>
                                    </div>
                                    <div className="col-6">
                                        <Link to="/" className="btn btn-light btn-sm btn-block font-weight-bold py-2 border" style={{ borderRadius: '8px' }}>
                                            Quay lại mua sắm
                                        </Link>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}


export default Profile;
