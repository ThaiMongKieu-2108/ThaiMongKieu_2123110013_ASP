/*
sinh viên: Thái Mộng Kiều
mã số: 2123110013
ngày tạo: 19-06-2026
version: 1.0
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;

namespace CMS.Backend.Controllers
{
    // 1. Định nghĩa đường dẫn gọi API. URL sẽ là: api/Banners
    [Route("api/[controller]")]
    [ApiController]
    public class BannersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // 2. Hàm khởi tạo (Constructor): Tiêm DBContext kết nối SQL Server vào
        public BannersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // LỆNH 1: Lấy toàn bộ danh sách Banner đang kích hoạt (Phục vụ hiển thị Slide trang chủ React)
        // Đường dẫn truy cập: GET https://localhost:7238/api/Banners
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // Lấy dữ liệu từ bảng Banners, lọc các banner kích hoạt và sắp xếp theo thứ tự hiển thị
            var banners = await _context.Banners
                .Where(b => b.IsActive == true) // Chỉ lấy các banner đang bật
                .OrderBy(b => b.Order)          // Sắp xếp theo thứ tự ưu tiên hiển thị
                .Select(b => new {
                    b.Id,
                    b.Title,
                    b.ImageUrl,
                    b.LinkUrl,
                    b.Order
                })
                .ToListAsync();

            // Trả về gói tin JSON kèm trạng thái HTTP 200 OK
            return Ok(banners);
        }

        // LỆNH 2: Lấy chi tiết thông tin của 1 Banner theo ID 
        // Đường dẫn truy cập: GET https://localhost:7238/api/Banners/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var banner = await _context.Banners
                .Select(b => new {
                    b.Id,
                    b.Title,
                    b.ImageUrl,
                    b.LinkUrl,
                    b.Order,
                    b.IsActive
                })
                .FirstOrDefaultAsync(b => b.Id == id);

            // Xử lý kịch bản lỗi bảo vệ hệ thống nếu ID truyền lên không hợp lệ
            if (banner == null)
            {
                return NotFound(new { message = "Không tìm thấy banner quảng cáo này" });
            }

            return Ok(banner);
        }
    }
}