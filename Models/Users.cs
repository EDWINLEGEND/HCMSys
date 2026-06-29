using System;
using System.ComponentModel.DataAnnotations;

namespace HCMSys.Models
{
    public class LoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }

    public class User
    {
        public int iUserId { get; set; }
        public string sUsername { get; set; } = null!;
        public string sPassword { get; set; } = null!;
        public string? sToken { get; set; }
        public string? sRole { get; set; }
    }
    public class tmHCM_Users
    {
        [Key]
        public Int32? iUserId { get; set; }
        public string? sUserName { get; set; }
        public string? sPassword { get; set; }
        public string? sToken { get; set; }
        public string? sEmail { get; set; }
        public Int32? iEmployee { get; set; }
        public Int32? iStatus { get; set; }
        public Int32? iAdmin { get; set; }
        public Int32? iUserRole { get; set; }
        public Int32? iUserType { get; set; }
        public Int32? iCreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public Int32? iModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public Int32? RememberMe { get; set; }
    }
    public class vmHCM_Users
    {
        [Key]
        public Int32 iUserId { get; set; }
        public string sUserName { get; set; }
        public string sPassword { get; set; }
        public string sToken { get; set; }
        public string sEmail { get; set; }
        public Int32 iEmployee { get; set; }
        public string EmployeeCode { get; set; }
        public string EmployeeName { get; set; }
        public Int32 iStatus { get; set; }
        public string sStatus { get; set; }
        public Int32 iAdmin { get; set; }
        public Int32 iUserRole { get; set; }
        public string sUserRole { get; set; }
        public Int32 iUserType { get; set; }
        public string sUserType { get; set; }
        public Int32 iCreatedBy { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public Int32 iModifiedBy { get; set; }
        public string ModifiedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public Int32 RememberMe { get; set; }
    }
}
