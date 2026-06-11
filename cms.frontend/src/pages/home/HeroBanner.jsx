import React, { useState, useEffect } from 'react';

// Đường dẫn API Backend chính xác của bạn để lấy ảnh từ thư mục uploads
const IMAGE_BASE_URL = "https://localhost:7238";

function HeroBanner() {
    // 1. Mảng danh sách các ảnh banner thời trang quần áo của shop
    const bannerImages = [
        `${IMAGE_BASE_URL}/uploads/banners/summer_collection.jpg`,
        `${IMAGE_BASE_URL}/uploads/banners/streetwear_styles.jpg`,
        `${IMAGE_BASE_URL}/uploads/banners/minimalist_looks.jpg`,
        `${IMAGE_BASE_URL}/uploads/banners/fall_fashion.jpg`
    ];

    // Link ảnh dự phòng online (Unsplash) nếu thư mục Backend của bạn chưa có sẵn các file ảnh trên
    const fallbackImages = [
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1200&auto=format&fit=crop"
    ];

    // State quản lý vị trí ảnh hiện tại đang hiển thị
    const [currentIndex, setCurrentIndex] = useState(0);

    // 2. Thuật toán tự động chạy Banner (Slider Carousel) sau mỗi 4 giây
    useEffect(() => {
        const timer = setInterval(() => {
            handleNext();
        }, 4000); // 4000ms = 4 giây chuyển ảnh một lần

        return () => clearInterval(timer); // Dọn dẹp bộ nhớ khi component bị unmount
    }, [currentIndex]);

    // Hàm chuyển sang ảnh tiếp theo (Vòng lặp lại từ đầu nếu hết ảnh)
    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    };

    // Hàm quay lại ảnh phía trước
    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + bannerImages.length) % bannerImages.length);
    };

    return (
        <section
            className="hero-banner-clothing my-4 position-relative overflow-hidden w-100"
            style={{
                height: '400px', // Chiều cao lý tưởng cho banner shop thời trang
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
            }}
        >
            {/* Ảnh Banner chính */}
            <img
                src={bannerImages[currentIndex]}
                className="w-100 h-100"
                alt="KieuCMS Fashion Banner"
                style={{
                    objectFit: 'cover',
                    transition: 'all 0.6s ease-in-out' // Hiệu ứng mượt mà khi đổi ảnh
                }}
                onError={(e) => {
                    // Nếu Backend chưa có ảnh, tự động nạp link ảnh thời trang Unsplash dự phòng
                    if (e.target.src !== fallbackImages[currentIndex]) {
                        e.target.src = fallbackImages[currentIndex];
                    }
                }}
            />

            {/* Lớp phủ mờ nhẹ giúp chữ hoặc các nút bấm nổi bật hơn */}
            <div className="position-absolute w-100 h-100" style={{ top: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.15)' }}></div>

            {/* Nút điều hướng mũi tên bên TRÁI (Prev) */}
            <button
                onClick={handlePrev}
                className="btn btn-light position-absolute d-flex align-items-center justify-content-center rounded-circle shadow-sm"
                style={{
                    top: '50%',
                    left: '20px',
                    transform: 'translateY(-50%)',
                    width: '45px',
                    height: '45px',
                    zIndex: 10,
                    opacity: 0.85
                }}
            >
                <i className="fas fa-chevron-left text-dark"></i>
            </button>

            {/* Nút điều hướng mũi tên bên PHẢI (Next) */}
            <button
                onClick={handleNext}
                className="btn btn-light position-absolute d-flex align-items-center justify-content-center rounded-circle shadow-sm"
                style={{
                    top: '50%',
                    right: '20px',
                    transform: 'translateY(-50%)',
                    width: '45px',
                    height: '45px',
                    zIndex: 10,
                    opacity: 0.85
                }}
            >
                <i className="fas fa-chevron-right text-dark"></i>
            </button>

            {/* Cụm các dấu chấm tròn hiển thị chỉ số trang (Indicators) ở cạnh dưới banner */}
            <div
                className="position-absolute w-100 text-center d-flex justify-content-center align-items-center"
                style={{ bottom: '20px', zIndex: 10 }}
            >
                {bannerImages.map((_, index) => (
                    <span
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className="mx-1"
                        style={{
                            width: currentIndex === index ? '24px' : '8px', // Dấu chấm hiện tại sẽ dài ra nhìn hiện đại
                            height: '8px',
                            borderRadius: '4px',
                            backgroundColor: currentIndex === index ? '#11CAA0' : '#ffffff', // Màu xanh chủ đạo của thương hiệu bạn
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    ></span>
                ))}
            </div>
        </section>
    );
}

export default HeroBanner;