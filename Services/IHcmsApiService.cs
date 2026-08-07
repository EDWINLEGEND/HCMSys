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
        Task<ApiResponseEnvelope<object>?> SaveAssetAllocationAsync(SaveAssetAllocationDto request);
        Task<List<SaveAssetAllocationDto>> GetAssetAllocationsAsync(int companyId = 1, int payYearId = 1);
        Task<SaveAssetAllocationDto?> GetAssetAllocationByIdAsync(int id);
        Task<List<LeaveBalanceDto>> GetLeaveBalancesAsync();
        Task<LeaveTypeOptionsDto> GetLeaveTypesAsync();
    }
}
