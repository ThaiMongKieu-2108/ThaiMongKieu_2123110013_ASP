using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data; // Thay bằng namespace chứa ApplicationDbContext của dự án
using CMS.Data.Entities; // Sử dụng đúng không gian lưu trữ thực thể Customer
using System;
using System.Linq;
using System.Threading.Tasks;


namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;


        // Hàm khởi tạo "Tiêm" DbContext vào Controller
        public CustomersController(ApplicationDbContext context)
        {
            _context = context;
        }


        /// <summary>
        /// API Endpoint 1: POST api/Customers/register
        /// Tiếp nhận gói tin từ Form Đăng ký (Register.jsx)
        /// </summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CustomerRegisterDto model)
        {
            // Kiểm tra tính hợp lệ dữ liệu đầu vào tối giản
            if (model == null || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password) || string.IsNullOrEmpty(model.FullName))
            {
                return BadRequest(new { message = "Vui lòng điền đầy đủ các thông tin bắt buộc!" });
            }


            try
            {
                // Kiểm tra trùng lặp tài khoản Email (chuyển về chữ thường để so khớp chính xác)
                var isEmailExist = await _context.Customers
                    .AnyAsync(c => c.Email.Trim().ToLower() == model.Email.Trim().ToLower());

                if (isEmailExist)
                {
                    return BadRequest(new { message = "Email này đã được đăng ký trên hệ thống ThaiCMS!" });
                }


                // KHỞI TẠO THỰC THỂ KHỚP 100% CẤU TRÚC ĐƠN GIẢN CỦA THẦY
                var newCustomer = new Customer
                {
                    FullName = model.FullName,
                    Email = model.Email.Trim(),
                    Phone = model.Phone,
                    Address = model.Address,
                    Password = model.Password // Lưu mật khẩu thô theo đúng yêu cầu tối giản
                };


                // Lưu thực thể xuống SQL Server
                _context.Customers.Add(newCustomer);
                await _context.SaveChangesAsync();


                return StatusCode(201, new { message = "Tạo tài khoản khách hàng thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi hệ thống khi đăng ký: {ex.Message}");
            }
        }


        /// <summary>
        /// API Endpoint 2: POST api/Customers/login
        /// Xác thực thông tin từ Form Đăng nhập (Login.jsx)
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
                // Truy vấn LINQ tìm kiếm khách hàng khớp cả Email (chữ thường) và Mật khẩu thô
                var customer = await _context.Customers
                    .FirstOrDefaultAsync(c => c.Email.Trim().ToLower() == model.Email.Trim().ToLower() && c.Password == model.Password);


                // Nếu không tìm thấy bản ghi nào khớp -> Từ chối xác thực
                if (customer == null)
                {
                    return Unauthorized(new { message = "Tài khoản hoặc mật khẩu không chính xác!" });
                }


                // Xác thực thành công -> Đóng gói dữ liệu sạch trả về cho FrontEnd lưu LocalStorage
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
                return StatusCode(500, $"Lỗi hệ thống khi xác thực: {ex.Message}");
            }
        }
    }


    // ────────────────────────────────────────────────────────
    // ĐỊNH NGHĨA CÁC ĐỐI TƯỢNG VẬN CHUYỂN DỮ LIỆU ĐẦU VÀO (DTO)
    // ────────────────────────────────────────────────────────
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
}
