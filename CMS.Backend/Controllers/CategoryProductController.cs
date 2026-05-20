/*
sinh viên: Thái Mộng Kiều
mã số: 2123110013
ngày tạo: 20-05-2026
version: 1.0
*/

using CMS.Data;
using CMS.Data.Entities; // Namespace chứa thực thể CategoryProduct
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CMS.Controllers
{
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        // "Tiêm" kết nối Database Context vào Controller 
        public CategoryProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Action lấy dữ liệu THẬT từ bảng CategoriesProducts lên giao diện
        public IActionResult Index()
        {
            // Truy vấn lấy toàn bộ danh sách danh mục sản phẩm từ SQL Server
            var data = _context.CategoriesProducts.ToList();

            return View(data);
        }
    }
}