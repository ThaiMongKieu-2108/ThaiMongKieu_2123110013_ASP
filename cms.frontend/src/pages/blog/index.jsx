import React, { useState, useEffect } from 'react';
import { blogService } from '../../services/blogService';
import PostCard from '../../components/PostCard'; // Xem lại tên file component PostCard của bạn nhé
import BlogSidebar from './BlogSidebar';
function BlogList() {
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
        <>

            <div className="container py-5">
                <h2
                    className="font-weight-bold mb-4"
                    style={{ color: '#005088' }}
                >
                    CẨM NANG XU HƯỚNG MẶC ĐẸP
                </h2>

                <div className="row">

                    {/* Danh sách bài viết */}
                    <div className="col-lg-9 col-md-8">
                        {loading ? (
                            <div className="text-center py-5">
                                <div
                                    className="spinner-border text-primary"
                                    role="status"
                                ></div>
                            </div>
                        ) : posts.length > 0 ? (
                            <div className="row">
                                {posts.map((post) => (
                                    <div
                                        className="col-lg-6 mb-4"
                                        key={post.id}
                                    >
                                        <PostCard post={post} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="alert alert-warning text-center">
                                Không tìm thấy bài viết nào phù hợp.
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="col-lg-3 col-md-4">
                        <BlogSidebar
                            onSelectCategory={handleSelectCategory}
                        />
                    </div>

                </div>
            </div>

        </>
    );
}

export default BlogList;