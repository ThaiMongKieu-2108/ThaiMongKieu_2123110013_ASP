import React from 'react';
import CategoryProductList from './components/CategoryProductList'; // Hoặc CategoryList tùy bạn đặt tên
import ProductList from './components/ProductList';
import PostList from './components/PostList';
import BlogCategoryList from './components/BlogCategoryList';
import OrderList from './components/OrderList';
import OrderDetailView from './components/OrderDetailView';
import './App.css'; // File chứa các style tùy biến riêng của dự án

function App() {
    return (
        <div className="container mt-5">
            {/* ==================== HEADER ==================== */}
            <header className="pb-3 mb-4 border-bottom d-flex justify-content-between align-items-center">
                <span className="fs-4 font-weight-bold text-dark text-uppercase">
                    👗 Fashion Boutique - Hệ Thống Quản Trị Nội Dung & Bán Hàng
                </span>
                <span className="badge badge-success px-3 py-2 d-none d-md-inline-block">
                    Học Phần Chuyên Đề ASP.NET + ReactJS
                </span>
            </header>

            {/* ==================== KHU VỰC 1: SHOPPING (BÁN HÀNG) ==================== */}
            <div className="row mb-5">
                {/* Cột trái: Bộ lọc danh mục sản phẩm thời trang */}
                <div className="col-md-4 mb-4">
                    <CategoryProductList />
                </div>
                {/* Cột phải: Danh sách sản phẩm thực tế */}
                <div className="col-md-8 mb-4">
                    <h4 className="mb-4 text-uppercase text-secondary font-weight-bold border-bottom pb-2">
                        🛍️ Bộ sưu tập mới nhất
                    </h4>
                    <ProductList />
                </div>
            </div>
            {/* ==================== KHU VỰC ĐƠN HÀNG MỚI THÊM ĐỂ TEST ==================== */}
            <div className="row mb-5">
                {/* Hiển thị bảng danh sách các đơn hàng của bảng Orders */}
                <div className="col-md-7 mb-4">
                    <OrderList />
                </div>
                {/* Hiển thị danh sách các sản phẩm mua cụ thể thuộc bảng OrderDetails */}
                <div className="col-md-5 mb-4">
                    <OrderDetailView orderId={1} />
                </div>
            </div>
            {/* ==================== KHU VỰC 2: BLOG & TIN TỨC (QUẢN TRỊ NỘI DUNG) ==================== */}
            <div className="row mt-5">
                {/* Cột trái: Bộ lọc danh mục bài viết tin tức (Phần bài tập tự làm từ Đoạn 2) */}
                <div className="col-md-4 mb-4">
                    <BlogCategoryList />
                </div>
                {/* Cột phải: Danh sách các bài viết tin tức lấy real-time bằng useEffect */}
                <div className="col-md-8 mb-4">
                    <PostList />
                </div>
            </div>

            {/* ==================== FOOTER ==================== */}
            <footer className="pt-3 mt-5 text-muted border-top text-center small">
                <p>© 2026 - Đồ án thực hành phân tầng ASP.NET Core Web API kết hợp ReactJS Client-side</p>
            </footer>
        </div>
    );
}

export default App;