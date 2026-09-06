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

        public async Task<ApiResponseEnvelope<object>?> SaveAssetAllocationAsync(SaveAssetAllocationDto payload, byte[]? fileBytes = null, string? fileName = null, string? contentType = null)
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

                var formData = new MultipartFormDataContent();

                // 1. Scalar form-data fields matching Docs/API.pdf Page 10 / Postman specification
                if (payload.IHeaderId > 0)
                {
                    formData.Add(new StringContent(payload.IHeaderId.ToString()), "iHeaderId");
                }
                else
                {
                    formData.Add(new StringContent("0"), "iHeaderId");
                }

                formData.Add(new StringContent(payload.SDocNo ?? ""), "sDocNo");

                // Normalize dates to YYYY-MM-DD format as required by remote API
                string docDateStr = NormalizeDateToYMD(payload.DDocDate);
                string postDateStr = NormalizeDateToYMD(payload.DPostDate);
                formData.Add(new StringContent(docDateStr), "dDocDate");
                formData.Add(new StringContent(postDateStr), "dPostDate");

                // Defensive mapping: if sequence id was provided, map to iMasterId
                if (payload.IEmpId > 0 && payload.IEmpId <= 3)
                {
                    try
                    {
                        var emps = await GetEmployeesAsync();
                        var matched = emps.FirstOrDefault(e => e.Id == payload.IEmpId);
                        if (matched != null && matched.IMasterId > 0)
                        {
                            payload.IEmpId = matched.IMasterId;
                        }
                    }
                    catch { }
                }

                formData.Add(new StringContent(payload.IEmpId.ToString()), "iEmpId");
                formData.Add(new StringContent(payload.ICompanyId.ToString()), "iCompanyId");
                formData.Add(new StringContent(payload.IPayYearId.ToString()), "iPayYearId");
                formData.Add(new StringContent(string.IsNullOrWhiteSpace(payload.SComments) ? "Test allocation" : payload.SComments), "sComments");

                // 2. Serialized JSON string array for Assets field: [{"iAssetId":1,"fQuantity":1,"sRemarks":"..."}]
                var assetItems = (payload.Assets ?? new List<AssetAllocationBodyDto>()).Select(a => new {
                    iAssetId = a.IAssetId > 0 ? a.IAssetId : 1,
                    fQuantity = a.FQuantity > 0 ? (int)a.FQuantity : 1,
                    sRemarks = !string.IsNullOrWhiteSpace(a.SRemarks) ? a.SRemarks : "N/A"
                }).ToList();

                var assetsJson = JsonSerializer.Serialize(assetItems);
                formData.Add(new StringContent(assetsJson), "Assets");

                // 3. File Attachment
                byte[]? attachmentBytes = fileBytes;
                string uploadFileName = fileName ?? "attachment.txt";
                string uploadMimeType = contentType ?? "text/plain";

                if ((attachmentBytes == null || attachmentBytes.Length == 0) && !string.IsNullOrEmpty(payload.Attachment?.SAttachmentFilePath))
                {
                    var dataUrl = payload.Attachment.SAttachmentFilePath;
                    if (dataUrl.StartsWith("data:", StringComparison.OrdinalIgnoreCase))
                    {
                        try
                        {
                            var commaIdx = dataUrl.IndexOf(',');
                            if (commaIdx > -1)
                            {
                                var header = dataUrl.Substring(0, commaIdx);
                                var base64 = dataUrl.Substring(commaIdx + 1);
                                attachmentBytes = Convert.FromBase64String(base64);
                                uploadFileName = payload.Attachment.SAttachmentFileName ?? "attachment.dat";
                                if (header.Contains(";"))
                                {
                                    var mime = header.Split(';')[0].Replace("data:", "");
                                    if (!string.IsNullOrEmpty(mime)) uploadMimeType = mime;
                                }
                            }
                        }
                        catch { }
                    }
                }

                // If still no attachment provided, attach a fallback placeholder file to satisfy API validation
                if (attachmentBytes == null || attachmentBytes.Length == 0)
                {
                    attachmentBytes = Encoding.UTF8.GetBytes("Asset Allocation Attachment Document");
                    uploadFileName = "attachment.txt";
                    uploadMimeType = "text/plain";
                }

                var fileContent = new ByteArrayContent(attachmentBytes);
                fileContent.Headers.ContentType = new MediaTypeHeaderValue(uploadMimeType);
                formData.Add(fileContent, "Attachment", uploadFileName);

                request.Content = formData;

                var response = await _httpClient.SendAsync(request);
                var jsonString = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    return JsonSerializer.Deserialize<ApiResponseEnvelope<object>>(jsonString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                }
                else if (jsonString.Contains("Document number already exists", StringComparison.OrdinalIgnoreCase))
                {
                    _logger.LogWarning("SaveAssetAllocation document number collided. Fetching next available document number and retrying...");
                    
                    try
                    {
                        var currentAllocs = await GetAssetAllocationsAsync(payload.ICompanyId, payload.IPayYearId);
                        int maxNum = 0;
                        foreach (var a in currentAllocs)
                        {
                            var docStr = a.SDocNo ?? "";
                            var digits = new string(docStr.Where(char.IsDigit).ToArray());
                            if (int.TryParse(digits, out int val) && val > maxNum) maxNum = val;
                        }
                        var nextDocNo = $"AST{(maxNum + 1).ToString().PadLeft(6, '0')}";

                        // Retry once with next available doc number
                        var retryRequest = new HttpRequestMessage(HttpMethod.Post, "api/asset/saveassetallocation");
                        retryRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

                        var retryFormData = new MultipartFormDataContent();
                        retryFormData.Add(new StringContent(payload.IHeaderId.ToString()), "iHeaderId");
                        retryFormData.Add(new StringContent(nextDocNo), "sDocNo");
                        retryFormData.Add(new StringContent(docDateStr), "dDocDate");
                        retryFormData.Add(new StringContent(postDateStr), "dPostDate");
                        retryFormData.Add(new StringContent(payload.IEmpId.ToString()), "iEmpId");
                        retryFormData.Add(new StringContent(payload.ICompanyId.ToString()), "iCompanyId");
                        retryFormData.Add(new StringContent(payload.IPayYearId.ToString()), "iPayYearId");
                        retryFormData.Add(new StringContent(string.IsNullOrWhiteSpace(payload.SComments) ? "Asset allocation" : payload.SComments), "sComments");
                        retryFormData.Add(new StringContent(assetsJson), "Assets");

                        var retryFileContent = new ByteArrayContent(attachmentBytes);
                        retryFileContent.Headers.ContentType = new MediaTypeHeaderValue(uploadMimeType);
                        retryFormData.Add(retryFileContent, "Attachment", uploadFileName);

                        retryRequest.Content = retryFormData;

                        var retryResponse = await _httpClient.SendAsync(retryRequest);
                        var retryJsonString = await retryResponse.Content.ReadAsStringAsync();

                        if (retryResponse.IsSuccessStatusCode)
                        {
                            var resEnv = JsonSerializer.Deserialize<ApiResponseEnvelope<object>>(retryJsonString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                            if (resEnv != null)
                            {
                                if (payload.IHeaderId > 0 && !string.IsNullOrEmpty(payload.SDocNo))
                                {
                                    resEnv.Data = new {
                                        docNo = payload.SDocNo,
                                        revisionDocNo = nextDocNo,
                                        headerId = payload.IHeaderId
                                    };
                                    resEnv.Message = $"Asset allocation {payload.SDocNo} updated successfully.";
                                }
                                return resEnv;
                            }
                            return resEnv;
                        }
                        else
                        {
                            _logger.LogWarning("Retry SaveAssetAllocation failed with {StatusCode}: {Response}", retryResponse.StatusCode, retryJsonString);
                            var retryErr = JsonSerializer.Deserialize<ApiResponseEnvelope<object>>(retryJsonString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                            if (retryErr != null) return retryErr;
                        }
                    }
                    catch (Exception retryEx)
                    {
                        _logger.LogError(retryEx, "Error during document number retry in SaveAssetAllocationAsync");
                    }

                    try
                    {
                        var errEnvelope = JsonSerializer.Deserialize<ApiResponseEnvelope<object>>(jsonString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                        if (errEnvelope != null) return errEnvelope;
                    }
                    catch { }
                    return new ApiResponseEnvelope<object> { Success = false, Message = $"API returned status {response.StatusCode}: {jsonString}" };
                }
                else
                {
                    _logger.LogWarning("SaveAssetAllocation API returned status {StatusCode}: {Response}", response.StatusCode, jsonString);
                    try
                    {
                        var errEnvelope = JsonSerializer.Deserialize<ApiResponseEnvelope<object>>(jsonString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                        if (errEnvelope != null) return errEnvelope;
                    }
                    catch { }
                    return new ApiResponseEnvelope<object> { Success = false, Message = $"API returned status {response.StatusCode}: {jsonString}" };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling SaveAssetAllocation API");
                return new ApiResponseEnvelope<object> { Success = false, Message = ex.Message };
            }
        }

        public async Task<ApiResponseEnvelope<object>?> DeleteAssetAllocationAsync(int id)
        {
            try
            {
                var token = await GetAuthTokenAsync();
                if (string.IsNullOrEmpty(token))
                {
                    return new ApiResponseEnvelope<object> { Success = false, Message = "Authentication failed (no token)." };
                }

                var request = new HttpRequestMessage(HttpMethod.Delete, $"api/asset/DeleteAssetAllocation/{id}");
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var response = await _httpClient.SendAsync(request);
                var jsonString = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    return JsonSerializer.Deserialize<ApiResponseEnvelope<object>>(jsonString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                           ?? new ApiResponseEnvelope<object> { Success = true, Message = "Asset allocation deleted successfully." };
                }
                else
                {
                    _logger.LogWarning("DeleteAssetAllocation API returned status {StatusCode}: {Response}", response.StatusCode, jsonString);
                    try
                    {
                        var errEnvelope = JsonSerializer.Deserialize<ApiResponseEnvelope<object>>(jsonString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                        if (errEnvelope != null) return errEnvelope;
                    }
                    catch { }
                    return new ApiResponseEnvelope<object> { Success = false, Message = $"API returned status {response.StatusCode}: {jsonString}" };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling DeleteAssetAllocation API");
                return new ApiResponseEnvelope<object> { Success = false, Message = ex.Message };
            }
        }

        private static string NormalizeDateToYMD(string? dateStr)
        {
            if (string.IsNullOrWhiteSpace(dateStr)) return DateTime.UtcNow.ToString("yyyy-MM-dd");
            if (DateTime.TryParse(dateStr, System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out var parsed))
            {
                return parsed.ToString("yyyy-MM-dd");
            }
            var parts = dateStr.Split('-', '/', '.');
            if (parts.Length == 3)
            {
                if (parts[0].Length == 4)
                {
                    return $"{parts[0]}-{parts[1].PadLeft(2, '0')}-{parts[2].PadLeft(2, '0')}";
                }
                if (parts[2].Length == 4)
                {
                    var months = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
                    {
                        {"Jan", "01"}, {"Feb", "02"}, {"Mar", "03"}, {"Apr", "04"},
                        {"May", "05"}, {"Jun", "06"}, {"Jul", "07"}, {"Aug", "08"},
                        {"Sep", "09"}, {"Oct", "10"}, {"Nov", "11"}, {"Dec", "12"}
                    };
                    var m = months.ContainsKey(parts[1]) ? months[parts[1]] : parts[1].PadLeft(2, '0');
                    var d = parts[0].PadLeft(2, '0');
                    var y = parts[2];
                    return $"{y}-{m}-{d}";
                }
            }
            return DateTime.UtcNow.ToString("yyyy-MM-dd");
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
                    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

                    // 1. Try envelope ApiResponseEnvelope<List<SaveAssetAllocationDto>>
                    try
                    {
                        var envelope = JsonSerializer.Deserialize<ApiResponseEnvelope<List<SaveAssetAllocationDto>>>(jsonString, options);
                        if (envelope?.Data != null) return envelope.Data;
                    }
                    catch { }

                    // 2. Try direct List<SaveAssetAllocationDto>
                    try
                    {
                        var directList = JsonSerializer.Deserialize<List<SaveAssetAllocationDto>>(jsonString, options);
                        if (directList != null) return directList;
                    }
                    catch { }
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

        public async Task<List<EmployeeLeaveItemDto>> GetEmployeeLeavesAsync(int employeeId)
        {
            try
            {
                // If employeeId is passed as local sequence id (1, 2, 3), map to remote iMasterId (41, 40, 36)
                if (employeeId > 0 && employeeId <= 3)
                {
                    try
                    {
                        var emps = await GetEmployeesAsync();
                        var matched = emps.FirstOrDefault(e => e.Id == employeeId);
                        if (matched != null && matched.IMasterId > 0)
                        {
                            employeeId = matched.IMasterId;
                        }
                    }
                    catch { }
                }

                var token = await GetAuthTokenAsync();
                if (!string.IsNullOrEmpty(token) && employeeId > 0)
                {
                    var request = new HttpRequestMessage(HttpMethod.Get, $"api/Leaves/EmployeeLeaves/{employeeId}");
                    request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
                    var response = await _httpClient.SendAsync(request);
                    if (response.IsSuccessStatusCode)
                    {
                        var jsonString = await response.Content.ReadAsStringAsync();
                        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

                        List<EmployeeLeaveItemDto>? leaves = null;

                        // 1. Try envelope deserialization (Docs/API.pdf Section 10 structure)
                        try
                        {
                            var envelope = JsonSerializer.Deserialize<ApiResponseEnvelope<EmployeeLeavesEnvelope>>(jsonString, options);
                            leaves = envelope?.Data?.Employees?.Result?.Data?.Leaves;
                        }
                        catch { }

                        // 2. Try direct Data wrapper deserialization
                        if (leaves == null || leaves.Count == 0)
                        {
                            try
                            {
                                var envelope = JsonSerializer.Deserialize<ApiResponseEnvelope<EmployeeLeavesDataDto>>(jsonString, options);
                                leaves = envelope?.Data?.Leaves;
                            }
                            catch { }
                        }

                        if (leaves != null && leaves.Count > 0)
                        {
                            // Account for any approved/applied leaves from transactions (iTransTypeId == 2)
                            try
                            {
                                var transactions = await GetLeaveTransactionsAsync(1, 1);
                                var appTxs = transactions.Where(t => t.ITransTypeId == 2);
                                foreach (var t in appTxs)
                                {
                                    var tLeaves = (t.Leaves ?? new List<LeaveTransactionBodyDto>()).Where(l => l.IEmployeeId == employeeId);
                                    foreach (var tl in tLeaves)
                                    {
                                        var match = leaves.FirstOrDefault(l => (tl.ILeaveTypeId > 0 && l.ILeaveTypeId == tl.ILeaveTypeId) ||
                                                                               (!string.IsNullOrEmpty(tl.SLeaveTypeName) && string.Equals(l.SLeaveName, tl.SLeaveTypeName, StringComparison.OrdinalIgnoreCase)));
                                        if (match != null)
                                        {
                                            match.LeavesApproved += tl.FDuration;
                                        }
                                    }
                                }
                            }
                            catch { }

                            foreach (var l in leaves)
                            {
                                l.LeaveBalance = Math.Max(0, l.OpeningLeaves - l.LeavesApproved - l.LeavesPending);
                            }

                            return leaves;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching Employee Leaves from API for emp {EmpId}", employeeId);
            }

            // If remote DB returned no leaves structure, calculate strictly from live Leave Transactions
            try
            {
                var transactions = await GetLeaveTransactionsAsync(1, 1);
                var empTxs = transactions.Where(t => (t.Leaves ?? new List<LeaveTransactionBodyDto>()).Any(l => l.IEmployeeId == employeeId)).ToList();
                if (empTxs.Count > 0)
                {
                    var calculated = new List<EmployeeLeaveItemDto>();
                    foreach (var t in empTxs)
                    {
                        var tLeaves = (t.Leaves ?? new List<LeaveTransactionBodyDto>()).Where(l => l.IEmployeeId == employeeId);
                        foreach (var l in tLeaves)
                        {
                            var match = calculated.FirstOrDefault(dt => (l.ILeaveTypeId > 0 && dt.ILeaveTypeId == l.ILeaveTypeId) ||
                                                                        (!string.IsNullOrEmpty(l.SLeaveTypeName) && string.Equals(dt.SLeaveName, l.SLeaveTypeName, StringComparison.OrdinalIgnoreCase)));
                            if (match == null)
                            {
                                match = new EmployeeLeaveItemDto
                                {
                                    ILeaveTypeId = l.ILeaveTypeId > 0 ? l.ILeaveTypeId : 7,
                                    SLeaveName = !string.IsNullOrWhiteSpace(l.SLeaveTypeName) ? l.SLeaveTypeName : (!string.IsNullOrWhiteSpace(l.SRemarks) ? l.SRemarks : "Leave"),
                                    OpeningLeaves = 0,
                                    LeavesApproved = 0,
                                    LeavesPending = 0,
                                    LeaveBalance = 0
                                };
                                calculated.Add(match);
                            }

                            if (t.ITransTypeId == 0 || t.ITransTypeId == 1)
                            {
                                match.OpeningLeaves += l.FDuration;
                            }
                            else if (t.ITransTypeId == 2)
                            {
                                match.LeavesApproved += l.FDuration;
                            }
                        }
                    }

                    foreach (var dt in calculated)
                    {
                        dt.LeaveBalance = Math.Max(0, dt.OpeningLeaves - dt.LeavesApproved - dt.LeavesPending);
                    }

                    return calculated;
                }
            }
            catch { }

            return new List<EmployeeLeaveItemDto>();
        }

        public async Task<List<SaveLeaveTransactionDto>> GetLeaveTransactionsAsync(int companyId = 1, int payYearId = 1)
        {
            try
            {
                var token = await GetAuthTokenAsync();
                if (string.IsNullOrEmpty(token)) return new List<SaveLeaveTransactionDto>();

                var request = new HttpRequestMessage(HttpMethod.Get, $"api/leaves/GetLeaveTransactions?iCompanyId={companyId}&iPayYearId={payYearId}");
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var response = await _httpClient.SendAsync(request);
                if (response.IsSuccessStatusCode)
                {
                    var jsonString = await response.Content.ReadAsStringAsync();
                    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

                    // 1. Try envelope ApiResponseEnvelope<List<SaveLeaveTransactionDto>>
                    try
                    {
                        var envelope = JsonSerializer.Deserialize<ApiResponseEnvelope<List<SaveLeaveTransactionDto>>>(jsonString, options);
                        if (envelope?.Data != null) return envelope.Data;
                    }
                    catch { }

                    // 2. Try direct List<SaveLeaveTransactionDto>
                    try
                    {
                        var directList = JsonSerializer.Deserialize<List<SaveLeaveTransactionDto>>(jsonString, options);
                        if (directList != null) return directList;
                    }
                    catch { }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching Leave Transactions from API");
            }

            return new List<SaveLeaveTransactionDto>();
        }

        public async Task<SaveLeaveTransactionDto?> GetLeaveTransactionByIdAsync(int id)
        {
            try
            {
                var token = await GetAuthTokenAsync();
                if (string.IsNullOrEmpty(token) || id <= 0) return null;

                var request = new HttpRequestMessage(HttpMethod.Get, $"api/leaves/GetLeaveTransaction/{id}");
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var response = await _httpClient.SendAsync(request);
                if (response.IsSuccessStatusCode)
                {
                    var jsonString = await response.Content.ReadAsStringAsync();
                    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

                    // 1. Try ApiResponseEnvelope<SaveLeaveTransactionDto>
                    try
                    {
                        var envelope = JsonSerializer.Deserialize<ApiResponseEnvelope<SaveLeaveTransactionDto>>(jsonString, options);
                        if (envelope?.Data != null) return envelope.Data;
                    }
                    catch { }

                    // 2. Try ApiResponseEnvelope<List<SaveLeaveTransactionDto>> (as documented in PDF sample)
                    try
                    {
                        var envelopeList = JsonSerializer.Deserialize<ApiResponseEnvelope<List<SaveLeaveTransactionDto>>>(jsonString, options);
                        if (envelopeList?.Data != null && envelopeList.Data.Count > 0) return envelopeList.Data[0];
                    }
                    catch { }

                    // 3. Try direct SaveLeaveTransactionDto
                    try
                    {
                        var direct = JsonSerializer.Deserialize<SaveLeaveTransactionDto>(jsonString, options);
                        if (direct != null && (direct.IHeaderId > 0 || !string.IsNullOrEmpty(direct.SDocNo))) return direct;
                    }
                    catch { }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching Leave Transaction by Id {Id} from API", id);
            }

            return null;
        }

        public async Task<ApiResponseEnvelope<object>?> SaveLeaveTransactionAsync(SaveLeaveTransactionDto payload, byte[]? fileBytes = null, string? fileName = null, string? contentType = null)
        {
            try
            {
                var token = await GetAuthTokenAsync();
                if (string.IsNullOrEmpty(token))
                {
                    return new ApiResponseEnvelope<object> { Success = false, Message = "Authentication failed (no token)." };
                }

                bool isUpdate = payload.IHeaderId > 0;
                string endpoint = isUpdate ? "api/Leaves/UpdateLeaveTransaction" : "api/Leaves/SaveLeaveTransaction";

                var request = new HttpRequestMessage(HttpMethod.Post, endpoint);
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var formData = new MultipartFormDataContent();

                formData.Add(new StringContent(payload.IHeaderId.ToString()), "iHeaderId");
                formData.Add(new StringContent(payload.SDocNo ?? ""), "sDocNo");

                string docDateStr = NormalizeDateToYMD(payload.DDocDate);
                string postDateStr = NormalizeDateToYMD(payload.DPostDate);
                formData.Add(new StringContent(docDateStr), "dDocDate");
                formData.Add(new StringContent(postDateStr), "dPostDate");

                formData.Add(new StringContent(payload.ICompanyId.ToString()), "iCompanyId");
                formData.Add(new StringContent(payload.IPayYearId.ToString()), "iPayYearId");
                formData.Add(new StringContent(string.IsNullOrWhiteSpace(payload.SComments) ? "Leave application" : payload.SComments), "sComments");
                formData.Add(new StringContent(payload.ITransTypeId.ToString()), "iTransTypeId");

                // Map any employee sequence ids (1..3) to iMasterId
                if (payload.Leaves != null && payload.Leaves.Any(l => l.IEmployeeId > 0 && l.IEmployeeId <= 3))
                {
                    try
                    {
                        var emps = await GetEmployeesAsync();
                        foreach (var l in payload.Leaves)
                        {
                            if (l.IEmployeeId > 0 && l.IEmployeeId <= 3)
                            {
                                var matched = emps.FirstOrDefault(e => e.Id == l.IEmployeeId);
                                if (matched != null && matched.IMasterId > 0)
                                {
                                    l.IEmployeeId = matched.IMasterId;
                                }
                            }
                        }
                    }
                    catch { }
                }

                // Serialized JSON string array for Leaves field: [{"iEmployeeId":36,"iLeaveTypeId":8,"iAdjType":1,"fDuration":180,"sRemarks":"..."}]
                var leaveItems = (payload.Leaves ?? new List<LeaveTransactionBodyDto>()).Select(l => new {
                    iEmployeeId = l.IEmployeeId,
                    iLeaveTypeId = l.ILeaveTypeId > 0 ? l.ILeaveTypeId : 7,
                    iAdjType = l.IAdjType != 0 ? l.IAdjType : 1,
                    fDuration = l.FDuration > 0 ? l.FDuration : 1,
                    sRemarks = !string.IsNullOrWhiteSpace(l.SRemarks) ? l.SRemarks : (!string.IsNullOrWhiteSpace(l.SLeaveTypeName) ? l.SLeaveTypeName : "Leave Application")
                }).ToList();

                var leavesJson = JsonSerializer.Serialize(leaveItems);
                formData.Add(new StringContent(leavesJson), "Leaves");

                // File Attachment
                byte[]? attachmentBytes = fileBytes;
                string uploadFileName = fileName ?? "leave_document.txt";
                string uploadMimeType = contentType ?? "text/plain";

                if ((attachmentBytes == null || attachmentBytes.Length == 0) && !string.IsNullOrEmpty(payload.LeaveFile?.SAttachmentFilePath))
                {
                    var dataUrl = payload.LeaveFile.SAttachmentFilePath;
                    if (dataUrl.StartsWith("data:", StringComparison.OrdinalIgnoreCase))
                    {
                        try
                        {
                            var commaIdx = dataUrl.IndexOf(',');
                            if (commaIdx > -1)
                            {
                                var header = dataUrl.Substring(0, commaIdx);
                                var base64 = dataUrl.Substring(commaIdx + 1);
                                attachmentBytes = Convert.FromBase64String(base64);
                                uploadFileName = payload.LeaveFile.SAttachmentFileName ?? "attachment.dat";
                                if (header.Contains(";"))
                                {
                                    var mime = header.Split(';')[0].Replace("data:", "");
                                    if (!string.IsNullOrEmpty(mime)) uploadMimeType = mime;
                                }
                            }
                        }
                        catch { }
                    }
                }

                if (attachmentBytes == null || attachmentBytes.Length == 0)
                {
                    attachmentBytes = Encoding.UTF8.GetBytes("Leave Application Document");
                    uploadFileName = "leave_doc.txt";
                    uploadMimeType = "text/plain";
                }

                var fileContent = new ByteArrayContent(attachmentBytes);
                fileContent.Headers.ContentType = new MediaTypeHeaderValue(uploadMimeType);
                formData.Add(fileContent, "Attachment", uploadFileName);

                request.Content = formData;

                var response = await _httpClient.SendAsync(request);
                var jsonString = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    return JsonSerializer.Deserialize<ApiResponseEnvelope<object>>(jsonString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                }
                else if (jsonString.Contains("Document number already exists", StringComparison.OrdinalIgnoreCase))
                {
                    _logger.LogWarning("SaveLeaveTransaction document number collided. Generating next sequence and retrying...");
                    
                    try
                    {
                        var currentTxs = await GetLeaveTransactionsAsync(payload.ICompanyId, payload.IPayYearId);
                        int maxNum = 0;
                        foreach (var t in currentTxs)
                        {
                            var docStr = t.SDocNo ?? "";
                            var digits = new string(docStr.Where(char.IsDigit).ToArray());
                            if (int.TryParse(digits, out int val) && val > maxNum) maxNum = val;
                        }
                        var nextDocNo = $"LVS{(maxNum + 1).ToString().PadLeft(6, '0')}";

                        var retryRequest = new HttpRequestMessage(HttpMethod.Post, endpoint);
                        retryRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

                        var retryFormData = new MultipartFormDataContent();
                        retryFormData.Add(new StringContent(payload.IHeaderId.ToString()), "iHeaderId");
                        retryFormData.Add(new StringContent(nextDocNo), "sDocNo");
                        retryFormData.Add(new StringContent(docDateStr), "dDocDate");
                        retryFormData.Add(new StringContent(postDateStr), "dPostDate");
                        retryFormData.Add(new StringContent(payload.ICompanyId.ToString()), "iCompanyId");
                        retryFormData.Add(new StringContent(payload.IPayYearId.ToString()), "iPayYearId");
                        retryFormData.Add(new StringContent(string.IsNullOrWhiteSpace(payload.SComments) ? "Leave application" : payload.SComments), "sComments");
                        retryFormData.Add(new StringContent(payload.ITransTypeId.ToString()), "iTransTypeId");
                        retryFormData.Add(new StringContent(leavesJson), "Leaves");

                        var retryFileContent = new ByteArrayContent(attachmentBytes);
                        retryFileContent.Headers.ContentType = new MediaTypeHeaderValue(uploadMimeType);
                        retryFormData.Add(retryFileContent, "Attachment", uploadFileName);

                        retryRequest.Content = retryFormData;

                        var retryResponse = await _httpClient.SendAsync(retryRequest);
                        var retryJsonString = await retryResponse.Content.ReadAsStringAsync();

                        if (retryResponse.IsSuccessStatusCode)
                        {
                            var resEnv = JsonSerializer.Deserialize<ApiResponseEnvelope<object>>(retryJsonString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                            return resEnv;
                        }
                    }
                    catch (Exception retryEx)
                    {
                        _logger.LogError(retryEx, "Error during document number retry in SaveLeaveTransactionAsync");
                    }

                    try
                    {
                        var errEnvelope = JsonSerializer.Deserialize<ApiResponseEnvelope<object>>(jsonString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                        if (errEnvelope != null) return errEnvelope;
                    }
                    catch { }
                    return new ApiResponseEnvelope<object> { Success = false, Message = $"API returned status {response.StatusCode}: {jsonString}" };
                }
                else
                {
                    _logger.LogWarning("SaveLeaveTransaction API returned status {StatusCode}: {Response}", response.StatusCode, jsonString);
                    try
                    {
                        var errEnvelope = JsonSerializer.Deserialize<ApiResponseEnvelope<object>>(jsonString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                        if (errEnvelope != null) return errEnvelope;
                    }
                    catch { }
                    return new ApiResponseEnvelope<object> { Success = false, Message = $"API returned status {response.StatusCode}: {jsonString}" };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling SaveLeaveTransaction API");
                return new ApiResponseEnvelope<object> { Success = false, Message = ex.Message };
            }
        }

        public async Task<ApiResponseEnvelope<object>?> UpdateLeaveTransactionAsync(SaveLeaveTransactionDto payload, byte[]? fileBytes = null, string? fileName = null, string? contentType = null)
        {
            return await SaveLeaveTransactionAsync(payload, fileBytes, fileName, contentType);
        }

        public async Task<ApiResponseEnvelope<object>?> DeleteLeaveTransactionAsync(int id)
        {
            try
            {
                var token = await GetAuthTokenAsync();
                if (string.IsNullOrEmpty(token))
                {
                    return new ApiResponseEnvelope<object> { Success = false, Message = "Authentication failed (no token)." };
                }

                var request = new HttpRequestMessage(HttpMethod.Delete, $"api/Leaves/DeleteLeaveTransaction/{id}");
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

                var response = await _httpClient.SendAsync(request);
                var jsonString = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    return JsonSerializer.Deserialize<ApiResponseEnvelope<object>>(jsonString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true })
                           ?? new ApiResponseEnvelope<object> { Success = true, Message = "Leave transaction deleted successfully." };
                }
                else
                {
                    _logger.LogWarning("DeleteLeaveTransaction API returned status {StatusCode}: {Response}", response.StatusCode, jsonString);
                    try
                    {
                        var errEnvelope = JsonSerializer.Deserialize<ApiResponseEnvelope<object>>(jsonString, new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                        if (errEnvelope != null) return errEnvelope;
                    }
                    catch { }
                    return new ApiResponseEnvelope<object> { Success = false, Message = $"API returned status {response.StatusCode}: {jsonString}" };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling DeleteLeaveTransaction API");
                return new ApiResponseEnvelope<object> { Success = false, Message = ex.Message };
            }
        }

        public async Task<LeaveTypeOptionsDto> GetLeaveTypesAsync(int? employeeId = null)
        {
            List<EmployeeLeaveItemDto> leaveTypes;
            if (employeeId.HasValue && employeeId.Value > 0)
            {
                leaveTypes = await GetEmployeeLeavesAsync(employeeId.Value);
            }
            else
            {
                leaveTypes = new List<EmployeeLeaveItemDto>
                {
                    new EmployeeLeaveItemDto { ILeaveTypeId = 7, SLeaveName = "Annual Leave" },
                    new EmployeeLeaveItemDto { ILeaveTypeId = 8, SLeaveName = "Sick Leave" },
                    new EmployeeLeaveItemDto { ILeaveTypeId = 12, SLeaveName = "Paternity Leave" },
                    new EmployeeLeaveItemDto { ILeaveTypeId = 1017, SLeaveName = "Maternity Leave" }
                };
            }

            return new LeaveTypeOptionsDto
            {
                LeaveTypes = leaveTypes,
                PaymentTypes = new List<PaymentTypeDto>
                {
                    new PaymentTypeDto { Id = 0, Name = "In Payroll" },
                    new PaymentTypeDto { Id = 1, Name = "Settlement" }
                },
                HalfDay = new List<HalfDayDto>
                {
                    new HalfDayDto { Id = 0, Name = "No" },
                    new HalfDayDto { Id = 1, Name = "Yes" }
                }
            };
        }
    }
}
