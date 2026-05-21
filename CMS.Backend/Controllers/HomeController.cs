using CMS.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using Microsoft.EntityFrameworkCore;
using CMS.Data; // Thư mục chứa DbContext [cite: 568]
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class HomeController : Controller
    {
        private readonly ApplicationDbContext _context;

        public HomeController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // LINQ: Lấy 3 bài viết mới nhất
            var latestPosts = _context.Posts
                .Include(p => p.Category) // Lấy kèm thông tin Danh mục (Join bảng)
                .OrderByDescending(p => p.CreatedDate) // Sắp xếp theo ngày tạo mới nhất    
                .Take(3) // Lấy 3 bài viết đầu tiên sau khi đã sắp xếp (tức là 3 bài mới nhất)
                .ToList();// Chuyển kết quả thành List để truyền sang View

            return View(latestPosts);
        }

    }
}
