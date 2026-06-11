import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import ProductCard from '../../components/ProductCard';
import ShopSidebar from './ShopSidebar';
import ShopHeader from './ShopHeader';

// IMPORT BẮT BUỘC: Gọi lại Header và Footer để bọc cấu trúc Layout trang cửa hàng

function Shop() {
    const [originalProducts, setOriginalProducts] = useState([]); // Lưu mảng gốc từ API
    const [filteredProducts, setFilteredProducts] = useState([]); // Lưu mảng sau khi lọc
    const [loading, setLoading] = useState(true);

    // Các trạng thái bộ lọc (Filter States)
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 99999999 });
    const [searchKeyword, setSearchKeyword] = useState('');

    // Bước 1: Nạp dữ liệu sản phẩm ban đầu từ server
    useEffect(() => {
        const fetchInitialData = async () => {
            setLoading(true);
            const data = await productService.getAllProducts();

            // Ép dữ liệu về mảng để tránh lỗi crash nếu API bọc trong object .data hoặc .items
            const productList = Array.isArray(data) ? data : (data?.data || data?.items || []);
            setOriginalProducts(productList);
            setFilteredProducts(productList);
            setLoading(false);
        };
        fetchInitialData();
    }, []);

    // Bước 2: Thuật toán lọc dữ liệu thời gian thực đan xen nhiều điều kiện
    useEffect(() => {
        let result = [...originalProducts];

        // 1. LỌC THEO DANH MỤC SẢN PHẨM (Đã sửa lỗi không bắt được ID)
        if (selectedCategory !== null) {
            result = result.filter(p => {
                // Thuật toán quét tất cả các cách đặt tên biến ID danh mục từ Backend trả về
                const pCategoryId = p.categoryId ?? p.maDM ?? p.categoryProductId ?? p.maDanhMuc ?? p.categoryProduct?.id;

                // Ép hai giá trị về chuỗi (String) để tránh lệch kiểu dữ liệu (ví dụ: số 1 so với chuỗi "1")
                return String(pCategoryId) === String(selectedCategory);
            });
        }

        // 2. Lọc theo khoảng giá Min - Max khách nhập vào
        result = result.filter(p => p.price >= priceRange.min && p.price <= priceRange.max);

        // 3. Lọc theo ô tìm kiếm nhanh (Không phân biệt chữ hoa chữ thường)
        if (searchKeyword.trim() !== '') {
            result = result.filter(p =>
                p.name.toLowerCase().includes(searchKeyword.toLowerCase())
            );
        }

        setFilteredProducts(result);
    }, [selectedCategory, priceRange, searchKeyword, originalProducts]);

    return (
        <>

            {/* 2. KHU VỰC NỘI DUNG CHÍNH CỦA TRANG CỬA HÀNG */}
            <main className="flex-grow-1 bg-light py-4">
                <div className="container">
                    <div className="row">
                        {/* CỘT TRÁI (col-md-3): Bộ lọc Sidebar danh mục và khoảng giá */}
                        <div className="col-md-3 mb-4">
                            <ShopSidebar
                                onCategoryChange={setSelectedCategory}
                                onPriceChange={setPriceRange}
                            />
                        </div>

                        {/* CỘT PHẢI (col-md-9): Khu vực hiển thị lưới sản phẩm */}
                        <div className="col-md-9">
                            {/* Header phụ: Ô tìm kiếm và bộ đếm số lượng */}
                            <ShopHeader
                                totalCount={filteredProducts.length}
                                keyword={searchKeyword}
                                onSearchChange={setSearchKeyword}
                            />

                            {/* Điều khiển hiển thị UX bằng Component LoadingOrEmpty */}
                            {loading ? (
                                <div className="text-center py-5 bg-white rounded shadow-sm border">
                                    <div className="spinner-border text-primary" role="status"></div>
                                    <p className="text-muted mt-2">Đang tải sản phẩm từ hệ thống...</p>
                                </div>
                            ) : filteredProducts.length > 0 ? (
                                // Lưới hiển thị danh sách sản phẩm
                                <div className="row">
                                    {filteredProducts.map((product) => (
                                        <div className="col-lg-4 col-sm-6 mb-4" key={product.id}>
                                            <ProductCard item={product} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                // Trạng thái Empty trống rỗng khi không lọc được sản phẩm
                                <div className="text-center py-5 my-2 bg-white rounded shadow-sm border">
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/5058/5058401.png"
                                        alt="Empty"
                                        style={{ width: '80px', opacity: 0.5 }}
                                        className="mb-3"
                                    />
                                    <h5 className="font-weight-bold text-secondary">KHÔNG TÌM THẤY SẢN PHẨM PHÙ HỢP</h5>
                                    <p className="text-muted small mb-0">Vui lòng điều chỉnh lại bộ lọc giá hoặc từ khóa tìm kiếm.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

        </>
    );
}

export default Shop;