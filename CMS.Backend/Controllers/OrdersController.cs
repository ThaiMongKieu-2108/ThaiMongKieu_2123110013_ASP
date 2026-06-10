/*
sinh viên: Thái Mộng Kiều
mã số: 2123110013
ngày cập nhật: 10-06-2026
version: 1.1
 */

using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// 1. API: Lấy danh sách lịch sử đơn hàng của một khách hàng cụ thể
        /// Đường dẫn: GET https://localhost:7238/api/Orders/customer/{customerId}
        /// </summary>
        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetByCustomer(int customerId)
        {
            // Tìm các đơn hàng thuộc về CustomerId này và sắp xếp đơn mới nhất lên đầu 
            var orders = await _context.Orders
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new {
                    o.Id,
                    o.OrderDate,
                    o.CustomerId,
                    o.Status,
                    o.Notes
                })
                .ToListAsync();

            return Ok(orders);
        }

        /// <summary>
        /// 2. API: Lấy chi tiết hóa đơn kèm danh sách sản phẩm đã mua
        /// Đường dẫn: GET https://localhost:7238/api/Orders/{id}
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound(new { message = "Không tìm thấy đơn hàng" });
            }

            // Định dạng lại cấu trúc JSON trả về để Frontend bóc tách dễ dàng, tránh lỗi tham chiếu vòng lập
            return Ok(new
            {
                id = order.Id,
                notes = order.Notes,
                orderDetails = order.OrderDetails.Select(d => new {
                    id = d.Id,
                    productId = d.ProductId,
                    quantity = d.Quantity,
                    unitPrice = d.UnitPrice,
                    // Lấy kèm tên sản phẩm để hiển thị lên hóa đơn Frontend
                    productName = d.Product != null ? d.Product.Name : "Sản phẩm không xác định"
                })
            });
        }

        /// <summary>
        /// 3. API: Tiếp nhận đơn đặt hàng từ giỏ hàng FrontEnd gửi lên
        /// Đường dẫn: POST https://localhost:7238/api/Orders
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderInputDTO input)
        {
            if (input == null)
            {
                return BadRequest(new { message = "Dữ liệu đơn hàng không hợp lệ" });
            }

            try
            {
                var newOrder = new Order
                {
                    OrderDate = DateTime.Now,
                    CustomerId = input.CustomerId,
                    Status = 0,               // 0: Mặc định đơn hàng mới ở trạng thái "Chờ xử lý" 
                    Notes = input.Notes
                };

                _context.Orders.Add(newOrder);
                await _context.SaveChangesAsync();

                return StatusCode(201, new
                {
                    message = "Đặt hàng thành công!",
                    orderId = newOrder.Id
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi xử lý tạo đơn hàng ngầm", detail = ex.Message });
            }
        }

        /// <summary>
        /// 4. API: Hủy/Xóa đơn hàng hệ thống
        /// Đường dẫn: DELETE https://localhost:7238/api/Orders/{id}
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
            {
                return NotFound(new { message = "Không tìm thấy đơn hàng" });
            }

            if (order.OrderDetails != null)
            {
                _context.OrderDetails.RemoveRange(order.OrderDetails);
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa đơn hàng thành công" });
        }
    }

    // LỚP DTO TRUNG GIAN ĐỂ HỨNG DỮ LIỆU TỪ FRONTEND TRUYỀN LÊN
    public class OrderInputDTO
    {
        public int CustomerId { get; set; }
        public string Notes { get; set; }
    }
}