// Import cấu hình axiosClient dùng chung từ thư mục api
import axiosClient from '../api/axiosClient';

const productService = {
    /**
     * 1. Lấy danh sách sản phẩm (Hỗ trợ lọc động nâng cao)
     * Nhận tham số filters từ ReactJS (ví dụ: { categoryProductId: 1, minPrice: 100, keyword: 'váy' })
     * API Endpoint: GET https://localhost:xxxx/api/Products
     */
    getAllProducts: async (filters = {}) => {
        try {
            // Truyền filters vào mục params để Axios tự băm thành Query String (?categoryProductId=1...)
            const response = await axiosClient.get('/Products', { params: filters });
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
    },

    /**
     * 4. Thêm mới một sản phẩm (Dành cho trang Admin / Quản lý)
     * API Endpoint: POST https://localhost:xxxx/api/Products
     */
    createProduct: async (productData) => {
        try {
            const response = await axiosClient.post('/Products', productData);
            return response.data || response;
        } catch (error) {
            console.error("Lỗi API createProduct:", error);
            throw error; // Ném lỗi ra ngoài để Form giao diện bắt được và hiển thị thông báo lỗi (Validation)
        }
    },

    /**
     * 5. Cập nhật thông tin sản phẩm theo ID
     * API Endpoint: PUT https://localhost:xxxx/api/Products/{id}
     */
    updateProduct: async (id, productData) => {
        try {
            const response = await axiosClient.put(`/Products/${id}`, productData);
            return response.data || response;
        } catch (error) {
            console.error(`Lỗi API updateProduct với ID ${id}:`, error);
            throw error;
        }
    },

    /**
     * 6. Xóa sản phẩm theo ID
     * API Endpoint: DELETE https://localhost:xxxx/api/Products/{id}
     */
    deleteProduct: async (id) => {
        try {
            const response = await axiosClient.delete(`/Products/${id}`);
            return response.data || response;
        } catch (error) {
            console.error(`Lỗi API deleteProduct với ID ${id}:`, error);
            throw error;
        }
    }
};

// CRITICAL: Xuất mặc định đối tượng này để file ProductGrid.jsx import vào không bị lỗi 'default was not found'
export default productService;