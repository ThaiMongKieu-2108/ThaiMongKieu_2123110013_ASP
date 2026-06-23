import React, { useState, useEffect } from 'react';
// Import dịch vụ gọi API danh mục sản phẩm đã thiết lập ở Buổi 7
import categoryProductService from '../../services/categoryProductService';

function CategoryMenu({ activeCategory = null, onSelectCategory }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMenuCategories = async () => {
            try {
                setLoading(true);
                const data = await categoryProductService.getAllCategoryProducts();
                setCategories(data);
            } catch (error) {
                console.error("Lỗi khi kéo danh mục sản phẩm từ Backend:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMenuCategories();
    }, []);

    const handleCategoryClick = (id) => {
        if (onSelectCategory) {
            onSelectCategory(id);
        }
    };

    if (loading) {
        return (
            <div className="container my-3 text-center">
                <div className="spinner-border spinner-border-sm text-info" role="status"></div>
                <span className="ml-2 text-muted" style={{ fontSize: '14px' }}>Đang nạp menu phân loại...</span>
            </div>
        );
    }

    return (
        <section id="category-menu-section" className="category-menu-wrapper my-4">
            <div className="container">
                {/* THIẾT KẾ GRID MỚI: Sử dụng Flexbox để căn đều các khối tròn danh mục */}
                <div className="d-flex flex-wrap justify-content-center align-items-center" style={{ gap: '30px' }}>

                    {/* KHỐI TRÒN 1: TẤT CẢ SẢN PHẨM (Dùng Icon hệ thống làm đại diện) */}
                    <div
                        className="category-circle-item text-center"
                        style={{ cursor: 'pointer', width: '110px' }}
                        onClick={() => handleCategoryClick(null)}
                    >
                        <div
                            className={`circle-img-wrapper d-flex align-items-center justify-content-center mx-auto mb-2 shadow-sm`}
                            style={{
                                width: '90px',
                                height: '90px',
                                borderRadius: '50%',
                                backgroundColor: activeCategory === null ? '#005088' : '#f8f9fa',
                                color: activeCategory === null ? '#ffffff' : '#005088',
                                border: activeCategory === null ? '3px solid #11CAA0' : '2px solid #e9ecef',
                                fontSize: '24px',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            <i className="fas fa-book-open"></i>
                        </div>
                        <span
                            className="d-block text-truncate font-weight-bold"
                            style={{ fontSize: '13px', color: activeCategory === null ? '#005088' : '#495057' }}
                        >
                            Tất cả sách
                        </span>
                    </div>

                    {/* VÒNG LẶP ĐỘNG KHỐI TRÒN CHỨA ẢNH ĐẠI DIỆN LẤY TRỰC TIẾP TỪ DATABASE */}
                    {categories.map((cat) => {
                        const isSelected = activeCategory === cat.id;

                        // 🟢 TỰ ĐỘNG KIỂM TRA BIẾN (Chấp nhận cả chữ hoa chữ thường trả về từ API)
                        const dbImageUrl = cat.imageUrl || cat.ImageUrl || "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=150&h=150&q=80";

                        return (
                            <div
                                className="category-circle-item text-center"
                                style={{ cursor: 'pointer', width: '110px' }}
                                key={cat.id}
                                onClick={() => handleCategoryClick(cat.id)}
                            >
                                <div
                                    className="circle-img-wrapper mx-auto mb-2 shadow-sm"
                                    style={{
                                        width: '90px',
                                        height: '90px',
                                        borderRadius: '50%',
                                        overflow: 'hidden',
                                        border: isSelected ? '3px solid #11CAA0' : '2px solid #e9ecef',
                                        transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <img
                                        src={dbImageUrl} // 🟢 Đổ trực tiếp dữ liệu link từ SQL Server
                                        alt={cat.name}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            filter: isSelected ? 'grayscale(0%)' : 'grayscale(20%)'
                                        }}
                                    />
                                </div>
                                <span
                                    className="d-block font-weight-bold text-truncate"
                                    style={{
                                        fontSize: '13px',
                                        color: isSelected ? '#11CAA0' : '#495057'
                                    }}
                                >
                                    {cat.name}
                                </span>
                            </div>
                        );
                    })}

                </div>
            </div>
        </section>
    );
}

export default CategoryMenu;