import React, { useState } from 'react';

// IMPORT ĐỦ CÁC THÀNH PHẦN THEO ĐÚNG THỨ TỰ CẤU TRÚC LAYOUT HỆ THỐNG NHÀ SÁCH
import HeroBanner from './HeroBanner';        // Tầng 2: Banner quảng cáo sách lớn
import CategoryMenu from './CategoryMenu';    // Tầng 3: Menu ngang danh mục nhà sách
import ProductGrid from './ProductGrid';      // Tầng 4: Lưới hiển thị danh sách sách/ebook
import LatestBlog from './LatestBlog';        // Tầng 5: Khối hiển thị bài viết văn hóa đọc

function Home() {
    // 🟢 STATE TRUNG GIAN: Quản lý ID danh mục sách đang được người dùng lựa chọn từ Tầng 3
    const [selectedCategory, setSelectedCategory] = useState(null);

    // Hàm nhận dữ liệu ID danh mục được click từ Component con (CategoryMenu) truyền lên
    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
    };

    return (
        <div className="homepage-container bg-white min-vh-100 d-flex flex-column">

            {/* TẦNG 2: Banner quảng cáo lớn, hình khối trang trí và nút kêu gọi mua sách khơi nguồn tri thức */}
            <HeroBanner />

            {/* TẦNG 3: Menu ngang hiển thị danh mục sản phẩm (Gọi API /api/CategoriesProducts) */}
            {/* Truyền hàm callback xuống để bắt sự kiện click đổi danh mục */}
            <CategoryMenu
                activeCategory={selectedCategory}
                onSelectCategory={handleCategorySelect}
            />

            {/* TẦNG 4: Lưới hiển thị danh sách sách mới hoặc sách lọc theo danh mục (Gọi API /api/Products) */}
            {/* Nhận biến selectedCategory để tự động Re-render cập nhật lại lưới sách */}
            <ProductGrid activeCategoryId={selectedCategory} />

            {/* TẦNG 5: Khối hiển thị các bài viết tin tức tóm tắt sách và kỹ năng xây dựng thói quen đọc (Gọi API /api/Posts) */}
            <LatestBlog />

        </div>
    );
}

export default Home;