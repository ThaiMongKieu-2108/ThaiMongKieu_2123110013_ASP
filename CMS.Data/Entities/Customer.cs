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
    public class Customer
    {
        [Key] // Ràng buộc khóa chính, tự động tăng
        public int Id { get; set; } // Khóa chính

        [Required] // Ràng buộc bắt buộc, nếu không có sẽ hiển thị thông báo lỗi
        public string FullName { get; set; } // Họ và tên đầy đủ của khách hàng

        [Required] // Ràng buộc bắt buộc, nếu không có sẽ hiển thị thông báo lỗi
        [EmailAddress] // Ràng buộc định dạng email, nếu không đúng sẽ hiển thị thông báo lỗi
        public string Email { get; set; } // Địa chỉ email của khách hàng

        public string? Phone { get; set; } // Số điện thoại của khách hàng, có thể để trống (nullable)

        public string? Address { get; set; } // Địa chỉ của khách hàng, có thể để trống (nullable)

        [Required] // Ràng buộc bắt buộc, nếu không có sẽ hiển thị thông báo lỗi
        public string Password { get; set; } // Lưu mật khẩu thô theo yêu cầu tối giản

        public virtual ICollection<Order>? Orders { get; set; } // Danh sách các đơn hàng của khách hàng, có thể để trống (nullable)

    }
}
