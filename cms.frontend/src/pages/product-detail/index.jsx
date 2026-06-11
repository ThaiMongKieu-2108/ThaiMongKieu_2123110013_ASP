import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import { CartContext } from '../../context/CartContext';
// IMPORT BẮT BUỘC: Gọi lại Header và Footer để đồng bộ giao diện toàn trang

const IMAGE_BASE_URL = "https://localhost:7238"; // Cấu hình gốc Backend của bạn

function ProductDetail() {
    const { id } = useParams(); // Lấy ID động từ thanh địa chỉ URL
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1); // Mặc định mua 1 sản phẩm
    const { addToCart } = useContext(CartContext);
    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            const data = await productService.getProductById(id);
            setProduct(data);
            setLoading(false);
        };
        fetchProduct();
    }, [id]);

    // Định dạng tiền tệ VNĐ
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // Hàm bổ trợ: Tự động chuẩn hóa đường dẫn ảnh an toàn
    const getImageUrl = (url) => {
        if (!url) return "https://via.placeholder.com/450?text=No+Image";
        if (url.startsWith('http')) return url;

        const cleanUrl = url.startsWith('/') ? url : `/${url}`;
        return `${IMAGE_BASE_URL}${cleanUrl}`;
    };

    const handleAddToCart = () => {
        if (!product) return;

        // Thuật toán kiểm tra lỗi bán vượt kho
        if (quantity > product.stockQuantity) {
            alert(`⚠️ Số lượng trong kho không đủ!\nHiện tại hệ thống chỉ còn ${product.stockQuantity} sản phẩm.`);
            return;
        }

        // LỆNH QUAN TRỌNG: Gửi sản phẩm và số lượng lên bộ quản lý giỏ hàng toàn cục
        addToCart(product, quantity);

        alert(`🎉 Thành công! Đã thêm ${quantity} mẫu [${product.name}] vào giỏ hàng.`);
    };

    return (
        <>

            {/* 2. KHU VỰC NỘI DUNG CHI TIẾT SẢN PHẨM */}
            <main className="flex-grow-1 bg-light py-5">
                <div className="container">
                    {loading ? (
                        <div className="text-center py-5 my-5">
                            <div className="spinner-border text-info" role="status"></div>
                            <p className="text-muted mt-2">Đang tải thông tin sản phẩm...</p>
                        </div>
                    ) : !product ? (
                        <div className="container text-center py-5">
                            <div className="alert alert-danger">Sản phẩm này không tồn tại hoặc đã ngừng kinh doanh.</div>
                            <button className="btn btn-secondary btn-sm" onClick={() => navigate('/shop')}>Quay lại cửa hàng</button>
                        </div>
                    ) : (
                        <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '16px' }}>
                            <div className="row">
                                {/* Cột trái: 1 Ảnh đại diện lớn cố định */}
                                <div className="col-md-6 mb-4 text-center">
                                    <div className="bg-white p-3 rounded border" style={{ height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img
                                            src={getImageUrl(product.imageUrl)}
                                            alt={product.name}
                                            className="img-fluid rounded"
                                            style={{ maxHeight: '100%', objectFit: 'contain' }}
                                            onError={(e) => {
                                                // Link ảnh dự phòng nếu đường dẫn sai hoặc mất file trên server
                                                e.target.src = "https://via.placeholder.com/450?text=KieuCMS+Product";
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Cột phải: Thông tin toàn diện mặt hàng */}
                                <div className="col-md-6 d-flex flex-column justify-content-center">
                                    <h2 className="font-weight-bold text-dark mb-2">{product.name}</h2>

                                    <h3 className="text-danger font-weight-bold mb-3">{formatCurrency(product.price)}</h3>

                                    <div className="mb-3">
                                        <span className="text-secondary font-weight-bold">Trạng thái kho: </span>
                                        {product.stockQuantity > 0 ? (
                                            <span className="badge badge-success px-2 py-1">Còn {product.stockQuantity} sản phẩm có sẵn</span>
                                        ) : (
                                            <span className="badge badge-danger px-2 py-1">Hết hàng toàn hệ thống</span>
                                        )}
                                    </div>

                                    <p className="text-muted text-justify mb-4" style={{ lineHeight: '1.6' }}>
                                        {product.description || "Chưa có mô tả chi tiết cho sản phẩm này. Các mẫu thiết kế tại KieuCMS đều được làm từ chất liệu cao cấp, phom dáng chuẩn, mang lại sự sang trọng và tự tin cho người mặc."}
                                    </p>

                                    {/* Tương tác chọn số lượng mua */}
                                    {product.stockQuantity > 0 && (
                                        <div className="d-flex align-items-center mb-4">
                                            <span className="font-weight-bold text-secondary mr-3">Số lượng mua:</span>
                                            <div className="input-group" style={{ width: '130px' }}>
                                                <div className="input-group-prepend">
                                                    <button className="btn btn-outline-secondary btn-sm" onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)}>-</button>
                                                </div>
                                                <input
                                                    type="number"
                                                    className="form-control text-center font-weight-bold"
                                                    value={quantity}
                                                    min="1"
                                                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                                                />
                                                <div className="input-group-append">
                                                    <button className="btn btn-outline-secondary btn-sm" onClick={() => setQuantity(q => q + 1)}>+</button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Nút bấm hành động thêm vào giỏ */}
                                    <button
                                        className="btn btn-lg text-white font-weight-bold btn-block shadow-sm"
                                        style={{ backgroundColor: '#11CAA0', borderColor: '#11CAA0', borderRadius: '30px' }}
                                        disabled={product.stockQuantity <= 0}
                                        onClick={handleAddToCart}
                                    >
                                        <i className="fas fa-shopping-cart mr-2"></i> THÊM VÀO GIỎ HÀNG
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

        </>
    );
}

export default ProductDetail;