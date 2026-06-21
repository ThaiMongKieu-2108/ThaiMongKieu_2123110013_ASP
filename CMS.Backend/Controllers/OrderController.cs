using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace CMS.Controllers
{
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hiển thị danh sách đơn hàng ngoài bảng quản trị Admin
        public IActionResult Index()
        {
            var data = _context.Orders
                               .Include(o => o.Customer) // Nạp thông tin người mua
                               .OrderByDescending(o => o.Id)
                               .ToList();
            return View(data);
        }

        // Hiển thị giao diện Chi tiết đơn hàng (Hình 1 của bạn)
        [HttpGet]
        public IActionResult Detail(int id)
        {
            var order = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails) // 🟢 QUAN TRỌNG: Phải nạp danh sách sản phẩm con
                    .ThenInclude(od => od.Product) // Nạp thông tin Tên/Hình ảnh của Product
                .FirstOrDefault(o => o.Id == id);

            if (order == null) return NotFound();

            return View(order); // Trả về tệp View(.cshtml) cho Admin
        }

        public IActionResult Delete(int id)
        {
            var order = _context.Orders.Include(o => o.OrderDetails).FirstOrDefault(o => o.Id == id);
            if (order != null)
            {
                if (order.OrderDetails != null) _context.OrderDetails.RemoveRange(order.OrderDetails);
                _context.Orders.Remove(order);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}