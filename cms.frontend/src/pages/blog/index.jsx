import React, { useState, useEffect } from 'react';
import { blogService } from '../../services/blogService';
import PostCard from '../../components/PostCard';
import BlogSidebar from './BlogSidebar';

function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

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
        if (categoryId === null) {
            await loadAllPosts(); // Nếu click "Tất cả" thì nạp lại toàn bộ
        } else {
            const filteredData = await blogService.getPostsByCategory(categoryId);
            setPosts(filteredData);
        }
        setLoading(false);
    };

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
                        ) : posts.length > 0 ? (
                            <div className="row">
                                {posts.map((post) => (
                                    <div className="col-lg-6 col-md-10 mb-4" key={post.id}>
                                        <PostCard post={post} />
                                    </div>
                                ))}
                            </div>
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