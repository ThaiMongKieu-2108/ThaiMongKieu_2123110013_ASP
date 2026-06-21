import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';

function CartTable({ selectedIds, setSelectedIds }) {
    const { cartItems, updateQuantity, removeFromCart } = useContext(CartContext);
    const IMAGE_BASE_URL = "https://localhost:7238";

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // Hàm xử lý khi tick chọn hoặc bỏ chọn từng item
    const handleToggleCheck = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(x => x !== id)); // Bỏ chọn
        } else {
            setSelectedIds([...selectedIds, id]); // Chọn thêm
        }
    };

    // Chọn tất cả hoặc bỏ chọn tất cả
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(cartItems.map(item => item.id));
        } else {
            setSelectedIds([]);
        }
    };

    return (
        <div className="table-responsive bg-white rounded shadow-sm" style={{ borderRadius: '16px' }}>
            <table className="table table-borderless vertical-align-middle mb-0">
                <thead style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #edf2f7' }}>
                    <tr>
                        <th scope="col" className="p-3 text-center" style={{ width: '5%' }}>
                            <input
                                type="checkbox"
                                checked={selectedIds.length === cartItems.length}
                                onChange={handleSelectAll}
                            />
                        </th>
                        <th scope="col" className="p-3 text-muted font-weight-bold small text-uppercase">Sản phẩm</th>
                        <th scope="col" className="p-3 text-muted font-weight-bold small text-uppercase text-center">Đơn giá</th>
                        <th scope="col" className="p-3 text-muted font-weight-bold small text-uppercase text-center">Số lượng</th>
                        <th scope="col" className="p-3 text-muted font-weight-bold small text-uppercase text-center">Thành tiền</th>
                        <th scope="col" className="p-3 text-muted font-weight-bold small text-uppercase text-center">Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map((item) => (
                        <tr key={item.id} className="border-bottom border-light align-middle">
                            {/* Ô CHECKBOX CHỈ ĐỊNH */}
                            <td className="p-3 text-center">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(item.id)}
                                    onChange={() => handleToggleCheck(item.id)}
                                />
                            </td>

                            {/* THÔNG TIN SẢN PHẨM */}
                            <td className="p-3 d-flex align-items-center">
                                <div className="product-img-wrapper mr-3 border rounded bg-light p-1" style={{ width: '60px', height: '60px' }}>
                                    <img
                                        src={item.imageUrl ? (item.imageUrl.startsWith('http') ? item.imageUrl : `${IMAGE_BASE_URL}${item.imageUrl}`) : 'https://via.placeholder.com/60'}
                                        alt={item.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
                                    />
                                </div>
                                <span className="font-weight-bold text-dark text-truncate d-inline-block" style={{ maxWidth: '180px' }}>
                                    {item.name}
                                </span>
                            </td>
                            <td className="p-3 text-center font-weight-bold text-secondary">{formatCurrency(item.price)}</td>
                            <td className="p-3 text-center">
                                <div className="input-group input-group-sm justify-content-center m-auto" style={{ width: '100px' }}>
                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item.id, item.quantity - 1, item.stockQuantity)}>-</button>
                                    <input type="text" className="form-control text-center font-weight-bold" value={item.quantity} readOnly />
                                    <button className="btn btn-sm btn-outline-secondary" onClick={() => updateQuantity(item.id, item.quantity + 1, item.stockQuantity)}>+</button>
                                </div>
                            </td>
                            <td className="p-3 text-center font-weight-bold text-danger">{formatCurrency(item.price * item.quantity)}</td>
                            <td className="p-3 text-center">
                                <button onClick={() => removeFromCart(item.id)} className="btn btn-sm text-danger"><i className="fas fa-trash-alt"></i></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CartTable;