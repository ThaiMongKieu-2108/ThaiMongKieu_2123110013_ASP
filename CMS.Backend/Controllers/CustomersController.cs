using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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

        // =====================================================
        // LOGIC ĐĂNG NHẬP (ĐÃ CHUẨN HÓA ROUTE)
        // POST: api/customers/login
        // =====================================================
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel model)
        {
            // Thuật toán kiểm tra Email và Password của bạn từ database
            var customer = _context.Customers.FirstOrDefault(c => c.Email == model.Email && c.Password == model.Password);

            if (customer == null)
            {
                // Trả về mã 400 kèm thông điệp để Frontend hiển thị lên khung thông báo màu đỏ
                return BadRequest(new { message = "Địa chỉ Email hoặc mật khẩu không chính xác!" });
            }

            return Ok(customer);
        }

        // =====================================================
        // LOGIC ĐĂNG KÝ TÀI KHOẢN (ĐÃ BỔ SUNG KHỚP FRONTEND)
        // POST: api/customers/register
        // =====================================================
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Customer model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Kiểm tra trùng lặp email trước khi thêm mới
            var isExist = await _context.Customers.AnyAsync(c => c.Email == model.Email);
            if (isExist)
            {
                return BadRequest(new { message = "Tài khoản Email này đã tồn tại trên hệ thống!" });
            }

            _context.Customers.Add(model);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Đăng ký tài khoản khách hàng thành công",
                data = model
            });
        }

        // =====================================================
        // GET ALL
        // GET: api/customers
        // =====================================================
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var customers = await _context.Customers
                .OrderByDescending(x => x.Id)
                .ToListAsync();

            return Ok(customers);
        }

        // =====================================================
        // GET DETAIL
        // GET: api/customers/1
        // =====================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(x => x.Id == id);

            if (customer == null)
            {
                return NotFound(new { message = "Không tìm thấy khách hàng" });
            }

            return Ok(customer);
        }

        // =====================================================
        // UPDATE
        // PUT: api/customers/1
        // =====================================================
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Customer model)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(x => x.Id == id);

            if (customer == null)
            {
                return NotFound(new { message = "Không tìm thấy khách hàng" });
            }

            customer.FullName = model.FullName;
            customer.Email = model.Email;
            customer.Phone = model.Phone;
            customer.Address = model.Address;
            customer.Password = model.Password;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Cập nhật khách hàng thành công",
                data = customer
            });
        }

        // =====================================================
        // DELETE
        // DELETE: api/customers/1
        // =====================================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var customer = await _context.Customers
                .FirstOrDefaultAsync(x => x.Id == id);

            if (customer == null)
            {
                return NotFound(new { message = "Không tìm thấy khách hàng" });
            }

            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa khách hàng thành công" });
        }
    }

    // Model DTO trung chuyển dữ liệu login sạch
    public class LoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}