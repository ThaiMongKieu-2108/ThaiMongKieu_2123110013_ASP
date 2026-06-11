import React from 'react';
// IMPORT BẮT BUỘC: Gọi lại Header và Footer để bọc cấu trúc Layout trang

function AboutPage() {
    return (
        <>

            {/* 2. KHU VỰC NỘI DUNG GIỚI THIỆU */}
            <main className="flex-grow-1 bg-white py-5">
                <div className="container">
                    {/* Banner Tiêu đề nhỏ */}
                    <div className="text-center mb-5">
                        <h2 className="font-weight-bold" style={{ color: '#005088', letterSpacing: '1px' }}>
                            VỀ CHÚNG TÔI
                        </h2>
                        <p className="text-muted" style={{ fontStyle: 'italic' }}>
                            KieuCMS.Fashion — Định hình phong cách, tự tin tỏa sáng
                        </p>
                        <hr style={{ width: '100px', borderTop: '3px solid #11CAA0' }} />
                    </div>

                    <div className="row align-items-center mb-5">
                        {/* Cột trái: Giới thiệu bằng văn bản */}
                        <div className="col-md-6 mb-4 mb-md-0">
                            <h4 className="font-weight-bold mb-3" style={{ color: '#005088' }}>
                                Câu Chuyện Thương Hiệu
                            </h4>
                            <p className="text-secondary text-justify" style={{ lineHeight: '1.7' }}>
                                Chào mừng bạn đến với <strong>KieuCMS.Fashion</strong>, điểm đến lý tưởng cho những ai yêu thích phong cách thời trang hiện đại, tinh tế và thanh lịch. Được thành lập với sứ mệnh mang đến những thiết kế thời trang ứng dụng cao, chúng tôi không ngừng cập nhật các xu hướng mới nhất từ mẫu đầm dạ hội sang trọng đến sơ mi công sở thời thượng.
                            </p>
                            <p className="text-secondary text-justify" style={{ lineHeight: '1.7' }}>
                                Mỗi sản phẩm tại KieuCMS đều được tuyển chọn kỹ lưỡng từ chất liệu vải cao cấp, đường kim mũi chỉ sắc sảo cho đến phom dáng chuẩn mực, nhằm tôn vinh nét đẹp tự nhiên và mang lại sự tự tin tuyệt đối cho người mặc trong mọi khoảnh khắc cuộc sống.
                            </p>
                        </div>

                        {/* Cột phải: Hình ảnh minh họa */}
                        <div className="col-md-6 text-center">
                            <img
                                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80"
                                alt="Store Banner"
                                className="img-fluid rounded shadow-sm border"
                                style={{ maxHeight: '350px', objectFit: 'cover', width: '100%' }}
                            />
                        </div>
                    </div>

                    {/* Khối giá trị cốt lõi (Cam kết dịch vụ) */}
                    <div className="bg-light p-4 rounded mb-4" style={{ borderRadius: '12px' }}>
                        <h4 className="font-weight-bold text-center mb-4" style={{ color: '#005088' }}>
                            Cam Kết Của KieuCMS
                        </h4>
                        <div className="row text-center">
                            <div className="col-md-4 mb-3 mb-md-0">
                                <div className="p-2">
                                    <i className="fas fa-gem text-info mb-3" style={{ fontSize: '30px', color: '#11CAA0' }}></i>
                                    <h5 className="font-weight-bold">Chất Lượng Cao</h5>
                                    <p className="text-muted small">Cam kết chất liệu vải và phom dáng thiết kế đạt tiêu chuẩn tốt nhất.</p>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3 mb-md-0">
                                <div className="p-2">
                                    <i className="fas fa-truck text-success mb-3" style={{ fontSize: '30px', color: '#11CAA0' }}></i>
                                    <h5 className="font-weight-bold">Giao Hàng Nhanh</h5>
                                    <p className="text-muted small">Hỗ trợ đóng gói cẩn thận và vận chuyển siêu tốc tới tận tay khách hàng.</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="p-2">
                                    <i className="fas fa-headset text-primary mb-3" style={{ fontSize: '30px', color: '#11CAA0' }}></i>
                                    <h5 className="font-weight-bold">Hỗ Trợ 24/7</h5>
                                    <p className="text-muted small">Đội ngũ tư vấn viên luôn sẵn sàng giải đáp mọi thắc mắc của bạn.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

        </>
    );
}

export default AboutPage;