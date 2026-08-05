using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using HCMSys.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace HCMSys.Services
{
    public class HcmsApiService : IHcmsApiService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;
        private readonly ILogger<HcmsApiService> _logger;

        private static string? _cachedToken;
        private static DateTime _tokenExpiration = DateTime.MinValue;
        private static readonly System.Threading.SemaphoreSlim _tokenSemaphore = new System.Threading.SemaphoreSlim(1, 1);

        public HcmsApiService(HttpClient httpClient, IConfiguration config, ILogger<HcmsApiService> logger)
        {
            _httpClient = httpClient;
            _config = config;
            _logger = logger;

            var baseUrl = _config["HcmsApi:BaseUrl"] ?? "https://neoxisktj-001-site1.ftempurl.com";
            _httpClient.BaseAddress = new Uri(baseUrl.TrimEnd('/') + "/");
        }

        public async Task<string?> GetAuthTokenAsync()
        {
            if (!string.IsNullOrEmpty(_cachedToken) && DateTime.UtcNow < _tokenExpiration.AddMinutes(-2))
            {
                return _cachedToken;
            }

            await _tokenSemaphore.WaitAsync();
            try
            {
                if (!string.IsNullOrEmpty(_cachedToken) && DateTime.UtcNow < _tokenExpiration.AddMinutes(-2))
                {
                    return _cachedToken;
                }

                var username = _config["HcmsApi:Username"] ?? "edwin";
                var password = _config["HcmsApi:Password"] ?? "123";

                var loginPayload = new ApiLoginRequest { Username = username, Password = password };
                var jsonContent = new StringContent(JsonSerializer.Serialize(loginPayload), Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync("api/auth/login", jsonContent);
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogError("API Auth login failed with status code {StatusCode}", response.StatusCode);
                    return null;
                }

                var jsonString = await response.Content.ReadAsStringAsync();
                var loginResponse = JsonSerializer.Deserialize<ApiLoginResponse>(jsonString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                var token = loginResponse?.GetEffectiveToken();
                if (!string.IsNullOrEmpty(token))
                {
                    _cachedToken = token;
                    _tokenExpiration = DateTime.UtcNow.AddMinutes(25);
                    return _cachedToken;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during API authentication");
            }
            finally
            {
                _tokenSemaphore.Release();
            }

            return null;
        }

        public async Task<List<EmployeeDto>> GetEmployeesAsync()
        {
            try
            {
                var token = await GetAuthTokenAsync();
                if (string.IsNullOrEmpty(token)) return new List<EmployeeDto>();

                var request = new HttpRequestMessage(HttpMethod.Get, "api/asset/employees");
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var response = await _httpClient.SendAsync(request);
                if (!response.IsSuccessStatusCode)
                {
                    request = new HttpRequestMessage(HttpMethod.Get, "api/common/employees");
                    request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
                    response = await _httpClient.SendAsync(request);
                }

                if (response.IsSuccessStatusCode)
                {
                    var jsonString = await response.Content.ReadAsStringAsync();
                    var envelope = JsonSerializer.Deserialize<ApiResponseEnvelope<EmployeeDataEnvelope>>(jsonString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    return envelope?.Data?.Employees ?? new List<EmployeeDto>();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching Employees from API");
            }

            return new List<EmployeeDto>();
        }

        public async Task<List<AssetCategoryDto>> GetAssetCategoriesAsync()
        {
            try
            {
                var token = await GetAuthTokenAsync();
                if (string.IsNullOrEmpty(token)) return new List<AssetCategoryDto>();

                var request = new HttpRequestMessage(HttpMethod.Get, "api/asset/AssetCategories");
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var response = await _httpClient.SendAsync(request);
                if (response.IsSuccessStatusCode)
                {
                    var jsonString = await response.Content.ReadAsStringAsync();
                    var envelope = JsonSerializer.Deserialize<ApiResponseEnvelope<AssetCategoryDataEnvelope>>(jsonString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    return envelope?.Data?.AssetCategories ?? new List<AssetCategoryDto>();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching Asset Categories from API");
            }

            return new List<AssetCategoryDto>();
        }

        public async Task<List<AssetDto>> GetAssetsAsync()
        {
            try
            {
                var token = await GetAuthTokenAsync();
                if (string.IsNullOrEmpty(token)) return new List<AssetDto>();

                var request = new HttpRequestMessage(HttpMethod.Get, "api/asset/Assets");
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var response = await _httpClient.SendAsync(request);
                if (response.IsSuccessStatusCode)
                {
                    var jsonString = await response.Content.ReadAsStringAsync();
                    var envelope = JsonSerializer.Deserialize<ApiResponseEnvelope<AssetDataEnvelope>>(jsonString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    return envelope?.Data?.Assets ?? new List<AssetDto>();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching Assets from API");
            }

            return new List<AssetDto>();
        }

        public async Task<ApiResponseEnvelope<object>?> SaveAssetAllocationAsync(SaveAssetAllocationDto payload)
        {
            try
            {
                var token = await GetAuthTokenAsync();
                if (string.IsNullOrEmpty(token))
                {
                    return new ApiResponseEnvelope<object> { Success = false, Message = "Authentication failed (no token)." };
                }

                var request = new HttpRequestMessage(HttpMethod.Post, "api/asset/saveassetallocation");
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var jsonPayload = JsonSerializer.Serialize(payload);
                request.Content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                var response = await _httpClient.SendAsync(request);
                var jsonString = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    return JsonSerializer.Deserialize<ApiResponseEnvelope<object>>(jsonString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                }
                else
                {
                    _logger.LogWarning("SaveAssetAllocation API returned non-success code {StatusCode}: {Response}", response.StatusCode, jsonString);
                    return new ApiResponseEnvelope<object> { Success = false, Message = $"API returned status {response.StatusCode}" };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling SaveAssetAllocation API");
                return new ApiResponseEnvelope<object> { Success = false, Message = ex.Message };
            }
        }

        public async Task<List<SaveAssetAllocationDto>> GetAssetAllocationsAsync(int companyId = 1, int payYearId = 1)
        {
            try
            {
                var token = await GetAuthTokenAsync();
                if (string.IsNullOrEmpty(token)) return new List<SaveAssetAllocationDto>();

                var request = new HttpRequestMessage(HttpMethod.Get, $"api/asset/GetAssetAllocation?iCompanyId={companyId}&iPayYearId={payYearId}");
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var response = await _httpClient.SendAsync(request);
                if (response.IsSuccessStatusCode)
                {
                    var jsonString = await response.Content.ReadAsStringAsync();
                    var envelope = JsonSerializer.Deserialize<ApiResponseEnvelope<List<SaveAssetAllocationDto>>>(jsonString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    return envelope?.Data ?? new List<SaveAssetAllocationDto>();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching Asset Allocations from API");
            }

            return new List<SaveAssetAllocationDto>();
        }

        public async Task<SaveAssetAllocationDto?> GetAssetAllocationByIdAsync(int id)
        {
            try
            {
                var token = await GetAuthTokenAsync();
                if (string.IsNullOrEmpty(token)) return null;

                var request = new HttpRequestMessage(HttpMethod.Get, $"api/asset/GetAssetAllocation/{id}");
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var response = await _httpClient.SendAsync(request);
                if (response.IsSuccessStatusCode)
                {
                    var jsonString = await response.Content.ReadAsStringAsync();
                    var envelope = JsonSerializer.Deserialize<ApiResponseEnvelope<SaveAssetAllocationDto>>(jsonString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    return envelope?.Data;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching Asset Allocation by Id from API");
            }

            return null;
        }
    }
}
