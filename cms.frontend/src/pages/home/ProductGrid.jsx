import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import ProductCard from '../../components/ProductCard';

// Nhận thuộc tính activeCategoryId từ trang cha truyền vào khi bấm danh mục ngoài Navbar/Header
function ProductGrid({ activeCategoryId = null }) {
    const [products, setProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Lần đầu chạy: Tải toàn bộ sản phẩm về lưu vào bộ nhớ tạm
    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi hệ thống khi tải danh sách sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllProducts();
    }, []);

    // Theo dõi biến [activeCategoryId] và [products]. Khi một trong hai thay đổi sẽ tính toán render lại
    useEffect(() => {
        if (products.length === 0) return;

        if (activeCategoryId === null || activeCategoryId === 0) {
            // 🟢 TRƯỜNG HỢP MẶC ĐỊNH (Tất cả): Lấy đúng 4 sản phẩm mới nhất (sắp xếp giảm dần theo ID)
            const latestProducts = [...products]
                .sort((a, b) => b.id - a.id)
                .slice(0, 4);
            setDisplayedProducts(latestProducts);
        } else {
            // 🟢 TRƯỜNG HỢP CHỌN DANH MỤC: Lọc chính xác các cuốn sách thuộc danh mục được bấm
            const filtered = products.filter(p => p.categoryProductId === activeCategoryId || p.CategoryProductId === activeCategoryId);
            setDisplayedProducts(filtered);
        }
    }, [activeCategoryId, products]);

    if (loading) {
        return (
            <div className="container my-5 text-center">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-2 text-muted">Đang tải danh sách sách tri thức mới nhất...</p>
            </div>
        );
    }

    return (
        <section className="product-grid-wrapper py-4">
            <div className="container">

                <div className="section-heading mb-4 d-flex justify-content-between align-items-center border-bottom pb-2">
                    <h4 className="font-weight-bold text-uppercase m-0" style={{ color: '#005088' }}>
                        <i className="fas fa-book-open mr-2 text-warning"></i>
                        {activeCategoryId === null || activeCategoryId === 0 ? "Sách mới xuất bản" : "Kết quả lọc danh mục"}
                    </h4>
                    <span className="text-muted" style={{ fontSize: '14px' }}>
                        {activeCategoryId === null || activeCategoryId === 0
                            ? `Hiển thị 4 đầu sách mới cập nhật`
                            : `Tìm thấy (${displayedProducts.length}) cuốn sách phù hợp`}
                    </span>
                </div>

                {/* KHUNG LƯỚI ĐỔ DỮ LIỆU ĐỘNG */}
                <div className="row">
                    {displayedProducts.length > 0 ? (
                        displayedProducts.map((product) => (
                            <div className="col-xl-3 col-lg-4 col-sm-6 col-12 mb-4" key={product.id}>
                                <ProductCard item={product} />
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-5 text-muted">
                            <i className="fas fa-folder-open mb-2 d-block" style={{ fontSize: '40px' }}></i>
                            Chủ đề này hiện tại chưa nhập đầu sách mới. Vui lòng quay lại sau!
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}

export default ProductGrid;