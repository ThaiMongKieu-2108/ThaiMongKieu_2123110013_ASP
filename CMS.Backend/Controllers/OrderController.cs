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
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        // "Tiêm" kết nối cơ sở dữ liệu vào Controller
        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Action lấy danh sách đơn hàng từ SQL Server
        public IActionResult Index()
        {
            // Lấy toàn bộ đơn hàng và kết nối lấy kèm thông tin Khách hàng đặt đơn đó
            var data = _context.Orders
                               .Include(o => o.Customer)
                               .ToList();

            return View(data);
        }

        [HttpGet]
        public IActionResult Detail(int id)
        {
            var order = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .FirstOrDefault(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            return View(order);
        }

        public IActionResult Delete(int id)
        {
            var order = _context.Orders
                .Include(o => o.OrderDetails)
                .FirstOrDefault(o => o.Id == id);

            if (order != null)
            {
                // Xóa chi tiết đơn hàng trước
                if (order.OrderDetails != null)
                {
                    _context.OrderDetails.RemoveRange(order.OrderDetails);
                }

                // Xóa đơn hàng
                _context.Orders.Remove(order);

                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}