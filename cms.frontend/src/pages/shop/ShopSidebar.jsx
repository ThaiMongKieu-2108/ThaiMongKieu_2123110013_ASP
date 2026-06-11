import React, { useState, useEffect } from 'react';
// ĐÃ ĐỒNG BỘ: Import đúng file dịch vụ lấy danh mục sản phẩm của bạn
import categoryProductService from '../../services/categoryProductService';

function ShopSidebar({ onCategoryChange, onPriceChange }) {
    const [categories, setCategories] = useState([]);
    const [activeCatId, setActiveCatId] = useState(null);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    // Hàm gọi API lấy danh mục từ bảng CategoryProduct
    useEffect(() => {
        const loadCategories = async () => {
            try {
                // Gọi chính xác hàm dịch vụ của bạn
                const res = await categoryProductService.getAllCategoryProducts();

                if (res) {
                    // Kiểm tra cấu trúc: Nếu axiosClient của bạn trả về trực tiếp mảng hoặc bọc trong đối tượng .data
                    const categoryList = Array.isArray(res) ? res : (res.data || []);
                    setCategories(categoryList);
                }
            } catch (error) {
                console.error("Lỗi khi kết nối API lấy danh mục sản phẩm:", error);
            }
        };
        loadCategories();
    }, []);

    const handleCategoryClick = (id) => {
        setActiveCatId(id);
        onCategoryChange(id); // Kích hoạt bộ lọc sản phẩm động ở trang Shop cha
    };

    // Hàm kích hoạt lọc giá khi người dùng điền số tiền
    const handleApplyPrice = (e) => {
        e.preventDefault();
        const min = minPrice === '' ? 0 : Number(minPrice);
        const max = maxPrice === '' ? 99999999 : Number(maxPrice);
        onPriceChange({ min, max });
    };

    return (
        <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '12px' }}>
            {/* Bộ lọc danh mục dọc */}
            <h6 className="font-weight-bold text-dark mb-3 pb-2 border-bottom" style={{ letterSpacing: '0.5px' }}>
                DANH MỤC SẢN PHẨM
            </h6>
            <div className="list-group list-group-flush mb-4">
                {/* Nút chọn mặc định: Xem tất cả sản phẩm */}
                <button
                    onClick={() => handleCategoryClick(null)}
                    className={`list-group-item list-group-item-action border-0 px-2 py-2 rounded text-left ${activeCatId === null ? 'font-weight-bold text-white' : 'text-secondary'}`}
                    style={activeCatId === null ? { backgroundColor: '#11CAA0', transition: '0.3s' } : { backgroundColor: 'transparent' }}
                >
                    <i className="fas fa-th-large mr-2"></i> Tất cả sản phẩm
                </button>

                {/* Vòng lặp map() lấy chuẩn xác bảng dữ liệu từ Backend */}
                {categories.map((cat) => (
                    <button
                        key={cat.id} // Khóa chính từ bảng dữ liệu của bạn
                        onClick={() => handleCategoryClick(cat.id)}
                        className={`list-group-item list-group-item-action border-0 px-2 py-2 mt-1 rounded text-left ${activeCatId === cat.id ? 'font-weight-bold text-white' : 'text-secondary'}`}
                        style={activeCatId === cat.id ? { backgroundColor: '#11CAA0', transition: '0.3s' } : { backgroundColor: 'transparent' }}
                    >
                        <i className="fas fa-chevron-right mr-2" style={{ fontSize: '11px', opacity: 0.7 }}></i>
                        {cat.name} {/* Tên danh mục hiển thị (ví dụ: Laptop, Thiết bị âm thanh,...) */}
                    </button>
                ))}
            </div>

            {/* Bộ lọc khoảng giá thông minh */}
            <h6 className="font-weight-bold text-dark mb-3 pb-2 border-bottom" style={{ letterSpacing: '0.5px' }}>
                LỌC THEO GIÁ (VNĐ)
            </h6>
            <form onSubmit={handleApplyPrice}>
                <div className="form-group mb-2">
                    <input
                        type="number"
                        className="form-control form-control-sm"
                        placeholder="Từ giá (Min)"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        style={{ borderRadius: '6px' }}
                    />
                </div>
                <div className="form-group mb-3">
                    <input
                        type="number"
                        className="form-control form-control-sm"
                        placeholder="Đến giá (Max)"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        style={{ borderRadius: '6px' }}
                    />
                </div>
                <button type="submit" className="btn btn-sm btn-block text-white font-weight-bold shadow-sm" style={{ backgroundColor: '#005088', borderRadius: '6px', transition: '0.3s' }}>
                    <i className="fas fa-filter mr-1"></i> Áp dụng mức giá
                </button>
            </form>
        </div>
    );
}

export default ShopSidebar;