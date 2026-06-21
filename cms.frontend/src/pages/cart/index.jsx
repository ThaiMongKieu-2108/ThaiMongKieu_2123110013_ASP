import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import CartTable from './CartTable';

function CartPage() {
    const { cartItems, getCartTotal } = useContext(CartContext);
    const navigate = useNavigate();

    // State lưu danh sách ID sản phẩm được tick chọn (Mặc định chọn tất cả ban đầu)
    const [selectedIds, setSelectedIds] = useState(cartItems.map(item => item.id));

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    // Tính tổng tiền chỉ dựa trên các sản phẩm được tick chọn
    const getSelectedTotal = () => {
        return cartItems
            .filter(item => selectedIds.includes(item.id))
            .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleGoToCheckout = () => {
        if (selectedIds.length === 0) {
            alert('⚠️ Vui lòng tick chọn ít nhất một sản phẩm để tiến hành thanh toán!');
            return;
        }
        // Chuyển hướng và đính kèm trạng thái các ID được chọn sang trang Checkout
        navigate('/checkout', { state: { selectedItemsIds: selectedIds } });
    };

    return (
        <main className="flex-grow-1 bg-light py-5">
            <div className="container">
                <div className="d-flex align-items-center mb-4 pb-2 border-bottom">
                    <h3 className="font-weight-bold m-0" style={{ color: '#005088' }}>
                        <i className="fas fa-shopping-bag mr-3 text-primary"></i>GIỎ HÀNG CỦA BẠN
                    </h3>
                </div>

                {cartItems.length > 0 ? (
                    <div className="row">
                        <div className="col-lg-8 mb-4">
                            {/* Truyền State chọn vào Table con */}
                            <CartTable selectedIds={selectedIds} setSelectedIds={setSelectedIds} />
                        </div>

                        <div className="col-lg-4">
                            <div className="card border-0 shadow-sm p-4 text-dark" style={{ borderRadius: '16px' }}>
                                <h5 className="font-weight-bold pb-2 border-bottom text-secondary small text-uppercase">
                                    Tóm tắt đơn hàng
                                </h5>

                                <div className="d-flex justify-content-between align-items-center my-4 p-3 rounded bg-light">
                                    <span className="font-weight-bold text-muted">Tổng thanh toán ({selectedIds.length} món):</span>
                                    <span className="font-weight-bold text-danger" style={{ fontSize: '22px' }}>
                                        {formatCurrency(getSelectedTotal())}
                                    </span>
                                </div>

                                <button
                                    onClick={handleGoToCheckout}
                                    className="btn btn-block btn-lg text-white font-weight-bold py-3 shadow-sm"
                                    style={{ backgroundColor: '#11CAA0', borderRadius: '50px' }}
                                >
                                    TIẾN HÀNH THANH TOÁN <i className="fas fa-arrow-right ml-2"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-5 bg-white rounded shadow-sm border">
                        <h5>Giỏ hàng trống</h5>
                    </div>
                )}
            </div>
        </main>
    );
}

export default CartPage;