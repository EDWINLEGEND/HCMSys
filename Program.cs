using HCMSys;
using HCMSys.Models;
 
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Add logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
 
builder.Services.AddControllers();
// Add services
builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();
builder.Services.AddControllersWithViews();

builder.Services.AddAuthentication(options =>
{
    // Cookie as default sign-in scheme
    options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
})
.AddCookie(options =>
{
    options.LoginPath = "/Login/Login";
    options.LogoutPath = "/Login/Logout";
});
 

builder.Services.AddAuthorization();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromHours(1); // Set session timeout to 30 minutes
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true; // Make the session cookie essential
});
builder.Services.AddAuthentication("HCMSys")
    .AddCookie("HCMSys", options =>
    {
        options.LoginPath = "/Login/Login";
    });
Global.connStrSql = builder.Configuration["ConnectionStrings:SMDbContext"].ToString();
Global.jwtKey = builder.Configuration["Authentication:Jwt:Key"].ToString();
Global.jwtIssue = builder.Configuration["Authentication:Jwt:Issuer"].ToString();
Global.ExcelConString = builder.Configuration["ConnectionStrings:ExcelConString"].ToString();

//builder.Services.AddDbContext<SMDbContext>(options => options.UseSqlServer(Global.connStrSql));
builder.Services.AddDbContext<SMDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration["ConnectionStrings:SMDbContext"].ToString(),
        sqlOptions =>
        {
            sqlOptions.CommandTimeout(0); // seconds
        }));
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage(); // show exception details in dev
}
else
{
    app.UseExceptionHandler("/Login/Index");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseSession();
app.UseRouting();

// Important: Authentication before Authorization and before endpoints that require auth
app.UseAuthentication();
app.UseAuthorization();


app.Use(async (context, next) =>
{
    context.Response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
    context.Response.Headers["Pragma"] = "no-cache";
    context.Response.Headers["Expires"] = "60";

    await next();
});

// Map default routes
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Login}/{action=Index}/{id?}"
);


app.MapRazorPages();

app.Run();