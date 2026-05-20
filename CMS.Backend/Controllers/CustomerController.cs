/*
sinh viên: Thái Mộng Kiều
mã số: 2123110013
ngày tạo: 20-05-2026
version: 1.0
*/

using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CMS.Controllers
{
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        // "Tiêm" kết nối cơ sở dữ liệu vào Controller
        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Action lấy danh sách khách hàng từ SQL Server
        public IActionResult Index()
        {
            // Lấy toàn bộ dữ liệu từ bảng Customers trong SQL
            var data = _context.Customers.ToList();

            return View(data);
        }
    }
}