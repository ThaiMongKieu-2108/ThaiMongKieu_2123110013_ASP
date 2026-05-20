/*
sinh viên: Thái Mộng Kiều
mã số: 2123110013
ngày tạo: 14-05-2026
version: 1.0
 */

using CMS.Data.Entities; // Thêm using cho các thực thể dữ liệu nếu cần thiết
using Microsoft.AspNetCore.Mvc;
using CMS.Data;
namespace CMS.Backend.Controllers
{
    public class CategoryController : Controller
    {
     
       private readonly ApplicationDbContext _context;

        // "Tiêm" kết nối vào Controller
        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // Lấy dữ liệu THẬT từ bảng Categories trong SQL
            var data = _context.Categories.ToList();
            return View(data);
        }

    }
}
