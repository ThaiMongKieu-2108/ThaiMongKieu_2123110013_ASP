/*
sinh viên: Thái Mộng Kiều
mã số: 2123110013
ngày cập nhật: 22-06-2026
version: 1.6 (Đảm bảo lưu đồng thời Orders và OrderDetails từ ReactJS)
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

        // 1. API: Lấy đơn hàng theo CustomerId phục vụ Frontend
        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetByCustomer(int customerId)
        {
            var orders = await _context.Orders
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new {
                    id = o.Id,
                    orderDate = o.OrderDate,
                    customerId = o.CustomerId,
                    status = o.Status,
                    notes = o.Notes
                })
                .ToListAsync();

            return Ok(orders);
        }

        // 2. API: Lấy chi tiết đơn hàng phục vụ ô xem nhanh ở Frontend
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var order = await _context.Orders
                .Include(o => o.OrderDetails)
                    .ThenInclude(od => od.Product)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound(new { message = "Không tìm thấy đơn hàng" });

            return Ok(new
            {
                id = order.Id,
                notes = order.Notes,
                orderDate = order.OrderDate,
                status = order.Status,
                orderDetails = order.OrderDetails.Select(d => new {
                    id = d.Id,
                    productId = d.ProductId,
                    quantity = d.Quantity,
                    unitPrice = d.UnitPrice,
                    productName = d.Product != null ? d.Product.Name : "Sản phẩm không xác định"
                }).ToList()
            });
        }

        // 3. API: Tiếp nhận đơn từ Checkout và thực hiện trừ kho + lưu chi tiết đơn hàng
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] OrderInputDTO input)
        {
            if (input == null || input.CartItems == null || !input.CartItems.Any())
            {
                return BadRequest(new { message = "Dữ liệu giỏ hàng rỗng." });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var newOrder = new Order
                {
                    OrderDate = DateTime.Now,
                    CustomerId = input.CustomerId,
                    Status = 0,
                    Notes = input.Notes,
                    OrderDetails = new List<OrderDetail>() // Khởi tạo mảng con
                };

                foreach (var item in input.CartItems)
                {
                    var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == item.ProductId);
                    if (product == null)
                    {
                        return BadRequest(new { message = $"Sản phẩm #{item.ProductId} không tồn tại." });
                    }

                    if (product.StockQuantity < item.Quantity)
                    {
                        return BadRequest(new { message = $"Sản phẩm '{product.Name}' không đủ hàng." });
                    }

                    // Khấu trừ kho hàng
                    product.StockQuantity -= item.Quantity;

                    // Gán trực tiếp phần tử con vào đơn hàng cha để EF Core tự gán OrderId sau khi SaveChanges
                    newOrder.OrderDetails.Add(new OrderDetail
                    {
                        ProductId = item.ProductId,
                        Quantity = item.Quantity,
                        UnitPrice = product.Price
                    });
                }

                _context.Orders.Add(newOrder);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return StatusCode(201, new { message = "Đặt hàng thành công và hệ thống đã cập nhật giảm kho hàng!", orderId = newOrder.Id });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Lỗi tạo đơn hàng ngầm", detail = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var order = await _context.Orders.Include(o => o.OrderDetails).FirstOrDefaultAsync(o => o.Id == id);
            if (order == null) return NotFound();
            if (order.OrderDetails != null) _context.OrderDetails.RemoveRange(order.OrderDetails);
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Xóa thành công" });
        }
    }

    public class OrderInputDTO
    {
        public int CustomerId { get; set; }
        public string Notes { get; set; }
        public List<CartItemDTO> CartItems { get; set; }
    }

    public class CartItemDTO
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
    }
}