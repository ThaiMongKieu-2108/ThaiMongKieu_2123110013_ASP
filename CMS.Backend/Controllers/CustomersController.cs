/*
sinh viên: Thái Mộng Kiều
mã số: 2123110013
ngày chỉnh sửa: 23-06-2026
version: 1.5 (Tích hợp hoàn chỉnh quy trình khôi phục mật khẩu OTP 2 bước bảo mật)
*/

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;
using BCrypt.Net;
using System.Text.Json.Serialization;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomersController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// API Endpoint 1: POST api/Customers/register
        /// </summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CustomerRegisterDto model)
        {
            if (model == null || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password) || string.IsNullOrEmpty(model.FullName))
            {
                return BadRequest(new { message = "Vui lòng điền đầy đủ các thông tin bắt buộc!" });
            }

            try
            {
                var isEmailExist = await _context.Customers
                    .AnyAsync(c => c.Email.Trim().ToLower() == model.Email.Trim().ToLower());

                if (isEmailExist)
                {
                    return BadRequest(new { message = "Email này đã được đăng ký trên hệ thống Kieu.BookWorld!" });
                }

                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password, workFactor: 12);

                var newCustomer = new Customer
                {
                    FullName = model.FullName,
                    Email = model.Email.Trim(),
                    Phone = model.Phone,
                    Address = model.Address,
                    Password = hashedPassword
                };

                _context.Customers.Add(newCustomer);
                await _context.SaveChangesAsync();

                return StatusCode(201, new { message = "Tạo tài khoản khách hàng thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi hệ thống khi đăng ký: {ex.Message}" });
            }
        }

        /// <summary>
        /// 🟢 LUỒNG 1: POST api/Customers/request-otp
        /// Tiếp nhận Email và sinh mã xác thực ngẫu nhiên 10 ký tự lưu tạm vào Database
        /// </summary>
        [HttpPost("request-otp")]
        public async Task<IActionResult> RequestOtp([FromBody] ForgotPasswordDto model)
        {
            if (model == null || string.IsNullOrEmpty(model.Email))
            {
                return BadRequest(new { message = "Vui lòng nhập chính xác địa chỉ Email!" });
            }

            try
            {
                var customer = await _context.Customers
                    .FirstOrDefaultAsync(c => c.Email.Trim().ToLower() == model.Email.Trim().ToLower());

                if (customer == null)
                {
                    return BadRequest(new { message = "Địa chỉ Email này không tồn tại trên hệ thống!" });
                }

                // Sinh chuỗi ngẫu nhiên 10 ký tự (Chữ in hoa và số)
                const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                var random = new Random();
                string tempOtp = new string(Enumerable.Repeat(chars, 10)
                    .Select(s => s[random.Next(s.Length)]).ToArray());

                // Lưu tạm thời mã OTP thô vào cột Password để đối chiếu dùng 1 lần
                customer.Password = tempOtp;

                _context.Customers.Update(customer);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = "Hệ thống đã tạo mã xác thực thành công!",
                    otpCode = tempOtp
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi hệ thống khi tạo mã: {ex.Message}" });
            }
        }

        /// <summary>
        /// 🟢 LUỒNG 2: POST api/Customers/reset-password
        /// Xác thực mã OTP chữ hoa/chữ thường và tiến hành băm mật khẩu mới bằng BCrypt
        /// </summary>
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto model)
        {
            if (model == null || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.OtpCode) || string.IsNullOrEmpty(model.NewPassword))
            {
                return BadRequest(new { message = "Vui lòng điền đầy đủ thông tin xác thực!" });
            }

            try
            {
                var customer = await _context.Customers
                    .FirstOrDefaultAsync(c => c.Email.Trim().ToLower() == model.Email.Trim().ToLower());

                if (customer == null)
                {
                    return BadRequest(new { message = "Tài khoản không tồn tại!" });
                }

                // Cắt khoảng trắng thừa và ép về chữ IN HOA để tránh lỗi gõ phím của người dùng
                if (string.IsNullOrEmpty(customer.Password) || customer.Password.Trim().ToUpper() != model.OtpCode.Trim().ToUpper())
                {
                    return BadRequest(new { message = "Mã xác thực 10 ký tự không chính xác hoặc đã hết hạn!" });
                }

                // Thực hiện băm bảo mật BCrypt cho mật khẩu mới
                customer.Password = BCrypt.Net.BCrypt.HashPassword(model.NewPassword, workFactor: 12);

                _context.Customers.Update(customer);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Đổi mật khẩu mới thành công! Vui lòng đăng nhập lại." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi hệ thống khi đổi mật khẩu: {ex.Message}" });
            }
        }

        /// <summary>
        /// API Endpoint 3: POST api/Customers/login
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] CustomerLoginDto model)
        {
            if (model == null || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
            {
                return BadRequest(new { message = "Tài khoản và mật khẩu không được để trống!" });
            }

            try
            {
                var customer = await _context.Customers
                    .FirstOrDefaultAsync(c => c.Email.Trim().ToLower() == model.Email.Trim().ToLower());

                if (customer == null || !BCrypt.Net.BCrypt.Verify(model.Password, customer.Password))
                {
                    return BadRequest(new { message = "Tài khoản hoặc mật khẩu không chính xác!" });
                }

                var customerSessionData = new
                {
                    id = customer.Id,
                    fullName = customer.FullName,
                    email = customer.Email,
                    phone = customer.Phone,
                    address = customer.Address
                };

                return Ok(customerSessionData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi hệ thống khi xác thực: {ex.Message}" });
            }
        }
    }

    // ==========================================
    // KHU VỰC CÁC LỚP DTO TRUYỀN TẢI DỮ LIỆU
    // ==========================================

    public class CustomerRegisterDto
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string Password { get; set; }
    }

    public class CustomerLoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class ResetPasswordDto
    {
        [JsonPropertyName("email")]
        public string Email { get; set; }

        [JsonPropertyName("otpCode")]
        public string OtpCode { get; set; }

        [JsonPropertyName("newPassword")]
        public string NewPassword { get; set; }
    }

    public class ForgotPasswordDto
    {
        [JsonPropertyName("email")]
        public string Email { get; set; }
    }
}