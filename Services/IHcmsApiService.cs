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
    }
}
