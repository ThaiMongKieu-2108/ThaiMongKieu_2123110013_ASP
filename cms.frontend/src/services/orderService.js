import axiosClient from '../api/axiosClient';

const orderService = {
    // 1. Hàm gửi dữ liệu đặt hàng (Gồm thông tin Đơn hàng + Mảng sản phẩm chi tiết)
    // Sẽ gọi sang API: POST https://localhost:xxxx/api/Orders
    createOrder: (orderData) => {
        const url = '/Orders';
        return axiosClient.post(url, orderData);
    },

    // 2. Hàm lấy danh sách lịch sử đơn hàng của một khách hàng cụ thể
    // Sẽ gọi sang API: GET https://localhost:xxxx/api/Orders/customer/{customerId}
    getOrdersByCustomer: (customerId) => {
        const url = `/Orders/customer/${customerId}`;
        return axiosClient.get(url);
    },

    // 3. Hàm lấy chi tiết của MỘT đơn hàng (Bao gồm các dòng sản phẩm trong bảng OrderDetails)
    // Sẽ gọi sang API: GET https://localhost:xxxx/api/Orders/${orderId}`
    getOrderDetail: (orderId) => {
        const url = `/Orders/${orderId}`;
        return axiosClient.get(url);
    }
};

export default orderService;