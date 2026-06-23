import React, { useState, useEffect } from 'react';
import productService from '../../services/productService'; // Sử dụng trực tiếp service chuẩn của em
import ProductCard from '../../components/ProductCard';

function TopSelling() {
    const [hotProducts, setHotProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopSellingData = async () => {
            try {
                setLoading(true);

                // Bước 1: Gọi dịch vụ API lấy toàn bộ sản phẩm sách (giống ProductGrid)
                const data = await productService.getAllProducts();

                if (data && data.length > 0) {
                    // Bước 2: Áp dụng thuật toán sắp xếp cắt mảng (Lấy 3 cuốn sách ngẫu nhiên hoặc mới nhất để làm mẫu bán chạy)
                    const topThreeHot = data
                        .sort((a, b) => b.id - a.id) // Sắp xếp theo ID mới nhất
                        .slice(0, 3);                // Cắt lấy đúng 3 đầu sách dẫn đầu

                    setHotProducts(topThreeHot);
                }
            } catch (error) {
                console.error("Lỗi hệ thống khi tải danh sách sách bán chạy:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopSellingData();
    }, []);

    // Hiệu ứng tải trang đồng bộ với hệ thống UX mẫu
    if (loading) {
        return (
            <div className="container my-4 text-center">
                <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                <span className="ml-2 text-muted" style={{ fontSize: '14px' }}>Đang lọc danh sách tác phẩm bán chạy...</span>
            </div>
        );
    }

    // Cơ chế phòng vệ an toàn dữ liệu
    if (hotProducts.length === 0) return null;

    return (
        <section className="top-selling-section py-5" style={{ backgroundColor: '#fcfcfc', borderTop: '1px solid #eee' }}>
            <div className="container">

                {/* Tiêu đề vùng thiết kế đồng bộ khối trung tâm */}
                <div className="section-heading mb-5 text-center">
                    <h3 className="font-weight-bold text-uppercase" style={{ color: '#005088', letterSpacing: '0.5px' }}>
                        <i className="fas fa-crown mr-2 text-warning"></i> Tác Phẩm Bán Chậy Nhất
                    </h3>
                    <p className="text-muted small m-0 mt-2 font-italic">
                        Những đầu sách tri thức được cộng đồng độc giả đón đọc nhiều nhất tuần qua cùng BookWorld
                    </p>
                    <div className="mx-auto mt-2" style={{ width: '60px', height: '3px', backgroundColor: '#11CAA0' }}></div>
                </div>

                {/* Khung lưới Grid System: Render chính xác 3 cột thành phần */}
                <div className="row">
                    {hotProducts.map((product) => (
                        <div className="col-lg-4 col-md-6 col-12 mb-4" key={product.id}>
                            <div className="position-relative h-100 card-hot-wrapper">

                                {/* Tag Nhãn dán Độc quyền kích thích thị giác mua hàng */}
                                <span className="badge badge-danger position-absolute px-3 py-2 text-uppercase font-weight-bold"
                                    style={{
                                        top: '15px',
                                        left: '25px',
                                        zIndex: 10,
                                        borderRadius: '20px',
                                        fontSize: '11px',
                                        boxShadow: '0 4px 8px rgba(219, 53, 69, 0.3)'
                                    }}
                                >
                                    <i className="fas fa-fire mr-1"></i> Hot Selling
                                </span>

                                {/* Tái sử dụng Component ProductCard con của em để đổ dữ liệu */}
                                <ProductCard item={product} />

                                {/* Hiển thị thông số lượt mua giả lập phục vụ báo cáo thẩm mỹ */}
                                <div className="text-center mt-3 small text-muted font-weight-bold">
                                    <i className="fas fa-shopping-basket mr-1 text-success"></i> Đã bán: {product.id + 17} cuốn
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

export default TopSelling;