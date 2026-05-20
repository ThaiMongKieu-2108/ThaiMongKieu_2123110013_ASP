/*
sinh viên: Thái Mộng Kiều
mã số: 2123110013
ngày tạo: 14-05-2026
version: 1.0
 */
using CMS.Data;
using CMS.Data.Entities; // Thêm using cho các thực thể dữ liệu nếu cần thiết
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Thêm using cho Entity Framework
namespace CMS.Backend.Controllers

{
    public class PostController : Controller
    {
        // Tương tự như CategoryController, chúng ta sẽ "tiêm" ApplicationDbContext để truy cập dữ liệu từ SQL

        private readonly ApplicationDbContext _context;

        // "Tiêm" kết nối vào Controller tương tự như CategoryController của bạn
        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var posts = _context.Posts.ToList(); // Lấy tất cả bài viết
            return View(posts);

        }
        // Hàm Details: Hiển thị chi tiết một bài viết (Bổ sung  khá giỏi)
        public IActionResult Details(int id)
        {
            // Lấy dữ liệu THẬT từ bảng Posts trong SQL Server dựa vào Id truyền vào.
            // Đồng thời nạp kèm (Include) dữ liệu của danh mục (Category) liên kết để hiển thị ngoài View.
            var post = _context.Posts
                               .Include(p => p.Category)
                               .FirstOrDefault(p => p.Id == id);

            // Nếu không tìm thấy bài viết nào ứng với Id đó trong Database, trả về trang lỗi 404
            if (post == null)
            {
                return NotFound();
            }

            // Truyền đối tượng bài viết thật qua View để hiển thị
            return View(post);
        }

    }
}
