import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

function MyOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null); // Lưu thông tin đơn chi tiết khi bấm nút
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);

    // Đọc phiên làm việc của khách hàng từ LocalStorage để lấy ID động
    const customerString = localStorage.getItem('customer');
    const customer = customerString ? JSON.parse(customerString) : null;
    const customerId = customer ? (customer.id || customer.Id) : null;

    // 1. Tải danh sách tất cả các đơn hàng đã đặt của riêng tài khoản này
    useEffect(() => {
        if (!customerId) {
            alert("⚠️ Luồng bảo mật: Vui lòng đăng nhập để xem lịch sử mua hàng!");
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            try {
                setLoading(true);
                const response = await axiosClient.get(`/Orders/customer/${customerId}`);
                // Bọc lót dữ liệu trả về từ Axios
                setOrders(response.data || response || []);
            } catch (error) {
                console.error("Lỗi tải lịch sử đơn hàng:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [customerId, navigate]);

    // 2. Tải chi tiết một đơn hàng cụ thể kèm mảng sản phẩm con
    const handleViewDetail = async (orderId) => {
        try {
            setDetailLoading(true);
            const response = await axiosClient.get(`/Orders/${orderId}`);

            // Ép đọc dữ liệu sạch từ data của Axios gửi về
            const rawData = response.data !== undefined ? response.data : response;
            setSelectedOrder(rawData);
        } catch (error) {
            console.error("Lỗi lấy chi tiết hóa đơn:", error);
            alert("Không thể tải thông tin chi tiết đơn hàng này.");
        } finally {
            setDetailLoading(false);
        }
    };

    // Hàm tiện ích ép định dạng tiền tệ chuẩn Việt Nam (đ)
    const formatVND = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number || 0);
    };

    // Hàm chuyển đổi nhãn trạng thái đơn hàng
    const getStatusLabel = (status) => {
        const statusCode = status ?? 0;
        switch (statusCode) {
            case 0: return <span className="badge badge-warning text-dark py-1 px-2 font-weight-bold">Chờ xử lý</span>;
            case 1: return <span className="badge badge-info py-1 px-2 font-weight-bold">Đang giao</span>;
            case 2: return <span className="badge badge-success py-1 px-2 font-weight-bold">Thành công</span>;
            default: return <span className="badge badge-danger py-1 px-2 font-weight-bold">Đã hủy</span>;
        }
    };

    // Helper kiểm tra an toàn mảng con tránh lỗi crash giao diện khi mapping dữ liệu rỗng
    const getOrderDetailsArray = (order) => {
        if (!order) return [];
        return order.orderDetails || order.OrderDetails || order.data?.orderDetails || order.data?.OrderDetails || [];
    };

    return (
        <div className="my-orders-page bg-light min-vh-100 py-4">
            <div className="container">
                <div className="row">

                    {/* BẢNG BÊN TRÁI: DANH SÁCH ĐƠN HÀNG THỜI TRANG */}
                    <div className={selectedOrder ? "col-md-7 mb-4" : "col-md-12 mb-4"}>
                        <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '15px' }}>
                            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                                <h4 className="font-weight-bold m-0" style={{ color: '#005088' }}>
                                    <i className="fas fa-history mr-2 text-info"></i>Lịch Sử Mua Hàng
                                </h4>
                                <span className="text-muted small">Tài khoản: <strong>{customer?.fullName || customer?.FullName || 'Thành viên'}</strong></span>
                            </div>

                            {loading ? (
                                <div className="text-center py-5 text-muted font-italic">Đang truy vấn kho dữ liệu đơn hàng...</div>
                            ) : orders.length === 0 ? (
                                <div className="text-center py-5 text-secondary font-weight-bold">Bạn chưa có đơn đặt hàng nào trên hệ thống ThaiCMS.</div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="thead-light">
                                            <tr>
                                                <th>Mã Đơn</th>
                                                <th>Ngày Đặt</th>
                                                <th>Trạng Thái</th>
                                                <th className="text-center">Hành Động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order) => {
                                                const oId = order.id || order.Id;
                                                const oDate = order.orderDate || order.OrderDate;
                                                const oStatus = order.status ?? order.Status;

                                                return (
                                                    <tr key={oId} className={selectedOrder && (selectedOrder.id === oId || selectedOrder.Id === oId) ? "table-primary" : ""}>
                                                        <td className="font-weight-bold">#{oId}</td>
                                                        <td>{oDate ? new Date(oDate).toLocaleDateString('vi-VN') : 'N/A'}</td>
                                                        <td>{getStatusLabel(oStatus)}</td>
                                                        <td className="text-center">
                                                            <button
                                                                className="btn btn-sm btn-outline-primary font-weight-bold px-3"
                                                                style={{ borderRadius: '20px' }}
                                                                onClick={() => handleViewDetail(oId)}
                                                            >
                                                                Xem chi tiết
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* VÙNG BÊN PHẢI: CHI TIẾT HÓA ĐƠN KÈM DANH SÁCH SẢN PHẨM MUA */}
                    {selectedOrder && (
                        <div className="col-md-5">
                            <div className="card shadow-sm border-0 p-4 position-sticky" style={{ borderRadius: '15px', top: '20px' }}>
                                <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                                    <h5 className="font-weight-bold m-0 text-success">
                                        <i className="fas fa-file-invoice-dollar mr-2"></i>Chi Tiết Đơn #{selectedOrder.id || selectedOrder.Id}
                                    </h5>
                                    <button className="close text-danger border-0 bg-transparent" style={{ fontSize: '24px', outline: 'none' }} onClick={() => setSelectedOrder(null)}>&times;</button>
                                </div>

                                {detailLoading ? (
                                    <div className="text-center py-5 text-muted">Đang đọc danh sách sản phẩm từ SQL Server...</div>
                                ) : (
                                    <>
                                        {/* Khối hiển thị thông tin chung và bọc lót lỗi Invalid Date */}
                                        <div className="mb-3 small bg-light p-3 rounded" style={{ borderRadius: '10px' }}>
                                            <p className="mb-1">
                                                <strong>Ngày tạo đơn:</strong>{' '}
                                                {selectedOrder.orderDate || selectedOrder.OrderDate
                                                    ? new Date(selectedOrder.orderDate || selectedOrder.OrderDate).toLocaleString('vi-VN')
                                                    : 'Chưa xác định'}
                                            </p>
                                            <p className="mb-0 text-justify">
                                                <strong>Ghi chú đơn:</strong> {selectedOrder.notes || selectedOrder.Notes || 'Không có ghi chú lưu trữ'}
                                            </p>
                                        </div>

                                        {/* Vòng lặp map lôi danh sách sản phẩm con lên giao diện */}
                                        <ul className="list-group mb-3" style={{ maxHeight: '230px', overflowY: 'auto', borderRadius: '10px' }}>
                                            {getOrderDetailsArray(selectedOrder).map((item) => {
                                                const pName = item.productName || item.ProductName || 'Sản phẩm mẫu';
                                                const pQty = item.quantity || item.Quantity || 0;
                                                const pPrice = item.unitPrice || item.UnitPrice || 0;

                                                return (
                                                    <li key={item.id || item.Id} className="list-group-item d-flex justify-content-between align-items-center lh-condensed p-2">
                                                        <div style={{ maxWidth: '70%' }}>
                                                            <h6 className="my-0 small font-weight-bold text-dark text-truncate">{pName}</h6>
                                                            <small className="text-muted d-block mt-0.5">SL: {pQty} x {formatVND(pPrice)}</small>
                                                        </div>
                                                        <span className="text-dark font-weight-bold small">
                                                            {formatVND(pQty * pPrice)}
                                                        </span>
                                                    </li>
                                                );
                                            })}
                                        </ul>

                                        {/* Khối tóm lược tổng tiền thanh toán hóa đơn */}
                                        <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded" style={{ borderRadius: '10px' }}>
                                            <span className="font-weight-bold text-dark small">Tổng tiền thanh toán:</span>
                                            <span className="h5 text-danger font-weight-bold m-0" style={{ letterSpacing: '0.5px' }}>
                                                {formatVND(
                                                    getOrderDetailsArray(selectedOrder).reduce(
                                                        (sum, item) => sum + (item.quantity || item.Quantity || 0) * (item.unitPrice || item.UnitPrice || 0),
                                                        0
                                                    )
                                                )}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default MyOrders;