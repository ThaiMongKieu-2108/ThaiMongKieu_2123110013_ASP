import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import axiosClient from '../../api/axiosClient';

function CheckoutPage() {
    // Lấy hàm 'removeFromCart' từ CartContext để xóa sản phẩm được chọn sau khi mua
    const { cartItems, removeFromCart } = useContext(CartContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [customer, setCustomer] = useState(null);
    const [shippingAddress, setShippingAddress] = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);

    // Lấy danh sách ID sản phẩm được chỉ định. Nếu không có (do đi trực tiếp), mặc định lấy toàn bộ giỏ hàng
    const selectedItemsIds = location.state?.selectedItemsIds || cartItems.map(item => item.id || item.Id);

    // Lọc ra những sản phẩm được chỉ định thanh toán
    const checkoutItems = cartItems.filter(item => selectedItemsIds.includes(item.id || item.Id));

    useEffect(() => {
        const savedCustomer = localStorage.getItem('customer');
        if (!savedCustomer) {
            alert('⚠️ Luồng bảo mật: Vui lòng đăng nhập tài khoản trước khi thực hiện thanh toán đơn hàng!');
            navigate('/login');
        } else {
            const customerObj = JSON.parse(savedCustomer);
            setCustomer(customerObj);
            setShippingAddress(customerObj.address || customerObj.Address || '');
        }
    }, [navigate]);

    // Tính tổng tiền riêng cho các mặt hàng được chọn mua
    const getCheckoutTotal = () => {
        return checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        // 1. Kiểm tra danh sách mua chỉ định
        if (checkoutItems.length === 0) {
            alert('⚠️ Không có sản phẩm nào được chỉ định thanh toán trong đơn hàng.');
            return;
        }

        // 2. Kiểm tra địa chỉ nhận hàng
        if (!shippingAddress.trim()) {
            alert('⚠️ VUI LÒNG ĐIỀN ĐẦY ĐỦ: Địa chỉ nhận hàng không được để trống!');
            return;
        }

        // 3. Rào điều kiện số điện thoại khắt khe
        const phoneInput = customer?.phone || customer?.Phone || '';

        if (!phoneInput || !phoneInput.trim()) {
            alert('⚠️ VUI LÒNG CẬP NHẬT: Số điện thoại liên hệ không được để trống!');
            return;
        }

        // Kiểm tra định dạng số điện thoại Việt Nam chuẩn
        const phoneRegex = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
        if (!phoneRegex.test(phoneInput.trim())) {
            alert('⚠️ ĐỊNH DẠNG SAI: Số điện thoại không hợp lệ (Phải đúng định dạng 10 số chuẩn VN)!');
            return;
        }

        try {
            setLoading(true);

            // 🟢 ĐÃ SỬA: Dựng cấu trúc DTO Payload sạch và lấy đúng ID sản phẩm bất kể hoa thường
            const orderPayload = {
                CustomerId: Number(customer.id || customer.Id),
                Notes: `[SĐT: ${phoneInput.trim()}] - [ĐC: ${shippingAddress.trim()}] - Ghi chú: ${note.trim() || 'Không có'}`,
                CartItems: checkoutItems.map(item => ({
                    ProductId: Number(item.id || item.Id || item.productId || item.ProductId),
                    Quantity: Number(item.quantity || item.Quantity)
                }))
            };

            const response = await axiosClient.post('/Orders', orderPayload);
            alert(response.data?.message || '🎉 Đặt hàng thành công các sản phẩm đã chọn!');

            // Chỉ xóa các sản phẩm vừa mua thành công ra khỏi giỏ hàng
            selectedItemsIds.forEach(id => {
                removeFromCart(id);
            });

            // Chuyển hướng về trang lịch sử đơn hàng
            navigate('/my-orders');
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || 'Có lỗi xảy ra khi xử lý trừ kho Backend.';
            alert(`⛔ THẤT BẠI: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    if (!customer) return null;

    return (
        <>
            <main className="flex-grow-1 bg-light py-5">
                <div className="container">
                    <h3 className="font-weight-bold mb-4" style={{ color: '#005088' }}>THÔNG TIN GIAO HÀNG & THANH TOÁN</h3>
                    <div className="row">

                        {/* Cột trái: Form nhập thông tin nhận hàng */}
                        <div className="col-md-6 mb-4">
                            <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '12px' }}>
                                <h5 className="font-weight-bold pb-2 border-bottom mb-3 text-secondary">Người nhận hàng</h5>

                                <div className="form-group mb-3">
                                    <label className="small font-weight-bold text-muted">Họ và tên khách hàng</label>
                                    <input type="text" className="form-control bg-light" value={customer.fullName || customer.FullName || ''} readOnly />
                                </div>

                                <div className="form-group mb-3">
                                    <label className="small font-weight-bold text-muted">Số điện thoại liên hệ *</label>
                                    <input
                                        type="text"
                                        className={`form-control ${!(customer.phone || customer.Phone) ? 'border-danger bg-white' : 'bg-light'}`}
                                        value={customer.phone || customer.Phone || ''}
                                        readOnly
                                    />
                                    {!(customer.phone || customer.Phone) && (
                                        <small className="text-danger font-italic mt-1 d-block">Lưu ý: Bạn cần cập nhật số điện thoại tài khoản để đặt hàng.</small>
                                    )}
                                </div>

                                <div className="form-group mb-3">
                                    <label className="small font-weight-bold text-muted">Địa chỉ nhận hàng (Bắt buộc điền) *</label>
                                    <textarea
                                        className={`form-control ${!shippingAddress.trim() ? 'border-danger' : ''}`}
                                        rows="3"
                                        value={shippingAddress}
                                        onChange={(e) => setShippingAddress(e.target.value)}
                                        placeholder="Nhập địa chỉ giao hàng cụ thể để shipper tìm kiếm..."
                                        required
                                    ></textarea>
                                    {!shippingAddress.trim() && (
                                        <small className="text-danger font-italic mt-1 d-block">Trường dữ liệu này không được phép bỏ trống.</small>
                                    )}
                                </div>

                                <div className="form-group mb-0">
                                    <label className="small font-weight-bold text-muted">Ghi chú đơn hàng (Tùy chọn)</label>
                                    <input type="text" className="form-control" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..." />
                                </div>
                            </div>
                        </div>

                        {/* Cột phải: Xem lại tóm tắt tệp hàng */}
                        <div className="col-md-6">
                            <div className="card border-0 shadow-sm p-4 bg-white" style={{ borderRadius: '12px' }}>
                                <h5 className="font-weight-bold pb-2 border-bottom mb-3 text-secondary">Tóm tắt đơn hàng ({checkoutItems.length})</h5>
                                <div className="order-summary-list mb-3" style={{ maxHeight: '240px', overflowY: 'auto' }}>
                                    {checkoutItems.map(item => (
                                        <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom border-light" key={item.id || item.Id}>
                                            <div className="small text-truncate" style={{ maxWidth: '250px' }}>
                                                <span className="font-weight-bold text-dark">{item.name}</span>
                                                <div className="text-muted">Số lượng: {item.quantity}</div>
                                            </div>
                                            <span className="small font-weight-bold text-secondary">{formatCurrency(item.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="d-flex justify-content-between pt-2 border-top">
                                    <h5 className="font-weight-bold text-dark">Thành tiền:</h5>
                                    <h4 className="font-weight-bold text-danger">{formatCurrency(getCheckoutTotal())}</h4>
                                </div>
                                <button
                                    onClick={handlePlaceOrder}
                                    className="btn btn-lg btn-block text-white font-weight-bold mt-4"
                                    style={{ backgroundColor: '#11CAA0', borderRadius: '30px' }}
                                    disabled={loading || checkoutItems.length === 0}
                                >
                                    {loading ? 'ĐANG GỬI ĐƠN HÀNG...' : 'XÁC NHẬN ĐẶT HÀNG'}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </>
    );
}

export default CheckoutPage;