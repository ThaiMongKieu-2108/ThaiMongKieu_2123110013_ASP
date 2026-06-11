// Import cấu hình axiosClient dùng chung từ thư mục api
import axiosClient from '../api/axiosClient';

const productService = {
    /**
     * 1. Lấy danh sách toàn bộ sản phẩm thời trang (hoặc theo bộ lọc)
     * API Endpoint: GET https://localhost:xxxx/api/Products
     */
    getAllProducts: async () => {
        try {
            // Thực hiện gọi API GET để lấy danh sách sản phẩm
            const response = await axiosClient.get('/Products');

            // Trả về mảng dữ liệu sản phẩm
            return response.data || response;
        } catch (error) {
            console.error("Lỗi API getAllProducts:", error);
            return []; // Trả về mảng rỗng để giao diện không bị sập nếu lỗi mạng
        }
    },

    /**
     * 2. Lấy danh mục sản phẩm (Cho cột ShopSidebar bên trái)
     * API Endpoint: GET https://localhost:xxxx/api/Categories?type=product
     */
    getProductCategories: async () => {
        try {
            // Thực hiện gọi API lấy danh mục, truyền query type=product nếu cần phân biệt với blog
            const response = await axiosClient.get('/Categories?type=product');
            return response.data || response;
        } catch (error) {
            console.error("Lỗi API getProductCategories:", error);
            return [];
        }
    },

    /**
     * 3. Lấy thông tin chi tiết của một sản phẩm theo ID
     * API Endpoint: GET https://localhost:xxxx/api/Products/{id}
     */
    getProductById: async (id) => {
        try {
            const response = await axiosClient.get(`/Products/${id}`);
            return response.data || response;
        } catch (error) {
            console.error(`Lỗi API getProductById với ID ${id}:`, error);
            return null;
        }
    }
};

// CRITICAL: Xuất mặc định đối tượng này để file ProductGrid.jsx import vào không bị lỗi 'default was not found'
export default productService;