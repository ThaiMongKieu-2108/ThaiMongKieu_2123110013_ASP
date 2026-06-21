import React, { useState, useEffect } from 'react';
// Thư viện useParams hỗ trợ bóc tách biến số trên URL đường dẫn
import { useParams, Link } from 'react-router-dom';
import productService from '../../services/productService';




const IMAGE_BASE_URL = "https://localhost:7111"; // Cổng Port chạy ngầm của Backend C#




function ProductDetail() {
    const { id } = useParams(); // Lấy biến ID động (Ví dụ: /product/12 -> lấy được con số 12)
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);


    // State cục bộ quản lý ô số lượng khách muốn chọn mua (Mặc định bằng 1)
    const [quantity, setQuantity] = useState(1);




    useEffect(() => {
        const fetchProductById = async () => {
            try {
                setLoading(true);
                const data = await productService.getProductById(id);
                setProduct(data.data || data); // Nạp đối tượng sản phẩm độc bản vào state
            } catch (error) {
                console.error("Lỗi lấy chi tiết sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductById();
    }, [id]);




    // Hàm tiện ích ép định dạng hiển thị tiền tệ chuẩn Việt Nam (đ)
    const formatVND = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    };




    // LOGIC CỐT LÕI: Kiểm thử hành động thêm sản phẩm vào giỏ hàng toàn cục
    const handleAddToCartSubmit = () => {
        // Thực hiện so sánh toán học trực tiếp giữa ô chọn mua với cột tồn kho thực tế
        if (quantity > product.stockQuantity) {
            // Nếu vượt kho -> Chặn lại lập tức, phát thông báo cảnh báo UX
            alert(`⛔ LỖI NGHIỆP VỤ KHO: Số lượng đặt mua (${quantity} chiếc) vượt quá số lượng hiện có trong kho hàng (Hiện còn: ${product.stockQuantity} chiếc). Vui lòng điều chỉnh lại số lượng!`);
            return; // Ngắt hàm, không cho chạy xuống lệnh nạp giỏ hàng bên dưới
        }




        // Kịch bản hợp lệ -> Đủ điều kiện đẩy vào mảng giỏ hàng toàn cục (Bổ sung ở buổi 12)
        alert(`🎉 THÀNH CÔNG: Đã thêm ${quantity} chiếc "${product.name}" vào giỏ hàng cá nhân!`);
    };




    if (loading) return <div className="text-center py-5 font-italic text-muted">Đang truy vấn kho dữ liệu mẫu thời trang...</div>;
    if (!product) return <div className="text-center py-5 text-danger font-weight-bold">Sản phẩm này không tồn tại trên hệ thống ThaiCMS.</div>;




    return (
        <div className="container py-5">
            <div className="row mt-3 bg-white p-4 rounded shadow-sm">
                {/* KHỐI BÊN TRÁI: HIỂN THỊ 1 ẢNH ĐẠI DIỆN DUY NHẤT (ÉP CHUẨN CỐ ĐỊNH TỈ LỆ) */}
                <div className="col-md-6 mb-4">
                    <div className="product-image-container border rounded" style={{ overflow: 'hidden', height: '450px' }}>
                        <img
                            src={
                                product.imageUrl
                                    ? (product.imageUrl.startsWith('http') ? product.imageUrl : `${IMAGE_BASE_URL}${product.imageUrl}`)
                                    : 'https://via.placeholder.com/500x500'
                            }
                            alt={product.name}
                            className="w-100 h-100"
                            style={{ objectFit: 'cover' }} // Giúp ảnh tự co giãn bọc khung, không bao giờ bị bóp méo
                        />
                    </div>
                </div>




                {/* KHỐI BÊN PHẢI: CHI TIẾT THÔNG TIN VÀ NÚT HÀNH ĐỘNG MUA SẮM */}
                <div className="col-md-6">
                    <h2 className="font-weight-bold text-dark mb-2">{product.name}</h2>


                    {/* Hiển thị giá bán lớn màu đỏ, nổi bật */}
                    <h3 className="text-danger font-weight-bold mb-4" style={{ letterSpacing: '0.5px' }}>
                        {formatVND(product.price)}
                    </h3>


                    <div className="mb-4">
                        <span className="badge badge-light py-2 px-3 border text-secondary">
                            <i className="fas fa-warehouse mr-2"></i> Số lượng tồn kho thực tế: <strong className="text-dark">{product.stockQuantity} chiếc</strong>
                        </span>
                    </div>




                    <p className="text-secondary mb-4 text-justify" style={{ fontSize: '15px', lineHeight: '1.6' }}>
                        {product.description || "Mô tả sản phẩm cao cấp đang được cập nhật chi tiết từ hệ thống quản trị nội dung ThaiCMS.Fashion..."}
                    </p>




                    <hr className="my-4" />




                    {/* KHU VỰC ĐIỀU CHỈNH SỐ LƯỢNG MUA VÀ ACTION BUTTON */}
                    <div className="d-flex align-items-center flex-wrap" style={{ gap: '15px' }}>
                        <div className="quantity-select-wrapper" style={{ width: '120px' }}>
                            <label className="small text-muted font-weight-bold mb-1 d-block">SỐ LƯỢNG MUA:</label>
                            <input
                                type="number"
                                className="form-control text-center font-weight-bold"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            />
                        </div>


                        <div className="btn-action-wrapper flex-grow-1 pt-4">
                            <button
                                className="btn btn-primary btn-block font-weight-bold py-2"
                                style={{ backgroundColor: '#005088', borderColor: '#005088', borderRadius: '6px' }}
                                onClick={handleAddToCartSubmit}
                            >
                                <i className="fas fa-shopping-cart mr-2"></i> THÊM VÀO GIỎ HÀNG
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}




export default ProductDetail;
