import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // THÊM STATE: Quản lý sản phẩm đang được chọn để xem chi tiết
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải danh sách sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="text-center my-4">
                <div className="spinner-border spinner-border-sm text-primary mr-2" role="status"></div>
                <span className="text-muted small">Đang tải danh sách sản phẩm thời trang...</span>
            </div>
        );
    }

    return (
        <div className="row">
            {products.length === 0 ? (
                <div className="col-12">
                    <p className="text-muted">Chưa có sản phẩm nào trong hệ thống.</p>
                </div>
            ) : (
                products.map((item) => (
                    <div className="col-md-6 mb-4" key={item.id}>
                        <div className="card h-100 shadow-sm border-0 rounded-lg overflow-hidden">
                            <div className="position-relative bg-light text-center" style={{ height: '220px' }}>
                                <img
                                    src={item.imageUrl || 'https://via.placeholder.com/300x220?text=No+Image'}
                                    alt={item.name}
                                    className="card-img-top w-100 h-100"
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>

                            <div className="card-body">
                                <h5 className="card-title font-weight-bold text-dark text-truncate" title={item.name}>
                                    {item.name}
                                </h5>
                                <p className="card-text text-danger font-weight-bold mb-1">
                                    Giá bán: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                </p>
                                <p className="card-text small text-muted mb-0">
                                    Số lượng tồn kho: <span className="font-weight-bold text-secondary">{item.stockQuantity}</span> sản phẩm
                                </p>
                            </div>

                            <div className="card-card-footer bg-transparent border-top-0 pt-0">
                                {/* ĐÃ CẬP NHẬT: Thêm sự kiện onClick để nạp sản phẩm được click vào state hiển thị chi tiết */}
                                <button
                                    className="btn btn-outline-primary btn-block btn-sm"
                                    onClick={() => setSelectedProduct(item)}
                                >
                                    <i className="fa-solid fa-cart-plus mr-1"></i> Xem chi tiết
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}

            {/* ==================== GIAO DIỆN MODAL HIỂN THỊ CHI TIẾT CÁC TRƯỜNG SẢN PHẨM ==================== */}
            {selectedProduct && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', overflowY: 'auto' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow-lg rounded-lg">
                            {/* Header của Modal */}
                            <div className="modal-header bg-light border-bottom">
                                <h5 className="modal-title font-weight-bold text-dark text-uppercase">
                                    <i className="fa-solid fa-circle-info text-info mr-2"></i> Chi tiết sản phẩm
                                </h5>
                                <button
                                    type="button"
                                    className="close border-0 bg-transparent text-secondary font-weight-bold"
                                    style={{ fontSize: '1.5rem', outline: 'none' }}
                                    onClick={() => setSelectedProduct(null)} // Click dấu X để đóng Modal
                                >
                                    &times;
                                </button>
                            </div>

                            {/* Body của Modal: Hiển thị đầy đủ tất cả các trường trong bảng Products */}
                            <div className="modal-body p-4">
                                <div className="row">
                                    {/* Cột trái: Hình ảnh lớn của sản phẩm */}
                                    <div className="col-md-5 mb-3">
                                        <div className="rounded overflow-hidden bg-light border text-center" style={{ height: '280px' }}>
                                            <img
                                                src={selectedProduct.imageUrl || 'https://via.placeholder.com/300x220?text=No+Image'}
                                                alt={selectedProduct.name}
                                                className="w-100 h-100"
                                                style={{ objectFit: 'contain' }}
                                            />
                                        </div>
                                    </div>

                                    {/* Cột phải: Toàn bộ thông tin các trường */}
                                    <div className="col-md-7">
                                        <h3 className="font-weight-bold text-dark mb-2">{selectedProduct.name}</h3>

                                        <div className="mb-3">
                                            <span className="text-muted small">Mã sản phẩm (ID): </span>
                                            <span className="badge badge-secondary">#PROD-{selectedProduct.id}</span>
                                            <span className="text-muted small ml-3">Mã danh mục: </span>
                                            <span className="badge badge-light border">#{selectedProduct.categoryProductId}</span>
                                        </div>

                                        <h4 className="text-danger font-weight-bold mb-3">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(selectedProduct.price)}
                                        </h4>

                                        <div className="p-3 bg-light rounded mb-3" style={{ maxHeight: '120px', overflowY: 'auto' }}>
                                            <h6 className="font-weight-bold text-secondary small text-uppercase mb-1">📋 Mô tả chi tiết:</h6>
                                            <p className="text-dark small mb-0" style={{ whiteSpace: 'pre-line' }}>
                                                {selectedProduct.description || 'Sản phẩm này hiện chưa có nội dung mô tả chi tiết từ nhà quản trị.'}
                                            </p>
                                        </div>

                                        <div className="text-muted small">
                                            <i className="fa-solid fa-warehouse mr-1 text-secondary"></i> Số lượng tồn kho vật lý:
                                            <strong className="text-dark ml-1">{selectedProduct.stockQuantity}</strong> sản phẩm
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Chân của Modal */}
                            <div className="modal-footer bg-light border-top">
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-sm px-4"
                                    onClick={() => setSelectedProduct(null)} // Click nút đóng
                                >
                                    Đóng lại
                                </button>
                                <button type="button" className="btn btn-primary btn-sm px-4">
                                    <i className="fa-solid fa-cart-plus mr-1"></i> Thêm vào giỏ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;