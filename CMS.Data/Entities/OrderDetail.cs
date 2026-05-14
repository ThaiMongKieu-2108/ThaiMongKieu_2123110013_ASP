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
    public class OrderDetail
    {
        [Key] // Ràng buộc khóa chính, tự động tăng
        public int Id { get; set; } // Khóa chính

        public int OrderId { get; set; } // Khóa ngoại liên kết tới Order

        public int ProductId { get; set; } // Khóa ngoại liên kết tới Product

        public int Quantity { get; set; } // Số lượng sản phẩm trong đơn hàng

        [Column(TypeName = "decimal(18,2)")] // Ràng buộc kiểu dữ liệu của cột trong cơ sở dữ liệu là decimal với độ chính xác 18 và số thập phân 2
        public decimal UnitPrice { get; set; } // Giá tại thời điểm mua

        [ForeignKey("OrderId")] // khóa ngoại

        public virtual Order? Order { get; set; } // Tham chiếu đến đối tượng Order, giúp truy cập thông tin đơn hàng của chi tiết đơn hàng, có thể để trống (nullable)

        [ForeignKey("ProductId")] // khóa ngoại
        public virtual Product? Product { get; set; } // Tham chiếu đến đối tượng Product, giúp truy cập thông tin sản phẩm của chi tiết đơn hàng, có thể để trống (nullable)

    }
}
