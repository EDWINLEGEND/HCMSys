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

        [JsonPropertyName("assetFile")]
        public AssetAllocationFileDto? AssetFile { get; set; }
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
}
