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
                // Calculate start and end date for TimeEntries filter
                string startDate = "2026-08-01";
                string endDate = "2026-08-31";
                if (DateTime.TryParse(date, out var parsedDt))
                {
                    if (period.Equals("Month", StringComparison.OrdinalIgnoreCase))
                    {
                        startDate = new DateTime(parsedDt.Year, parsedDt.Month, 1).ToString("yyyy-MM-dd");
                        endDate = new DateTime(parsedDt.Year, parsedDt.Month, DateTime.DaysInMonth(parsedDt.Year, parsedDt.Month)).ToString("yyyy-MM-dd");
                    }
                    else if (period.Equals("Day", StringComparison.OrdinalIgnoreCase))
                    {
                        startDate = parsedDt.ToString("yyyy-MM-dd");
                        endDate = parsedDt.ToString("yyyy-MM-dd");
                    }
                    else
                    {
                        startDate = parsedDt.ToString("yyyy-MM-dd");
                        endDate = parsedDt.AddDays(7).ToString("yyyy-MM-dd");
                    }
                }

                // Execute all three live Jibble queries in PARALLEL via Task.WhenAll:
                // 1. Monthly Timesheets (time-attendance.prod.jibble.io)
                // 2. People & Unit Managers (workspace.prod.jibble.io)
                // 3. TimeEntries Notes (time-tracking.prod.jibble.io)
                var timesheetsTask = FetchTimesheetsRawAsync(token, date, period);
                var managersTask = GetPeopleManagersMapAsync(token, forceRefresh);
                var notesTask = GetTimeEntriesNotesMapAsync(token, startDate, endDate, forceRefresh);

                await Task.WhenAll(timesheetsTask, managersTask, notesTask);

                var personTimesheets = await timesheetsTask;
                var managersMap = await managersTask;
                var notesMap = await notesTask;

                var rows = FlattenTimesheets(personTimesheets, managersMap, notesMap);

                // Cache for 60 minutes (user can click 'Refresh API' to bypass cache anytime)
                _cache.Set(cacheKey, rows, TimeSpan.FromMinutes(60));
                return rows;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception while querying Jibble APIs in parallel");
            }

            return new List<JibbleTimesheetGridRowDto>();
        }

        private async Task<List<JibblePersonTimesheetModel>?> FetchTimesheetsRawAsync(string token, string date, string period)
        {
            try
            {
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
                    return odataResp?.Value;
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

            return null;
        }

        public async Task<Dictionary<string, string>> GetPeopleManagersMapAsync(string token, bool forceRefresh = false)
        {
            string cacheKey = "Jibble_People_Managers";
            if (!forceRefresh && _cache.TryGetValue(cacheKey, out Dictionary<string, string>? cached) && cached != null)
            {
                return cached;
            }

            var map = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

            try
            {
                // Jibble Workspace People API with UnitManagers and Group.UnitManagers expanded
                string url = "https://workspace.prod.jibble.io/v1/People?$select=id,email,code,fullName,managers&$expand=UnitManagers($select=id,fullName),Group($expand=UnitManagers($select=id,fullName))";

                using var request = new HttpRequestMessage(HttpMethod.Get, url);
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead);
                if (response.IsSuccessStatusCode)
                {
                    using var stream = await response.Content.ReadAsStreamAsync();
                    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                    var odataResp = await JsonSerializer.DeserializeAsync<JibbleODataResponse<JibbleWorkspacePersonModel>>(stream, options);

                    if (odataResp?.Value != null)
                    {
                        foreach (var p in odataResp.Value)
                        {
                            var mgrNames = new List<string>();

                            // 1. Direct UnitManagers
                            if (p.UnitManagers != null)
                            {
                                foreach (var um in p.UnitManagers)
                                {
                                    if (!string.IsNullOrWhiteSpace(um.FullName))
                                        mgrNames.Add(um.FullName.Trim());
                                }
                            }

                            // 2. Group UnitManagers
                            if (p.Group?.UnitManagers != null)
                            {
                                foreach (var gm in p.Group.UnitManagers)
                                {
                                    if (!string.IsNullOrWhiteSpace(gm.FullName))
                                        mgrNames.Add(gm.FullName.Trim());
                                }
                            }

                            // 3. Any direct managers
                            if (p.Managers != null)
                            {
                                foreach (var m in p.Managers)
                                {
                                    if (m is JsonElement elem && elem.ValueKind == JsonValueKind.String)
                                    {
                                        var val = elem.GetString();
                                        if (!string.IsNullOrWhiteSpace(val)) mgrNames.Add(val.Trim());
                                    }
                                }
                            }

                            // Distinct list of managers
                            var distinctMgrs = mgrNames.Distinct().ToList();
                            if (distinctMgrs.Count > 0)
                            {
                                string mgrsJoined = string.Join(", ", distinctMgrs);

                                if (!string.IsNullOrWhiteSpace(p.Id))
                                    map[p.Id] = mgrsJoined;
                                if (!string.IsNullOrWhiteSpace(p.Code))
                                    map[p.Code] = mgrsJoined;
                                if (!string.IsNullOrWhiteSpace(p.FullName))
                                    map[p.FullName] = mgrsJoined;
                            }
                        }
                    }

                    _cache.Set(cacheKey, map, TimeSpan.FromMinutes(60));
                }
                else
                {
                    _logger.LogWarning("Failed to query People API: {StatusCode}", response.StatusCode);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception querying Jibble People API");
            }

            return map;
        }

        public async Task<Dictionary<(string personId, string date), string>> GetTimeEntriesNotesMapAsync(string token, string startDate, string endDate, bool forceRefresh = false)
        {
            string cacheKey = $"Jibble_TimeEntries_Notes_{startDate}_{endDate}";
            if (!forceRefresh && _cache.TryGetValue(cacheKey, out Dictionary<(string personId, string date), string>? cached) && cached != null)
            {
                return cached;
            }

            var result = new Dictionary<(string personId, string date), string>();
            var rawNotes = new Dictionary<(string personId, string date), List<string>>();

            try
            {
                // Query TimeEntries for date range in 5 parallel chunks of 1000 items ($skip = 0, 1000, 2000, 3000, 4000)
                var skips = new[] { 0, 1000, 2000, 3000, 4000 };
                var chunkTasks = skips.Select(skip => FetchTimeEntriesChunkAsync(token, startDate, endDate, skip)).ToList();

                var chunkResults = await Task.WhenAll(chunkTasks);

                foreach (var chunk in chunkResults)
                {
                    if (chunk == null) continue;
                    foreach (var entry in chunk)
                    {
                        if (string.IsNullOrWhiteSpace(entry.Note) || string.IsNullOrWhiteSpace(entry.PersonId) || string.IsNullOrWhiteSpace(entry.BelongsToDate))
                            continue;

                        var cleanNote = entry.Note.Trim();
                        if (string.IsNullOrEmpty(cleanNote)) continue;

                        var key = (entry.PersonId, entry.BelongsToDate);
                        if (!rawNotes.TryGetValue(key, out var list))
                        {
                            list = new List<string>();
                            rawNotes[key] = list;
                        }

                        if (!list.Contains(cleanNote))
                        {
                            list.Add(cleanNote);
                        }
                    }
                }

                // Format into joined string for each (personId, date)
                foreach (var kvp in rawNotes)
                {
                    result[kvp.Key] = string.Join(" | ", kvp.Value);
                }

                _cache.Set(cacheKey, result, TimeSpan.FromMinutes(60));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception querying Jibble TimeEntries API");
            }

            return result;
        }

        private async Task<List<JibbleTimeEntryModel>?> FetchTimeEntriesChunkAsync(string token, string startDate, string endDate, int skip)
        {
            try
            {
                string rawFilter = $"belongsToDate ge {startDate} and belongsToDate le {endDate}";
                string url = $"https://time-tracking.prod.jibble.io/v1/TimeEntries?$filter={Uri.EscapeDataString(rawFilter)}&$select=id,personId,time,belongsToDate,type,note&$top=1000&$skip={skip}";

                using var request = new HttpRequestMessage(HttpMethod.Get, url);
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

                var response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead);
                if (response.IsSuccessStatusCode)
                {
                    using var stream = await response.Content.ReadAsStreamAsync();
                    var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                    var odataResp = await JsonSerializer.DeserializeAsync<JibbleODataResponse<JibbleTimeEntryModel>>(stream, options);
                    return odataResp?.Value;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Error fetching TimeEntries chunk with skip={Skip}", skip);
            }

            return null;
        }

        private List<JibbleTimesheetGridRowDto> FlattenTimesheets(
            List<JibblePersonTimesheetModel>? personTimesheets,
            Dictionary<string, string> managersMap,
            Dictionary<(string personId, string date), string> notesMap)
        {
            var result = new List<JibbleTimesheetGridRowDto>();
            if (personTimesheets == null || personTimesheets.Count == 0) return result;

            foreach (var pt in personTimesheets)
            {
                var person = pt.Person;
                string personId = pt.PersonId ?? person?.Id ?? string.Empty;
                string fullName = !string.IsNullOrWhiteSpace(person?.FullName) ? person.FullName.Trim() : "Unknown";
                string memberCode = !string.IsNullOrWhiteSpace(person?.Code) ? person.Code.Trim() : "-";
                string position = !string.IsNullOrWhiteSpace(person?.PositionName) ? person.PositionName.Trim() : "-";
                string department = !string.IsNullOrWhiteSpace(person?.GroupName) ? person.GroupName.Trim() : "-";

                // Resolve Manager(s) from People API (UnitManagers + Group.UnitManagers)
                string managers = "-";
                if (!string.IsNullOrWhiteSpace(personId) && managersMap.TryGetValue(personId, out var mgrs) && !string.IsNullOrWhiteSpace(mgrs))
                {
                    managers = mgrs;
                }
                else if (!string.IsNullOrWhiteSpace(memberCode) && memberCode != "-" && managersMap.TryGetValue(memberCode, out var mgrsCode) && !string.IsNullOrWhiteSpace(mgrsCode))
                {
                    managers = mgrsCode;
                }
                else if (!string.IsNullOrWhiteSpace(fullName) && fullName != "Unknown" && managersMap.TryGetValue(fullName, out var mgrsName) && !string.IsNullOrWhiteSpace(mgrsName))
                {
                    managers = mgrsName;
                }
                else if (person?.Managers != null && person.Managers.Count > 0)
                {
                    managers = string.Join(", ", person.Managers.Where(m => !string.IsNullOrWhiteSpace(m)));
                }
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

                    // Attach note from TimeEntries API if available for this person on this date
                    if (!string.IsNullOrWhiteSpace(personId) && notesMap.TryGetValue((personId, rawDate), out var noteText) && !string.IsNullOrWhiteSpace(noteText))
                    {
                        if (justification == "-" || string.IsNullOrWhiteSpace(justification))
                        {
                            justification = noteText;
                        }
                        else
                        {
                            justification = $"{justification} | {noteText}";
                        }
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
                        StatusBadge = statusBadge,
                        IsAbsenceOrTimeOff = statusBadge != "Worked" || (absence != "-" && !string.IsNullOrWhiteSpace(absence))
                    });
                }
            }

            // Order by Date ascending, then Full Name ascending
            return result.OrderBy(r => r.Date).ThenBy(r => r.FullName).ToList();
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
