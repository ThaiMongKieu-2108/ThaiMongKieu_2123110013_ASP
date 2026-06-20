using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{
    public class Banner
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập tên hoặc tiêu đề banner")]
        [StringLength(250)]
        public string Title { get; set; }

        [Required(ErrorMessage = "Vui lòng chọn hoặc nhập đường dẫn hình ảnh")]
        public string ImageUrl { get; set; }

        [StringLength(500)]
        public string? LinkUrl { get; set; } // Đường dẫn khi click vào banner (nếu có)

        public int Order { get; set; } = 0; // Thứ tự hiển thị

        public bool IsActive { get; set; } = true; // Trạng thái hiển thị (Bật/Tắt)

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
