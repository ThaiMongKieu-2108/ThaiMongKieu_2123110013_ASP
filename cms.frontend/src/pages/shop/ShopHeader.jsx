import React from 'react';

function ShopHeader({ totalCount, keyword, onSearchChange }) {
    return (
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center pb-3 mb-4 border-bottom">
            {/* Thông báo động số lượng sản phẩm lọc được */}
            <div className="mb-2 mb-sm-0">
                <span className="text-secondary font-weight-bold">
                    Tìm thấy <span className="text-danger">{totalCount}</span> sản phẩm phù hợp
                </span>
            </div>

            {/* Ô tìm kiếm nhanh */}
            <div className="search-box" style={{ maxWidth: '300px', width: '100%' }}>
                <div className="input-group input-group-sm">
                    <input
                        type="text"
                        className="form-control border-right-0"
                        placeholder="Tìm mẫu sản phẩm nhanh..."
                        value={keyword}
                        onChange={(e) => onSearchChange(e.target.value)}
                        style={{ borderRadius: '20px 0 0 20px' }}
                    />
                    <div className="input-group-append">
                        <span className="input-group-text bg-white border-left-0 text-muted" style={{ borderRadius: '0 20px 20px 0' }}>
                            <i className="fas fa-search"></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShopHeader;