/*
sinh viên: Thái Mộng Kiều
mã số: 2123110013
ngày chỉnh sửa: 23-06-2026
version: 1.2 (Tích hợp rào trùng Email và băm bảo mật BCrypt cho hệ thống Khách hàng)
*/

using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using BCrypt.Net; // 🟢 Kích hoạt thư viện mã hóa bảo mật

namespace CMS.Controllers
{
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Action lấy danh sách khách hàng từ SQL Server hiển thị lên View Index.cshtml
        public IActionResult Index()
        {
            var data = _context.Customers.ToList();
            return View(data);
        }

        // ==========================================
        // KHU VỰC THÊM MỚI KHÁCH HÀNG (CREATE)
        // ==========================================

        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(Customer model)
        {
            // 🟢 TẦNG RÀO 1: Kiểm tra xem địa chỉ Email nhập vào đã tồn tại trong DB chưa
            if (!string.IsNullOrEmpty(model.Email))
            {
                var isEmailExist = _context.Customers
                    .Any(c => c.Email.Trim().ToLower() == model.Email.Trim().ToLower());

                if (isEmailExist)
                {
                    // Trả lỗi đỏ ngay tại ô nhập Email trên giao diện Form Create
                    ModelState.AddModelError("Email", "Địa chỉ Email này đã được đăng ký trên hệ thống!");
                    return View(model);
                }
            }

            if (ModelState.IsValid)
            {
                // 🟢 TẦNG BẢO MẬT: Băm mật khẩu thô tự động trước khi lưu xuống SQL Server
                if (!string.IsNullOrEmpty(model.Password))
                {
                    model.Password = BCrypt.Net.BCrypt.HashPassword(model.Password, workFactor: 12);
                }

                _context.Customers.Add(model);
                _context.SaveChanges();

                return RedirectToAction("Index");
            }

            return View(model);
        }

        // ==========================================
        // KHU VỰC CHỈNH SỬA KHÁCH HÀNG (EDIT)
        // ==========================================

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null)
            {
                return NotFound();
            }
            return View(customer);
        }

        [HttpPost]
        public IActionResult Edit(Customer model, string NewPassword)
        {
            // 🟢 TẦNG RÀO 2: Kiểm tra trùng mã Email với người dùng khác khi chỉnh sửa
            if (!string.IsNullOrEmpty(model.Email))
            {
                var isEmailUsedByOthers = _context.Customers
                    .Any(c => c.Email.Trim().ToLower() == model.Email.Trim().ToLower() && c.Id != model.Id);

                if (isEmailUsedByOthers)
                {
                    // Bắn thông báo lỗi trùng lặp sang cho giao diện Form Edit hiển thị
                    ModelState.AddModelError("Email", "Email này đã được sử dụng bởi một khách hàng khác!");
                    return View(model);
                }
            }

            if (ModelState.IsValid)
            {
                // Lấy thông tin khách hàng gốc không theo vết (AsNoTracking) để giữ lại mật khẩu nếu không đổi
                var existingCustomer = _context.Customers.AsNoTracking().FirstOrDefault(c => c.Id == model.Id);
                if (existingCustomer == null) return NotFound();

                // 🟢 XỬ LÝ MẬT KHẨU KHI EDIT: 
                if (!string.IsNullOrEmpty(NewPassword))
                {
                    // Nếu Admin nhập ô mật khẩu mới -> Thực hiện băm mới qua BCrypt
                    model.Password = BCrypt.Net.BCrypt.HashPassword(NewPassword, workFactor: 12);
                }
                else
                {
                    // Nếu Admin bỏ trống ô mật khẩu mới -> Giữ nguyên chuỗi băm cũ đang có sẵn trong DB
                    model.Password = existingCustomer.Password;
                }

                _context.Customers.Update(model);
                _context.SaveChanges();

                return RedirectToAction("Index");
            }

            return View(model);
        }

        // ==========================================
        // KHU VỰC XÓA KHÁCH HÀNG (DELETE)
        // ==========================================

        public IActionResult Delete(int id)
        {
            var customer = _context.Customers.Find(id);
            if (customer != null)
            {
                _context.Customers.Remove(customer);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}