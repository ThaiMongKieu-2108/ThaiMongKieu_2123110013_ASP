# 📝 DỰ ÁN HỆ THỐNG QUẢN TRỊ NỘI DUNG - CMS FULL-STACK

## 👤 Thông tin sinh viên

* **Họ và tên:** Thái Mộng Kiều
* **Mã số sinh viên:** 2123110013
* **Giảng viên hướng dẫn:** ThS. Nguyễn Cao Thái
* **Công nghệ sử dụng:** .NET 8.0, ASP.NET Core MVC, ASP.NET Web API, Entity Framework Core, SQL Server, CKEditor 5, Bootstrap 5.

---

# 📌 Giới thiệu dự án

Đây là dự án **Hệ thống Quản trị Nội dung (CMS - Content Management System)** được xây dựng theo mô hình **Full-stack Backend + Frontend**, hỗ trợ quản lý bài viết, người dùng, phân quyền, xác thực đăng nhập và cung cấp dữ liệu thông qua Web API.

Dự án được tổ chức theo kiến trúc **3 lớp (3-Layer Architecture)**:

* **CMS.Data** → Quản lý Entity, DbContext và dữ liệu.
* **CMS.Backend** → Trang quản trị Admin + Web API.
* **Frontend (ReactJS - dự kiến)** → Giao diện người dùng sử dụng API.

---

# 📅 Nhật ký tiến độ thực hiện

## 🔹 Buổi 1: Khởi tạo Solution & Thiết kế Entity

### Nội dung thực hiện

* Khởi tạo Solution `ThaiMongKieuCMS_Solution`.
* Xây dựng kiến trúc 3 lớp:

  * `CMS.Data`
  * `CMS.Backend`
  * Frontend
* Thiết kế các Entity:

  * Category
  * Post
  * User
  * CategoryProduct
  * Product
  * Customer
  * Order
  * OrderDetail
* Thiết lập `Project Reference` giữa các project.
* Tạo dữ liệu giả (Mock Data) để kiểm tra giao diện Razor View.

---

## 🔹 Buổi 2: Kết nối Database với Entity Framework Core

### Nội dung thực hiện

* Cài đặt Entity Framework Core:

  * `Microsoft.EntityFrameworkCore.SqlServer`
  * `Microsoft.EntityFrameworkCore.Tools`
  * `Microsoft.EntityFrameworkCore.Design`
* Tạo `ApplicationDbContext`.
* Cấu hình `DefaultConnection` trong `appsettings.json`.
* Đăng ký DbContext trong `Program.cs`.
* Thực hiện Migration:

  ```powershell
  Add-Migration InitialCreate
  Update-Database
  ```
* Tạo cơ sở dữ liệu SQL Server tự động bằng Code First.
* Kết nối dữ liệu thật từ SQL Server thay cho Mock Data.

---

## 🔹 Buổi 3: Truy vấn LINQ & CRUD

### Nội dung thực hiện

* Sử dụng LINQ:

  * `.Where()`
  * `.OrderByDescending()`
  * `.Include()`
* Xây dựng đầy đủ CRUD:

  * **Create**
  * **Read**
  * **Update**
  * **Delete**
* Tách xử lý:

  * `[HttpGet]` → Hiển thị Form
  * `[HttpPost]` → Xử lý dữ liệu gửi lên
* Sử dụng:

  ```csharp
  _context.SaveChanges();
  ```

  để lưu dữ liệu xuống SQL Server.

---

## 🔹 Buổi 4: Hoàn thiện giao diện Admin & Quản lý User

### Nội dung thực hiện

* Xây dựng Layout quản trị:

  * `_LayoutAdmin.cshtml`
* Thiết kế Sidebar điều hướng bằng Bootstrap.
* Quản lý bài viết (Post):

  * Dropdown Category
  * Upload hình ảnh (`IFormFile`)
  * Lưu ảnh vào `wwwroot/uploads`
  * Sinh tên file bằng `Guid.NewGuid()`
* Tích hợp **CKEditor 5** cho trình soạn thảo nội dung.
* Hiển thị HTML bằng:

  ```cshtml
  @Html.Raw(Model.Content)
  ```
* Xây dựng phân hệ User:

  * Thêm User
  * Chỉnh sửa User
  * Phân quyền:

    * Admin
    * Editor
  * Giữ nguyên mật khẩu cũ nếu không nhập mật khẩu mới.

---

## 🔹 Buổi 5: Authentication & Authorization

### Nội dung thực hiện

* Cấu hình Cookie Authentication:

  ```csharp
  AddAuthentication()
  ```
* Thiết lập:

  * Trang đăng nhập
  * Trang AccessDenied
* Xây dựng:

  * `Login`
  * `Logout`
* Xác thực người dùng bằng:

  * `Claims`
  * `ClaimsIdentity`
  * `ClaimsPrincipal`
* Sử dụng:

  ```csharp
  [Authorize]
  ```

  để bảo vệ Controller.
* Phân quyền theo Role:

  ```csharp
  [Authorize(Roles = "Admin")]
  ```
* Hiển thị thông tin người dùng đang đăng nhập trên Layout.

---

## 🔹 Buổi 6: Web API RESTful & CORS

### Nội dung thực hiện

* Xây dựng `PostsController` dạng API.
* Cấu hình:

  ```csharp
  [ApiController]
  [Route("api/[controller]")]
  ```
* Xây dựng API:

  * `GetAll()`
  * `GetByCategory(id)`
  * `GetDetail(id)`
* Trả dữ liệu JSON theo chuẩn RESTful.
* Xử lý HTTP Status Code:

  * `200 OK`
  * `404 NotFound`
* Kiểm thử API bằng **Swagger UI**.
* Cấu hình **CORS** để ReactJS có thể truy cập API:

  ```csharp
  app.UseCors("AllowAll");
  ```

---

# 🚀 Hướng dẫn chạy dự án

## 1. Cấu hình Database

Mở file:

```bash
CMS.Backend/appsettings.json
```

Chỉnh sửa chuỗi kết nối:

```json
"DefaultConnection"
```

cho phù hợp với SQL Server trên máy.

---

## 2. Cập nhật Database

Mở **Package Manager Console**:

```powershell
Update-Database
```

---

## 3. Chạy dự án

Nhấn:

```text
F5
```

hoặc nút **Start** trong Visual Studio.

### Đường dẫn truy cập

* **Trang quản trị:**

```text
https://localhost:xxxx/
```

* **Swagger API:**

```text
https://localhost:xxxx/swagger
```

---

## 📌 Chức năng chính

✅ Quản lý bài viết (CRUD)
✅ Quản lý người dùng
✅ Upload hình ảnh
✅ CKEditor 5
✅ Authentication bằng Cookie
✅ Authorization theo Role
✅ Web API RESTful
✅ Swagger API Documentation
✅ CORS cho ReactJS
✅ Kết nối SQL Server bằng Entity Framework Core

---

**Cập nhật tiến độ mới nhất:** 28/05/2026
**Sinh viên thực hiện:** Thái Mộng Kiều
