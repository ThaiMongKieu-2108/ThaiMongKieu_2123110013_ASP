/*
sinh viên: Thái Mộng Kiều
mã số: 2123110013
ngày tạo: 14-05-2026
version: 1.0
 */

using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities; // Thêm using cho các thực thể dữ liệu nếu cần thiết
namespace CMS.Backend.Controllers
{
    public class CategoryController : Controller
    {
        public IActionResult Index()
        {
            // Tạo danh sách dữ liệu mẫu trực tiếp trong code
            var list = new List<Category> {
            new Category { Id = 1, Name = "Tin Công Nghệ", Description = "Review Laptop, AI" },
            new Category { Id = 2, Name = "Giáo Dục", Description = "Thông tin tuyển sinh" }
        };
            return View(list); // Gửi danh sách này sang giao diện

        }
    }
}
