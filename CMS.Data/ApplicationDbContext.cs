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
using Microsoft.EntityFrameworkCore;
using CMS.Data.Entities;

namespace CMS.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
          : base(options) { }

        // Khai báo các bảng dữ liệu
        public DbSet<Category> Categories { get; set; } // Bảng danh mục
        public DbSet<Post> Posts { get; set; } // Bảng bài viết
        public DbSet<User> Users { get; set; } // Bảng người dùng
        public DbSet<CategoryProduct> CategoriesProducts { get; set; } // Bảng trung gian giữa Category và Product
        public DbSet<Product> Products { get; set; } // Bảng sản phẩm
        public DbSet<Customer> Customers { get; set; } // Bảng khách hàng
        public DbSet<Order> Orders { get; set; } // Bảng đơn hàng
        public DbSet<OrderDetail> OrderDetails { get; set; } // Bảng chi tiết đơn hàng

    }
}
