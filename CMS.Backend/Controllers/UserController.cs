/*
sinh viên: Thái Mộng Kiều
mã số: 2123110013
ngày tạo: 14-05-2026
version: 1.0
 */
using CMS.Data; // Thêm using cho ApplicationDbContext
using CMS.Data.Entities; // Thêm using cho các thực thể dữ liệu nếu cần thiết
using Microsoft.AspNetCore.Mvc;
namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        // "Tiêm" kết nối Database vào Controller tương tự như CategoryController
        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Action lấy danh sách thành viên
        public IActionResult Index()
        {
            
            var data = _context.Users.ToList(); // Lấy tất cả thành viên từ bảng Users trong SQL

            return View(data);
        }
    }
}
