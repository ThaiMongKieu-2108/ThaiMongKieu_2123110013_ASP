import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { blogService } from '../../services/blogService';

function BlogDetail() {
    const { id } = useParams(); // Bóc tách lấy ID từ URL bài viết
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPostDetail = async () => {
            setLoading(true);
            const data = await blogService.getPostById(id);
            if (data) {
                setPost(data);
            } else {
                console.error("Không tìm thấy dữ liệu bài viết!");
            }
            setLoading(false);
        };
        fetchPostDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="text-center py-5 my-5">
                <div className="spinner-border text-success" role="status"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container text-center py-5">
                <div className="alert alert-danger">Bài viết không tồn tại hoặc đã bị gỡ bỏ.</div>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/blog')}>Quay lại Blog</button>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-9">
                    {/* Nút quay lại nhanh */}
                    <button className="btn btn-link text-decoration-none p-0 mb-3" onClick={() => navigate('/blog')} style={{ color: '#11CAA0' }}>
                        <i className="fas fa-arrow-left mr-1"></i> Quay lại danh sách tin tức
                    </button>

                    {/* Tiêu đề & Ngày đăng */}
                    <h1 className="font-weight-bold mb-2" style={{ color: '#005088', fontSize: '32px' }}>{post.title}</h1>
                    <div className="text-muted mb-4" style={{ fontSize: '13px' }}>
                        <i className="far fa-calendar-alt mr-1"></i>
                        Đăng ngày: {post.createdDate ? new Date(post.createdDate).toLocaleDateString('vi-VN') : 'Không rõ'}
                    </div>

                    {/* Đoạn tóm tắt mở đầu */}
                    {post.summary && (
                        <blockquote className="blockquote p-3 bg-light border-left" style={{ borderLeftWidth: '4px', borderLeftColor: '#11CAA0', fontSize: '16px', fontStyle: 'italic' }}>
                            {post.summary}
                        </blockquote>
                    )}

                    {/* NỘI DUNG CHÍNH (Biên dịch HTML từ CKEditor bằng dangerouslySetInnerHTML) */}
                    <div
                        className="blog-detail-content mt-4 text-justify lh-lg"
                        style={{ fontSize: '16px', color: '#333333' }}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </div>
            </div>
        </div>
    );
}

export default BlogDetail;