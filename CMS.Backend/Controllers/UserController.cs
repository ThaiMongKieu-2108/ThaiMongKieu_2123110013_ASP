/*
sinh viên: Thái Mộng Kiều
mã số: 2123110013
ngày cập nhật: 23-06-2026
version: 1.1 (Tích hợp băm mật khẩu bảo mật một chiều qua BCrypt.Net)
 */
using CMS.Data; // Thêm using cho ApplicationDbContext
using CMS.Data.Entities; // Thêm using cho các thực thể dữ liệu nếu cần thiết
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using BCrypt.Net; // 🟢 ĐÃ ĐƯA LÊN TRÊN CÙNG: Kích hoạt thư viện mã hóa bảo mật

namespace CMS.Backend.Controllers;

[Authorize(Roles = "Admin")]
public class UserController : Controller
{
    private readonly ApplicationDbContext _context;

    // "Tiêm" kết nối Database vào Controller tương tự như CategoryController
    public UserController(ApplicationDbContext context)
    {
        _context = context;
    }

    // Action lấy danh sách thành viên
    public IActionResult Index()
    {
        var data = _context.Users.ToList(); // Lấy tất cả thành viên từ bảng Users trong SQL
        return View(data);
    }

    // HIỂN THỊ FORM CREATE
    [HttpGet]
    public IActionResult Create()
    {
        return View();
    }

    [HttpPost]
    public IActionResult Create(User model)
    {
        // Kiểm tra xem tên đăng nhập đã tồn tại chưa
        var checkExist = _context.Users.Any(u => u.Username == model.Username);
        if (checkExist)
        {
            ModelState.AddModelError("Username", "Tên đăng nhập này đã có người dùng!");
            return View(model);
        }

        // 🔥 TIẾN HÀNH MÃ HÓA: Băm mật khẩu thô thành chuỗi bảo mật trước khi Insert vào SQL Server
        if (!string.IsNullOrEmpty(model.PasswordHash))
        {
            model.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.PasswordHash, workFactor: 12);
        }

        // Lưu User mới vào Database
        _context.Users.Add(model);
        _context.SaveChanges();

        return RedirectToAction("Index");
    }

    [HttpGet]
    public IActionResult Edit(int id)
    {
        var user = _context.Users.Find(id);
        if (user == null) return NotFound();

        return View(user);
    }

    // POST: Thực hiện lưu thay đổi
    [HttpPost]
    public IActionResult Edit(User model, string NewPassword)
    {
        // 1. Tìm User gốc trong Database để lấy lại mật khẩu cũ nếu cần
        var existingUser = _context.Users.AsNoTracking().FirstOrDefault(u => u.Id == model.Id);

        if (existingUser == null) return NotFound();

        // 2. Xử lý mật khẩu: Nếu nhập mới thì thực hiện băm bảo mật, nếu trống thì giữ nguyên chuỗi cũ trong DB
        if (!string.IsNullOrEmpty(NewPassword))
        {
            // 🔥 TIẾN HÀNH MÃ HÓA: Mật khẩu mới nhập vào sẽ được băm một chiều an toàn bằng BCrypt
            model.PasswordHash = BCrypt.Net.BCrypt.HashPassword(NewPassword, workFactor: 12);
        }
        else
        {
            // Nếu không điền mật khẩu mới, giữ lại chuỗi băm cũ đã có trong Database
            model.PasswordHash = existingUser.PasswordHash;
        }

        // 3. Cập nhật vào Database
        _context.Users.Update(model);
        _context.SaveChanges();

        return RedirectToAction("Index");
    }

    public IActionResult Delete(int id)
    {
        var user = _context.Users.Find(id);
        if (user != null)
        {
            _context.Users.Remove(user);
            _context.SaveChanges();
        }
        return RedirectToAction("Index");
    }
}