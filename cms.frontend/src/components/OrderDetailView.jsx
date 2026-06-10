import React, { useState, useEffect } from 'react';
import orderService from '../services/orderService';

const OrderDetailView = ({ orderId = 1 }) => { // Mặc định hiển thị thử đơn hàng có ID = 1
    const [orderDetail, setOrderDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                setLoading(true);
                // Gọi API kéo toàn bộ sản phẩm nằm trong đơn hàng này
                const data = await orderService.getOrderDetail(orderId);
                setOrderDetail(data);
            } catch (error) {
                console.error("Lỗi khi tải chi tiết dòng sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderDetail();
    }, [orderId]);

    if (loading) return <div className="text-muted small text-center my-3">Đang nạp bảng chi tiết mặt hàng...</div>;
    if (!orderDetail) return <div className="text-danger small">Không tìm thấy thông tin gói hàng này.</div>;

    // Tính tổng tiền của toàn bộ hóa đơn đơn hàng dựa trên mảng OrderDetails
    const totalInvoicePrice = orderDetail.orderDetails.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);

    return (
        <div className="card shadow-sm border rounded-lg p-4 bg-white mt-4">
            <h6 className="text-uppercase text-secondary font-weight-bold mb-3">
                📦 Sản phẩm thuộc Đơn hàng #ORD-{orderId}
            </h6>

            <div className="list-group list-group-flush">
                {orderDetail.orderDetails.map((detail) => (
                    <div className="list-group-item d-flex justify-content-between align-items-center px-0 py-3 border-bottom" key={detail.id}>
                        <div>
                            {/* Hiển thị tên sản phẩm thông qua định hướng Object liên kết ở Backend */}
                            <p className="font-weight-bold text-dark mb-1 small">{detail.productName || `Mã SP: ${detail.productId}`}</p>
                            <span className="text-muted small">
                                Số lượng: <strong className="text-dark">{detail.quantity}</strong> x {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detail.unitPrice)}
                            </span>
                        </div>
                        {/* Tính thành tiền riêng cho từng dòng mặt hàng */}
                        <span className="font-weight-bold text-dark small">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(detail.quantity * detail.unitPrice)}
                        </span>
                    </div>
                ))}
            </div>

            {/* Khối hiển thị tổng thành tiền lớn ở dưới đáy */}
            <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                <span className="font-weight-bold text-uppercase text-muted small">Tổng tiền thanh toán:</span>
                <h4 className="text-danger font-weight-bold mb-0">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalInvoicePrice)}
                </h4>
            </div>
        </div>
    );
};

export default OrderDetailView;