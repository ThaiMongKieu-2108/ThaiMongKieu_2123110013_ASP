import React from 'react';

function AboutPage() {
    return (
        <div className="d-flex flex-column min-vh-100">

            {/* 2. KHU VỰC NỘI DUNG GIỚI THIỆU NHÀ SÁCH */}
            <main className="flex-grow-1 bg-white py-5">
                <div className="container">

                    {/* Banner Tiêu đề trung tâm */}
                    <div className="text-center mb-5">
                        <h2 className="font-weight-bold" style={{ color: '#005088', letterSpacing: '1px' }}>
                            VỀ CHÚNG TÔI
                        </h2>
                        <p className="text-muted" style={{ fontStyle: 'italic' }}>
                            ThaiMongKieuCMS.BookWorld — Khơi nguồn tri thức, lan tỏa văn hóa đọc
                        </p>
                        <hr style={{ width: '100px', borderTop: '3px solid #11CAA0' }} />
                    </div>

                    <div className="row align-items-center mb-5">
                        {/* Cột trái: Giới thiệu hệ thống và danh mục */}
                        <div className="col-md-6 mb-4 mb-md-0">
                            <h4 className="font-weight-bold mb-3" style={{ color: '#005088' }}>
                                Câu Chuyện Thương Hiệu
                            </h4>
                            <p className="text-secondary text-justify" style={{ lineHeight: '1.7' }}>
                                Chào mừng bạn đến với <strong>ThaiMongKieuCMS.BookWorld</strong>, không gian mua sắm trực tuyến toàn diện dành cho những tâm hồn yêu sách và đam mê khám phá tri thức. Chúng tôi tự hào mang đến một hệ sinh thái tàng thư phong phú, trải dài từ các tác phẩm <strong>sách văn học</strong> kinh điển, cẩm nang <strong>sách kinh tế</strong> thực chiến, thế giới <strong>sách thiếu nhi - truyện tranh</strong> sinh động cho đến các giải pháp công nghệ <strong>ebook</strong> tiện lợi mọi lúc mọi nơi.
                            </p>
                            <p className="text-secondary text-justify" style={{ lineHeight: '1.7' }}>
                                Không dừng lại ở một nền tảng thương mại điện tử cung cấp sách thương mại, phần quản trị nội dung (CMS Post) của BookWorld còn là nơi đội ngũ biên tập viên tận tâm biên soạn những bản tóm tắt nội dung sách nổi bật, cập nhật liên tục danh sách sách bán chạy hàng tuần, và chia sẻ các bài viết chuyên sâu về kỹ năng xây dựng thói quen đọc sách hiệu quả trong kỷ nguyên số.
                            </p>
                        </div>

                        {/* Cột phải: Hình ảnh không gian đọc sách tri thức */}
                        <div className="col-md-6 text-center">
                            <img
                                src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80"
                                alt="Bookstore Library Banner"
                                className="img-fluid rounded shadow-sm border"
                                style={{ maxHeight: '350px', objectFit: 'cover', width: '100%' }}
                            />
                        </div>
                    </div>

                    {/* Khối giá trị cốt lõi (Cam kết dịch vụ phát triển văn hóa đọc) */}
                    <div className="bg-light p-4 rounded mb-4" style={{ borderRadius: '12px' }}>
                        <h4 className="font-weight-bold text-center mb-4" style={{ color: '#005088' }}>
                            Giá Trị Cốt Lõi Tại BookWorld
                        </h4>
                        <div className="row text-center">
                            <div className="col-md-4 mb-3 mb-md-0">
                                <div className="p-2">
                                    <i className="fas fa-book-reader mb-3" style={{ fontSize: '30px', color: '#11CAA0' }}></i>
                                    <h5 className="font-weight-bold">Sách Chuẩn Bản Quyền</h5>
                                    <p className="text-muted small">Cam kết 100% các đầu sách giấy và ebook đều được phân phối chính hãng từ các nhà xuất bản uy tín.</p>
                                </div>
                            </div>
                            <div className="col-md-4 mb-3 mb-md-0">
                                <div className="p-2">
                                    <i className="fas fa-feather-alt mb-3" style={{ fontSize: '30px', color: '#11CAA0' }}></i>
                                    <h5 className="font-weight-bold">CMS Điểm Tin Sách</h5>
                                    <p className="text-muted small">Liên tục cập nhật chuyên mục review, tóm tắt sách nổi bật và định hướng xây dựng thói quen đọc hằng ngày.</p>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="p-2">
                                    <i className="fas fa-shipping-fast mb-3" style={{ fontSize: '30px', color: '#11CAA0' }}></i>
                                    <h5 className="font-weight-bold">Vận Chuyển Linh Hoạt</h5>
                                    <p className="text-muted small">Hỗ trợ giao sách giấy siêu tốc tận nhà hoặc kích hoạt tài khoản đọc Ebook trực tuyến ngay tức thì.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

        </div>
    );
}

export default AboutPage;