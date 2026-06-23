import React, { useState, useEffect } from 'react';
import { blogService } from '../../services/blogService';
import PostCard from '../../components/PostCard';
import BlogSidebar from './BlogSidebar';

function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // 🟢 CÁC STATE PHỤC VỤ PHÂN TRANG BÀI VIẾT
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(4); // Cấu hình hiển thị 4 bài viết trên mỗi trang

    // Chạy đầu tiên để tải toàn bộ bài viết
    useEffect(() => {
        loadAllPosts();
    }, []);

    const loadAllPosts = async () => {
        setLoading(true);
        const data = await blogService.getAllPosts();
        setPosts(data);
        setLoading(false);
    };

    // Hàm nhận sự kiện chọn danh mục từ Sidebar con gửi lên
    const handleSelectCategory = async (categoryId) => {
        setLoading(true);
        setCurrentPage(1); // 🟢 QUAN TRỌNG: Đổi danh mục thì phải đưa số trang về lại trang 1
        if (categoryId === null) {
            await loadAllPosts(); // Nếu click "Tất cả" thì nạp lại toàn bộ
        } else {
            const filteredData = await blogService.getPostsByCategory(categoryId);
            setPosts(filteredData);
        }
        setLoading(false);
    };

    // 🟢 THUẬT TOÁN TÍNH TOÁN PHÂN TRANG ĐỘNG
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost); // Cắt mảng bài viết theo trang

    const totalPages = Math.ceil(posts.length / postsPerPage); // Tính tổng số trang

    // Tạo danh sách các số trang [1, 2, 3...]
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="blog-page-wrapper bg-light min-vh-100">

            {/* 1. KHU VỰC BANNER TIÊU ĐỀ (GIỮA MÀN HÌNH THEO THIẾT KẾ) */}
            <div className="container mt-4">
                <div className="card text-center py-4 px-3 border shadow-sm bg-white" style={{ borderRadius: '8px' }}>
                    <h2 className="font-weight-bold m-0" style={{ color: '#005088', letterSpacing: '1px' }}>
                        TẠP CHÍ NHÀ SÁCH KIEUCMS
                    </h2>
                    <p className="text-muted small m-0 mt-1 font-italic">
                        Cập nhật cẩm nang phối đồ và xu hướng mặc đẹp mới nhất từ các nhà thiết kế
                    </p>
                </div>
            </div>

            {/* 2. KHU VỰC BỐ CỤC CHÍNH (SIDEBAR TRÁI - LIST PHẢI) */}
            <div className="container py-4">
                <div className="row">

                    {/* [Bên Trái]: <BlogSidebar /> chiếm 3 cột (md-4) */}
                    <div className="col-lg-3 col-md-4 mb-4">
                        <BlogSidebar onSelectCategory={handleSelectCategory} />
                    </div>

                    {/* [Bên Phải]: <BlogList /> chiếm 9 cột (md-8) */}
                    <div className="col-lg-9 col-md-8">
                        {loading ? (
                            <div className="text-center py-5 bg-white rounded border shadow-sm">
                                <div className="spinner-border text-primary" role="status"></div>
                                <p className="text-muted mt-2 mb-0 small">Đang tải bài viết bổ ích...</p>
                            </div>
                        ) : currentPosts.length > 0 ? (
                            <>
                                {/* Chỉ render danh sách bài viết thuộc trang hiện tại (currentPosts) */}
                                <div className="row">
                                    {currentPosts.map((post) => (
                                        <div className="col-lg-6 col-md-10 mb-4" key={post.id}>
                                            <PostCard post={post} />
                                        </div>
                                    ))}
                                </div>

                                {/* 🟢 THANH ĐIỀU HƯỚNG PHÂN TRANG (PAGINATION) BẰNG BOOTSTRAP */}
                                {totalPages > 1 && (
                                    <nav className="mt-2 d-flex justify-content-center">
                                        <ul className="pagination pagination-sm shadow-sm">
                                            {/* Nút Quay lại trang trước */}
                                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                                                    <i className="fas fa-angle-left"></i> Trước
                                                </button>
                                            </li>

                                            {/* Map danh sách các số trang */}
                                            {pageNumbers.map(number => (
                                                <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                                                    <button onClick={() => setCurrentPage(number)} className="page-link"
                                                        style={currentPage === number ? { backgroundColor: '#005088', borderColor: '#005088' } : {}}>
                                                        {number}
                                                    </button>
                                                </li>
                                            ))}

                                            {/* Nút Sang trang sau */}
                                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                                <button className="page-link" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
                                                    Sau <i className="fas fa-angle-right"></i>
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                )}
                            </>
                        ) : (
                            <div className="alert alert-warning text-center border-0 shadow-sm py-4">
                                <i className="fas fa-exclamation-triangle mr-2"></i>
                                Không tìm thấy bài viết nào phù hợp trong chủ đề này.
                            </div>
                        )}
                    </div>

                </div>
            </div>

        </div>
    );
}

export default BlogPage;