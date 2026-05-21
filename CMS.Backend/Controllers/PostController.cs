/*
sinh viên: Thái Mộng Kiều
mã số: 2123110013
ngày tạo: 14-05-2026
version: 1.0
 */
using CMS.Data;
using System.Linq;
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
        // GET: Post/Details/5
        public IActionResult Details(int id)
        {
            // 1. Truy vấn bài viết theo ID
            // Sử dụng .Include(p => p.Category) để lấy kèm thông tin Danh mục (Join bảng)
            var post = _context.Posts
                .Include(p => p.Category)
                .FirstOrDefault(p => p.Id == id);

            // 2. Kiểm tra nếu không tìm thấy bài viết (tránh lỗi màn hình trắng)
            if (post == null)
            {
                return NotFound(); // Trả về trang lỗi 404
            }

            // 3. Truyền dữ liệu sang View
            return View(post);
        }

        // Tham số 'id' sẽ hứng giá trị từ URL (Ví dụ cấu hình route: /Post/ListByCategory/5)
        public IActionResult ListByCategory(int? id)
        {
            if (id == null)
            {
                if (id == null)
                {
                    return BadRequest("Vui lòng cung cấp mã danh mục.");
                }
            }

            // Lấy thông tin danh mục hiện tại để hiển thị tên danh mục lên tiêu đề trang
            var category = _context.Categories.Find(id);
            if (category == null)
            {
                return NotFound("Danh mục không tồn tại.");
            }
            ViewBag.CategoryName = category.Name; // Gửi tên danh mục sang View

            // Lấy danh sách bài viết thuộc danh mục này (kèm theo thông tin Category)
            var posts = _context.Posts
                                .Where(p => p.CategoryId == id)
                                .Include(p => p.Category) // Join bảng để lấy tên danh mục
                                .OrderByDescending(p => p.CreatedDate)
                                .ToList();

            return View(posts);

        }
    }
}
