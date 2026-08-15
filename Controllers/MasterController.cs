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
                joiningDate = e.JoiningDate.HasValue ? e.JoiningDate.Value.ToString("dd-MMM-yyyy") : "",
                dateOfJoining = e.JoiningDate.HasValue ? e.JoiningDate.Value.ToString("dd-MMM-yyyy") : "",
                department = !string.IsNullOrEmpty(e.SDepartmentName) ? e.SDepartmentName : "",
                departmentName = !string.IsNullOrEmpty(e.SDepartmentName) ? e.SDepartmentName : "",
                sDepartmentName = !string.IsNullOrEmpty(e.SDepartmentName) ? e.SDepartmentName : "",
                designation = !string.IsNullOrEmpty(e.SDesignationName) ? e.SDesignationName : "",
                designationName = !string.IsNullOrEmpty(e.SDesignationName) ? e.SDesignationName : "",
                sDesignationName = !string.IsNullOrEmpty(e.SDesignationName) ? e.SDesignationName : "",
                reportingManager = !string.IsNullOrEmpty(e.SReportingToName) ? e.SReportingToName : "",
                sReportingToName = !string.IsNullOrEmpty(e.SReportingToName) ? e.SReportingToName : "",
                sReportingToCode = !string.IsNullOrEmpty(e.SReportingToCode) ? e.SReportingToCode : "",
                contact = "",
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
        public async Task<IActionResult> SaveApiAssetAllocation()
        {
            SaveAssetAllocationDto? dto = null;
            byte[]? fileBytes = null;
            string? fileName = null;
            string? contentType = null;

            if (Request.HasFormContentType)
            {
                var form = await Request.ReadFormAsync();
                dto = new SaveAssetAllocationDto
                {
                    IHeaderId = int.TryParse(form["iHeaderId"], out var hId) ? hId : 0,
                    SDocNo = form["sDocNo"].ToString() ?? "",
                    DDocDate = form["dDocDate"].ToString() ?? "",
                    DPostDate = form["dPostDate"].ToString() ?? "",
                    IEmpId = int.TryParse(form["iEmpId"], out var empId) ? empId : 0,
                    ICompanyId = int.TryParse(form["iCompanyId"], out var compId) ? compId : 1,
                    IPayYearId = int.TryParse(form["iPayYearId"], out var pyId) ? pyId : 1,
                    SComments = form["sComments"].ToString(),
                    SEmployeeCode = form["sEmployeeCode"].ToString(),
                    SEmployeeName = form["sEmployeeName"].ToString(),
                    SDepartmentName = form["sDepartmentName"].ToString(),
                    SDesignationName = form["sDesignationName"].ToString(),
                    SReportingToName = form["sReportingToName"].ToString()
                };

                var assetsStr = form["Assets"].ToString();
                if (!string.IsNullOrEmpty(assetsStr))
                {
                    try
                    {
                        var parsedAssets = System.Text.Json.JsonSerializer.Deserialize<List<AssetAllocationBodyDto>>(assetsStr, new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                        if (parsedAssets != null) dto.Assets = parsedAssets;
                    }
                    catch { }
                }

                if (form.Files.Count > 0)
                {
                    var formFile = form.Files[0];
                    using var ms = new System.IO.MemoryStream();
                    await formFile.CopyToAsync(ms);
                    fileBytes = ms.ToArray();
                    fileName = formFile.FileName;
                    contentType = formFile.ContentType;
                }
            }
            else
            {
                using var reader = new System.IO.StreamReader(Request.Body);
                var body = await reader.ReadToEndAsync();
                if (!string.IsNullOrEmpty(body))
                {
                    dto = System.Text.Json.JsonSerializer.Deserialize<SaveAssetAllocationDto>(body, new System.Text.Json.JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                }
            }

            if (dto == null) return BadRequest(new { success = false, message = "Invalid request payload." });

            // Rule: 1 asset code item can only be allocated to one person at a time
            try
            {
                var existingAllocations = await _apiService.GetAssetAllocationsAsync(dto.ICompanyId, dto.IPayYearId);
                if (existingAllocations != null && existingAllocations.Count > 0 && dto.Assets != null && dto.Assets.Count > 0)
                {
                    foreach (var newItem in dto.Assets)
                    {
                        var conflictingAlloc = existingAllocations.FirstOrDefault(other =>
                            (other.IHeaderId != dto.IHeaderId || dto.IHeaderId == 0) &&
                            other.IStatus == 1 &&
                            other.Assets != null &&
                            other.Assets.Any(a => a.IAssetId == newItem.IAssetId || (!string.IsNullOrEmpty(a.SAssetCode) && !string.IsNullOrEmpty(newItem.SAssetCode) && a.SAssetCode.Equals(newItem.SAssetCode, StringComparison.OrdinalIgnoreCase)))
                        );

                        if (conflictingAlloc != null)
                        {
                            var conflictAst = conflictingAlloc.Assets?.FirstOrDefault(a => a.IAssetId == newItem.IAssetId || (!string.IsNullOrEmpty(a.SAssetCode) && !string.IsNullOrEmpty(newItem.SAssetCode) && a.SAssetCode.Equals(newItem.SAssetCode, StringComparison.OrdinalIgnoreCase)));
                            var astCodeName = conflictAst != null ? $"{conflictAst.SAssetCode} ({conflictAst.SAssetName})" : $"Asset #{newItem.IAssetId}";
                            var empName = conflictingAlloc.SEmployeeName ?? $"Employee #{conflictingAlloc.IEmpId}";
                            var docNo = conflictingAlloc.SDocNo ?? $"Doc #{conflictingAlloc.IHeaderId}";
                            return Json(new { success = false, message = $"Asset {astCodeName} is already allocated to {empName} in document {docNo}. An asset can only be allocated to one person at a time." });
                        }
                    }
                }
            }
            catch (Exception)
            {
                // Non-blocking log if checking allocations encounters an issue
            }

            var result = await _apiService.SaveAssetAllocationAsync(dto, fileBytes, fileName, contentType);
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

        [HttpGet]
        public async Task<IActionResult> GetApiLeaveBalances()
        {
            var balances = await _apiService.GetLeaveBalancesAsync();
            return Json(balances);
        }

        [HttpGet]
        public async Task<IActionResult> GetApiLeaveTypes()
        {
            var types = await _apiService.GetLeaveTypesAsync();
            return Json(types);
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

        public ActionResult AssetAllocation(int? id)
        {
            ViewBag.EditId = id ?? 0;
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
