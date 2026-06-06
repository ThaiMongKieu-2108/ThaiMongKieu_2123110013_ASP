using CMS.Data; // Đảm bảo khớp với Namespace chứa ApplicationDbContext trong Solution của em
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    // 1. Cấu hình đường dẫn API: api/CategoriesProducts
    [Route("api/[controller]")]

    // 2. Kích hoạt tính năng tự động kiểm tra lỗi dữ liệu (Validation)
    [ApiController]

    // 3. Kế thừa ControllerBase để tối ưu bộ nhớ cho API thuần dữ liệu JSON
    public class CategoriesProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // 4. Hàm khởi tạo: Nạp cơ sở dữ liệu SQL Server vào Controller thông qua DI
        public CategoriesProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// API lấy toàn bộ danh mục sản phẩm thời trang (Giao thức GET)
        /// Đường dẫn gọi dữ liệu: GET https://localhost:xxxx/api/CategoriesProducts
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                // Bước A: Quét bảng dữ liệu CategoriesProducts số nhiều dưới SQL Server lên
                var categories = await _context.CategoriesProducts
                    .OrderBy(c => c.DisplayOrder) // Ưu tiên sắp xếp theo thứ tự hiển thị
                    .Select(c => new {
                        // Bước B: Kỹ thuật gọt tỉa (Projection) - chỉ lấy các trường cần thiết ra FrontEnd
                        c.Id,
                        c.Name,
                        c.Description,
                        c.DisplayOrder,
                        c.IsActive
                    })
                    .ToListAsync(); // Chuyển đổi bất đồng bộ sang dạng danh sách mảng

            // Bước C: Trả về mã thành công HTTP 200 OK đính kèm chuỗi chữ JSON sạch
            return Ok(categories);
        }
            catch (System.Exception ex)
            {
                // Bảo vệ hệ thống: Nếu sập kết nối SQL thì trả về lỗi 500 kèm lời nhắn lý do lỗi
                return StatusCode(500, new { 
                    message = "Lỗi kết nối cơ sở dữ liệu hệ thống", 
                    detail = ex.Message
    });
            }
        }

 // =================================================================
        // 2. GET DETAIL: Lấy chi tiết một danh mục sản phẩm theo ID (api/categoryproduct/{id})
        // =================================================================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            // Tìm danh mục đầu tiên có Id khớp với tham số
            var category = await _context.CategoriesProducts
                .FirstOrDefaultAsync(c => c.Id == id);

            // Xử lý kịch bản lỗi nếu ID không tồn tại trong Database
            if (category == null)
            {
                // Trả về mã lỗi 404 kèm gói tin JSON thông báo lỗi
                return NotFound(new { message = "Không tìm thấy danh mục sản phẩm này trong hệ thống" });
            }

            // Trả về đối tượng danh mục tìm được kèm mã 200 OK
            return Ok(category);
        }
        // thêm mới một danh mục sản phẩm thời trang (Giao thức POST)
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CategoryProduct model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.CategoriesProducts.Add(model);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Thêm danh mục thành công",
                data = model
            });
        }
        // sửa một danh mục sản phẩm thời trang (Giao thức PUT)
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] CategoryProduct model)
        {
            var category = await _context.CategoriesProducts
                .FirstOrDefaultAsync(x => x.Id == id);

            if (category == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy danh mục"
                });
            }

            category.Name = model.Name;
            category.Description = model.Description;
            category.DisplayOrder = model.DisplayOrder;
            category.IsActive = model.IsActive;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Cập nhật thành công",
                data = category
            });
        }
        // xóa một danh mục sản phẩm thời trang (Giao thức DELETE)
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.CategoriesProducts
                .FirstOrDefaultAsync(x => x.Id == id);

            if (category == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy danh mục cần xóa"
                });
            }

            _context.CategoriesProducts.Remove(category);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Xóa thành công"
            });
        }
    }
}
