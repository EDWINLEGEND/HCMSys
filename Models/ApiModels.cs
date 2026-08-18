using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace HCMSys.Models
{
    // --- Authentication DTOs ---
    public class ApiLoginRequest
    {
        [JsonPropertyName("username")]
        public string Username { get; set; } = string.Empty;

        [JsonPropertyName("password")]
        public string Password { get; set; } = string.Empty;
    }

    public class ApiLoginTokenData
    {
        [JsonPropertyName("token")]
        public string? Token { get; set; }

        [JsonPropertyName("expires")]
        public string? Expires { get; set; }
    }

    public class ApiLoginResponse
    {
        [JsonPropertyName("success")]
        public bool Success { get; set; }

        [JsonPropertyName("message")]
        public string? Message { get; set; }

        [JsonPropertyName("token")]
        public string? Token { get; set; }

        [JsonPropertyName("expiresUtc")]
        public string? ExpiresUtc { get; set; }

        [JsonPropertyName("data")]
        public ApiLoginTokenData? Data { get; set; }

        // Helper property to extract token regardless of API payload variant
        public string? GetEffectiveToken()
        {
            return !string.IsNullOrEmpty(Token) ? Token : Data?.Token;
        }
    }

    // --- Generic API Response ---
    public class ApiResponseEnvelope<T>
    {
        [JsonPropertyName("success")]
        public bool Success { get; set; }

        [JsonPropertyName("message")]
        public string? Message { get; set; }

        [JsonPropertyName("data")]
        public T? Data { get; set; }
    }

    // --- Employee DTOs ---
    public class EmployeeDataEnvelope
    {
        [JsonPropertyName("employees")]
        public List<EmployeeDto> Employees { get; set; } = new List<EmployeeDto>();
    }

    public class EmployeeDto
    {
        [JsonPropertyName("iMasterId")]
        public int IMasterId { get; set; }

        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("sCode")]
        public string SCode { get; set; } = string.Empty;

        [JsonPropertyName("sName")]
        public string SName { get; set; } = string.Empty;

        [JsonPropertyName("joiningDate")]
        public DateTime? JoiningDate { get; set; }

        [JsonPropertyName("revisionDate")]
        public DateTime? RevisionDate { get; set; }

        [JsonPropertyName("effectiveDate")]
        public DateTime? EffectiveDate { get; set; }

        [JsonPropertyName("iCategory")]
        public int ICategory { get; set; }

        [JsonPropertyName("sCategoryName")]
        public string SCategoryName { get; set; } = string.Empty;

        [JsonPropertyName("iDesignation")]
        public int IDesignation { get; set; }

        [JsonPropertyName("sDesignationCode")]
        public string SDesignationCode { get; set; } = string.Empty;

        [JsonPropertyName("sDesignationName")]
        public string SDesignationName { get; set; } = string.Empty;

        [JsonPropertyName("sDepartmentCode")]
        public string SDepartmentCode { get; set; } = string.Empty;

        [JsonPropertyName("sDepartmentName")]
        public string SDepartmentName { get; set; } = string.Empty;

        [JsonPropertyName("iEmployeeStatus")]
        public int IEmployeeStatus { get; set; }

        [JsonPropertyName("sEmployeeStatusName")]
        public string SEmployeeStatusName { get; set; } = string.Empty;

        [JsonPropertyName("iStatus")]
        public int IStatus { get; set; }

        [JsonPropertyName("sStatus")]
        public string SStatus { get; set; } = string.Empty;

        [JsonPropertyName("sReportingToCode")]
        public string SReportingToCode { get; set; } = string.Empty;

        [JsonPropertyName("sReportingToName")]
        public string SReportingToName { get; set; } = string.Empty;
    }

    // --- Asset Category DTOs ---
    public class AssetCategoryDataEnvelope
    {
        [JsonPropertyName("assetCategories")]
        public List<AssetCategoryDto> AssetCategories { get; set; } = new List<AssetCategoryDto>();
    }

    public class AssetCategoryDto
    {
        [JsonPropertyName("iMasterId")]
        public int IMasterId { get; set; }

        [JsonPropertyName("sName")]
        public string SName { get; set; } = string.Empty;

        [JsonPropertyName("sCode")]
        public string SCode { get; set; } = string.Empty;

        [JsonPropertyName("iStatus")]
        public int IStatus { get; set; }
    }

    // --- Asset DTOs ---
    public class AssetDataEnvelope
    {
        [JsonPropertyName("assets")]
        public List<AssetDto> Assets { get; set; } = new List<AssetDto>();
    }

    public class AssetDto
    {
        [JsonPropertyName("iMasterId")]
        public int IMasterId { get; set; }

        [JsonPropertyName("sName")]
        public string SName { get; set; } = string.Empty;

        [JsonPropertyName("sCode")]
        public string SCode { get; set; } = string.Empty;

        [JsonPropertyName("iCategoryId")]
        public int ICategoryId { get; set; }

        [JsonPropertyName("sCategoryCode")]
        public string SCategoryCode { get; set; } = string.Empty;

        [JsonPropertyName("sCategoryName")]
        public string SCategoryName { get; set; } = string.Empty;

        [JsonPropertyName("sTagNumber")]
        public string STagNumber { get; set; } = string.Empty;

        [JsonPropertyName("iStatus")]
        public int IStatus { get; set; }
    }

    // --- Asset Allocation DTOs ---
    public class SaveAssetAllocationDto
    {
        [JsonPropertyName("iHeaderId")]
        public int IHeaderId { get; set; } = 0;

        [JsonPropertyName("sDocNo")]
        public string SDocNo { get; set; } = string.Empty;

        [JsonPropertyName("dDocDate")]
        public string DDocDate { get; set; } = string.Empty;

        [JsonPropertyName("dPostDate")]
        public string DPostDate { get; set; } = string.Empty;

        [JsonPropertyName("iEmpId")]
        public int IEmpId { get; set; }

        [JsonPropertyName("sComments")]
        public string? SComments { get; set; }

        [JsonPropertyName("sEmployeeCode")]
        public string? SEmployeeCode { get; set; }

        [JsonPropertyName("sEmployeeName")]
        public string? SEmployeeName { get; set; }

        [JsonPropertyName("sDepartmentCode")]
        public string? SDepartmentCode { get; set; }

        [JsonPropertyName("sDepartmentName")]
        public string? SDepartmentName { get; set; }

        [JsonPropertyName("sDesignationCode")]
        public string? SDesignationCode { get; set; }

        [JsonPropertyName("sDesignationName")]
        public string? SDesignationName { get; set; }

        [JsonPropertyName("sReportingToCode")]
        public string? SReportingToCode { get; set; }

        [JsonPropertyName("sReportingToName")]
        public string? SReportingToName { get; set; }

        [JsonPropertyName("iCompanyId")]
        public int ICompanyId { get; set; } = 1;

        [JsonPropertyName("iPayYearId")]
        public int IPayYearId { get; set; } = 1;

        [JsonPropertyName("iStatus")]
        public int IStatus { get; set; } = 1;

        [JsonPropertyName("iAuthStatus")]
        public int IAuthStatus { get; set; } = 0;

        [JsonPropertyName("iCreatedBy")]
        public int ICreatedBy { get; set; } = 1;

        [JsonPropertyName("iModifiedBy")]
        public int IModifiedBy { get; set; } = 1;

        [JsonPropertyName("iApprovedBy")]
        public int IApprovedBy { get; set; } = 0;

        [JsonPropertyName("assets")]
        public List<AssetAllocationBodyDto> Assets { get; set; } = new List<AssetAllocationBodyDto>();

        [JsonPropertyName("attachment")]
        public AssetAllocationFileDto? Attachment { get; set; }

        [JsonPropertyName("assetFile")]
        public AssetAllocationFileDto? AssetFile { get; set; }

        public AssetAllocationFileDto? GetEffectiveAttachment()
        {
            return Attachment ?? AssetFile;
        }
    }

    public class AssetAllocationSaveItemDto
    {
        [JsonPropertyName("iAssetId")]
        public int IAssetId { get; set; }

        [JsonPropertyName("fQuantity")]
        public decimal FQuantity { get; set; } = 1;

        [JsonPropertyName("sRemarks")]
        public string SRemarks { get; set; } = string.Empty;
    }

    public class AssetAllocationBodyDto
    {
        [JsonPropertyName("iBodyId")]
        public int IBodyId { get; set; } = 0;

        [JsonPropertyName("iHeaderId")]
        public int IHeaderId { get; set; } = 0;

        [JsonPropertyName("sDocNo")]
        public string SDocNo { get; set; } = string.Empty;

        [JsonPropertyName("iAssetId")]
        public int IAssetId { get; set; }

        [JsonPropertyName("sAssetCode")]
        public string SAssetCode { get; set; } = string.Empty;

        [JsonPropertyName("sAssetName")]
        public string SAssetName { get; set; } = string.Empty;

        [JsonPropertyName("sCategoryCode")]
        public string SCategoryCode { get; set; } = string.Empty;

        [JsonPropertyName("sCategoryName")]
        public string SCategoryName { get; set; } = string.Empty;

        [JsonPropertyName("sTagNumber")]
        public string STagNumber { get; set; } = string.Empty;

        [JsonPropertyName("fQuantity")]
        public decimal FQuantity { get; set; } = 1;

        [JsonPropertyName("sRemarks")]
        public string? SRemarks { get; set; }
    }

    public class AssetAllocationFileDto
    {
        [JsonPropertyName("iHeaderId")]
        public int IHeaderId { get; set; } = 0;

        [JsonPropertyName("iFileId")]
        public int IFileId { get; set; } = 0;

        [JsonPropertyName("sAttachmentFilePath")]
        public string? SAttachmentFilePath { get; set; }

        [JsonPropertyName("sAttachmentFileName")]
        public string? SAttachmentFileName { get; set; }

        [JsonPropertyName("sContentType")]
        public string? SContentType { get; set; }
    }

    // --- Leave DTOs (Docs/API.pdf Sections 10-15) ---
    public class EmployeeLeaveItemDto
    {
        [JsonPropertyName("iLeaveTypeId")]
        public int ILeaveTypeId { get; set; }

        [JsonPropertyName("sLeaveName")]
        public string SLeaveName { get; set; } = string.Empty;

        [JsonPropertyName("openingLeaves")]
        public decimal OpeningLeaves { get; set; }

        [JsonPropertyName("leavesApproved")]
        public decimal LeavesApproved { get; set; }

        [JsonPropertyName("leavesPending")]
        public decimal LeavesPending { get; set; }

        [JsonPropertyName("leaveBalance")]
        public decimal LeaveBalance { get; set; }
    }

    public class EmployeeLeavesDataDto
    {
        [JsonPropertyName("iEmployeeId")]
        public int IEmployeeId { get; set; }

        [JsonPropertyName("sEmployeeCode")]
        public string SEmployeeCode { get; set; } = string.Empty;

        [JsonPropertyName("sEmployeeName")]
        public string SEmployeeName { get; set; } = string.Empty;

        [JsonPropertyName("sCategoryName")]
        public string? SCategoryName { get; set; }

        [JsonPropertyName("sDepartmentName")]
        public string? SDepartmentName { get; set; }

        [JsonPropertyName("sDesignationName")]
        public string? SDesignationName { get; set; }

        [JsonPropertyName("sReportingToName")]
        public string? SReportingToName { get; set; }

        [JsonPropertyName("iRevision")]
        public int IRevision { get; set; }

        [JsonPropertyName("iCompanyId")]
        public int ICompanyId { get; set; } = 1;

        [JsonPropertyName("iPayYearId")]
        public int IPayYearId { get; set; } = 1;

        [JsonPropertyName("leaves")]
        public List<EmployeeLeaveItemDto> Leaves { get; set; } = new List<EmployeeLeaveItemDto>();
    }

    public class EmployeeLeavesResultDto
    {
        [JsonPropertyName("success")]
        public bool Success { get; set; }

        [JsonPropertyName("statusCode")]
        public int StatusCode { get; set; }

        [JsonPropertyName("message")]
        public string? Message { get; set; }

        [JsonPropertyName("data")]
        public EmployeeLeavesDataDto? Data { get; set; }
    }

    public class EmployeeLeavesEmployeesWrapperDto
    {
        [JsonPropertyName("result")]
        public EmployeeLeavesResultDto? Result { get; set; }
    }

    public class EmployeeLeavesEnvelope
    {
        [JsonPropertyName("employees")]
        public EmployeeLeavesEmployeesWrapperDto? Employees { get; set; }
    }

    public class SaveLeaveTransactionDto
    {
        [JsonPropertyName("iHeaderId")]
        public int IHeaderId { get; set; } = 0;

        [JsonPropertyName("sDocNo")]
        public string SDocNo { get; set; } = string.Empty;

        [JsonPropertyName("dDocDate")]
        public string DDocDate { get; set; } = string.Empty;

        [JsonPropertyName("dPostDate")]
        public string DPostDate { get; set; } = string.Empty;

        [JsonPropertyName("iTransTypeId")]
        public int ITransTypeId { get; set; } = 0; // 0 = Opening Leaves, 1 = Leave Eligibility, 2 = Leave Adjustments / Leave Application

        [JsonPropertyName("sComments")]
        public string? SComments { get; set; }

        [JsonPropertyName("iCompanyId")]
        public int ICompanyId { get; set; } = 1;

        [JsonPropertyName("iPayYearId")]
        public int IPayYearId { get; set; } = 1;

        [JsonPropertyName("iStatus")]
        public int IStatus { get; set; } = 1;

        [JsonPropertyName("iAuthStatus")]
        public int IAuthStatus { get; set; } = 1;

        [JsonPropertyName("iCreatedBy")]
        public int ICreatedBy { get; set; } = 1;

        [JsonPropertyName("iModifiedBy")]
        public int IModifiedBy { get; set; } = 1;

        [JsonPropertyName("iApprovedBy")]
        public int IApprovedBy { get; set; } = 1;

        [JsonPropertyName("leaves")]
        public List<LeaveTransactionBodyDto> Leaves { get; set; } = new List<LeaveTransactionBodyDto>();

        [JsonPropertyName("leaveFile")]
        public LeaveTransactionFileDto? LeaveFile { get; set; }

        [JsonPropertyName("attachment")]
        public LeaveTransactionFileDto? Attachment { get; set; }

        public LeaveTransactionFileDto? GetEffectiveAttachment()
        {
            return LeaveFile ?? Attachment;
        }
    }

    public class LeaveTransactionSaveItemDto
    {
        [JsonPropertyName("iEmployeeId")]
        public int IEmployeeId { get; set; }

        [JsonPropertyName("iLeaveTypeId")]
        public int ILeaveTypeId { get; set; }

        [JsonPropertyName("iAdjType")]
        public int IAdjType { get; set; } = 1;

        [JsonPropertyName("fDuration")]
        public decimal FDuration { get; set; }

        [JsonPropertyName("sRemarks")]
        public string SRemarks { get; set; } = string.Empty;
    }

    public class LeaveTransactionBodyDto
    {
        [JsonPropertyName("iBodyId")]
        public int IBodyId { get; set; } = 0;

        [JsonPropertyName("iHeaderId")]
        public int IHeaderId { get; set; } = 0;

        [JsonPropertyName("sDocNo")]
        public string SDocNo { get; set; } = string.Empty;

        [JsonPropertyName("iTransTypeId")]
        public int ITransTypeId { get; set; } = 0;

        [JsonPropertyName("iEmployeeId")]
        public int IEmployeeId { get; set; }

        [JsonPropertyName("sEmployeeCode")]
        public string SEmployeeCode { get; set; } = string.Empty;

        [JsonPropertyName("sEmployeeName")]
        public string SEmployeeName { get; set; } = string.Empty;

        [JsonPropertyName("sDepartmentName")]
        public string? SDepartmentName { get; set; }

        [JsonPropertyName("sDesignationName")]
        public string? SDesignationName { get; set; }

        [JsonPropertyName("sReportingToName")]
        public string? SReportingToName { get; set; }

        [JsonPropertyName("iRevisionId")]
        public int IRevisionId { get; set; } = 0;

        [JsonPropertyName("iLeaveTypeId")]
        public int ILeaveTypeId { get; set; }

        [JsonPropertyName("sLeaveTypeName")]
        public string SLeaveTypeName { get; set; } = string.Empty;

        [JsonPropertyName("iAdjType")]
        public int IAdjType { get; set; } = 1;

        [JsonPropertyName("fDuration")]
        public decimal FDuration { get; set; }

        [JsonPropertyName("sRemarks")]
        public string? SRemarks { get; set; }
    }

    public class LeaveTransactionFileDto
    {
        [JsonPropertyName("iHeaderId")]
        public int IHeaderId { get; set; } = 0;

        [JsonPropertyName("iFileId")]
        public int IFileId { get; set; } = 0;

        [JsonPropertyName("sAttachmentFilePath")]
        public string? SAttachmentFilePath { get; set; }

        [JsonPropertyName("sAttachmentFileName")]
        public string? SAttachmentFileName { get; set; }

        [JsonPropertyName("sContentType")]
        public string? SContentType { get; set; }
    }

    public class PaymentTypeDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
    }

    public class HalfDayDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
    }

    public class LeaveTypeOptionsDto
    {
        [JsonPropertyName("leaveTypes")]
        public List<EmployeeLeaveItemDto> LeaveTypes { get; set; } = new List<EmployeeLeaveItemDto>();

        [JsonPropertyName("paymentTypes")]
        public List<PaymentTypeDto> PaymentTypes { get; set; } = new List<PaymentTypeDto>();

        [JsonPropertyName("halfDay")]
        public List<HalfDayDto> HalfDay { get; set; } = new List<HalfDayDto>();
    }
}
