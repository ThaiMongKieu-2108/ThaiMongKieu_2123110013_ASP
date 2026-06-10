/*
sinh viên: Thái Mộng Kiều
mã số: 2123110013
ngày tạo: 14-05-2026
version: 1.0
*/

using CMS.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ======================================================
// 1. ĐĂNG KÝ DỊCH VỤ (SERVICES)
// ======================================================

// MVC
builder.Services.AddControllersWithViews();

// Swagger (ĐƯỢC GIỮ NGUYÊN)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// Authentication Cookie
builder.Services.AddAuthentication(
    CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";
        options.AccessDeniedPath = "/Account/AccessDenied";
    });

// ---- CẤU HÌNH CORS (Đã cập nhật theo hướng dẫn) ----
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Cho phép ReactJS ở port 3000 gọi tới
              .AllowAnyHeader()                     // Cho phép mọi loại Header (Content-Type, Authorization...)
              .AllowAnyMethod()                     // Cho phép mọi phương thức HTTP (GET, POST, PUT, DELETE)
              .AllowCredentials();                  // Hỗ trợ truyền Cookie/Session nếu cần sau này
    });
});

var app = builder.Build();

// ======================================================
// 2. CẤU HÌNH MIDDLEWARE
// ======================================================

// Swagger (ĐƯỢC GIỮ NGUYÊN)
app.UseSwagger();

app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "ThaiMongKieuCMS Web API v1");
    c.RoutePrefix = "swagger";
});

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseRouting();

// Kích hoạt CORS đúng vị trí này (Sau UseRouting và trước UseAuthentication/UseAuthorization)
app.UseCors("AllowReactApp");

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// ======================================================
// 3. ROUTING
// ======================================================

// API Controller
app.MapControllers();

// MVC Controller
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();