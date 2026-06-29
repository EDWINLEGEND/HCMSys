using DocumentFormat.OpenXml.Spreadsheet;
using HCMSys.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace HCMSys.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;

        public AuthController(IConfiguration config)
        {
            _config = config;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginModel login)
        {
            //if (login.Username == "admin" && login.Password == "password123")
            //{
            //    var token = GenerateToken(login.Username);
            //    return Ok(new { token });
            //}
            try
            {
                if (login.Username == "smitha" && login.Password == "password123")
                {
                    //var token = GenerateToken(login.Username);
                    var claims = new[]
                     {
                            new Claim(ClaimTypes.Name, login.Username),
                            new Claim(ClaimTypes.Role, "Admin"),
                            new Claim(ClaimTypes.NameIdentifier, "1")
                        };

                    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("ThisIsASecretKey123!TestEntryFromSmithaSebastian"));
                    var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

                    var token = new JwtSecurityToken(
                        issuer: "http://localhost/HCMSys",
                        audience: "http://localhost/HCMSys",
                        claims: claims,
                        expires: DateTime.UtcNow.AddHours(1),
                        signingCredentials: creds);

                    return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(token) });
                }

                //var jwt = new JwtSecurityTokenHandler().WriteToken(token);
                //return Ok(new { token });
                //}
                return Unauthorized("Invalid username or password");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"JWT creation error: {ex.Message}");
            }
            //return Unauthorized("Invalid username or password");
        }

        private string GenerateToken(string username)
        {
            string ss = _config["Jwt:Key"];
 
            if (string.IsNullOrEmpty(ss) || ss.Length < 32)
            {
            
            }
            var s = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("ThisIsASecretKey123!TestEntryFromSmithaSebastian"));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, "Admin"),
                new Claim(ClaimTypes.NameIdentifier, 1.ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

}
