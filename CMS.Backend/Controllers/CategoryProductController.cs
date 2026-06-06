/*
sinh viên: Thái Mộng Kiều
mã số: 2123110013
ngày tạo: 20-05-2026
version: 1.0
*/

using CMS.Data;
using CMS.Data.Entities; // Namespace chứa thực thể CategoryProduct
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace CMS.Controllers
{
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        // "Tiêm" kết nối Database Context vào Controller 
        public CategoryProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Action lấy dữ liệu THẬT từ bảng CategoriesProducts lên giao diện
        public IActionResult Index()
        {
            // Truy vấn lấy toàn bộ danh sách danh mục sản phẩm từ SQL Server
            var data = _context.CategoriesProducts.ToList();

            return View(data);
        }
        // Hiển thị form thêm
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // Lưu dữ liệu thêm mới
        [HttpPost]
        public IActionResult Create(CategoryProduct model)
        {
            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Add(model);
                _context.SaveChanges();

                return RedirectToAction("Index");
            }

            return View(model);
        }

        // Hiển thị form sửa
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var category = _context.CategoriesProducts.Find(id);

            if (category == null)
                return NotFound();

            return View(category);
        }

        // Lưu dữ liệu sửa
        [HttpPost]
        public IActionResult Edit(CategoryProduct model)
        {
            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Update(model);
                _context.SaveChanges();

                return RedirectToAction("Index");
            }

            return View(model);
        }

        // Xóa
        public IActionResult Delete(int id)
        {
            var category = _context.CategoriesProducts.Find(id);

            if (category != null)
            {
                _context.CategoriesProducts.Remove(category);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}