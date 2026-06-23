/*
sinh viên: Thái Mộng Kiều
mã số: 2123110013
ngày cập nhật: 23-06-2026
version: 1.7 (Tích hợp tự động gửi email hóa đơn đơn hàng qua MailKit SMTP)
 */

using CMS.Data;
using CMS.Data.Entities;
// Thêm 3 namespace cần thiết cho chức năng gửi thư
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
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

        // 3. API: Tiếp nhận đơn từ Checkout và thực hiện trừ kho + lưu chi tiết đơn hàng + GỬI MAIL
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

                decimal totalAmount = 0; // Biến tính tổng tiền gửi qua email
                var emailProductListHtml = ""; // Chuỗi HTML chứa danh sách sản phẩm để đưa vào mail

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

                    // Tính tổng tiền đơn hàng
                    totalAmount += product.Price * item.Quantity;

                    // Thêm dòng sản phẩm vào chuỗi danh sách email HTML
                    emailProductListHtml += $"<li>{product.Name} - SL: {item.Quantity} - Đơn giá: {product.Price:N0} VND</li>";

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

                // 🟢 ĐOẠN XỬ LÝ TỰ ĐỘNG GỬI EMAIL ĐỘNG THEO TÀI KHOẢN MUA
                try
                {
                    // 1. Tìm chính xác khách hàng trong DB dựa vào CustomerId truyền từ ReactJS lên
                    var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Id == input.CustomerId);

                    // 2. Nếu tìm thấy thì lấy đúng Email/FullName trong DB, nếu không thấy mới dùng mail dự phòng
                    string customerEmail = customer != null ? customer.Email : "kkieu1009@gmail.com";
                    string customerName = customer != null ? customer.FullName : "Khách hàng E-Shopper";

                    // 3. Tiến hành cấu hình mail gửi đi
                    var email = new MimeMessage();

                    // THAY THẾ: Điền chính xác địa chỉ Gmail GỬI ĐI của bạn vào đây
                    email.From.Add(MailboxAddress.Parse("thaimongkieu229@gmail.com"));

                    // Tự động gửi tới email của tài khoản đang mua hàng
                    email.To.Add(MailboxAddress.Parse(customerEmail));
                    email.Subject = $"[E-Shopper] Xác nhận đơn hàng trực tuyến thành công #{newOrder.Id}";

                    var builder = new BodyBuilder();
                    builder.HtmlBody = $@"
        <div style='font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; border: 1px solid #ddd; padding: 20px;'>
            <h2 style='color: #1F497D; border-bottom: 2px solid #1F497D; padding-bottom: 10px;'>CẢM ƠN BẠN ĐÃ ĐẶT HÀNG!</h2>
            <p>Xin chào <strong>{customerName}</strong>,</p>
            <p>Yêu cầu mua sắm của bạn đã được hệ thống tiếp nhận và đang trong quá trình xử lý.</p>
            
            <h3 style='color: #002060;'>Thông tin đơn hàng #{newOrder.Id}</h3>
            <table style='width: 100%; border-collapse: collapse; margin-bottom: 15px;'>
                <tr>
                    <td style='padding: 5px 0;'><strong>Ngày đặt hàng:</strong></td>
                    <td>{newOrder.OrderDate:dd/MM/yyyy HH:mm:ss}</td>
                </tr>
                <tr>
                    <td style='padding: 5px 0;'><strong>Ghi chú đơn hàng:</strong></td>
                    <td>{(string.IsNullOrEmpty(newOrder.Notes) ? "Không có" : newOrder.Notes)}</td>
                </tr>
            </table>

            <h3 style='color: #002060; border-top: 1px solid #ddd; padding-top: 10px;'>Chi tiết sản phẩm:</h3>
            <ul style='padding-left: 20px;'>
                {emailProductListHtml}
            </ul>

            <p style='font-size: 16px; font-weight: bold; color: #C00000; text-align: right; margin-top: 20px;'>
                Tổng giá trị thanh toán: {totalAmount:N0} VND
            </p>
        </div>";

                    email.Body = builder.ToMessageBody();

                    using var smtp = new MailKit.Net.Smtp.SmtpClient();
                    await smtp.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);

                    // THAY THẾ: Điền Gmail của bạn và "Mật khẩu ứng dụng" 16 ký tự vào đây
                    await smtp.AuthenticateAsync("thaimongkieu229@gmail.com", "wigr stgj oqru nrkt");

                    await smtp.SendAsync(email);
                    await smtp.DisconnectAsync(true);
                }
                catch (Exception emailEx)
                {
                    // Ghi nhận lỗi ra cửa sổ hệ thống để kiểm tra nếu mail không đi
                    Console.WriteLine($"[Email Error]: {emailEx.Message}");
                }
    

                return StatusCode(201, new { message = "Đặt hàng thành công và hệ thống đã cập nhật giảm kho hàng!", orderId = newOrder.Id });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Lỗi tạo đơn hàng ngầm", detail = ex.Message });
            }
        }

        // 4. API: Hủy/Xóa đơn hàng
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