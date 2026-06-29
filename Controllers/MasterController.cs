using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.InkML;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Wordprocessing;
using HCMSys.Helpers;
 
using HCMSys.Models;
 
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.NetworkInformation;
using System.Runtime.Intrinsics.Arm;
using System.Text;
using System.Threading.Tasks;
namespace HCMSys.Controllers
{
    public class MasterController : Controller
    {
        SMDbContext db = new SMDbContext();
        private readonly IWebHostEnvironment _env;
        public MasterController(  IWebHostEnvironment env )
        {
     
            _env = env;
 
        } 
        /// <summary>
        /// ////Project master
        /// </summary>
        /// <returns></returns>
        public ActionResult ProjectIndex()
        {
            var token = HttpContext.Session.GetString("jwt");
            if (token == null || JwtHelper.IsTokenExpired(token))
            {
                return RedirectToAction("Index", "Login");
            }
            return View(db.vmHCM_Project.ToList());
        }
        [HttpPost]
        public JsonResult CreateProject(tmHCM_Project tmMaster)
        {
            try
            {
                var token = HttpContext.Session.GetString("jwt");
                if (token == null || JwtHelper.IsTokenExpired(token))
                {
                    return Json("Invalid Session");
                }
                tmHCM_Project d = new tmHCM_Project();
                if (tmMaster.sCode != "" && tmMaster.sCode != null)
                {
                    tmHCM_Project act = db.tmHCM_Project.Where(s => s.sCode.ToLower() == tmMaster.sCode.ToLower() && s.iStatus < 5).FirstOrDefault();
                    if (act != null)
                    {
                        return Json("Duplicate Code");
                    }
                    else
                    {
                        if (tmMaster.sName != null)
                            d.sName = tmMaster.sName;
                        else
                            d.sName = "";
                        d.sCode = tmMaster.sCode;
                        if (tmMaster.sArabicName != null)
                            d.sArabicName = tmMaster.sArabicName;
                        else
                            d.sArabicName = "";
                        d.CreatedDate = DateTime.Now;
                        d.iCreatedBy = tmMaster.iCreatedBy;
                        d.ModifiedDate = DateTime.Now;
                        d.iModifiedBy = tmMaster.iModifiedBy;
                        db.tmHCM_Project.Add(d);
                        db.SaveChanges();
                    }
                }
            }
            catch (Exception e)
            {
                return Json(e.Message.ToString());
            }
            return Json("");
        }


        [HttpPost]
        public JsonResult UpdateProject(tmHCM_Project tmMaster)
        {
            try
            {
                var token = HttpContext.Session.GetString("jwt");
                if (token == null || JwtHelper.IsTokenExpired(token))
                {
                    return Json("Invalid Session");
                }
                if (tmMaster.iMasterId != 0)
                {
                    tmHCM_Project d = db.tmHCM_Project.Where(s => s.iMasterId == tmMaster.iMasterId).FirstOrDefault();
                    if (d != null)
                    {
                        if (tmMaster.sName != null)
                            d.sName = tmMaster.sName;
                        else
                            d.sName = "";
                        if (tmMaster.sArabicName != null)
                            d.sArabicName = tmMaster.sArabicName;
                        else
                            d.sArabicName = "";
                        d.ModifiedDate = DateTime.Now;
                        d.iModifiedBy = tmMaster.iModifiedBy;
                        db.tmHCM_Project.Update(d);
                        db.SaveChanges();
                    }
                }
            }
            catch (Exception e)
            {
                return Json(e.Message.ToString());
            }
            return Json("");
        }
        [HttpPost]
        public JsonResult DeleteProject(int iMasterId, Int32 UserId)
        {
            bool chk;
            try
            {
                var token = HttpContext.Session.GetString("jwt");
                if (token == null || JwtHelper.IsTokenExpired(token))
                {
                    chk = false;
                    return Json(new { result = "Invalid Session" });
                }
                if (iMasterId > 0)
                {
                    tmHCM_Project vMaster = db.tmHCM_Project.Where(s => s.iMasterId == iMasterId).FirstOrDefault();
                    if (vMaster != null)
                    {
                        vMaster.iStatus = 5;
                        vMaster.ModifiedDate = DateTime.Now;
                        vMaster.iModifiedBy = UserId;
                        db.tmHCM_Project.Update(vMaster);
                        db.SaveChanges();
                    }
                }
                chk = true;
            }
            catch (System.Exception)
            {
                chk = false;
            }
            return Json(new { result = "Project Deleted Successfully" });
        }
        

        [HttpGet]
        public JsonResult GetEmployee()
        {
            return Json(db.vmHCM_Employee.ToList());
        }

      
        public JsonResult GetProjects()
        {
            return Json(db.vmHCM_Project.ToList());
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
