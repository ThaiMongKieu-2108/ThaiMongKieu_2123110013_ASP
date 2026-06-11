import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import CartTable from './CartTable';

function CartPage() {
    const { cartItems, getCartTotal } = useContext(CartContext);
    const navigate = useNavigate();

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    return (
        <>
            <main className="flex-grow-1 bg-light py-5">
                <div className="container">
                    <h3 className="font-weight-bold mb-4" style={{ color: '#005088' }}>GIỎ HÀNG CỦA BẠN</h3>

                    {cartItems.length > 0 ? (
                        <div className="row">
                            {/* Cột trái: Bảng danh sách sản phẩm */}
                            <div className="col-lg-8 mb-4">
                                <CartTable />
                            </div>

                            {/* Cột phải: Khung tính tiền tóm tắt */}
                            <div className="col-lg-4">
                                <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '12px' }}>
                                    <h5 className="font-weight-bold pb-2 border-bottom text-secondary">TÓM TẮT ĐƠN HÀNG</h5>
                                    <div className="d-flex justify-content-between my-3">
                                        <span className="font-weight-bold text-dark" style={{ fontSize: '16px' }}>Tổng tiền thanh toán:</span>
                                        <span className="font-weight-bold text-danger" style={{ fontSize: '20px' }}>{formatCurrency(getCartTotal())}</span>
                                    </div>
                                    <button
                                        onClick={() => navigate('/checkout')}
                                        className="btn btn-block text-white font-weight-bold py-2.5"
                                        style={{ backgroundColor: '#11CAA0', borderRadius: '30px' }}
                                    >
                                        TIẾN HÀNH THANH TOÁN <i className="fas fa-long-arrow-alt-right ml-2"></i>
                                    </button>
                                    <button onClick={() => navigate('/shop')} className="btn btn-block btn-outline-secondary btn-sm mt-2 border-0">
                                        Tiếp tục mua sắm
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-5 bg-white rounded shadow-sm border">
                            <img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" alt="Empty Cart" style={{ width: '100px', opacity: 0.5 }} className="mb-3" />
                            <h5 className="font-weight-bold text-secondary">Giỏ hàng của bạn đang trống rỗng</h5>
                            <button onClick={() => navigate('/shop')} className="btn btn-sm text-white font-weight-bold mt-3 px-4" style={{ backgroundColor: '#005088', borderRadius: '20px' }}>
                                MUA SẮM NGAY
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}

export default CartPage;