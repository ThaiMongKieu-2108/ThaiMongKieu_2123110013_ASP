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
    public class User
    {
        public int Id { get; set; } // Khóa chính
        public string Username { get; set; } // Tên đăng nhập
        public string PasswordHash { get; set; } // Mật khẩu đã được mã hóa để bảo mật
        public string FullName { get; set; } // Họ và tên đầy đủ của người dùng
        public string Role { get; set; } // Vai trò của người dùng (ví dụ: Admin, Editor, User)                                
    }
}
