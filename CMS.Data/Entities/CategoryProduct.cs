/*
sinh viên: Thái Mộng Kiều
mã số: 2123110013
ngày tạo: 14-05-2026
version: 1.0
 */

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{
    public class CategoryProduct
    {
        [Key] // Ràng buộc khóa chính, tự động tăng
        public int Id { get; set; } // Khóa chính

        [Required(ErrorMessage = "Tên danh mục không được để trống")] // Ràng buộc bắt buộc, nếu không có sẽ hiển thị thông báo lỗi
        [StringLength(100)] // Ràng buộc độ dài tối đa của tên danh mục là 100 ký tự
        public string Name { get; set; } // Tên danh mục sản phẩm
        public int DisplayOrder { get; set; }
        public string? Description { get; set; } // Mô tả danh mục sản phẩm, có thể để trống (nullable)
        [StringLength(500)]
        public string? ImageUrl { get; set; }
        public bool IsActive { get; set; } = true;
        // Quan hệ: Một danh mục có nhiều sản phẩm
        public virtual ICollection<Product>? Products { get; set; } // Danh sách các sản phẩm thuộc danh mục này, có thể để trống (nullable)

    }
}
