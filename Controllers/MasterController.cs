using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.InkML;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Wordprocessing;
 
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
using HCMSys.Services;

namespace HCMSys.Controllers
{
    public class MasterController : Controller
    {
        private readonly IWebHostEnvironment _env;
        private readonly IHcmsApiService _apiService;

        public MasterController(IWebHostEnvironment env, IHcmsApiService apiService)
        {
            _env = env;
            _apiService = apiService;
        }

        [HttpGet]
        public async Task<IActionResult> GetApiEmployees()
        {
            var employees = await _apiService.GetEmployeesAsync();
            var normalized = employees.Select(e => new {
                id = e.Id > 0 ? e.Id : e.IMasterId,
                iMasterId = e.IMasterId > 0 ? e.IMasterId : e.Id,
                code = !string.IsNullOrEmpty(e.SCode) ? e.SCode : $"EMP-{e.Id:D3}",
                sCode = !string.IsNullOrEmpty(e.SCode) ? e.SCode : $"EMP-{e.Id:D3}",
                name = !string.IsNullOrEmpty(e.SName) ? e.SName : "",
                sName = !string.IsNullOrEmpty(e.SName) ? e.SName : "",
                joiningDate = e.JoiningDate.HasValue ? e.JoiningDate.Value.ToString("dd-MMM-yyyy") : "15-Jan-2020",
                dateOfJoining = e.JoiningDate.HasValue ? e.JoiningDate.Value.ToString("dd-MMM-yyyy") : "15-Jan-2020",
                department = !string.IsNullOrEmpty(e.SDepartmentName) ? e.SDepartmentName : "Engineering",
                departmentName = !string.IsNullOrEmpty(e.SDepartmentName) ? e.SDepartmentName : "Engineering",
                sDepartmentName = !string.IsNullOrEmpty(e.SDepartmentName) ? e.SDepartmentName : "Engineering",
                designation = !string.IsNullOrEmpty(e.SDesignationName) ? e.SDesignationName : "Software Engineer",
                designationName = !string.IsNullOrEmpty(e.SDesignationName) ? e.SDesignationName : "Software Engineer",
                sDesignationName = !string.IsNullOrEmpty(e.SDesignationName) ? e.SDesignationName : "Software Engineer",
                reportingManager = "Jane Doe",
                contact = "+1-234-567-8900",
                currentOutstanding = 0.00
            });
            return Json(normalized);
        }

        [HttpGet]
        public async Task<IActionResult> GetApiAssetCategories()
        {
            var categories = await _apiService.GetAssetCategoriesAsync();
            var normalized = categories.Select(c => new {
                id = c.IMasterId,
                iMasterId = c.IMasterId,
                code = !string.IsNullOrEmpty(c.SCode) ? c.SCode : "",
                sCode = !string.IsNullOrEmpty(c.SCode) ? c.SCode : "",
                name = !string.IsNullOrEmpty(c.SName) ? c.SName : "",
                sName = !string.IsNullOrEmpty(c.SName) ? c.SName : ""
            });
            return Json(normalized);
        }

        [HttpGet]
        public async Task<IActionResult> GetApiAssets()
        {
            var assets = await _apiService.GetAssetsAsync();
            var normalized = assets.Select(a => new {
                id = a.IMasterId,
                iMasterId = a.IMasterId,
                code = !string.IsNullOrEmpty(a.SCode) ? a.SCode : "",
                sCode = !string.IsNullOrEmpty(a.SCode) ? a.SCode : "",
                name = !string.IsNullOrEmpty(a.SName) ? a.SName : "",
                sName = !string.IsNullOrEmpty(a.SName) ? a.SName : "",
                iCategoryId = a.ICategoryId,
                categoryCode = a.SCategoryCode,
                categoryName = a.SCategoryName,
                tagNumber = a.STagNumber
            });
            return Json(normalized);
        }

        [HttpPost]
        public async Task<IActionResult> SaveApiAssetAllocation([FromBody] SaveAssetAllocationDto request)
        {
            if (request == null) return BadRequest(new { success = false, message = "Invalid request payload." });
            var result = await _apiService.SaveAssetAllocationAsync(request);
            return Json(result ?? new ApiResponseEnvelope<object> { Success = false, Message = "Failed to call Save API." });
        }

        [HttpGet]
        public async Task<IActionResult> GetApiAssetAllocations(int companyId = 1, int payYearId = 1)
        {
            var allocations = await _apiService.GetAssetAllocationsAsync(companyId, payYearId);
            return Json(allocations);
        }

        [HttpGet]
        public async Task<IActionResult> GetApiAssetAllocationById(int id)
        {
            var allocation = await _apiService.GetAssetAllocationByIdAsync(id);
            if (allocation == null) return NotFound(new { success = false, message = "Asset allocation not found." });
            return Json(allocation);
        }

        /// <summary>
        /// ////Project master
        /// </summary>
        /// <returns></returns>
        public ActionResult ProjectIndex()
        {
            return View();
        }

        public ActionResult LeaveApplicationIndex()
        {
            return View();
        }

        public ActionResult CreateLeaveApplication()
        {
            return View();
        }

        public ActionResult ClaimIndex()
        {
            return View();
        }

        public ActionResult CreateClaim()
        {
            return View();
        }

        public ActionResult BusinessTripIndex()
        {
            return View();
        }

        public ActionResult CreateBusinessTrip()
        {
            return View();
        }

        public ActionResult AssetAllocationIndex()
        {
            return View();
        }

        public ActionResult AssetDeAllocationIndex()
        {
            return View();
        }

        public ActionResult HRRequestIndex()
        {
            return View();
        }

        public ActionResult HRReturnIndex()
        {
            return View();
        }

        public ActionResult HRDocumentIssueIndex()
        {
            return View();
        }

        public ActionResult AssetAllocation()
        {
            return View();
        }

        public ActionResult AssetDeAllocation()
        {
            return View();
        }

        public ActionResult HRRequest()
        {
            return View();
        }

        public ActionResult HRReturn()
        {
            return View();
        }

        public ActionResult HRDocumentIssue()
        {
            return View();
        }

        public ActionResult OpeningLeavesIndex()
        {
            return View();
        }

        public ActionResult OpeningLeaves()
        {
            return View();
        }

        public ActionResult LeaveEligibilityIndex()
        {
            return View();
        }

        public ActionResult LeaveEligibility()
        {
            return View();
        }

        public ActionResult LeaveAdjustmentsIndex()
        {
            return View();
        }

        public ActionResult LeaveAdjustments()
        {
            return View();
        }

        // Loan Management Module Actions
        public ActionResult LoanRequestIndex()
        {
            return View();
        }

        public ActionResult CreateLoanRequest()
        {
            return View();
        }

        public ActionResult LoanDisbursementIndex()
        {
            return View();
        }

        public ActionResult CreateLoanDisbursement()
        {
            return View();
        }

        public ActionResult LoanDefermentIndex()
        {
            return View();
        }

        public ActionResult CreateLoanDeferment()
        {
            return View();
        }

        public ActionResult LoanSettlementIndex()
        {
            return View();
        }

        public ActionResult CreateLoanSettlement()
        {
            return View();
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
