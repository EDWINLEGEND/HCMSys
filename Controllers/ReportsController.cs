using Microsoft.AspNetCore.Mvc;
using System;
 
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HCMSys.Models; 
using Newtonsoft.Json.Linq; 
using Microsoft.Data.SqlClient;
using System.Data;
using System.Reflection;
using Microsoft.EntityFrameworkCore;
 
using Rotativa.AspNetCore;
//using ClosedXML.Excel;
using System.IO;
using Microsoft.AspNetCore.Http;
using System.Text;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Drawing;
using System.Threading;
using System.Net;
using System.ComponentModel;
using LicenseContext = OfficeOpenXml.LicenseContext;

namespace HCMSys.Controllers
{
    public class ReportsController : Controller
    {
        SMDbContext db = new SMDbContext();
 
        public IActionResult ReportSummary()
        {
            Models.Report_Url rpturl = new Models.Report_Url();
            rpturl.reportUrl = Global.rptsite;
            return View(rpturl); 
        }
        public IActionResult ReportDetail()
        {
            Models.Report_Url rpturl = new Models.Report_Url();
            rpturl.reportUrl = Global.rptsite;
            return View(rpturl);
        }
        public IActionResult Index()
        {
            Models.Report_Url rpturl = new Models.Report_Url();
            rpturl.reportUrl = Global.rptsite;
            return View(rpturl);
        }

        [HttpPost]
        public JsonResult CreateFile(DateTime stDate,DateTime endDate,Int32 iEmployee,Int32 iSite,Int32 iProject,Int32 IEngineer)
        {
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            int k = 0;

            DataTable dt = this.getAttendance(stDate, endDate, iEmployee, iSite, iProject, IEngineer).Tables[0];

            string userProfileFolder = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);
            string DownloadsFolder = userProfileFolder + "\\Downloads\\";
            //string export = DownloadsFolder + "\\AttendanceReport" + DateTime.Now.ToString("ddMMyyyyHHmmss") + ".xlsx";
            string export =Global.dpath+  "AttendanceReport" + DateTime.Now.ToString("ddMMyyyyHHmmss") + ".xlsx";
            FileInfo fi1 = new FileInfo(export);

            k = 1;
            try
            {
                using (var package = new ExcelPackage(fi1))
                {
                    ExcelWorksheet sheet = package.Workbook.Worksheets.Add("AttendanceReport");
                    sheet.Cells[1, 1].Value = "Attendance Report For The Period - From " + stDate.ToString("dd-MM-yyyy") + " To " + endDate.ToString("dd-MM-yyyy");
                    using (ExcelRange Rng = sheet.Cells[1, 1, 1, 126])
                    {
                        Rng.Style.Font.Bold = true; //Font should be bold
                        Rng.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left; // Alignment is center
                        Rng.Style.Font.Size = 12;
                        Rng.Style.Font.Color.SetColor(Color.DarkBlue);
                        Rng.Style.Fill.PatternType = ExcelFillStyle.Solid;
                        Rng.Style.Fill.BackgroundColor.SetColor(Color.LightBlue);
                    }

                    sheet.Cells[2, 1].Value = "Employee Code";
                    sheet.Cells[2, 2].Value = "Employee Name";
                    using (ExcelRange Rng = sheet.Cells[2, 1, 2, 2])
                    {
                        Rng.Style.Font.Bold = true; //Font should be bold
                        Rng.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left; // Alignment is center
                        Rng.Style.Font.Size = 10;
                        Rng.Style.Font.Color.SetColor(Color.Black);
                        Rng.Style.Fill.PatternType = ExcelFillStyle.Solid;
                        Rng.Style.Fill.BackgroundColor.SetColor(Color.LightGray);
                    }
                    for (int i = 3; i <= 33; i++)
                    {
                        if (i == 3)
                        {
                            sheet.Cells[2, i].Value = i - 2;
                            sheet.Cells[3, i].Value = "Project";
                            sheet.Cells[3, i + 1].Value = "Site";
                            sheet.Cells[3, i + 2].Value = "Approved By";
                            sheet.Cells[3, i + 3].Value = "TimeDiff";
                            sheet.Cells[2, i, 2, i + 3].Merge = true;
                            sheet.Cells[2, i, 2, i + 3].Style.Font.Bold = true; //Font should be bold
                            sheet.Cells[2, i, 2, i + 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center; // Alignment is center
                            sheet.Cells[2, i, 2, i + 3].Style.Font.Size = 10;
                            //sheet.Cells[2, i, 2, i + 3].Style.Fill.BackgroundColor.SetColor(Color.LightBlue);
                            using (ExcelRange Rng = sheet.Cells[2, i, 2, i + 3])
                            {
                                Rng.Style.Font.Color.SetColor(Color.Black);
                                Rng.Style.Fill.PatternType = ExcelFillStyle.Solid;
                                Rng.Style.Fill.BackgroundColor.SetColor(Color.LightGray);
                            }
                            k = k + 2;
                        }
                        else
                        {
                            sheet.Cells[2, (k + i)].Value = i - 2;
                            sheet.Cells[3, (k + i)].Value = "Project";
                            sheet.Cells[3, (k + i) + 1].Value = "Site";
                            sheet.Cells[3, (k + i) + 2].Value = "Approved By";
                            sheet.Cells[3, (k + i) + 3].Value = "TimeDiff";
                            sheet.Cells[2, (k + i), 2, (k + i) + 3].Merge = true;

                            sheet.Cells[2, k + i, 2, (k + i) + 3].Style.Font.Bold = true; //Font should be bold
                            sheet.Cells[2, k + i, 2, (k + i) + 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center; // Alignment is center
                            sheet.Cells[2, k + i, 2, (k + i) + 3].Style.Font.Size = 10;
                            using (ExcelRange Rng = sheet.Cells[2, k + i, 2, (k + i) + 3])
                            {
                                Rng.Style.Font.Color.SetColor(Color.Black);
                                Rng.Style.Fill.PatternType = ExcelFillStyle.Solid;
                                Rng.Style.Fill.BackgroundColor.SetColor(Color.LightGray);
                            }
                            k = k + 3;
                        }
                    }
                    string EmployeeCode = ""; string EmployeeName = "";
                    string pEmployeeCode = ""; int j = 4; int dts = 0; int pdts = 0;
                    string Project = ""; string Site = ""; string Engineer = ""; string TIMEDIFF = "00:00";
                    k = 2; int z = 0; int m = 0; int n = 0;
                    foreach (DataRow row in dt.Rows)
                    {
                        EmployeeCode = row["EmployeeCode"].ToString();
                        EmployeeName = row["EmployeeName"].ToString();
                        Project = row["Project"].ToString();
                        Site = row["Site"].ToString();
                        Engineer = row["Engineer"].ToString();
                        TIMEDIFF = row["TIMEDIFF"].ToString();
                        dts = Convert.ToInt32(row["dt"].ToString());


                        if (pEmployeeCode == EmployeeCode)
                        {
                            if (dts == pdts)
                            {
                                j = j + 1;
                                n = j;
                            }
                            else
                            {
                                j = m;
                            }

                            sheet.Cells[j, 1].Value = EmployeeCode;
                            sheet.Cells[j, 2].Value = EmployeeName;
                            if (dts == 1)
                            {
                                sheet.Cells[j, dts + 2].Value = Project;
                                sheet.Cells[j, dts + 3].Value = Site;
                                sheet.Cells[j, dts + 4].Value = Engineer;
                                sheet.Cells[j, dts + 5].Value = TIMEDIFF;
                            }
                            else if (dts == 2)
                            {

                                sheet.Cells[j, dts + 5].Value = Project;
                                sheet.Cells[j, dts + 6].Value = Site;
                                sheet.Cells[j, dts + 7].Value = Engineer;
                                sheet.Cells[j, dts + 8].Value = TIMEDIFF;

                            }
                            else if (dts == 3)
                            {

                                sheet.Cells[j, dts + 8].Value = Project;
                                sheet.Cells[j, dts + 9].Value = Site;
                                sheet.Cells[j, dts + 10].Value = Engineer;
                                sheet.Cells[j, dts + 11].Value = TIMEDIFF;

                            }
                            else if (dts == 4)
                            {

                                sheet.Cells[j, dts + 11].Value = Project;
                                sheet.Cells[j, dts + 12].Value = Site;
                                sheet.Cells[j, dts + 13].Value = Engineer;
                                sheet.Cells[j, dts + 14].Value = TIMEDIFF;

                            }
                            else if (dts == 5)
                            {

                                sheet.Cells[j, dts + 14].Value = Project;
                                sheet.Cells[j, dts + 15].Value = Site;
                                sheet.Cells[j, dts + 16].Value = Engineer;
                                sheet.Cells[j, dts + 17].Value = TIMEDIFF;

                            }
                            else if (dts == 6)
                            {

                                sheet.Cells[j, dts + 17].Value = Project;
                                sheet.Cells[j, dts + 18].Value = Site;
                                sheet.Cells[j, dts + 19].Value = Engineer;
                                sheet.Cells[j, dts + 20].Value = TIMEDIFF;

                            }
                            else if (dts == 7)
                            {

                                sheet.Cells[j, dts + 20].Value = Project;
                                sheet.Cells[j, dts + 21].Value = Site;
                                sheet.Cells[j, dts + 22].Value = Engineer;
                                sheet.Cells[j, dts + 23].Value = TIMEDIFF;

                            }
                            else if (dts == 8)
                            {

                                sheet.Cells[j, dts + 23].Value = Project;
                                sheet.Cells[j, dts + 24].Value = Site;
                                sheet.Cells[j, dts + 25].Value = Engineer;
                                sheet.Cells[j, dts + 26].Value = TIMEDIFF;

                            }
                            else if (dts == 9)
                            {

                                sheet.Cells[j, dts + 26].Value = Project;
                                sheet.Cells[j, dts + 27].Value = Site;
                                sheet.Cells[j, dts + 28].Value = Engineer;
                                sheet.Cells[j, dts + 29].Value = TIMEDIFF;

                            }
                            else if (dts == 10)
                            {

                                sheet.Cells[j, dts + 29].Value = Project;
                                sheet.Cells[j, dts + 30].Value = Site;
                                sheet.Cells[j, dts + 31].Value = Engineer;
                                sheet.Cells[j, dts + 32].Value = TIMEDIFF;

                            }
                            else if (dts == 11)
                            {
                                sheet.Cells[j, dts + 32].Value = Project;
                                sheet.Cells[j, dts + 33].Value = Site;
                                sheet.Cells[j, dts + 34].Value = Engineer;
                                sheet.Cells[j, dts + 35].Value = TIMEDIFF;

                            }
                            else if (dts == 12)
                            {

                                sheet.Cells[j, dts + 35].Value = Project;
                                sheet.Cells[j, dts + 36].Value = Site;
                                sheet.Cells[j, dts + 37].Value = Engineer;
                                sheet.Cells[j, dts + 38].Value = TIMEDIFF;

                            }
                            else if (dts == 13)
                            {

                                sheet.Cells[j, dts + 38].Value = Project;
                                sheet.Cells[j, dts + 39].Value = Site;
                                sheet.Cells[j, dts + 40].Value = Engineer;
                                sheet.Cells[j, dts + 41].Value = TIMEDIFF;

                            }
                            else if (dts == 14)
                            {

                                sheet.Cells[j, dts + 41].Value = Project;
                                sheet.Cells[j, dts + 42].Value = Site;
                                sheet.Cells[j, dts + 43].Value = Engineer;
                                sheet.Cells[j, dts + 44].Value = TIMEDIFF;

                            }
                            else if (dts == 15)
                            {

                                sheet.Cells[j, dts + 44].Value = Project;
                                sheet.Cells[j, dts + 45].Value = Site;
                                sheet.Cells[j, dts + 46].Value = Engineer;
                                sheet.Cells[j, dts + 47].Value = TIMEDIFF;

                            }
                            else if (dts == 16)
                            {

                                sheet.Cells[j, dts + 47].Value = Project;
                                sheet.Cells[j, dts + 48].Value = Site;
                                sheet.Cells[j, dts + 49].Value = Engineer;
                                sheet.Cells[j, dts + 50].Value = TIMEDIFF;

                            }
                            else if (dts == 17)
                            {

                                sheet.Cells[j, dts + 50].Value = Project;
                                sheet.Cells[j, dts + 51].Value = Site;
                                sheet.Cells[j, dts + 52].Value = Engineer;
                                sheet.Cells[j, dts + 53].Value = TIMEDIFF;

                            }
                            else if (dts == 18)
                            {

                                sheet.Cells[j, dts + 53].Value = Project;
                                sheet.Cells[j, dts + 54].Value = Site;
                                sheet.Cells[j, dts + 55].Value = Engineer;
                                sheet.Cells[j, dts + 56].Value = TIMEDIFF;

                            }
                            else if (dts == 19)
                            {

                                sheet.Cells[j, dts + 56].Value = Project;
                                sheet.Cells[j, dts + 57].Value = Site;
                                sheet.Cells[j, dts + 58].Value = Engineer;
                                sheet.Cells[j, dts + 59].Value = TIMEDIFF;

                            }
                            else if (dts == 20)
                            {

                                sheet.Cells[j, dts + 59].Value = Project;
                                sheet.Cells[j, dts + 60].Value = Site;
                                sheet.Cells[j, dts + 61].Value = Engineer;
                                sheet.Cells[j, dts + 62].Value = TIMEDIFF;

                            }
                            else if (dts == 21)
                            {
                                sheet.Cells[j, dts + 62].Value = Project;
                                sheet.Cells[j, dts + 63].Value = Site;
                                sheet.Cells[j, dts + 64].Value = Engineer;
                                sheet.Cells[j, dts + 65].Value = TIMEDIFF;

                            }
                            else if (dts == 22)
                            {

                                sheet.Cells[j, dts + 65].Value = Project;
                                sheet.Cells[j, dts + 66].Value = Site;
                                sheet.Cells[j, dts + 67].Value = Engineer;
                                sheet.Cells[j, dts + 68].Value = TIMEDIFF;

                            }
                            else if (dts == 23)
                            {

                                sheet.Cells[j, dts + 68].Value = Project;
                                sheet.Cells[j, dts + 69].Value = Site;
                                sheet.Cells[j, dts + 70].Value = Engineer;
                                sheet.Cells[j, dts + 71].Value = TIMEDIFF;

                            }
                            else if (dts == 24)
                            {

                                sheet.Cells[j, dts + 71].Value = Project;
                                sheet.Cells[j, dts + 72].Value = Site;
                                sheet.Cells[j, dts + 73].Value = Engineer;
                                sheet.Cells[j, dts + 74].Value = TIMEDIFF;

                            }
                            else if (dts == 25)
                            {

                                sheet.Cells[j, dts + 74].Value = Project;
                                sheet.Cells[j, dts + 75].Value = Site;
                                sheet.Cells[j, dts + 76].Value = Engineer;
                                sheet.Cells[j, dts + 77].Value = TIMEDIFF;

                            }
                            else if (dts == 26)
                            {

                                sheet.Cells[j, dts + 77].Value = Project;
                                sheet.Cells[j, dts + 78].Value = Site;
                                sheet.Cells[j, dts + 79].Value = Engineer;
                                sheet.Cells[j, dts + 80].Value = TIMEDIFF;

                            }
                            else if (dts == 27)
                            {

                                sheet.Cells[j, dts + 80].Value = Project;
                                sheet.Cells[j, dts + 81].Value = Site;
                                sheet.Cells[j, dts + 82].Value = Engineer;
                                sheet.Cells[j, dts + 83].Value = TIMEDIFF;

                            }
                            else if (dts == 28)
                            {

                                sheet.Cells[j, dts + 83].Value = Project;
                                sheet.Cells[j, dts + 84].Value = Site;
                                sheet.Cells[j, dts + 85].Value = Engineer;
                                sheet.Cells[j, dts + 86].Value = TIMEDIFF;

                            }
                            else if (dts == 29)
                            {

                                sheet.Cells[j, dts + 86].Value = Project;
                                sheet.Cells[j, dts + 87].Value = Site;
                                sheet.Cells[j, dts + 88].Value = Engineer;
                                sheet.Cells[j, dts + 89].Value = TIMEDIFF;

                            }
                            else if (dts == 30)
                            {

                                sheet.Cells[j, dts + 89].Value = Project;
                                sheet.Cells[j, dts + 90].Value = Site;
                                sheet.Cells[j, dts + 91].Value = Engineer;
                                sheet.Cells[j, dts + 92].Value = TIMEDIFF;

                            }
                            else if (dts == 31)
                            {

                                sheet.Cells[j, dts + 92].Value = Project;
                                sheet.Cells[j, dts + 93].Value = Site;
                                sheet.Cells[j, dts + 94].Value = Engineer;
                                sheet.Cells[j, dts + 95].Value = TIMEDIFF;

                            }
                        }
                        else
                        {
                            if (pEmployeeCode != "")
                            {

                                int numCol = sheet.Dimension.Rows;
                                j = numCol + 1;

                            }


                            n = 0;
                            m = j;
                            sheet.Cells[j, 1].Value = EmployeeCode;
                            sheet.Cells[j, 2].Value = EmployeeName;
                            if (dts == 1)
                            {
                                sheet.Cells[j, dts + 2].Value = Project;
                                sheet.Cells[j, dts + 3].Value = Site;
                                sheet.Cells[j, dts + 4].Value = Engineer;
                                sheet.Cells[j, dts + 5].Value = TIMEDIFF;

                            }
                            else if (dts == 2)
                            {

                                sheet.Cells[j, dts + 5].Value = Project;
                                sheet.Cells[j, dts + 6].Value = Site;
                                sheet.Cells[j, dts + 7].Value = Engineer;
                                sheet.Cells[j, dts + 8].Value = TIMEDIFF;

                            }
                            else if (dts == 3)
                            {

                                sheet.Cells[j, dts + 8].Value = Project;
                                sheet.Cells[j, dts + 9].Value = Site;
                                sheet.Cells[j, dts + 10].Value = Engineer;
                                sheet.Cells[j, dts + 11].Value = TIMEDIFF;

                            }
                            else if (dts == 4)
                            {

                                sheet.Cells[j, dts + 11].Value = Project;
                                sheet.Cells[j, dts + 12].Value = Site;
                                sheet.Cells[j, dts + 13].Value = Engineer;
                                sheet.Cells[j, dts + 14].Value = TIMEDIFF;

                            }
                            else if (dts == 5)
                            {

                                sheet.Cells[j, dts + 14].Value = Project;
                                sheet.Cells[j, dts + 15].Value = Site;
                                sheet.Cells[j, dts + 16].Value = Engineer;
                                sheet.Cells[j, dts + 17].Value = TIMEDIFF;

                            }
                            else if (dts == 6)
                            {

                                sheet.Cells[j, dts + 17].Value = Project;
                                sheet.Cells[j, dts + 18].Value = Site;
                                sheet.Cells[j, dts + 19].Value = Engineer;
                                sheet.Cells[j, dts + 20].Value = TIMEDIFF;

                            }
                            else if (dts == 7)
                            {

                                sheet.Cells[j, dts + 20].Value = Project;
                                sheet.Cells[j, dts + 21].Value = Site;
                                sheet.Cells[j, dts + 22].Value = Engineer;
                                sheet.Cells[j, dts + 23].Value = TIMEDIFF;

                            }
                            else if (dts == 8)
                            {

                                sheet.Cells[j, dts + 23].Value = Project;
                                sheet.Cells[j, dts + 24].Value = Site;
                                sheet.Cells[j, dts + 25].Value = Engineer;
                                sheet.Cells[j, dts + 26].Value = TIMEDIFF;

                            }
                            else if (dts == 9)
                            {

                                sheet.Cells[j, dts + 26].Value = Project;
                                sheet.Cells[j, dts + 27].Value = Site;
                                sheet.Cells[j, dts + 28].Value = Engineer;
                                sheet.Cells[j, dts + 29].Value = TIMEDIFF;

                            }
                            else if (dts == 10)
                            {

                                sheet.Cells[j, dts + 29].Value = Project;
                                sheet.Cells[j, dts + 30].Value = Site;
                                sheet.Cells[j, dts + 31].Value = Engineer;
                                sheet.Cells[j, dts + 32].Value = TIMEDIFF;

                            }
                            else if (dts == 11)
                            {
                                sheet.Cells[j, dts + 32].Value = Project;
                                sheet.Cells[j, dts + 33].Value = Site;
                                sheet.Cells[j, dts + 34].Value = Engineer;
                                sheet.Cells[j, dts + 35].Value = TIMEDIFF;

                            }
                            else if (dts == 12)
                            {

                                sheet.Cells[j, dts + 35].Value = Project;
                                sheet.Cells[j, dts + 36].Value = Site;
                                sheet.Cells[j, dts + 37].Value = Engineer;
                                sheet.Cells[j, dts + 38].Value = TIMEDIFF;

                            }
                            else if (dts == 13)
                            {

                                sheet.Cells[j, dts + 38].Value = Project;
                                sheet.Cells[j, dts + 39].Value = Site;
                                sheet.Cells[j, dts + 40].Value = Engineer;
                                sheet.Cells[j, dts + 41].Value = TIMEDIFF;

                            }
                            else if (dts == 14)
                            {

                                sheet.Cells[j, dts + 41].Value = Project;
                                sheet.Cells[j, dts + 42].Value = Site;
                                sheet.Cells[j, dts + 43].Value = Engineer;
                                sheet.Cells[j, dts + 44].Value = TIMEDIFF;

                            }
                            else if (dts == 15)
                            {

                                sheet.Cells[j, dts + 44].Value = Project;
                                sheet.Cells[j, dts + 45].Value = Site;
                                sheet.Cells[j, dts + 46].Value = Engineer;
                                sheet.Cells[j, dts + 47].Value = TIMEDIFF;

                            }
                            else if (dts == 16)
                            {

                                sheet.Cells[j, dts + 47].Value = Project;
                                sheet.Cells[j, dts + 48].Value = Site;
                                sheet.Cells[j, dts + 49].Value = Engineer;
                                sheet.Cells[j, dts + 50].Value = TIMEDIFF;

                            }
                            else if (dts == 17)
                            {

                                sheet.Cells[j, dts + 50].Value = Project;
                                sheet.Cells[j, dts + 51].Value = Site;
                                sheet.Cells[j, dts + 52].Value = Engineer;
                                sheet.Cells[j, dts + 53].Value = TIMEDIFF;

                            }
                            else if (dts == 18)
                            {

                                sheet.Cells[j, dts + 53].Value = Project;
                                sheet.Cells[j, dts + 54].Value = Site;
                                sheet.Cells[j, dts + 55].Value = Engineer;
                                sheet.Cells[j, dts + 56].Value = TIMEDIFF;

                            }
                            else if (dts == 19)
                            {

                                sheet.Cells[j, dts + 56].Value = Project;
                                sheet.Cells[j, dts + 57].Value = Site;
                                sheet.Cells[j, dts + 58].Value = Engineer;
                                sheet.Cells[j, dts + 59].Value = TIMEDIFF;

                            }
                            else if (dts == 20)
                            {

                                sheet.Cells[j, dts + 59].Value = Project;
                                sheet.Cells[j, dts + 60].Value = Site;
                                sheet.Cells[j, dts + 61].Value = Engineer;
                                sheet.Cells[j, dts + 62].Value = TIMEDIFF;

                            }
                            else if (dts == 21)
                            {
                                sheet.Cells[j, dts + 62].Value = Project;
                                sheet.Cells[j, dts + 63].Value = Site;
                                sheet.Cells[j, dts + 64].Value = Engineer;
                                sheet.Cells[j, dts + 65].Value = TIMEDIFF;

                            }
                            else if (dts == 22)
                            {

                                sheet.Cells[j, dts + 65].Value = Project;
                                sheet.Cells[j, dts + 66].Value = Site;
                                sheet.Cells[j, dts + 67].Value = Engineer;
                                sheet.Cells[j, dts + 68].Value = TIMEDIFF;

                            }
                            else if (dts == 23)
                            {

                                sheet.Cells[j, dts + 68].Value = Project;
                                sheet.Cells[j, dts + 69].Value = Site;
                                sheet.Cells[j, dts + 70].Value = Engineer;
                                sheet.Cells[j, dts + 71].Value = TIMEDIFF;

                            }
                            else if (dts == 24)
                            {

                                sheet.Cells[j, dts + 71].Value = Project;
                                sheet.Cells[j, dts + 72].Value = Site;
                                sheet.Cells[j, dts + 73].Value = Engineer;
                                sheet.Cells[j, dts + 74].Value = TIMEDIFF;

                            }
                            else if (dts == 25)
                            {

                                sheet.Cells[j, dts + 74].Value = Project;
                                sheet.Cells[j, dts + 75].Value = Site;
                                sheet.Cells[j, dts + 76].Value = Engineer;
                                sheet.Cells[j, dts + 77].Value = TIMEDIFF;

                            }
                            else if (dts == 26)
                            {

                                sheet.Cells[j, dts + 77].Value = Project;
                                sheet.Cells[j, dts + 78].Value = Site;
                                sheet.Cells[j, dts + 79].Value = Engineer;
                                sheet.Cells[j, dts + 80].Value = TIMEDIFF;

                            }
                            else if (dts == 27)
                            {

                                sheet.Cells[j, dts + 80].Value = Project;
                                sheet.Cells[j, dts + 81].Value = Site;
                                sheet.Cells[j, dts + 82].Value = Engineer;
                                sheet.Cells[j, dts + 83].Value = TIMEDIFF;

                            }
                            else if (dts == 28)
                            {

                                sheet.Cells[j, dts + 83].Value = Project;
                                sheet.Cells[j, dts + 84].Value = Site;
                                sheet.Cells[j, dts + 85].Value = Engineer;
                                sheet.Cells[j, dts + 86].Value = TIMEDIFF;

                            }
                            else if (dts == 29)
                            {

                                sheet.Cells[j, dts + 86].Value = Project;
                                sheet.Cells[j, dts + 87].Value = Site;
                                sheet.Cells[j, dts + 88].Value = Engineer;
                                sheet.Cells[j, dts + 89].Value = TIMEDIFF;

                            }
                            else if (dts == 30)
                            {

                                sheet.Cells[j, dts + 89].Value = Project;
                                sheet.Cells[j, dts + 90].Value = Site;
                                sheet.Cells[j, dts + 91].Value = Engineer;
                                sheet.Cells[j, dts + 92].Value = TIMEDIFF;

                            }
                            else if (dts == 31)
                            {

                                sheet.Cells[j, dts + 92].Value = Project;
                                sheet.Cells[j, dts + 93].Value = Site;
                                sheet.Cells[j, dts + 94].Value = Engineer;
                                sheet.Cells[j, dts + 95].Value = TIMEDIFF;

                            }
                        }

                        pEmployeeCode = EmployeeCode;
                        pdts = dts;

                        z = z + 1;
                    }
                    package.SaveAs(fi1);
    



                }
            }
            catch (System.Exception e)
            {
                string err = e.Message.ToString();
                return Json("Error");
                //return Json(export + " - " + e.Message.ToString());
            }

            return Json(export);
            //return Json(export);

        }
        public IActionResult ExportToExcel(string export)
        {
            MemoryStream ms = new MemoryStream();
            using (FileStream file = new FileStream(export, FileMode.Open, FileAccess.Read))
                file.CopyTo(ms);

            return File(ms.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Report.xlsx");

        }


        private DataSet getAttendance(DateTime stDate, DateTime endDate, Int32 iEmployee, Int32 iSite, Int32 iProject, Int32 IEngineer)
        {
            DataSet ds = new DataSet();
            string constr = Global.connStrSql;
            using (SqlConnection con = new SqlConnection(constr))
            {
                //string query = $@"SELECT EmployeeCode,EmployeeName,Site,Project,case when Engineer='' then EmployeeName else Engineer end Engineer,isnull([1],'00:00')[1],isnull([2],'00:00')[2],isnull([3],'00:00')[3],isnull([4],'00:00')[4],isnull([5],'00:00')[5],
                //isnull([6],'00:00')[6],isnull([7],'00:00')[7],isnull([8],'00:00')[8],isnull([9],'00:00')[9],isnull([10],'00:00')[10],isnull([11],'00:00')[11],isnull([12],'00:00')[12],
                //isnull([13],'00:00')[13],isnull([14],'00:00')[14],isnull([15],'00:00')[15],isnull([16],'00:00')[16],isnull([17],'00:00')[17],isnull([18],'00:00')[18],isnull([19],'00:00')[19],
                //isnull([20],'00:00')[20],isnull([21],'00:00')[21],isnull([22],'00:00')[22],isnull([23],'00:00')[23],isnull([24],'00:00')[24],isnull([25],'00:00')[25],isnull([26],'00:00')[26],
                //isnull([27],'00:00')[27],isnull([28],'00:00')[28],isnull([29],'00:00')[29],isnull([30],'00:00')[30],isnull([31],'00:00')[31] FROM(SELECT
                //EmployeeCode, EmployeeName, Site, Project, Engineer, TIMEDIFF, dt   FROM vtPay_Attendance) Att PIVOT(max(TIMEDIFF) FOR dt
                //IN ([1],[2],[3],[4],[5],[6],[7],[8],[9],[10],[11],[12],[13],[14],[15],[16],[17],[18],[19],[20],[21],[22],[23],[24],[25],[26],
                //[27],[28],[29],[30],[31])) AS A order by employeecode,dt";
                string cond = "cast(dStartDateTime as date) between '" + stDate.ToString("yyyy-MM-dd") + "' " +
                " and '" + endDate.ToString("yyyy-MM-dd") + "' and iApprovedBy<>0 ";
                if (iEmployee != 0)
                    cond =cond + " and iEmployee = " + iEmployee;
                if (iSite != 0)
                    cond = cond + " and iSite = " + iSite;
                if (iProject != 0)
                    cond = cond + " and iProject = " + iProject;
                if (IEngineer != 0)
                    cond = cond + " and IEngineer = " + IEngineer;
                string query = "select EmployeeCode,EmployeeName,Project,Site,case when Engineer='' then EmployeeName else Engineer end Engineer, " +
                " SUBSTRING(cast(cast(DATEADD(ms, SUM(DATEDIFF(ms, dStartDateTime, dEndDateTime)), '00:00:00.000') as time) as varchar), 1, 5)TIMEDIFF,Dt " +
                " from vtPay_Attendance where " + cond + "  group by EmployeeCode,EmployeeName,Project,Site,case when Engineer='' " +
                " then EmployeeName else Engineer end, Dt order by " +
                " employeecode, dt,Project,Site,Engineer ";
                using (SqlCommand cmd = new SqlCommand(query))
                {
                    cmd.Connection = con;
                    using (SqlDataAdapter sda = new SqlDataAdapter(cmd))
                    {
                        sda.Fill(ds);
                    }
                }
            }
            return ds;
        }
  
        private void releaseObject(object obj)
        {
            try
            {
                System.Runtime.InteropServices.Marshal.ReleaseComObject(obj);
                obj = null;
            }
            catch
            {
                obj = null;
                //MessageBox.Show("Exception Occured while releasing object " + ex.ToString());
            }
            finally
            {
                GC.Collect();
            }
        }
 

    }
}
