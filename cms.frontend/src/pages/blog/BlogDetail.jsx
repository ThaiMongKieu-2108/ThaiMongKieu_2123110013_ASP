import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
        <div className="blog-detail-wrapper bg-light py-4 min-vh-100">
            <div className="container">

                {/* 1. THANH BREADCRUMB ĐIỀU HƯỚNG (Góc trên cùng bên trái) */}
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb bg-transparent p-0 mb-0" style={{ fontSize: '14px' }}>
                        <li className="breadcrumb-item">
                            <Link to="/" className="text-decoration-none" style={{ color: '#007bff' }}>Trang Chủ</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="/blog" className="text-decoration-none" style={{ color: '#007bff' }}>Tin tức</Link>
                        </li>
                        <li className="breadcrumb-item active text-muted text-truncate" aria-current="page" style={{ maxWidth: '300px' }}>
                            {post.title}
                        </li>
                    </ol>
                </nav>

                {/* 2. KHỐI NỘI DUNG CHÍNH (Dạng Card có dải màu xanh thương hiệu ở đầu) */}
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="card shadow-sm border-light" style={{ borderRadius: '6px', overflow: 'hidden', borderTop: '4px solid #005088' }}>
                            <div className="card-body p-4 p-md-5 bg-white">

                                {/* Tiêu đề bài viết */}
                                <h2 className="font-weight-bold mb-3 text-lowercase" style={{ color: '#2c3e50', fontSize: '36px', letterSpacing: '-0.5px' }}>
                                    {post.title}
                                </h2>

                                {/* Thanh thông tin Metadata (Ngày, Tác giả, Lượt xem) */}
                                <div className="d-flex flex-wrap text-muted mb-4 pb-3 border-bottom" style={{ fontSize: '13px', gap: '15px' }}>
                                    <span>
                                        <i className="far fa-calendar-alt mr-1"></i>
                                        {post.createdDate ? new Date(post.createdDate).toLocaleDateString('vi-VN') : '2/6/2026'}
                                    </span>
                                    <span>
                                        <i className="far fa-user mr-1"></i> Tác giả: {post.author || 'Biên tập viên KieuCMS'}
                                    </span>
                                    <span>
                                        <i className="far fa-eye mr-1"></i> Lượt xem: {post.views || 525} lượt
                                    </span>
                                </div>

                                {/* NỘI DUNG CHÍNH (Render trực tiếp mã ảnh và chữ) */}
                                <div className="blog-main-article-content text-justify">
                                    {/* Ảnh đại diện nếu có trong object dữ liệu */}
                                    {post.image && (
                                        <div className="text-center mb-4">
                                            <img src={post.image} alt={post.title} className="img-fluid rounded" style={{ maxHeight: '500px', objectFit: 'cover' }} />
                                        </div>
                                    )}

                                    {/* Ruột bài viết */}
                                    <div
                                        className="content-render"
                                        style={{ fontSize: '15px', color: '#4a4a4a', lineHeight: '1.8' }}
                                        dangerouslySetInnerHTML={{ __html: post.content }}
                                    />
                                </div>

                                <hr className="my-4" />

                                {/* CHÂN CARD: Gồm nút quay lại và Mã bản tin */}
                                <div className="d-flex justify-content-between align-items-center">
                                    <button
                                        className="btn btn-light btn-sm text-secondary border px-3"
                                        onClick={() => navigate('/blog')}
                                        style={{ fontSize: '13px', fontWeight: '500' }}
                                    >
                                        <i className="fas fa-chevron-left mr-1"></i> Quay lại mục Tin tức
                                    </button>

                                    <span className="text-muted font-italic" style={{ fontSize: '13px' }}>
                                        Mã bản tin: #{post.code || id || '108'}
                                    </span>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default BlogDetail;