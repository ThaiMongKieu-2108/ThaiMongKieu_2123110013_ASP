/*
sinh viên: Thái Mộng Kiều
mã số: 2123110013
ngày tạo: 14-05-2026
version: 1.0
 */

using Microsoft.AspNetCore.Mvc;
using CMS.Data.Entities; // Thêm using cho các thực thể dữ liệu nếu cần thiết
namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        public IActionResult Index()
        {
            // 1. Tạo danh sách Người dùng giả (Mock Data)
            var users = new List<User>
            {
                new User
                {
                    Id = 1,
                    Username = "admin_thai",
                    FullName = "Nguyễn Cao Thái",
                    Role = "Administrator"
                },
                new User
                {
                    Id = 2,
                    Username = "editor_01",
                    FullName = "Trần Văn Biên Tập",
                    Role = "Editor"
                },
                new User
                {
                    Id = 3,
                    Username = "author_minh",
                    FullName = "Lê Quang Minh",
                    Role = "Author"
                }
            };

            // 2. Trả về View kèm theo danh sách người dùng
            return View(users);

        }
    }
}
