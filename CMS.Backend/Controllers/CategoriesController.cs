/*
sinh viên: Thái Mộng Kiều
mã số: 2123110013
ngày cập nhật: 10-06-2026
version: 1.0
 */

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;

namespace CMS.Backend.Controllers
{
    // 1. Định nghĩa đường dẫn gọi API. Tên Controller là "Categories" nên URL sẽ là: api/Categories
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // 2. Hàm khởi tạo (Constructor): Tiêm DBContext kết nối SQL Server vào
        public CategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // LỆNH 1: Lấy toàn bộ danh sách chủ đề tin tức (Phục vụ cho BlogCategoryList bên React)
        // Đường dẫn truy cập: GET https://localhost:7238/api/Categories
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // Lấy dữ liệu từ bảng Categories, gọt tỉa các trường dữ liệu cần thiết
            var categories = await _context.Categories
                .OrderBy(c => c.Name) // Sắp xếp danh mục theo thứ tự bảng chữ cái A-Z
                .Select(c => new {
                    c.Id,
                    c.Name,
                    c.Description
                })
                .ToListAsync();

            // Trả về gói tin JSON kèm trạng thái HTTP 200 OK
            return Ok(categories);
        }

        // LỆNH 2: Lấy chi tiết thông tin của 1 chủ đề theo ID 
        // Đường dẫn truy cập: GET https://localhost:7238/api/Categories/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var category = await _context.Categories
                .Select(c => new {
                    c.Id,
                    c.Name,
                    c.Description
                })
                .FirstOrDefaultAsync(c => c.Id == id);

            // Xử lý kịch bản lỗi bảo vệ hệ thống nếu ID truyền lên không hợp lệ
            if (category == null)
            {
                return NotFound(new { message = "Không tìm thấy danh mục bài viết này" });
            }

            return Ok(category);
        }
    }
}