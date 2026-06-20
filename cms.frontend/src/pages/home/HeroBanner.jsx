import React, { useState, useEffect } from 'react';
import bannerService from '../../services/bannerService'; // Import service vừa tạo

function HeroBanner() {
    // 1. Khởi tạo State chứa danh sách banner lấy từ cơ sở dữ liệu
    const [banners, setBanners] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    // Link ảnh dự phòng nếu database trống hoặc bị lỗi ảnh
    const fallbackImage = "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop";

    // 2. useEffect dùng để gọi API ngay khi trang chủ được tải lên
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                // Gọi API lấy danh sách banner đang active
                const response = await bannerService.getAllBanners();
                setBanners(response); // Đổ dữ liệu JSON từ Backend vào state
            } catch (error) {
                console.error("Lỗi khi lấy danh sách banner từ CSDL:", error);
            } finally {
                setLoading(false); // Kết thúc quá trình tải dữ liệu
            }
        };

        fetchBanners();
    }, []);

    // 3. Thuật toán tự động chạy Slider sau mỗi 4 giây (chỉ chạy khi đã có dữ liệu banner)
    useEffect(() => {
        if (banners.length === 0) return;

        const timer = setInterval(() => {
            handleNext();
        }, 4000);

        return () => clearInterval(timer);
    }, [currentIndex, banners]);

    // Hàm chuyển sang ảnh tiếp theo
    const handleNext = () => {
        if (banners.length > 0) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }
    };

    // Hàm quay lại ảnh phía trước
    const handlePrev = () => {
        if (banners.length > 0) {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
        }
    };

    // Nếu đang tải dữ liệu từ CSDL, hiển thị khung trống mờ hoặc hiệu ứng loading
    if (loading) {
        return <div className="my-4 text-center py-5 bg-light rounded" style={{ height: '400px' }}>Đang nạp dữ liệu Banner...</div>;
    }

    // Nếu CSDL chưa cấu hình banner nào, ẩn phần này hoặc hiển thị 1 ảnh mặc định cố định
    if (banners.length === 0) {
        return (
            <section className="hero-banner-clothing my-4 w-100" style={{ height: '400px', borderRadius: '12px' }}>
                <img src={fallbackImage} className="w-100 h-100 rounded" style={{ objectFit: 'cover' }} alt="Mặc định" />
            </section>
        );
    }

    // Lấy banner hiện tại dựa trên Index đang chạy
    const currentBanner = banners[currentIndex];

    return (
        <section
            className="hero-banner-clothing my-4 position-relative overflow-hidden w-100"
            style={{
                height: '400px',
                borderRadius: '12px',
                boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
            }}
        >
            {/* Thẻ liên kết bọc ngoài ảnh: Click vào sẽ chuyển hướng đến LinkUrl từ CSDL (nếu có) */}
            <a href={currentBanner.linkUrl || "#"} target="_blank" rel="noreferrer" className="w-100 h-100 d-block">
                <img
                    src={currentBanner.imageUrl}
                    className="w-100 h-100"
                    alt={currentBanner.title || "KieuCMS Fashion Banner"}
                    style={{
                        objectFit: 'cover',
                        transition: 'all 0.6s ease-in-out'
                    }}
                    onError={(e) => {
                        // Tự động thay thế bằng ảnh dự phòng nếu URL ảnh trong database bị lỗi/hỏng
                        if (e.target.src !== fallbackImage) {
                            e.target.src = fallbackImage;
                        }
                    }}
                />
            </a>

            {/* Lớp phủ mờ và Tiêu đề Banner hiển thị động */}
            <div className="position-absolute w-100 h-100 d-flex align-items-end" style={{ top: 0, left: 0, backgroundColor: 'rgba(0, 0, 0, 0.2)', padding: '40px' }}>
                <h2 className="text-white fw-bold m-0 p-2 rounded" style={{ backgroundColor: 'rgba(0,0,0,0.4)', fontSize: '24px' }}>
                    {currentBanner.title}
                </h2>
            </div>

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

            {/* Cụm các dấu chấm tròn hiển thị chỉ số trang dựa trên độ dài mảng dữ liệu thực tế */}
            <div
                className="position-absolute w-100 text-center d-flex justify-content-center align-items-center"
                style={{ bottom: '20px', zIndex: 10 }}
            >
                {banners.map((_, index) => (
                    <span
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className="mx-1"
                        style={{
                            width: currentIndex === index ? '24px' : '8px',
                            height: '8px',
                            borderRadius: '4px',
                            backgroundColor: currentIndex === index ? '#11CAA0' : '#ffffff',
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