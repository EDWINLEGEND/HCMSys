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
            return Json(employees);
        }

        [HttpGet]
        public async Task<IActionResult> GetApiAssetCategories()
        {
            var categories = await _apiService.GetAssetCategoriesAsync();
            return Json(categories);
        }

        [HttpGet]
        public async Task<IActionResult> GetApiAssets()
        {
            var assets = await _apiService.GetAssetsAsync();
            return Json(assets);
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
