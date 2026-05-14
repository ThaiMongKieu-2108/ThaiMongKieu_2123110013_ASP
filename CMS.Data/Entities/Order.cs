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
    public class Order
    {
        [Key] // Ràng buộc khóa chính, tự động tăng
        public int Id { get; set; } // Khóa chính

        public DateTime OrderDate { get; set; } = DateTime.Now; // Ngày đặt hàng, mặc định là ngày hiện tại
        public int CustomerId { get; set; } // Khóa ngoại liên kết tới Customer

        public int Status { get; set; } // 0: Chờ duyệt, 1: Đang giao, 2: Đã xong

        public string? Notes { get; set; } // Ghi chú đơn hàng, có thể để trống (nullable)

        [ForeignKey("CustomerId")] // Ràng buộc khóa ngoại, liên kết với thuộc tính CustomerId
        public virtual Customer? Customer { get; set; } // Tham chiếu đến đối tượng Customer, giúp truy cập thông tin khách hàng của đơn hàng, có thể để trống (nullable)

        public virtual ICollection<OrderDetail>? OrderDetails { get; set; } // Danh sách chi tiết đơn hàng, có thể để trống (nullable)

    }
}
