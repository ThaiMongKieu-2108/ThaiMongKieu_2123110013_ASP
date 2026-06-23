import React, { useState, useEffect } from 'react';
import blogService from '../services/blogService';

const PostList = () => {
    // 1. Khai báo State chứa mảng bài viết lấy từ SQL Server
    const [posts, setPosts] = useState([]);

    // Khai báo State quản lý trạng thái chờ (Loading) nhằm tối ưu trải nghiệm người dùng
    const [loading, setLoading] = useState(true);

    // THÊM STATE: Lưu trữ bài viết đang được chọn để đọc chi tiết
    const [selectedPost, setSelectedPost] = useState(null);

    // 2. Sử dụng useEffect để kiểm soát vòng đời gọi dữ liệu 
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true); // Bắt đầu tải dữ liệu
                const data = await blogService.getAllPosts();
                setPosts(data);
            } catch (error) {
                console.error("Quá trình kết nối API bài viết thất bại:", error);
            } finally {
                setLoading(false); // Kết thúc tải dữ liệu
            }
        };

        fetchPosts();
    }, []); // Mảng rỗng [] đảm bảo API chỉ gọi 1 LẦN DUY NHẤT khi mở trang

    // 3. Xử lý trạng thái hiển thị giao diện tạm thời
    if (loading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border text-info" role="status"></div>
                <p className="mt-2 text-muted">Đang kết nối Database lấy tin tức nhà sách...</p>
            </div>
        );
    }

    // 4. Render giao diện HTML/Bootstrap hoàn chỉnh khi đã có dữ liệu thành công
    return (
        <div className="card shadow-sm p-4 bg-white rounded mt-5">
            {/* Tiêu đề danh sách bài viết */}
            <h4 className="card-title text-uppercase font-weight-bold text-dark border-bottom pb-3 mb-4">
                <i className="fa-solid fa-newspaper mr-2 text-info"></i> Xu hướng & Bí quyết mặc đẹp
            </h4>

            {/* Kiểm tra mảng dữ liệu rỗng */}
            {posts.length === 0 ? (
                <div className="alert alert-light text-center border">
                    <p className="text-muted m-0">Hiện tại chưa có bài viết xu hướng nào trong hệ thống.</p>
                </div>
            ) : (
                <div className="row">
                    {posts.map((post) => (
                        <div className="col-12 mb-4" key={post.id}>
                            <div className="card h-100 border-0 shadow-sm bg-light">
                                <div className="card-body">
                                    {/* Tiêu đề bài viết kèm sự kiện click mở bài viết */}
                                    <h5 className="font-weight-bold">
                                        <button
                                            className="btn btn-link text-dark p-0 text-decoration-none font-weight-bold text-left shadow-none text-hover-primary"
                                            onClick={() => setSelectedPost(post)}
                                            style={{ fontSize: '1.25rem' }}
                                        >
                                            {post.title}
                                        </button>
                                    </h5>

                                    {/* Hiển thị đoạn mô tả ngắn trích dẫn */}
                                    <p className="text-secondary small mt-2 card-text-truncate">
                                        {post.shortDescription || 'Nhấn để xem chi tiết bài viết chia sẻ về xu hướng phối đồ công sở...'}
                                    </p>

                                    {/* Phần chân Card: Hiển thị ngày đăng và nút đọc tiếp */}
                                    <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top border-light text-muted small">
                                        <span>
                                            <i className="fa-regular fa-calendar-days mr-1 text-secondary"></i>
                                            {new Date(post.createdDate).toLocaleDateString('vi-VN')}
                                        </span>
                                        {/* ĐÃ CẬP NHẬT: Thêm onClick vào nút Đọc tiếp để kích hoạt Modal */}
                                        <span
                                            className="badge badge-pill badge-info px-3 py-2 cursor-pointer transition-all"
                                            onClick={() => setSelectedPost(post)}
                                            style={{ userSelect: 'none' }}
                                        >
                                            Đọc tiếp <i className="fa-solid fa-angle-right ml-1"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ==================== CỬA SỔ MODAL HIỂN THỊ CHI TIẾT BÀI VIẾT BẬT LÊN ==================== */}
            {selectedPost && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', overflowY: 'auto' }}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow-lg rounded-lg">
                            {/* Header của Modal tin tức */}
                            <div className="modal-header bg-light border-bottom py-3">
                                <h5 className="modal-title font-weight-bold text-dark text-uppercase small">
                                    <i className="fa-solid fa-book-open text-info mr-2"></i> Chi tiết bài viết
                                </h5>
                                <button
                                    type="button"
                                    className="close border-0 bg-transparent text-secondary font-weight-bold"
                                    style={{ fontSize: '1.5rem', outline: 'none' }}
                                    onClick={() => setSelectedPost(null)} // Click dấu X để đóng bài viết
                                >
                                    &times;
                                </button>
                            </div>

                            {/* Body của Modal: Hiển thị tiêu đề lớn, ngày tháng và nội dung chi tiết */}
                            <div className="modal-body p-4">
                                <h2 className="font-weight-bold text-dark mb-2">{selectedPost.title}</h2>

                                <div className="text-muted small mb-4 border-bottom pb-2">
                                    <i className="fa-regular fa-calendar-days mr-1"></i> Ngày đăng: {new Date(selectedPost.createdDate).toLocaleDateString('vi-VN')}
                                    {selectedPost.categoryName && (
                                        <span className="ml-3 badge badge-info px-2 py-1">{selectedPost.categoryName}</span>
                                    )}
                                </div>

                                {/* Nội dung bài viết chi tiết */}
                                <div className="blog-content text-secondary" style={{ lineHeight: '1.7', fontSize: '1.05rem' }}>
                                    {/* Nếu Backend của bạn trả về HTML Content, sử dụng dangerouslySetInnerHTML. 
                                        Còn nếu là Text thuần thì hiển thị bình thường */}
                                    {selectedPost.content ? (
                                        <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
                                    ) : (
                                        <p style={{ whiteSpace: 'pre-line' }}>{selectedPost.shortDescription || 'Bài viết hiện tại chưa có nội dung chi tiết.'}</p>
                                    )}
                                </div>
                            </div>

                            {/* Chân của Modal */}
                            <div className="modal-footer bg-light border-top py-2">
                                <button
                                    type="button"
                                    className="btn btn-secondary btn-sm px-4"
                                    onClick={() => setSelectedPost(null)}
                                >
                                    Đóng lại
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostList;