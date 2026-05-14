/*
sinh viên: Thái Mộng Kiều
mã số: 2123110013
ngày tạo: 14-05-2026
version: 1.0
 */

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{
    public class Product
    {
        [Key] //Ràng buộc khóa chính, tự động tăng
        public int Id { get; set; } // Khóa chính

        [Required(ErrorMessage = "Tên sản phẩm không được để trống")] // Ràng buộc bắt buộc, nếu không có sẽ hiển thị thông báo lỗi
        public string Name { get; set; } // Tên sản phẩm

        public string? Description { get; set; } // Mô tả sản phẩm, có thể để trống (nullable)

        [Range(0, double.MaxValue)] // Ràng buộc giá phải lớn hơn hoặc bằng 0, nếu không sẽ hiển thị thông báo lỗi
        [Column(TypeName = "decimal(18,2)")] // Ràng buộc kiểu dữ liệu của cột trong cơ sở dữ liệu là decimal với độ chính xác 18 và số thập phân 2
        public decimal Price { get; set; } // Giá sản phẩm

        public int StockQuantity { get; set; } // Số lượng tồn kho của sản phẩm

        public string? ImageUrl { get; set; } // URL hình ảnh đại diện cho sản phẩm, có thể để trống (nullable)

        // Khóa ngoại nối tới CategoryProduct
        public int CategoryProductId { get; set; } // Id của danh mục sản phẩm mà sản phẩm thuộc về

        [ForeignKey("CategoryProductId")] // Ràng buộc khóa ngoại, liên kết với thuộc tính CategoryProductId
        public virtual CategoryProduct? CategoryProduct { get; set; } // Tham chiếu đến đối tượng CategoryProduct, giúp truy cập thông tin danh mục sản phẩm của sản phẩm, có thể để trống (nullable)

    }
}
