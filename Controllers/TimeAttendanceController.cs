using System.Text;
using HCMSys.Services;
using Microsoft.AspNetCore.Mvc;

namespace HCMSys.Controllers
{
    public class TimeAttendanceController : Controller
    {
        private readonly IJibbleApiService _jibbleService;
        private readonly ILogger<TimeAttendanceController> _logger;

        public TimeAttendanceController(IJibbleApiService jibbleService, ILogger<TimeAttendanceController> logger)
        {
            _jibbleService = jibbleService;
            _logger = logger;
        }

        [HttpGet]
        public IActionResult Index()
        {
            ViewData["Title"] = "Timesheets";
            ViewBag.DefaultDate = "2026-08-01";
            ViewBag.DefaultPeriod = "Month";
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetTimesheetData(string date = "2026-08-01", string period = "Month", bool forceRefresh = false)
        {
            try
            {
                var rows = await _jibbleService.GetTimesheetGridRowsAsync(date, period, forceRefresh);
                return Json(new
                {
                    success = true,
                    count = rows.Count,
                    date = date,
                    period = period,
                    data = rows
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching timesheet data from Jibble");
                return Json(new
                {
                    success = false,
                    message = "Failed to load timesheet data from Jibble API: " + ex.Message,
                    data = new List<object>()
                });
            }
        }

        [HttpGet]
        public async Task<IActionResult> ExportTimesheetCsv(string date = "2026-08-01", string period = "Month")
        {
            var rows = await _jibbleService.GetTimesheetGridRowsAsync(date, period, false);
            var sb = new StringBuilder();

            // 12 Exact Columns in user specified order:
            // Date, Day, Full Name, Member Code, Position, Department, Manager(s), First In, Last Out, Worked Hours, Absence, Justification
            sb.AppendLine("Date,Day,Full Name,Member Code,Position,Department,Manager(s),First In,Last Out,Worked Hours,Absence,Justification");

            foreach (var r in rows)
            {
                sb.AppendLine(string.Join(",",
                    EscapeCsv(r.FormattedDate),
                    EscapeCsv(r.Day),
                    EscapeCsv(r.FullName),
                    EscapeCsv(r.MemberCode),
                    EscapeCsv(r.Position),
                    EscapeCsv(r.Department),
                    EscapeCsv(r.Managers),
                    EscapeCsv(r.FirstIn),
                    EscapeCsv(r.LastOut),
                    EscapeCsv(r.WorkedHours),
                    EscapeCsv(r.Absence),
                    EscapeCsv(r.Justification)
                ));
            }

            var bytes = Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(sb.ToString())).ToArray();
            string fileName = $"Timesheets_{date}_{period}.csv";
            return File(bytes, "text/csv", fileName);
        }

        private string EscapeCsv(string? val)
        {
            if (string.IsNullOrEmpty(val)) return "\"\"";
            val = val.Replace("\"", "\"\"");
            return $"\"{val}\"";
        }
    }
}
