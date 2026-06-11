import React, { useContext } from 'react';
// IMPORT THÀNH PHẦN: Sử dụng Link để điều hướng mượt mà, không bị load lại trang
import { Link } from 'react-router-dom';
// IMPORT BẮT BUỘC: Gọi giỏ hàng toàn cục Context API để xử lý đẩy dữ liệu sống lên Header
import { CartContext } from '../context/CartContext';

// SỬA TẠI ĐÂY: Thay đổi cổng thành đúng cổng đang chạy của API Backend (Ví dụ: 7238)
const IMAGE_BASE_URL = "https://localhost:7238";

function ProductCard({ item }) {
    // Gọi hàm addToCart từ bộ quản lý giỏ hàng toàn cục ra để sử dụng
    const { addToCart } = useContext(CartContext);

    // Hàm bổ trợ: Định dạng số thô thành chuỗi tiền tệ VNĐ (450.000 ₫)
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    // Hàm xử lý đường dẫn ảnh để tránh lỗi thiếu dấu "/" ở giữa
    const getImageUrl = (url) => {
        if (!url) return "https://via.placeholder.com/300"; // Ảnh tạm nếu item không có dữ liệu ảnh
        if (url.startsWith('http')) return url; // Nếu API trả về link tuyệt đối

        // Đảm bảo có dấu / hợp lý giữa Base URL và đường dẫn ảnh
        const cleanUrl = url.startsWith('/') ? url : `/${url}`;
        return `${IMAGE_BASE_URL}${cleanUrl}`;
    };

    // LOGIC CỐT LÕI: Hàm xử lý khi khách nhấn nút mua nhanh ở lưới danh sách
    const handleQuickAddToCart = (e) => {
        e.preventDefault(); // Ngăn chặn sự kiện click làm ảnh hưởng đến các thẻ bọc ngoài

        if (item.stockQuantity <= 0) {
            alert("⚠️ Mẫu sản phẩm này hiện tại đã cháy hàng toàn hệ thống!");
            return;
        }

        // Đẩy sản phẩm này lên bộ nhớ giỏ hàng toàn cục với số lượng mặc định là 1 chiếc
        addToCart(item, 1);
        alert(`🎉 Thành công! Đã thêm 1 mẫu [${item.name}] vào giỏ hàng cá nhân.`);
    };

    return (
        <div className="card h-100 shadow-sm border-0 product-card-hover" style={{ borderRadius: '12px', overflow: 'hidden', transition: '0.3s' }}>

            {/* Khối 1: Hình ảnh trang phục + Nhãn tồn kho */}
            <div className="position-relative overflow-hidden" style={{ height: '320px', backgroundColor: '#f8fafc' }}>
                <img
                    src={getImageUrl(item.imageUrl)}
                    className="card-img-top w-100 h-100"
                    alt={item.name}
                    style={{ objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                    onError={(e) => {
                        // Nếu đường dẫn sai hoặc Backend chặn file, đổi sang ảnh lỗi mặc định để giao diện không bị trống
                        e.target.src = "https://via.placeholder.com/300?text=No+Image";
                    }}
                />

                {/* Thuật toán 1: Nếu hết sạch hàng thì dán nhãn màu xám */}
                {item.stockQuantity <= 0 ? (
                    <span className="badge badge-secondary position-absolute px-2 py-1" style={{ top: '15px', left: '15px', borderRadius: '4px', fontSize: '11px', backgroundColor: '#6c757d' }}>
                        Hết hàng tạm thời
                    </span>
                ) : (
                    /* Thuật toán 2: Nếu tồn kho thấp (Từ 1 đến 5 chiếc) thì đóng dấu cảnh báo đỏ bốc lửa */
                    item.stockQuantity <= 5 && (
                        <span className="badge badge-danger position-absolute px-2 py-1" style={{ top: '15px', left: '15px', borderRadius: '4px', fontSize: '11px' }}>
                            Bán chạy / Còn {item.stockQuantity} chiếc
                        </span>
                    )
                )}
            </div>

            {/* Khối 2: Nội dung thông tin chi tiết trang phục */}
            <div className="card-body d-flex flex-column p-3">
                {/* Tên sản phẩm */}
                <h6 className="card-title font-weight-bold text-dark text-truncate mb-1" title={item.name} style={{ fontSize: '16px' }}>
                    {item.name}
                </h6>

                {/* Giá tiền sản phẩm */}
                <p className="card-text font-weight-bold text-danger mb-3" style={{ fontSize: '17px' }}>
                    {formatCurrency(item.price)}
                </p>

                {/* Cụm nút bấm tương tác đẩy sát đáy thẻ (mt-auto) */}
                <div className="mt-auto pt-2 border-top d-flex justify-content-between">
                    {/* Nút xem chi tiết: Chuyển sang thẻ Link để chuyển trang mượt mà */}
                    <Link
                        to={`/product/${item.id}`}
                        className="btn btn-sm btn-outline-primary font-weight-bold px-3 d-flex align-items-center justify-content-center"
                        style={{ borderRadius: '20px', flexGrow: 1, textAlign: 'center' }}
                    >
                        <i className="fas fa-eye mr-1"></i> Chi tiết
                    </Link>

                    {/* Nút Mua ngay: Đã kết nối hàm liên kết Context API */}
                    <button
                        className="btn btn-sm text-white font-weight-bold px-3 ml-2"
                        style={{
                            borderRadius: '20px',
                            backgroundColor: item.stockQuantity <= 0 ? '#b2bec3' : '#11CAA0',
                            borderColor: item.stockQuantity <= 0 ? '#b2bec3' : '#11CAA0',
                            flexGrow: 1
                        }}
                        disabled={item.stockQuantity <= 0} // Vô hiệu hóa nút bấm nếu sản phẩm hết hàng trong kho
                        onClick={handleQuickAddToCart}
                    >
                        <i className="fas fa-cart-plus mr-1"></i> Mua ngay
                    </button>
                </div>
            </div>

        </div>
    );
}

export default ProductCard;