import React, { useContext } from 'react';
import { CartContext } from '../../context/CartContext';

function CartTable() {
    const { cartItems, updateQuantity, removeFromCart } = useContext(CartContext);
    const IMAGE_BASE_URL = "https://localhost:7238";

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <div className="table-responsive bg-white rounded shadow-sm border">
            <table className="table table-borderless vertical-align-middle mb-0">
                <thead className="bg-secondary text-white" style={{ backgroundColor: '#005088' }}>
                    <tr>
                        <th scope="col" className="p-3 small font-weight-bold text-uppercase">Sản phẩm</th>
                        <th scope="col" className="p-3 small font-weight-bold text-uppercase text-center">Đơn giá</th>
                        <th scope="col" className="p-3 small font-weight-bold text-uppercase text-center">Số lượng</th>
                        <th scope="col" className="p-3 small font-weight-bold text-uppercase text-center">Thành tiền</th>
                        <th scope="col" className="p-3 small font-weight-bold text-uppercase text-center">Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map((item) => (
                        <tr key={item.id} className="border-bottom">
                            <td className="p-3 d-flex align-items-center">
                                <img
                                    src={`${IMAGE_BASE_URL}${item.imageUrl?.startsWith('/') ? item.imageUrl : '/' + item.imageUrl}`}
                                    alt={item.name}
                                    style={{ width: '60px', height: '60px', objectFit: 'contain' }}
                                    className="rounded border mr-3 bg-light"
                                    onError={(e) => e.target.src = "https://via.placeholder.com/60"}
                                />
                                <span className="font-weight-bold text-dark text-truncate d-inline-block" style={{ maxWidth: '200px' }} title={item.name}>
                                    {item.name}
                                </span>
                            </td>
                            <td className="p-3 text-center font-weight-bold text-secondary">{formatCurrency(item.price)}</td>
                            <td className="p-3 text-center">
                                <div className="input-group input-group-sm justify-content-center m-auto" style={{ width: '100px' }}>
                                    <div className="input-group-prepend">
                                        <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item.id, item.quantity - 1, item.stockQuantity)}>-</button>
                                    </div>
                                    <input type="text" className="form-control text-center font-weight-bold" value={item.quantity} readOnly />
                                    <div className="input-group-append">
                                        <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item.id, item.quantity + 1, item.stockQuantity)}>+</button>
                                    </div>
                                </div>
                            </td>
                            <td className="p-3 text-center font-weight-bold text-danger">{formatCurrency(item.price * item.quantity)}</td>
                            <td className="p-3 text-center">
                                <button onClick={() => removeFromCart(item.id)} className="btn btn-sm btn-link text-muted p-0">
                                    <i className="fas fa-trash-alt text-danger" style={{ fontSize: '16px' }}></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CartTable;