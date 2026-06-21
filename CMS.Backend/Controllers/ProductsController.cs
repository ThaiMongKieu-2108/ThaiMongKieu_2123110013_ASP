using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    // 1. Định nghĩa đường dẫn để gọi API. [controller] sẽ tự lấy tên là "Products"
    // Khi chạy, địa chỉ truy cập dữ liệu sẽ là: https://localhost:xxxx/api/products
    [Route("api/[controller]")]

    // 2. Đánh dấu đây là một API Controller để hệ thống hỗ trợ các tính năng tự động kiểm tra dữ liệu đầu vào
    [ApiController]

    // 3. API Controller phải kế thừa từ ControllerBase (thay vì kế thừa từ Controller như phân hệ MVC)
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        // 4. Hàm khởi tạo (Constructor): "Tiêm" ngữ cảnh dữ liệu SQL Server vào để sử dụng
        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        /// 1. 
        /// <summary>
        /// API Endpoint: GET https://localhost:xxxx/api/Products
        /// Nhận các tham số lọc động được gửi từ { params: filters } của ReactJS
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] int? categoryProductId,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] string? keyword)
        {
            try
            {
                // Bước 1: Khởi tạo câu truy vấn dạng IQueryable để tối ưu hiệu năng (Chưa thực thi xuống Database)
                var query = _context.Products.AsQueryable();

                // Bước 2: Kiểm tra và cộng dồn các điều kiện lọc bằng LINQ (Cơ chế Deferred Execution)

                // Lọc theo Danh mục sản phẩm nếu FrontEnd có truyền categoryProductId khác null
                if (categoryProductId.HasValue)
                {
                    query = query.Where(p => p.CategoryProductId == categoryProductId.Value);
                }

                // Lọc theo Sàn giá tối thiểu
                if (minPrice.HasValue)
                {
                    query = query.Where(p => p.Price >= minPrice.Value);
                }

                // Lọc theo Trần giá tối đa
                if (maxPrice.HasValue)
                {
                    query = query.Where(p => p.Price <= maxPrice.Value);
                }

                // Tìm kiếm gần đúng theo từ khóa tên sản phẩm (Không phân biệt hoa thường trong SQL)
                if (!string.IsNullOrEmpty(keyword))
                {
                    // Sử dụng hàm Contains để sinh ra câu lệnh LIKE '%keyword%' trong T-SQL
                    query = query.Where(p => p.Name.Contains(keyword.Trim()));
                }

                // Bước 3: Sắp xếp sản phẩm mới nhất lên đầu và đẩy câu lệnh SQL hoàn chỉnh xuống SQL Server
                var result = await query
                    .OrderByDescending(p => p.Id)
                    .ToListAsync();

                return Ok(result); // Trả về mã HTTP 200 kèm mảng dữ liệu JSON đã thanh lọc
            }
            catch (System.Exception ex)
            {
                // Tránh sập ứng dụng Backend, ghi nhận nhật ký lỗi hệ thống
                return StatusCode(500, $"Lỗi hệ thống SQL Server: {ex.Message}");
            }
        }

        // 2. Định nghĩa đường dẫn chứa tham số động: api/products/categoryproduct/{categoryproductId}
        [HttpGet("categoryproduct/{categoryProductId}")]
        public async Task<IActionResult> GetByCategoryProduct(int categoryProductId)
        {
            // Lọc các bài viết có CategoryId trùng với ID truyền vào từ thanh URL
            var products = await _context.Products
                .Where(p => p.CategoryProductId == categoryProductId)
                .OrderByDescending(p => p.Id)
                .ToListAsync();

            return Ok(products);
        }

        // 3. Định nghĩa đường dẫn nhận ID trực tiếp: api/products/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            // 3.1. Quét bảng Products để tìm sản phẩm đầu tiên có Id khớp với tham số
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Id == id);

            // 3.2 Xử lý kịch bản lỗi bảo vệ hệ thống: ID không tồn tại trong Database
            if (product == null)
            {
                // Trả về mã lỗi 404 kèm một "gói tin" JSON thông báo nhỏ gọn để Frontend tự xử lý UI
                return NotFound(new { message = "Không tìm thấy sản phẩm này trong hệ thống" });
            }

            // 3.3. Trả về toàn bộ đối tượng sản phẩm (bao gồm cả trường Content chứa mã HTML) kèm mã 200 OK
            return Ok(product);
        }

        // 4. Thêm mới sản phẩm
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Product model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Products.Add(model);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Thêm sản phẩm thành công",
                data = model
            });
        }

        // 5. Cập nhật thông tin sản phẩm dựa vào ID
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Product model)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(x => x.Id == id);

            if (product == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy sản phẩm"
                });
            }

            product.Name = model.Name;
            product.Description = model.Description;
            product.Price = model.Price;
            product.StockQuantity = model.StockQuantity;
            product.ImageUrl = model.ImageUrl;
            product.CategoryProductId = model.CategoryProductId;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Cập nhật thành công",
                data = product
            });
        }

        // 6. Xóa sản phẩm ra khỏi cơ sở dữ liệu
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(x => x.Id == id);

            if (product == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy sản phẩm"
                });
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Xóa thành công"
            });
        }
    }
}