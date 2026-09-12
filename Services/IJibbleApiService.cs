using HCMSys.Models;

namespace HCMSys.Services
{
    public interface IJibbleApiService
    {
        Task<string?> GetAuthTokenAsync();
        Task<List<JibbleTimesheetGridRowDto>> GetTimesheetGridRowsAsync(string date = "2026-08-01", string period = "Month", bool forceRefresh = false);
    }
}
