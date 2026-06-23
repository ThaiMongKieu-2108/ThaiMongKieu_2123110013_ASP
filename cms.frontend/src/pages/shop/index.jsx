import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import ShopSidebar from './ShopSidebar';
import ShopHeader from './ShopHeader';
import ProductList from './ProductList';
import LoadingOrEmpty from './LoadingOrEmpty';

function Shop() {
    // State 1: Lưu trữ mảng danh sách sản phẩm đổ ra giao diện
    const [products, setProducts] = useState([]);

    // State 2: Quản lý trạng thái chờ mạng (UX hiệu ứng xoay)
    const [isLoading, setIsLoading] = useState(true);

    // State 3: Khối quản lý tập trung toàn bộ tiêu chí lọc từ database
    const [filters, setFilters] = useState({
        categoryProductId: null,   // Mặc định null là lấy tất cả danh mục
        minPrice: '',       // Để trống nghĩa là không giới hạn sàn giá
        maxPrice: '',       // Để trống nghĩa là không giới hạn trần giá
        keyword: ''         // Từ khóa tìm kiếm rỗng
    });

    // 🟢 STATE 4: QUẢN LÝ PHÂN TRANG SẢN PHẨM (PAGINATION)
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(6); // Cấu hình hiển thị cố định 6 cuốn sách trên 1 trang

    // useEffect theo dõi biến [filters]. Cứ khi nào 1 trong các ô lọc thay đổi -> API tự gọi ngầm
    useEffect(() => {
        const fetchFilterProducts = async () => {
            try {
                setIsLoading(true); // Bật hiệu ứng chờ mạng
                // Gửi cụm đối tượng filters xuống API Backend C#
                const response = await productService.getAllProducts(filters);
                setProducts(response.data || response); // Cập nhật mảng sản phẩm mới
            } catch (error) {
                console.error("Lỗi gọi API lọc sản phẩm:", error);
            } finally {
                setIsLoading(false); // Tắt hiệu ứng chờ mạng
            }
        };
        fetchFilterProducts();
    }, [filters]);

    // Hàm CallBack nhận sự kiện thay đổi bộ lọc từ các component con gửi lên
    const handleFilterUpdate = (newFields) => {
        // 🟢 QUAN TRỌNG: Đưa trạng thái trang về lại trang 1 khi các tiêu chí lọc thay đổi
        setCurrentPage(1);
        setFilters(prev => ({
            ...prev,
            ...newFields // Gộp đè các trường lọc mới vào trạng thái cũ
        }));
    };

    // 🟢 THUẬT TOÁN TÍNH TOÁN PHÂN TRANG SẢN PHẨM (CLIENT-SIDE)
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    // Cắt nhỏ mảng sản phẩm gốc để chỉ lấy đúng 6 sản phẩm thuộc trang hiện tại
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    // Tính tổng số trang dựa trên kết quả lọc thực tế
    const totalPages = Math.ceil(products.length / productsPerPage);

    // Tạo mảng số trang để kết xuất ra giao diện thanh bấm [1, 2, 3...]
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="container py-4">
            <div className="row">
                {/* CỘT TRÁI (3/12): Khu vực chứa bộ lọc dọc */}
                <aside className="col-md-3 mb-4">
                    <ShopSidebar
                        activeCategory={filters.categoryProductId}
                        minPrice={filters.minPrice}
                        maxPrice={filters.maxPrice}
                        onFilterChange={handleFilterUpdate}
                    />
                </aside>

                {/* CỘT PHẢI (9/12): Khu vực chứa thanh Search và Lưới hàng hóa */}
                <main className="col-md-9">
                    <ShopHeader
                        total={products.length}
                        keyword={filters.keyword}
                        onSearchChange={handleFilterUpdate}
                    />

                    {/* Kiểm soát UX qua LoadingOrEmpty trước khi render danh sách sản phẩm phân trang */}
                    <LoadingOrEmpty isLoading={isLoading} totalItems={products.length}>
                        {/* Truyền mảng đã phân trang (currentProducts) thay vì mảng gốc (products) */}
                        <ProductList products={currentProducts} />
                    </LoadingOrEmpty>

                    {/* 🟢 THANH ĐIỀU HƯỚNG PHÂN TRANG BOOTSTRAP (PAGINATION BAR) */}
                    {!isLoading && totalPages > 1 && (
                        <nav className="mt-4 d-flex justify-content-center">
                            <ul className="pagination pagination-sm shadow-sm">
                                {/* Nút điều hướng về trang trước */}
                                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                                        <i className="fas fa-chevron-left mr-1"></i> Trước
                                    </button>
                                </li>

                                {/* Render danh sách các số trang */}
                                {pageNumbers.map(number => (
                                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                        <button onClick={() => setCurrentPage(number)} className="page-link"
                                            style={currentPage === number ? { backgroundColor: '#005088', borderColor: '#005088' } : {}}>
                                            {number}
                                        </button>
                                    </li>
                                ))}

                                {/* Nút điều hướng sang trang sau */}
                                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
                                        Sau <i className="fas fa-chevron-right ml-1"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Shop;