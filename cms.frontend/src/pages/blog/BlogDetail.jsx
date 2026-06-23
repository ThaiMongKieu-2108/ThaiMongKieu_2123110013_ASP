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
            try {
                setLoading(true);
                const data = await blogService.getPostById(id);
                if (data) {
                    setPost(data);
                } else {
                    console.error("Không tìm thấy dữ liệu bài viết!");
                }
            } catch (error) {
                console.error("Lỗi hệ thống khi tải chi tiết bài viết:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPostDetail();
    }, [id]);

    if (loading) {
        return (
            <div className="text-center py-5 my-5">
                <div className="spinner-border text-info" role="status"></div>
                <div className="text-muted small mt-2">Đang nạp nội dung bài viết...</div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container text-center py-5">
                <div className="alert alert-danger">Bài viết không tồn tại hoặc đã bị gỡ bỏ khỏi hệ thống.</div>
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/blog')}>Quay lại mục Tin tức</button>
            </div>
        );
    }

    // Tự động kiểm tra thuộc tính ảnh bìa trả về từ SQL Server
    const mainThumbnail = post.imageUrl || post.ImageUrl || post.image;

    return (
        <div className="blog-detail-wrapper bg-light py-4 min-vh-100">
            <div className="container">

                {/* 1. THANH BREADCRUMB ĐIỀU HƯỚNG */}
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb bg-transparent p-0 mb-0" style={{ fontSize: '14px' }}>
                        <li className="breadcrumb-item">
                            <Link to="/" className="text-decoration-none" style={{ color: '#005088' }}>Trang Chủ</Link>
                        </li>
                        <li className="breadcrumb-item">
                            <Link to="/blog" className="text-decoration-none" style={{ color: '#005088' }}>Tạp chí & Văn hóa đọc</Link>
                        </li>
                        <li className="breadcrumb-item active text-muted text-truncate" aria-current="page" style={{ maxWidth: '400px' }}>
                            {post.title}
                        </li>
                    </ol>
                </nav>

                {/* 2. KHỐI NỘI DUNG CHÍNH ĐỔ BÓNG CAO CẤP */}
                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        <div className="card shadow-sm border-0" style={{ borderRadius: '8px', overflow: 'hidden', borderTop: '4px solid #005088' }}>
                            <div className="card-body p-4 p-md-5 bg-white">

                                {/* Tiêu đề bài viết (Đã loại bỏ class ép chữ thường text-lowercase) */}
                                <h1 className="font-weight-bold mb-3" style={{ color: '#2c3e50', fontSize: '32px', lineHeight: '1.3' }}>
                                    {post.title}
                                </h1>

                                {/* Thanh thông tin Metadata hệ thống */}
                                <div className="d-flex flex-wrap text-muted mb-4 pb-3 border-bottom" style={{ fontSize: '13px', gap: '15px' }}>
                                    <span>
                                        <i className="far fa-calendar-alt mr-1 text-info"></i>
                                        {post.createdDate ? new Date(post.createdDate).toLocaleDateString('vi-VN') : '23/06/2026'}
                                    </span>
                                    <span>
                                        <i className="far fa-user mr-1 text-info"></i> Tác giả: {post.author || 'Ban biên tập Kieu.BookWorld'}
                                    </span>
                                    <span>
                                        <i className="far fa-eye mr-1 text-info"></i> Chuyên mục: {post.categoryName || 'Văn hóa đọc'}
                                    </span>
                                </div>

                                {/* NỘI DUNG CHÍNH BÀI VIẾT */}
                                <div className="blog-main-article-content">
                                    {/* Ảnh đại diện tiêu đề bài viết */}
                                    {mainThumbnail && (
                                        <div className="text-center mb-4 shadow-sm rounded overflow-hidden">
                                            <img src={mainThumbnail} alt={post.title} className="img-fluid" style={{ width: '100%', maxHeight: '450px', objectFit: 'cover' }} />
                                        </div>
                                    )}render

                                    {/* 🟢 KHUNG BIÊN DỊCH HTML ĐỘNG: 
                                        dangerouslySetInnerHTML tự động chuyển đổi chuỗi mã HTML (bao gồm các thẻ chữ đậm, 
                                        chữ nghiêng, căn lề và các thẻ <img> chèn giữa từ CKEditor) thành giao diện đồ họa hoàn chỉnh */}
                                    {/* Ruột bài viết sau khi được sửa font chữ tiếng Việt */}
                                    <div
                                        className="content-render text-justify"
                                        // 🟢 ĐÃ SỬA: Thay đổi font sang hệ sans-serif hiện đại để hiển thị dấu tiếng Việt chuẩn xác, không bị lỗi dấu nhảy cách
                                        style={{
                                            fontSize: '16px',
                                            color: '#333333',
                                            lineHeight: '1.8',
                                            fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                                        }}
                                        dangerouslySetInnerHTML={{ __html: post.content }}
                                    />
                                </div>

                                <hr className="my-4" style={{ borderColor: '#eee' }} />

                                {/* CHÂN CARD CỦA BẢN TIN */}
                                <div className="d-flex justify-content-between align-items-center">
                                    <button
                                        className="btn btn-light btn-sm text-secondary border px-3"
                                        onClick={() => navigate('/blog')}
                                        style={{ fontSize: '13px', fontWeight: '500', borderRadius: '4px' }}
                                    >
                                        <i className="fas fa-chevron-left mr-1"></i> Quay lại mục Tin tức
                                    </button>

                                    <span className="text-muted font-italic" style={{ fontSize: '12px' }}>
                                        Mã số bản tin: #{id || '108'}
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