import React, { useState, useEffect } from 'react';
import orderService from '../services/orderService';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Giả lập ID của khách hàng đang đăng nhập (Thực tế sẽ lấy từ Auth/Session)
    const mockCustomerId = 3;

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                // Gọi API lấy các đơn hàng của khách mã số 1
                const data = await orderService.getOrdersByCustomer(mockCustomerId);
                setOrders(data);
            } catch (error) {
                console.error("Lỗi khi tải lịch sử đơn hàng:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    // Hàm phụ trợ để hiển thị trạng thái bằng các Badge màu sắc của Bootstrap
    const renderStatusBadge = (status) => {
        switch (status) {
            case 0: return <span className="badge badge-warning text-dark">Chờ duyệt</span>;
            case 1: return <span className="badge badge-info text-white">Đang giao</span>;
            case 2: return <span className="badge badge-success text-white">Đã giao xong</span>;
            default: return <span className="badge badge-secondary">Không xác định</span>;
        }
    };

    if (loading) {
        return <div className="text-center my-4 small text-muted">Đang tìm kiếm lịch sử mua hàng...</div>;
    }

    return (
        <div className="card shadow-sm p-4 bg-white rounded">
            <h5 className="card-title text-uppercase font-weight-bold text-dark border-bottom pb-2 mb-3">
                <i className="fa-solid fa-clock-rotate-left mr-2 text-primary"></i> Lịch sử mua hàng
            </h5>

            {orders.length === 0 ? (
                <p className="text-muted small pl-2">Bạn chưa có đơn đặt hàng nào trong hệ thống.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover border small align-middle">
                        <thead className="thead-light">
                            <tr>
                                <th>Mã Đơn</th>
                                <th>Ngày đặt</th>
                                <th>Trạng thái</th>
                                <th>Ghi chú</th>
                                <th className="text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td className="font-weight-bold text-primary">#ORD-{order.id}</td>
                                    <td>{new Date(order.orderDate).toLocaleDateString('vi-VN')}</td>
                                    <td>{renderStatusBadge(order.status)}</td>
                                    <td className="text-truncate text-muted" style={{ maxWidth: '150px' }}>
                                        {order.notes || 'Không có'}
                                    </td>
                                    <td className="text-center">
                                        <button className="btn btn-sm btn-outline-secondary px-3 py-1">
                                            Chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrderList;