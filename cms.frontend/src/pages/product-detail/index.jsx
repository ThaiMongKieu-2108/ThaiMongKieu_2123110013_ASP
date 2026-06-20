import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import { CartContext } from '../../context/CartContext';

const IMAGE_BASE_URL = "https://localhost:7238"; // Cấu hình gốc Backend của bạn

function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
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

    // Định dạng tiền tệ VNĐ chuẩn có gạch chân d chữ đ
    const formatCurrency = (value) => {
        if (value === 0 || !value) return <span className="text-danger font-weight-bold" style={{ fontSize: '28px' }}>0 <span className="text-decoration-underline">đ</span></span>;
        return <span className="text-danger font-weight-bold" style={{ fontSize: '28px' }}>{new Intl.NumberFormat('vi-VN').format(value)} <span className="text-decoration-underline">đ</span></span>;
    };

    const getImageUrl = (url) => {
        if (!url) return "https://via.placeholder.com/450?text=No+Image";
        if (url.startsWith('http')) return url;
        const cleanUrl = url.startsWith('/') ? url : `/${url}`;
        return `${IMAGE_BASE_URL}${cleanUrl}`;
    };

    const handleAddToCart = () => {
        if (!product) return;
        if (quantity > product.stockQuantity) {
            alert(`⚠️ Số lượng trong kho không đủ!\nHiện tại hệ thống chỉ còn ${product.stockQuantity} sản phẩm.`);
            return;
        }
        addToCart(product, quantity);
        alert(`🎉 Thành công! Đã thêm ${quantity} mẫu [${product.name}] vào giỏ hàng.`);
    };

    return (
        <main className="flex-grow-1 bg-white py-4">
            <div className="container">
                {loading ? (
                    <div className="text-center py-5 my-5">
                        <div className="spinner-border text-primary" role="status"></div>
                    </div>
                ) : !product ? (
                    <div className="container text-center py-5">
                        <div className="alert alert-danger">Sản phẩm này không tồn tại hoặc đã ngừng kinh doanh.</div>
                        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/shop')}>Quay lại cửa hàng</button>
                    </div>
                ) : (
                    <div className="card border-light shadow-sm p-3 bg-white" style={{ borderRadius: '4px' }}>
                        <div className="row">

                            {/* Cột trái: Khung chứa ảnh sản phẩm sát mép nhẹ */}
                            <div className="col-md-5 mb-3 text-center">
                                <div className="p-1 border rounded bg-light" style={{ minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <img
                                        src={getImageUrl(product.imageUrl)}
                                        alt={product.name}
                                        className="img-fluid"
                                        style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/450?text=KieuCMS+Product";
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Cột phải: Thông tin chi tiết */}
                            <div className="col-md-7 pl-md-4">
                                {/* Tên sản phẩm */}
                                <h2 className="font-weight-bold text-dark mb-2" style={{ fontSize: '28px', color: '#2b2b2b' }}>
                                    {product.name}
                                </h2>

                                {/* Giá tiền */}
                                <div className="mb-3">
                                    {formatCurrency(product.price)}
                                </div>

                                {/* Nhãn số lượng tồn kho thực tế */}
                                <div className="mb-3 text-muted" style={{ fontSize: '13px' }}>
                                    <span className="bg-light border px-2 py-1 rounded d-inline-block">
                                        <i className="fas fa-warehouse mr-1 text-secondary"></i> Số lượng tồn kho thực tế: <strong className="text-dark">{product.stockQuantity || 333} chiếc</strong>
                                    </span>
                                </div>

                                {/* Mô tả sản phẩm */}
                                <p className="text-secondary text-justify mb-4 small" style={{ lineHeight: '1.7', color: '#666' }}>
                                    {product.description || "Chưa có mô tả chi tiết cho thiết kế đầm cao cấp này."}
                                </p>

                                <hr />

                                {/* Bảng tương tác mua hàng phía dưới */}
                                <div className="row align-items-end mt-3">
                                    {/* Số lượng mua */}
                                    <div className="col-sm-4 mb-3">
                                        <label className="font-weight-bold text-secondary text-uppercase d-block mb-2" style={{ fontSize: '12px', letterSpacing: '0.5px' }}>
                                            Số lượng mua:
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control text-center font-weight-bold border"
                                            value={quantity}
                                            min="1"
                                            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                                            style={{ height: '42px', borderRadius: '4px' }}
                                        />
                                    </div>

                                    {/* Nút thêm vào giỏ hàng dạng Thanh ngang vuông vắn màu xanh biển */}
                                    <div className="col-sm-8 mb-3">
                                        <button
                                            className="btn text-white font-weight-bold btn-block d-flex align-items-center justify-content-center"
                                            style={{
                                                backgroundColor: '#005088',
                                                height: '42px',
                                                borderRadius: '4px',
                                                fontSize: '14px'
                                            }}
                                            disabled={product.stockQuantity <= 0}
                                            onClick={handleAddToCart}
                                        >
                                            <i className="fas fa-shopping-cart mr-2" style={{ fontSize: '13px' }}></i>
                                            THÊM VÀO GIỎ HÀNG
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

export default ProductDetail;