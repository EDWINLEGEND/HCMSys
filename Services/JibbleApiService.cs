using System.Globalization;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.RegularExpressions;
using HCMSys.Models;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace HCMSys.Services
{
    public class JibbleApiService : IJibbleApiService
    {
        private readonly HttpClient _httpClient;
        private readonly IMemoryCache _cache;
        private readonly ILogger<JibbleApiService> _logger;

        private const string ClientId = "78359abf-46f9-4585-8903-c0991cda046e";
        private const string ClientSecret = "rIaTwIC4GQGArq9aWU3OXrzPhD6KJnLesTfOsMBWCtumL0fi";
        private const string TokenUrl = "https://identity.prod.jibble.io/connect/token";
        private const string TokenCacheKey = "Jibble_Auth_Token";

        public JibbleApiService(HttpClient httpClient, IMemoryCache cache, ILogger<JibbleApiService> logger)
        {
            _httpClient = httpClient;
            _cache = cache;
            _logger = logger;
            _httpClient.Timeout = TimeSpan.FromSeconds(60);
        }

        public async Task<string?> GetAuthTokenAsync()
        {
            if (_cache.TryGetValue(TokenCacheKey, out string? cachedToken) && !string.IsNullOrEmpty(cachedToken))
            {
                return cachedToken;
            }

            try
            {
                var bodyParams = new Dictionary<string, string>
                {
                    { "grant_type", "client_credentials" },
                    { "client_id", ClientId },
                    { "client_secret", ClientSecret }
                };

                using var tokenRequest = new HttpRequestMessage(HttpMethod.Post, TokenUrl)
                {
                    Content = new FormUrlEncodedContent(bodyParams)
                };

                var response = await _httpClient.SendAsync(tokenRequest);
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var tokenResp = JsonSerializer.Deserialize<JibbleTokenResponse>(json);
                    if (tokenResp != null && !string.IsNullOrEmpty(tokenResp.AccessToken))
                    {
                        var cacheDuration = TimeSpan.FromSeconds(Math.Max(300, tokenResp.ExpiresIn - 120));
                        _cache.Set(TokenCacheKey, tokenResp.AccessToken, cacheDuration);
                        return tokenResp.AccessToken;
                    }
                }
                else
                {
                    var err = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Failed to obtain Jibble token: {Status} - {Error}", response.StatusCode, err);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception while obtaining Jibble OAuth token");
            }

            return null;
        }

        public async Task<List<JibbleTimesheetGridRowDto>> GetTimesheetGridRowsAsync(string date = "2026-08-01", string period = "Month", bool forceRefresh = false)
        {
            if (string.IsNullOrWhiteSpace(date)) date = "2026-08-01";
            if (string.IsNullOrWhiteSpace(period)) period = "Month";

            string cacheKey = $"Jibble_Timesheets_{date}_{period}";

            if (!forceRefresh && _cache.TryGetValue(cacheKey, out List<JibbleTimesheetGridRowDto>? cachedRows) && cachedRows != null)
            {
                return cachedRows;
            }

            var token = await GetAuthTokenAsync();
            if (string.IsNullOrEmpty(token))
            {
                _logger.LogError("Unable to fetch Jibble timesheets: No token available.");
                return new List<JibbleTimesheetGridRowDto>();
            }

            try
            {
                // Jibble OData query: Date and Period are capital case; $expand=person;$count=true
                string queryUrl = $"https://time-attendance.prod.jibble.io/v1/Timesheets?Date={Uri.EscapeDataString(date)}&Period={Uri.EscapeDataString(period)}&$expand=person&$count=true";

                using var request = new HttpRequestMessage(HttpMethod.Get, queryUrl);
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead);
                if (response.IsSuccessStatusCode)
                {
                    using var stream = await response.Content.ReadAsStreamAsync();
                    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                    var odataResp = await JsonSerializer.DeserializeAsync<JibbleODataResponse<JibblePersonTimesheetModel>>(stream, options);

                    var rows = FlattenTimesheets(odataResp?.Value);

                    // Cache for 60 minutes (user can click 'Refresh API' to bypass cache anytime)
                    _cache.Set(cacheKey, rows, TimeSpan.FromMinutes(60));
                    return rows;
                }
                else
                {
                    var err = await response.Content.ReadAsStringAsync();
                    _logger.LogError("Error from Jibble Timesheets API: {StatusCode} - {Message}", response.StatusCode, err);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception while querying Jibble Timesheets API");
            }

            return new List<JibbleTimesheetGridRowDto>();
        }

        private List<JibbleTimesheetGridRowDto> FlattenTimesheets(List<JibblePersonTimesheetModel>? personTimesheets)
        {
            var result = new List<JibbleTimesheetGridRowDto>();
            if (personTimesheets == null || personTimesheets.Count == 0) return result;

            foreach (var pt in personTimesheets)
            {
                var person = pt.Person;
                string fullName = !string.IsNullOrWhiteSpace(person?.FullName) ? person.FullName.Trim() : "Unknown";
                string memberCode = !string.IsNullOrWhiteSpace(person?.Code) ? person.Code.Trim() : "-";
                string position = !string.IsNullOrWhiteSpace(person?.PositionName) ? person.PositionName.Trim() : "-";
                string department = !string.IsNullOrWhiteSpace(person?.GroupName) ? person.GroupName.Trim() : "-";
                
                string managers = (person?.Managers != null && person.Managers.Count > 0)
                    ? string.Join(", ", person.Managers.Where(m => !string.IsNullOrWhiteSpace(m)))
                    : "-";
                if (string.IsNullOrWhiteSpace(managers)) managers = "-";

                var dailyList = pt.Daily;
                if (dailyList == null || dailyList.Count == 0) continue;

                foreach (var d in dailyList)
                {
                    string rawDate = d.Date ?? string.Empty;
                    string formattedDate = rawDate;
                    string dayName = "-";

                    if (DateTime.TryParse(rawDate, out var parsedDate))
                    {
                        formattedDate = parsedDate.ToString("dd-MMM-yy", CultureInfo.InvariantCulture);
                        dayName = parsedDate.ToString("dddd", CultureInfo.InvariantCulture);
                    }

                    // Format First In
                    string firstInDisplay = FormatTime(d.FirstInOffset, d.FirstIn);
                    
                    // Format Last Out
                    string lastOutDisplay = FormatTime(d.LastOutOffset, d.LastOut);

                    // Format Worked Hours
                    var (workedDecimal, workedDisplay) = ParseIsoDuration(d.TrackedHours?.Worked);

                    // Justification & Absence determination
                    string justification = "-";
                    string absence = "-";
                    string statusBadge = "Worked";

                    var timeOff = d.TimeOff;
                    bool hasWorked = workedDecimal > 0 || firstInDisplay != "-";

                    if (timeOff != null && timeOff.Types != null && timeOff.Types.Count > 0)
                    {
                        var typeNames = string.Join(", ", timeOff.Types.Select(t => t.Name).Where(n => !string.IsNullOrWhiteSpace(n)));
                        justification = !string.IsNullOrWhiteSpace(typeNames) ? typeNames : "Time Off";

                        var (timeOffHours, _) = ParseIsoDuration(timeOff.PaidTimeOff);
                        if (timeOffHours == 0)
                        {
                            var (unpaidHours, _) = ParseIsoDuration(timeOff.UnpaidTimeOff);
                            timeOffHours = unpaidHours;
                        }

                        absence = timeOffHours > 0 ? $"{justification} ({timeOffHours:0.#}h)" : justification;
                        statusBadge = "Time Off";
                    }
                    else if (timeOff != null && timeOff.IsRestDay)
                    {
                        justification = "Rest Day";
                        absence = "Rest Day";
                        statusBadge = "Rest Day";
                    }
                    else if (!hasWorked)
                    {
                        absence = "Absent";
                        justification = "-";
                        statusBadge = "Absent";
                    }
                    else
                    {
                        statusBadge = "Worked";
                    }

                    result.Add(new JibbleTimesheetGridRowDto
                    {
                        Date = rawDate,
                        FormattedDate = formattedDate,
                        Day = dayName,
                        FullName = fullName,
                        MemberCode = memberCode,
                        Position = position,
                        Department = department,
                        Managers = managers,
                        Justification = justification,
                        FirstIn = firstInDisplay,
                        LastOut = lastOutDisplay,
                        WorkedHours = workedDisplay,
                        WorkedHoursDecimal = Math.Round(workedDecimal, 2),
                        Absence = absence,
                        StatusBadge = statusBadge
                    });
                }
            }

            // Order by Date descending, then Full Name ascending
            return result.OrderByDescending(r => r.Date).ThenBy(r => r.FullName).ToList();
        }

        private string FormatTime(string? timeOffsetStr, string? timeOfDayStr)
        {
            if (!string.IsNullOrWhiteSpace(timeOffsetStr) && DateTimeOffset.TryParse(timeOffsetStr, out var dto))
            {
                return dto.ToString("hh:mm tt", CultureInfo.InvariantCulture);
            }

            if (!string.IsNullOrWhiteSpace(timeOfDayStr))
            {
                var timePart = timeOfDayStr.Split('.')[0]; // remove subsecond ticks
                if (TimeSpan.TryParse(timePart, out var ts))
                {
                    return DateTime.Today.Add(ts).ToString("hh:mm tt", CultureInfo.InvariantCulture);
                }
            }

            return "-";
        }

        private (double Hours, string Display) ParseIsoDuration(string? isoDuration)
        {
            if (string.IsNullOrWhiteSpace(isoDuration) || isoDuration == "PT0S" || isoDuration == "P0D")
            {
                return (0, "0h 0m");
            }

            try
            {
                int days = 0;
                int hours = 0;
                int minutes = 0;

                var dMatch = Regex.Match(isoDuration, @"(\d+)D");
                if (dMatch.Success) days = int.Parse(dMatch.Groups[1].Value);

                var hMatch = Regex.Match(isoDuration, @"(\d+)H");
                if (hMatch.Success) hours = int.Parse(hMatch.Groups[1].Value);

                var mMatch = Regex.Match(isoDuration, @"(\d+)M");
                if (mMatch.Success) minutes = int.Parse(mMatch.Groups[1].Value);

                double totalHours = days * 24 + hours + (minutes / 60.0);

                var parts = new List<string>();
                int netHours = days * 24 + hours;
                if (netHours > 0) parts.Add($"{netHours}h");
                if (minutes > 0 || parts.Count == 0) parts.Add($"{minutes}m");

                return (totalHours, string.Join(" ", parts));
            }
            catch
            {
                return (0, "0h 0m");
            }
        }
    }
}
