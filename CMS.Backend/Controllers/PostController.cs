/*
sinh viên: Thái Mộng Kiều
mã số: 2123110013
ngày chỉnh sửa: 23-06-2026
version: 1.1 (Tích hợp API kết nối cổng tải hình ảnh không đồng bộ cho CKEditor 5)
 */
using CMS.Data;
using CMS.Data.Entities; // Thêm using cho các thực thể dữ liệu nếu cần thiết
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // Thêm using cho Entity Framework
using System.Linq;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class PostController : Controller
    {
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

        // Hàm Details: Hiển thị chi tiết một bài viết
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
                return BadRequest("Vui lòng cung cấp mã danh mục.");
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

        // 1. Hàm hiển thị form tạo mới bài viết (GET)
        [HttpGet]
        public IActionResult Create()
        {
            // Chúng ta lấy danh sách Category để đổ vào ViewBag
            ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name");
            return View();
        }

        [HttpPost]
        public IActionResult Create(Post model, IFormFile uploadImage)
        {
            if (uploadImage != null && uploadImage.Length > 0)
            {
                // 1. Định nghĩa đường dẫn lưu file: wwwroot/uploads
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

                // Tạo thư mục nếu chưa tồn tại
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                // 2. Tạo tên file duy nhất để không bị đè dữ liệu
                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(folder, fileName);

                // 3. Chép file vào thư mục
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }

                // 4. Lưu đường dẫn vào CSDL để sau này hiển thị
                model.ImageUrl = "/uploads/" + fileName;
            }

            _context.Posts.Add(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        // 🟢 ĐÃ CHÈN VÀO ĐÂY: Hàm xử lý nhận file ảnh đẩy lên trực tiếp từ khung CKEditor
        /// <summary>
        /// API Endpoint tiếp nhận file ảnh tải lên trực tiếp từ giữa trình soạn thảo CKEditor
        /// Đường dẫn gọi xử lý: POST /Post/UploadEditorImage
        /// </summary>
        [HttpPost]
        [IgnoreAntiforgeryToken] // Tắt bộ lọc token bảo vệ để CKEditor gửi AJAX không bị chặn
        public IActionResult UploadEditorImage(IFormFile upload)
        {
            if (upload == null || upload.Length == 0)
            {
                return Json(new { uploaded = false, error = new { message = "Tệp tin hình ảnh trống." } });
            }

            try
            {
                // 1. Thiết lập thư mục lưu trữ vật lý: wwwroot/uploads/editor
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "editor");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                // 2. Tạo tên file định danh duy nhất chống ghi đè dữ liệu
                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(upload.FileName);
                string filePath = Path.Combine(folder, fileName);

                // 3. Thực thi lưu tệp tin xuống ổ đĩa máy chủ
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    upload.CopyTo(stream);
                }

                // 4. Trả về đúng định dạng gói tin JSON mà CKEditor yêu cầu để tự động chèn thẻ <img> vào bài viết
                string imageUrl = "/uploads/editor/" + fileName;
                return Json(new { uploaded = true, url = imageUrl });
            }
            catch (Exception ex)
            {
                return Json(new { uploaded = false, error = new { message = ex.Message } });
            }
        }

        public IActionResult Delete(int id)
        {
            // 1. Tìm bài viết theo Id
            var post = _context.Posts.Find(id);

            if (post != null)
            {
                // 2. Xóa khỏi bộ nhớ tạm
                _context.Posts.Remove(post);

                // 3. Cập nhật xuống SQL Server
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }

        // GET: Hiển thị form kèm dữ liệu cũ
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null) return NotFound();

            // Chuẩn bị lại danh sách danh mục để người dùng có thể đổi chuyên mục
            ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name", post.CategoryId);
            return View(post);
        }

        // POST: Thực hiện cập nhật
        [HttpPost]
        public IActionResult Edit(Post model, IFormFile uploadImage)
        {
            // Bước 1: Kiểm tra xem người dùng có chọn file ảnh mới không
            if (uploadImage != null && uploadImage.Length > 0)
            {
                // Thực hiện quy trình upload giống như trang Create
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }

                // Cập nhật đường dẫn ảnh mới vào model
                model.ImageUrl = "/uploads/" + fileName;
            }
            else
            {
                // Bước quan trọng: Nếu không upload ảnh mới, chúng ta phải giữ lại ảnh cũ
                var oldPost = _context.Posts.AsNoTracking().FirstOrDefault(p => p.Id == model.Id);
                if (oldPost != null && string.IsNullOrEmpty(model.ImageUrl))
                {
                    model.ImageUrl = oldPost.ImageUrl;
                }
            }
            _context.Posts.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }
    }
}