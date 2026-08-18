using System.Collections.Generic;
using System.Threading.Tasks;
using HCMSys.Models;

namespace HCMSys.Services
{
    public interface IHcmsApiService
    {
        Task<string?> GetAuthTokenAsync();
        Task<List<EmployeeDto>> GetEmployeesAsync();
        Task<List<AssetCategoryDto>> GetAssetCategoriesAsync();
        Task<List<AssetDto>> GetAssetsAsync();
        Task<ApiResponseEnvelope<object>?> SaveAssetAllocationAsync(SaveAssetAllocationDto request, byte[]? fileBytes = null, string? fileName = null, string? contentType = null);
        Task<ApiResponseEnvelope<object>?> DeleteAssetAllocationAsync(int id);
        Task<List<SaveAssetAllocationDto>> GetAssetAllocationsAsync(int companyId = 1, int payYearId = 1);
        Task<SaveAssetAllocationDto?> GetAssetAllocationByIdAsync(int id);
        Task<List<EmployeeLeaveItemDto>> GetEmployeeLeavesAsync(int employeeId);
        Task<List<SaveLeaveTransactionDto>> GetLeaveTransactionsAsync(int companyId = 1, int payYearId = 1);
        Task<SaveLeaveTransactionDto?> GetLeaveTransactionByIdAsync(int id);
        Task<ApiResponseEnvelope<object>?> SaveLeaveTransactionAsync(SaveLeaveTransactionDto request, byte[]? fileBytes = null, string? fileName = null, string? contentType = null);
        Task<ApiResponseEnvelope<object>?> UpdateLeaveTransactionAsync(SaveLeaveTransactionDto request, byte[]? fileBytes = null, string? fileName = null, string? contentType = null);
        Task<ApiResponseEnvelope<object>?> DeleteLeaveTransactionAsync(int id);
        Task<LeaveTypeOptionsDto> GetLeaveTypesAsync(int? employeeId = null);
    }
}
