/*
sinh viên: Thái Mộng Kiều
mã số: 2123110013
ngày tạo: 20-05-2026
version: 1.0
*/

using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // BẮT BUỘC phải có để dùng được hàm .Include()
using System.Linq;

namespace CMS.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        // "Tiêm" kết nối cơ sở dữ liệu vào Controller
        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Action lấy danh sách sản phẩm từ SQL Server
        public IActionResult Index()
        {
            // Lấy toàn bộ dữ liệu từ bảng Products
            // Đồng thời dùng .Include để nạp kèm thông tin danh mục của sản phẩm đó
            var data = _context.Products
                               .Include(p => p.CategoryProduct)
                               .ToList();

            return View(data);
        }
    }
}