/*
sinh viên: Thái Mộng Kiều
mã số: 2123110013
ngày tạo: 20-05-2026
version: 1.0
*/

using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore; // BẮT BUỘC phải có để dùng .Include()
using System.Linq;

namespace CMS.Controllers
{
    public class OrderDetailController : Controller
    {
        private readonly ApplicationDbContext _context;

        // "Tiêm" kết nối cơ sở dữ liệu vào Controller
        public OrderDetailController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Action lấy danh sách chi tiết tất cả các mặt hàng đã bán
        public IActionResult Index()
        {
            // Nạp kèm thông tin của cả Sản phẩm (Product) và Đơn hàng (Order) liên kết
            var data = _context.OrderDetails
                               .Include(d => d.Product)
                               .Include(d => d.Order)
                               .ToList();

            return View(data);
        }
    }
}