 
using HCMSys.Helpers;
using HCMSys.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Nancy.Json;
using Nancy.Session;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NuGet.Protocol;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
namespace HCMSys.Controllers
{
     
    public class LoginController : Controller
    {
        SMDbContext db = new SMDbContext();
        string tempPath = Path.GetTempFileName();
        public IActionResult Index()
        {
            return View();
        }
       

        [AllowAnonymous]
        public IActionResult Home()
        {
 
            return View(db.vmHCM_Employee.OrderByDescending(ss => ss.iMasterId).ToList());
        }

        [HttpPost]
        public async Task<IActionResult> Login(User user)
        {
            string username = ""; Int32 isadmin = 0; Int32 iuserid = 0;
            string pwd = BCrypt.Net.BCrypt.HashPassword(user.sPassword);

            vmHCM_Users d = db.vmHCM_Users.Where(s => s.sUserName == user.sUsername).FirstOrDefault();

            string session = GenerateJwtToken(d);
            HttpContext.Session.SetString("jwt", session);
            if (d != null)
            {
                username = d.sUserName;
                isadmin = Convert.ToInt32(d.iAdmin);
                iuserid = Convert.ToInt32(d.iUserId);
            }
            else
            {
                using (StreamWriter outputFile = new StreamWriter(tempPath))
                {
                    outputFile.WriteLine("Invalid Username");
                }
                ViewBag.error = "Invalid Username";
                return View("Index");
            }
            if (session == "")
            {
                using (StreamWriter outputFile = new StreamWriter(tempPath))
                {
                    outputFile.WriteLine("Invalid Credentials");
                }
                ViewBag.error = "Invalid Credentials";
 
                return View("Index");
            }
            else
            {
                Global.sToken = session;
                HttpContext.Session.SetString("username", username);
                HttpContext.Session.SetString("userid", iuserid.ToString());
                HttpContext.Session.SetString("isadmin", isadmin.ToString());
                Global.unm = username;
                Global.userid = iuserid;
 
                using (StreamWriter outputFile = new StreamWriter(tempPath))
                {
                    outputFile.WriteLine("Login Successful");
                }
                return RedirectToAction("Home");
            }
        }

        private string GenerateJwtToken(vmHCM_Users user)
        {
            var jwtKey = Global.jwtKey ?? throw new Exception("Missing Jwt:Key");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
            new Claim(ClaimTypes.Name, user.sUserName),
            new Claim(ClaimTypes.NameIdentifier, user.iUserId.ToString()),
            new Claim(ClaimTypes.Role, user.sUserRole ?? "User"),
            new Claim(ClaimTypes.Email, user.sEmail )
        };

            var token = new JwtSecurityToken(
                issuer: Global.jwtIssue,
                audience: Global.jwtIssue,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(60),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        [HttpGet]
        public IActionResult Logout()
        {
 
            //logout(Global.sessionID);
            Global.sToken = "";
            HttpContext.Session.Remove("jwt");
            HttpContext.Session.Remove("username");
            HttpContext.Session.Remove("userid");
            HttpContext.Session.Remove("isadmin");
            
            return SignOut(new AuthenticationProperties
            {
                RedirectUri = "/Index"
            }, CookieAuthenticationDefaults.AuthenticationScheme);
            //return RedirectToAction("Index");
        }
        private bool UpdateSQL(string cmd)
        {
            bool chk = false;
            try
            {
                string query = String.Format(cmd);
                using (var command = db.Database.GetDbConnection().CreateCommand())
                {
                    command.CommandType = System.Data.CommandType.Text;
                    command.CommandText = query;
                    command.CommandTimeout = 0;
                    db.Database.OpenConnection();
                    command.ExecuteNonQuery();
                    db.Database.CloseConnection();
                }
                chk = true;
            }
            catch (System.Exception e)
            {
                string err = e.Message.ToString();
                using (StreamWriter outputFile = new StreamWriter(tempPath))
                {
                    outputFile.WriteLine(err);
                }
                chk = false;
            }
            return chk;
        }

        private class WebClient : System.Net.WebClient
        {
            public int Timeout { get; set; }

            protected override WebRequest GetWebRequest(Uri uri)
            {

                WebRequest lWebRequest = base.GetWebRequest(uri);
                lWebRequest.Timeout = Timeout;
                ((HttpWebRequest)lWebRequest).ReadWriteTimeout = Timeout;
                return lWebRequest;
            }
        }
    }
    
}
