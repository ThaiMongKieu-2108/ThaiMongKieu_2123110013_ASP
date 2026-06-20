/*
sinh viên: Thái Mộng Kiều
mã số: 2123110013
ngày tạo: 19-06-2026
version: 1.0
 */

using CMS.Backend.Models; // Thay đổi namespace này nếu model Banner nằm ở CMS.Data.Entities
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class BannerController : Controller
    {
        private readonly ApplicationDbContext _context;

        // "Tiêm" kết nối database vào Controller
        public BannerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 1. Trang danh sách hiển thị toàn bộ Banner trong trang quản trị
        public IActionResult Index()
        {
            // Lấy dữ liệu THẬT từ bảng Banners trong SQL xếp theo thứ tự hiển thị
            var data = _context.Banners.OrderBy(b => b.Order).ToList();
            return View(data);
        }

        // 2. Hàm GET: Dùng để hiển thị giao diện Form thêm mới Banner
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // 3. Hàm POST: Dùng để đón dữ liệu từ Form gửi lên và lưu vào SQL
        [HttpPost]
        public IActionResult Create(Banner model)
        {
            if (ModelState.IsValid)
            {
                // BƯỚC 1: Thêm dữ liệu vào bộ nhớ tạm của Entity Framework
                _context.Banners.Add(model);

                // BƯỚC 2: Ra lệnh cho hệ thống ghi dữ liệu thật sự vào SQL Server
                _context.SaveChanges();

                // Sau khi lưu thành công, tự động quay về trang danh sách banner
                return RedirectToAction("Index");
            }

            return View(model);
        }

        // 4. Hàm GET: Tìm dữ liệu Banner cũ và đổ lên Form chỉnh sửa
        [HttpGet]
        public IActionResult Edit(int id)
        {
            // Tìm đối tượng banner trong Database bằng Id
            var banner = _context.Banners.Find(id);

            if (banner == null) return NotFound();

            return View(banner); // Gửi đối tượng tìm được sang giao diện Edit.cshtml
        }

        // 5. Hàm POST: Nhận dữ liệu Banner mới sửa đổi từ người dùng và lưu lại
        [HttpPost]
        public IActionResult Edit(Banner model)
        {
            if (ModelState.IsValid)
            {
                // Lệnh cập nhật đối tượng vào bộ nhớ tạm
                _context.Banners.Update(model);

                // Lưu thay đổi thực sự xuống SQL Server
                _context.SaveChanges();

                // Quay lại trang danh sách để xem kết quả cập nhật
                return RedirectToAction("Index");
            }

            return View(model);
        }

        // 6. Action nhận vào Id của Banner cần xóa khỏi hệ thống
        public IActionResult Delete(int id)
        {
            // Bước 1: Tìm đối tượng Banner trong Database bằng Id
            var banner = _context.Banners.Find(id);

            // Kiểm tra nếu tìm thấy thì tiến hành xóa
            if (banner != null)
            {
                // Bước 2: Lệnh xóa khỏi bộ nhớ tạm (Tracking)
                _context.Banners.Remove(banner);

                // Bước 3: Chốt phiên làm việc, xóa thực sự trong SQL Server
                _context.SaveChanges();
            }

            // Sau khi xóa xong, quay lại trang danh sách để cập nhật lại giao diện hiển thị
            return RedirectToAction("Index");
        }
    }
}