/*
sinh viên: Thái Mộng Kiều
mã số: 2123110013
ngày tạo: 14-05-2026
version: 1.0
 */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CMS.Data.Entities
{
    public class Post
    {
        public int Id { get; set; } // Khóa chính
        public string Title { get; set; } // Tiêu đề bài viết
        public string Content { get; set; } // Nội dung bài viết
        public string ImageUrl { get; set; }  // URL hình ảnh đại diện cho bài viết
        public DateTime CreatedDate { get; set; } = DateTime.Now; // Ngày tạo bài viết, mặc định là ngày hiện tại

        // Khóa ngoại liên kết tới Category
        public int CategoryId { get; set; } // Id của danh mục mà bài viết thuộc về
        public virtual Category Category { get; set; } // Tham chiếu đến đối tượng Category, giúp truy cập thông tin danh mục của bài viết

    }
}
