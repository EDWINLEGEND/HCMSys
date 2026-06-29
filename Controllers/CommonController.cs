using HCMSys.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Configuration;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.OleDb;

using System.IO;
using System.Linq;
 
 
namespace HCMSys.Controllers
{

    public class CommonController : Controller
    {
        SMDbContext db = new SMDbContext();
        [Obsolete]
        private Microsoft.AspNetCore.Hosting.IWebHostEnvironment _Environment;
        private IConfiguration Configuration;
        public CommonController(Microsoft.AspNetCore.Hosting.IWebHostEnvironment _environment, IConfiguration _configuration)
        {
            _Environment = (Microsoft.AspNetCore.Hosting.IWebHostEnvironment?)_environment;
            Configuration = _configuration;
        }
        [HttpGet]
        public JsonResult getCode(int id)
        {
            string sCode = ""; string vseries = ""; Int32 result = 0;
            tsHCM_MasterSeries t = db.tsHCM_MasterSeries.Where(s => s.iModuleId == id).FirstOrDefault();
            if (t != null)
                vseries = t.sVoucherSeries.ToString();
            else
                vseries = "";
            string tseries = vseries;

            if (id == 7)
            {
                tmHCM_Project data = db.tmHCM_Project.Where(m => m.iMasterId != 0 && m.sCode.StartsWith(tseries) == true).OrderByDescending(u => Convert.ToInt32(u.sCode.Replace(tseries, ""))).FirstOrDefault();
                if (data != null)
                    sCode = (Convert.ToInt32(data.sCode.Replace(tseries, "")) + 1).ToString();
                else
                    sCode = "1";
            }
            
            else
            {
                sCode = "1";
            }

            if (Convert.ToInt32(sCode) < 10)
            {
                if (id != 26)
                    sCode = "00" + sCode;
            }
            else if (Convert.ToInt32(sCode) < 100 && Convert.ToInt32(sCode) >= 10)
            {
                if (id != 26)
                    sCode = "0" + sCode;
            }

            if (vseries != "")
            {
                if (id == 26)
                {
                    sCode = sCode;
                }
                else
                {
                    sCode = vseries + sCode;
                }
                    
            }
            
                return Json(sCode);
        }
        
        private void writeLog(string fileName, string msg, int i)
        {
            string path = Path.Combine(this._Environment.WebRootPath, "HCMSysLogs");

            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);
            string fullPath = Path.Combine(path, "HCMSysMaster" + DateTime.Now.ToString("ddMMyyyy") + ".Log.txt");
            if (i == 1)
            {
                using (StreamWriter writer = new StreamWriter(fullPath, false))
                {
                    writer.WriteLine(msg);
                    writer.Close();
                    writer.Dispose();
                }
            }
            else
            {
                using (StreamWriter writer = new StreamWriter(fullPath, true))
                {
                    writer.WriteLine(msg);
                    writer.Close();
                    writer.Dispose();
                }
            }
        }
    }
}
