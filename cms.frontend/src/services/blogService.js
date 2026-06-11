import axios from 'axios';

const API_URL = "https://localhost:7238/api";

export const blogService = {
    // 1. Lấy toàn bộ bài viết tin tức
    getAllPosts: async () => {
        try {
            const response = await axios.get(`${API_URL}/posts`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi gọi API getAllPosts:", error);
            return [];
        }
    },

    // 2. Lấy danh mục tin tức (cho ô Sidebar bên phải)
    getBlogCategories: async () => {
        try {
            const response = await axios.get(`${API_URL}/categories?type=blog`); // tùy thuộc vào cấu hình api của bạn
            return response.data;
        } catch (error) {
            console.error("Lỗi khi gọi API getBlogCategories:", error);
            return [];
        }
    },

    // 3. Lọc bài viết theo ID danh mục
    getPostsByCategory: async (categoryId) => {
        try {
            const response = await axios.get(`${API_URL}/posts/category/${categoryId}`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi lọc bài viết theo danh mục ${categoryId}:`, error);
            return [];
        }
    },

    // 4. Lấy chi tiết 1 bài viết theo ID độc bản
    getPostById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/posts/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi gọi chi tiết bài viết ID ${id}:`, error);
            return null;
        }
    }
};