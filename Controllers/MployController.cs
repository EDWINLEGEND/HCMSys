using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using HCMSys.Models;
using HCMSys.Helpers;
using static HCMSys.Models.cStatus;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Nancy.Json;

namespace HCMSys.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MployController : ControllerBase
    {
        SMDbContext db = new SMDbContext();
        DateTime dtFixed=Convert.ToDateTime( "1900-01-01 00:00:00");

        [HttpGet("CheckLogin")]
        public ActionResult<StatusModel> CheckLogin(string sUserName, string sPwd, [FromHeader] string APIKey)
        {
            StatusModel e = new StatusModel();
            if(sUserName!=null)
                sUserName=sUserName.Replace(";amp;", "&");
            try
            {
                if (APIKey == "34JGH445-98FD-8IED-8LPO-343G25656D23")
                {
                    CCryptoEngine s = new CCryptoEngine();
                    string pwd = s.Encrypt(sPwd, "neox-3hn8-sqoy19");

                    tmPay_Users c = db.tmPay_Users.Where(s => s.sUserName == sUserName && s.iStatus < 5 && s.sPassword == pwd && s.iUserType==2).FirstOrDefault();
                    if (c != null)
                    {
                        UpdateSQL("update a set dEndDateTime = case when cast(dStartDateTime as date) < cast(GETDATE() as date) then  " +
                        " DATEADD(" + "MINUTE"  + ",case when b.tm is null  then 540 else case when b.tm > 540 then 0 else 540 - b.tm end end, dStartDateTime)  end from tPay_Attendance a left join " +
                        " (select sum(DATEDIFF(MINUTE, dStartDateTime, denddatetime))tm ,iEmployee ,cast(dStartDateTime as date) st from " +
                        " tPay_Attendance where(cast(dEndDateTime as date) <> '1900-01-01' " +
                        " and dEndDateTime is not null ) and iStatus< 5 group by  iEmployee ,cast(dStartDateTime as date)) as b on a.iEmployee = b.iEmployee and cast(a.dStartDateTime as date)= b.st " +
                        " where(cast(dEndDateTime as date) = '1900-01-01'  or dEndDateTime is null or cast(dEndDateTime as date) <> cast(dStartDateTime as date)) " +
                        " and cast(dStartDateTime as date) < cast(GETDATE() as date) and iStatus< 5 ");
                        e.Id = 1;
                        e.iUserId = c.iUserId;
                        e.iEmployeeId = c.iEmployee;
                        e.iUserRole = c.iUserRole;
                        tmHCM_Employee z = db.tmHCM_Employee.Where(s => s.iMasterId == c.iEmployee && s.iStatus < 5).FirstOrDefault();
                        if(z!=null)
                        {
                            e.EmployeeName = z.sName;
                        }                        
                        e.sDescription = "Valid User";
                        return Ok(e);
                    }
                    else
                    {
                        e.Id = 3;
                        e.sDescription = "User Name/Password doesnot match";
                        return Ok(e);
                    }
                }
                else
                {
                    e.Id = 2;
                    e.sDescription = "Unauthorised";
                    return Ok(e);
                }
            }
            catch (Exception ex)
            {
                e.Id = 4;
                e.sDescription = ex.Message;
                return Ok(e);
            }
        }
        [HttpGet("GetAttendance")]
        public ActionResult<IEnumerable<vtPay_Attendance>> GetAttendance(Int32 Employee, [FromHeader] string APIKey)
        {
            StatusModel e = new StatusModel();
            try
            {
                if (APIKey == "34JGH445-98FD-8IED-8LPO-343G25656D23")
                {
                    return db.vtPay_Attendance.Where(ss => ss.iEmployee == Employee).OrderByDescending(ss=>ss.iTransactionId).ToList();
                }
                else
                {
                    e.Id = 2;
                    e.sDescription = "Unauthorised";
                    return Ok(e);
                }
            }
            catch (Exception ex)
            {
                e.Id = 4;
                e.sDescription = ex.Message;
                return Ok(e);
            }
        }
        [HttpGet("GetAttendanceByTrId")]
        public ActionResult<IEnumerable<vtPay_Attendance>> GetAttendanceByTrId(Int32 trid, [FromHeader] string APIKey)
        {
            StatusModel e = new StatusModel();
            try
            {
                if (APIKey == "34JGH445-98FD-8IED-8LPO-343G25656D23")
                {
                    return db.vtPay_Attendance.Where(ss => ss.iTransactionId == trid).OrderByDescending(ss => ss.iTransactionId).ToList();
                }
                else
                {
                    e.Id = 2;
                    e.sDescription = "Unauthorised";
                    return Ok(e);
                }
            }
            catch (Exception ex)
            {
                e.Id = 4;
                e.sDescription = ex.Message;
                return Ok(e);
            }
        }
        [HttpGet("GetAttendanceForApproval")]
        public ActionResult<IEnumerable<vtPay_Attendance>> GetAttendanceForApproval(Int32 Engineer, [FromHeader] string APIKey)
        {
            StatusModel e = new StatusModel();
            try
            {
                if (APIKey == "34JGH445-98FD-8IED-8LPO-343G25656D23")
                {
                    return db.vtPay_Attendance.Where(ss => ss.iEngineer == Engineer && ss.iApprovedBy ==0 && ss.sEndDateTime !="").OrderByDescending(ss => ss.iTransactionId).ToList().ToList();
                }
                else
                {
                    e.Id = 2;
                    e.sDescription = "Unauthorised";
                    return Ok(e);
                }
            }
            catch (Exception ex)
            {
                e.Id = 4;
                e.sDescription = ex.Message;
                return Ok(e);
            }
        }
        [HttpGet("GetAttendanceApproved")]
        public ActionResult<IEnumerable<vtPay_Attendance>> GetAttendanceApproved(Int32 Engineer, [FromHeader] string APIKey)
        {
            StatusModel e = new StatusModel();
            try
            {
                if (APIKey == "34JGH445-98FD-8IED-8LPO-343G25656D23")
                {
                    return db.vtPay_Attendance.Where(ss => ss.iEngineer == Engineer && ss.iApprovedBy != 0 ).OrderByDescending(ss => ss.iTransactionId).ToList().ToList();
                }
                else
                {
                    e.Id = 2;
                    e.sDescription = "Unauthorised";
                    return Ok(e);
                }
            }
            catch (Exception ex)
            {
                e.Id = 4;
                e.sDescription = ex.Message;
                return Ok(e);
            }
        }
        [HttpGet("GetUserByEmployee")]
        public ActionResult<IEnumerable<vmPay_Users>> GetUserByEmployee(Int32 Employee, [FromHeader] string APIKey)
        {
            StatusModel e = new StatusModel();
            try
            {
                if (APIKey == "34JGH445-98FD-8IED-8LPO-343G25656D23")
                {
                    return db.vmPay_Users.Where(ss => ss.iEmployee == Employee).ToList();
                }
                else
                {
                    e.Id = 2;
                    e.sDescription = "Unauthorised";
                    return Ok(e);
                }
            }
            catch (Exception ex)
            {
                e.Id = 4;
                e.sDescription = ex.Message;
                return Ok(e);
            }
        }
        [HttpGet("GetUserByUserId")]
        public ActionResult<IEnumerable<vmPay_Users>> GetUserByUserId(Int32 iUserId, [FromHeader] string APIKey)
        {
            StatusModel e = new StatusModel();
            try
            {
                if (APIKey == "34JGH445-98FD-8IED-8LPO-343G25656D23")
                {
                    return db.vmPay_Users.Where(ss => ss.iUserId == iUserId).ToList();
                }
                else
                {
                    e.Id = 2;
                    e.sDescription = "Unauthorised";
                    return Ok(e);
                }
            }
            catch (Exception ex)
            {
                e.Id = 4;
                e.sDescription = ex.Message;
                return Ok(e);
            }
        }
        [HttpGet("GetUserByUserName")]
        public ActionResult<IEnumerable<vmPay_Users>> GetUserByUserName(string sUserName, [FromHeader] string APIKey)
        {
            StatusModel e = new StatusModel();
            if(sUserName!=null)
                sUserName=sUserName.Replace(";amp;", "&");
            try
            {
                if (APIKey == "34JGH445-98FD-8IED-8LPO-343G25656D23")
                {
                    return db.vmPay_Users.Where(ss => ss.sUserName == sUserName).ToList();
                }
                else
                {
                    e.Id = 2;
                    e.sDescription = "Unauthorised";
                    return Ok(e);
                }
            }
            catch (Exception ex)
            {
                e.Id = 4;
                e.sDescription = ex.Message;
                return Ok(e);
            }
        }
        [HttpGet("GetDesignation")]
        public ActionResult<IEnumerable<vmHCM_Location>> GetDesignation( [FromHeader] string APIKey)
        {
            StatusModel e = new StatusModel();
            try
            {
                if (APIKey == "34JGH445-98FD-8IED-8LPO-343G25656D23")
                {
                    return db.vmHCM_Location.ToList();
                }
                else
                {
                    e.Id = 2;
                    e.sDescription = "Unauthorised";
                    return Ok(e);
                }
            }
            catch (Exception ex)
            {
                e.Id = 4;
                e.sDescription = ex.Message;
                return Ok(e);
            }
        }
        [HttpGet("GetSites")]
        public ActionResult<IEnumerable<vmHCM_Site>> GetSites([FromHeader] string APIKey)
        {
            StatusModel e = new StatusModel();
            try
            {
                if (APIKey == "34JGH445-98FD-8IED-8LPO-343G25656D23")
                {
                    return db.vmHCM_Site.ToList();
                }
                else
                {
                    e.Id = 2;
                    e.sDescription = "Unauthorised";
                    return Ok(e);
                }
            }
            catch (Exception ex)
            {
                e.Id = 4;
                e.sDescription = ex.Message;
                return Ok(e);
            }
        }
        [HttpGet("GetSitesByProject")]
        public ActionResult<IEnumerable<vmHCM_Site>> GetSitesByProject(string project, [FromHeader] string APIKey)
        {
            StatusModel e = new StatusModel();
            if(project!=null)
                project = project.Replace(";amp;", "&");
            try
            {
                if (APIKey == "34JGH445-98FD-8IED-8LPO-343G25656D23")
                {
                    return db.vmHCM_Site.Where(ss => ss.sCode == project).ToList();
                }
                else
                {
                    e.Id = 2;
                    e.sDescription = "Unauthorised";
                    return Ok(e);
                }
            }
            catch (Exception ex)
            {
                e.Id = 4;
                e.sDescription = ex.Message;
                return Ok(e);
            }
        }
        [HttpGet("GetProjects")]
        public ActionResult<IEnumerable<vmHCM_Project>> GetProjects([FromHeader] string APIKey)
        {
            StatusModel e = new StatusModel();
            try
            {
                if (APIKey == "34JGH445-98FD-8IED-8LPO-343G25656D23")
                {
                    return db.vmHCM_Project.ToList();
                }
                else
                {
                    e.Id = 2;
                    e.sDescription = "Unauthorised";
                    return Ok(e);
                }
            }
            catch (Exception ex)
            {
                e.Id = 4;
                e.sDescription = ex.Message;
                return Ok(e);
            }
        }
     
        [HttpGet("GetProject")]
        public ActionResult<StatusModel> GetProject(string site,[FromHeader] string APIKey)
        {
            StatusModel e = new StatusModel();
            if(site!=null)
                site = site.Replace(";amp;", "&");
            try
            {
                if (APIKey == "34JGH445-98FD-8IED-8LPO-343G25656D23")
                {

                    vmHCM_Site c = db.vmHCM_Site.Where(ss => ss.sName == site).FirstOrDefault();
                    if (c != null)
                    {
                        e.Id =1;
                        e.sDescription = c.sName;
                        return Ok(e);
                    }
                    else
                    {
                        e.Id = 2;
                        e.sDescription = "No Data";
                        return Ok(e);
                    }
                }
                else
                {
                    e.Id = 2;
                    e.sDescription = "Unauthorised";
                    return Ok(e);
                }
            }
            catch (Exception ex)
            {
                e.Id = 4;
                e.sDescription = "Error";
                return Ok(e);
            }
        }
        [HttpGet("GetSiteId")]
        public ActionResult<StatusModel> GetSiteId(string site, [FromHeader] string APIKey)
        {
            StatusModel e = new StatusModel();
            if(site!=null)
                site = site.Replace(";amp;", "&");
            try
            {
                if (APIKey == "34JGH445-98FD-8IED-8LPO-343G25656D23")
                {

                    vmHCM_Site c = db.vmHCM_Site.Where(ss => ss.sName == site).FirstOrDefault();
                    if (c != null)
                    {
                        e.Id = 1;
                        e.sDescription = c.iMasterId.ToString();
                        return Ok(e);
                    }
                    else
                    {
                        e.Id = 2;
                        e.sDescription = "No Data";
                        return Ok(e);
                    }
                }
                else
                {
                    e.Id = 2;
                    e.sDescription = "Unauthorised";
                    return Ok(e);
                }
            }
            catch (Exception ex)
            {
                e.Id = 4;
                e.sDescription = "Error";
                return Ok(e);
            }
        }
        [HttpGet("GetProjectId")]
        public ActionResult<StatusModel> GetProjectId(string project, [FromHeader] string APIKey)
        {
            StatusModel e = new StatusModel();
            if(project!=null)
                project = project.Replace(";amp;", "&");
            try
            {
                if (APIKey == "34JGH445-98FD-8IED-8LPO-343G25656D23")
                {

                    vmHCM_Project c = db.vmHCM_Project.Where(ss => ss.sName == project).FirstOrDefault();
                    if (c != null)
                    {
                        e.Id = 1;
                        e.sDescription = c.iMasterId.ToString();
                        return Ok(e);
                    }
                    else
                    {
                        e.Id = 2;
                        e.sDescription = "No Data";
                        return Ok(e);
                    }
                }
                else
                {
                    e.Id = 2;
                    e.sDescription = "Unauthorised";
                    return Ok(e);
                }
            }
            catch (Exception ex)
            {
                e.Id = 4;
                e.sDescription = "Error";
                return Ok(e);
            }
        }
       
        [HttpGet("CreateAttendance")]
        public ActionResult<StatusModel> CreateAttendance(Int32 Employee, string Site, string Project, DateTime stDate, DateTime endDate, string Engineer, string UserId, [FromHeader] string APIKey)
        {
            StatusModel c = new StatusModel();
            if(Site!=null)
               Site= Site.Replace(";amp;", "&");
            if(Project!=null)
              Project=  Project.Replace(";amp;", "&");
            if(Engineer!=null)
              Engineer=  Engineer.Replace(";amp;", "&");
            try
            {
                if (APIKey == "34JGH445-98FD-8IED-8LPO-343G25656D23")
                {
                    tPay_Attendance d = new tPay_Attendance();
                    vtPay_Attendance att = db.vtPay_Attendance.Where(s => s.iEmployee == Employee && s.Project == Project &&
                    s.Site == Site && s.dStartDateTime.Date == stDate.Date && s.iStatus < 5 && 
                    stDate.TimeOfDay >= s.dStartDateTime.TimeOfDay && stDate.TimeOfDay <= s.dEndDateTime.TimeOfDay).FirstOrDefault();
                    if (att != null)
                    {
                        c.Id = 2;
                        c.sDescription = "Data Exists For The Date";
                        return Ok(c);
                    }
                    else
                    {
                        vtPay_Attendance att1 = db.vtPay_Attendance.Where(s => s.iEmployee == Employee  &&
                        s.dStartDateTime.Date == stDate.Date && s.dEndDateTime == dtFixed.Date && s.iStatus < 5).FirstOrDefault();
                        if (att1 != null)
                        {

                            c.Id = 2;
                            c.sDescription = "Timeout is not done for the previous entry";
                            return Ok(c);

                        }

                        vtPay_Attendance att2 = db.vtPay_Attendance.Where(s => s.iEmployee == Employee && 
                        stDate.Date == s.dStartDateTime.Date &&
                        stDate.TimeOfDay>= s.dStartDateTime.TimeOfDay && 
                        stDate.TimeOfDay <= s.dEndDateTime.TimeOfDay && s.iStatus < 5).FirstOrDefault();
                        if (att2 != null)
                        {
                            c.Id = 2;
                            c.sDescription = "Timein already exists for another site";
                            return Ok(c);
                        }
                        Int32 iSite = 0;Int32 iProject = 0; Int32 iEngineer = 0; Int32 iUser = 0;
                        vmHCM_Site s = db.vmHCM_Site.Where(s => s.sName == Site ).FirstOrDefault();
                        if (s != null)
                            iSite = s.iMasterId;
                        vmHCM_Site p = db.vmHCM_Site.Where(s => s.sName == Project).FirstOrDefault();
                        if (p != null)
                            iProject = p.iMasterId;
 
                        vmPay_Users u = db.vmPay_Users.Where(s => s.sUserName == UserId).FirstOrDefault();
                        if (u != null)
                            iUser = u.iUserId;
                        d.iEmployee = Employee;
                        d.iSite = iSite;
                        d.iProject = iProject;
                        d.iEngineer = iEngineer;
                        d.dStartDateTime = stDate;
                        if (dtFixed == endDate)
                            endDate = dtFixed;
                        else
                        {
                            if (stDate > endDate)
                            {
                                c.Id = 2;
                                c.sDescription = "Start Date Cannot Be Greater Than End Date";
                                return Ok(c);
                            }
                            if (stDate.Date != endDate.Date)
                            {
                                c.Id = 2;
                                c.sDescription = "Start Date & End Date should be the same";
                                return Ok(c);
                            }
                        }
                        d.dEndDateTime = endDate;
                        d.CreatedDate = DateTime.Now;
                        d.iCreatedBy = iUser;
                        d.ModifiedDate = DateTime.Now;
                        d.iModifiedBy =iUser;
                        d.iApprovedBy = 0;
                        d.ApprovalDate = DateTime.Now;
                        db.tPay_Attendance.Add(d);
                        db.SaveChanges();
                        c.Id = 1;
                        c.sDescription = "Data Inserted Successfully";
                        return Ok(c);
                    }
                }
                else
                {
                    c.Id = 2;
                    c.sDescription = "Unauthorised";
                    return Ok(c);
                }
            }
            catch (Exception e)
            {
                c.Id = 3;
                c.sDescription = e.Message.ToString();
                return Ok(e);
            }
        }
        [HttpGet("CreateAttendanceApproved")]
        public ActionResult<StatusModel> CreateAttendanceApproved(Int32 Employee, string Site, string Project, DateTime stDate, DateTime endDate, string Engineer, string UserId, [FromHeader] string APIKey)
        {
            StatusModel c = new StatusModel();
            if (Site != null)
                Site= Site.Replace(";amp;", "&");
            if (Project != null)
                Project = Project.Replace(";amp;", "&");
            if (Engineer != null)
                Engineer = Engineer.Replace(";amp;", "&");
            try
            {
                if (APIKey == "34JGH445-98FD-8IED-8LPO-343G25656D23")
                {
                    tPay_Attendance d = new tPay_Attendance();
                    vtPay_Attendance att = db.vtPay_Attendance.Where(s => s.iEmployee == Employee && s.Project == Project &&
                    s.Site == Site && s.dStartDateTime.Date == stDate.Date && s.iStatus < 5 && stDate.TimeOfDay >= s.dStartDateTime.TimeOfDay && stDate.TimeOfDay <= s.dEndDateTime.TimeOfDay).FirstOrDefault();
                    if (att != null)
                    {
                        c.Id = 2;
                        c.sDescription = "Data Exists For The Date";
                        return Ok(c);
                    }
                    else
                    {
                        vtPay_Attendance att1 = db.vtPay_Attendance.Where(s => s.iEmployee == Employee &&
                        s.dStartDateTime.Date == stDate.Date && s.dEndDateTime == dtFixed.Date && s.iStatus < 5).FirstOrDefault();
                        if (att1 != null)
                        {

                            c.Id = 2;
                            c.sDescription = "Timeout is not done for the previous entry";
                            return Ok(c);

                        }

                        vtPay_Attendance att2 = db.vtPay_Attendance.Where(s => s.iEmployee == Employee && stDate.Date == s.dStartDateTime &&
                        stDate.TimeOfDay >= s.dStartDateTime.TimeOfDay && stDate.TimeOfDay <= s.dEndDateTime.TimeOfDay && s.iStatus < 5).FirstOrDefault();
                        if (att2 != null)
                        {
                            c.Id = 2;
                            c.sDescription = "Timein already exists for another site";
                            return Ok(c);
                        }
                        Int32 iSite = 0; Int32 iProject = 0; Int32 iEngineer = 0; Int32 iUser = 0;
                        vmHCM_Site s = db.vmHCM_Site.Where(s => s.sName == Site).FirstOrDefault();
                        if (s != null)
                            iSite = s.iMasterId;
                        vmHCM_Project p = db.vmHCM_Project.Where(s => s.sName == Project).FirstOrDefault();
                        if (p != null)
                            iProject = p.iMasterId;
                   
                        vmPay_Users u = db.vmPay_Users.Where(s => s.sUserName == UserId).FirstOrDefault();
                        if (u != null)
                            iUser = u.iUserId;
                        d.iEmployee = Employee;
                        d.iSite = iSite;
                        d.iProject = iProject;
                        d.iEngineer = iEngineer;
                        d.dStartDateTime = stDate;
                        if (dtFixed == endDate)
                            endDate = dtFixed;
                        else
                        {
                            if (stDate > endDate)
                            {
                                c.Id = 2;
                                c.sDescription = "Start Date Cannot Be Greater Than End Date";
                                return Ok(c);
                            }
                            if (stDate.Date != endDate.Date)
                            {
                                c.Id = 2;
                                c.sDescription = "Start Date & End Date should be the same";
                                return Ok(c);
                            }
                        }
                        d.dEndDateTime = endDate;
                        d.CreatedDate = DateTime.Now;
                        d.iCreatedBy = iUser;
                        d.ModifiedDate = DateTime.Now;
                        d.iModifiedBy = iUser;
                        d.iApprovedBy = 0;
                        d.ApprovalDate = DateTime.Now;
                        db.tPay_Attendance.Add(d);
                        db.SaveChanges();
                        c.Id = 1;
                        c.sDescription = "Data Inserted Successfully";
                        return Ok(c);
                    }
                }
                else
                {
                    c.Id = 2;
                    c.sDescription = "Unauthorised";
                    return Ok(c);
                }
            }
            catch (Exception e)
            {
                c.Id = 3;
                c.sDescription = e.Message.ToString();
                return Ok(e);
            }
        }
        [HttpGet("DeleteAttendance")]
        public ActionResult<StatusModel> DeleteAttendance(Int32 Id ,string UserId, [FromHeader] string APIKey)
        {
            StatusModel c = new StatusModel();
            try
            {
                if (APIKey == "34JGH445-98FD-8IED-8LPO-343G25656D23")
                {
                    Int32 iUser = 0;
                    tPay_Attendance d = db.tPay_Attendance.Where(s => s.iTransactionId == Id).FirstOrDefault();
                    if(d!=null)
                    {
                        vmPay_Users u = db.vmPay_Users.Where(s => s.sUserName == UserId).FirstOrDefault();
                        if (u != null)
                            iUser = u.iUserId;
                        d.iStatus = 5;
                        d.ModifiedDate = DateTime.Now;
                        d.iModifiedBy = iUser;
                        db.tPay_Attendance.Update(d);
                        db.SaveChanges();

                        c.Id = 1;
                        c.sDescription = "Data Deleted Successfully";
                        return Ok(c);
                    }
                    else
                    {
                        c.Id = 4;
                        c.sDescription = "No Data Exists";
                        return Ok(c);
                    }
                }
                else
                {
                    c.Id = 2;
                    c.sDescription = "Unauthorised";
                    return Ok(c);
                }
            }
            catch (Exception e)
            {
                c.Id = 3;
                c.sDescription = e.Message.ToString();
                return Ok(e);
            }
        }
        [HttpGet("UpdateAttendance")]
        public ActionResult<StatusModel> UpdateAttendance(Int32 id, Int32 Employee, string Site, string Project, string stDate, string endDate, string Engineer, string UserId, [FromHeader] string APIKey)
        {
            DateTime dt1 = Convert.ToDateTime(stDate);
            DateTime dt2 = Convert.ToDateTime(endDate);
            StatusModel c = new StatusModel();
            if (Site != null)
                Site= Site.Replace(";amp;", "&");
            if (Project != null)
                Project=Project.Replace(";amp;", "&");
            if (Engineer != null)
                Engineer= Engineer.Replace(";amp;", "&");
            try
            {
                if (APIKey == "34JGH445-98FD-8IED-8LPO-343G25656D23")
                {
                    if (id != 0)
                    {
                        tPay_Attendance d = db.tPay_Attendance.Where(s => s.iTransactionId == id).FirstOrDefault();
                        if (d != null)
                        {
                            Int32 iSite = 0; Int32 iProject = 0; Int32 iEngineer = 0; Int32 iUser = 0;
                            vmHCM_Site s = db.vmHCM_Site.Where(s => s.sName == Site).FirstOrDefault();
                            if (s != null)
                                iSite = s.iMasterId;
                            vmHCM_Project p = db.vmHCM_Project.Where(s => s.sName == Project).FirstOrDefault();
                            if (p != null)
                                iProject = p.iMasterId;
            
                            vmPay_Users u = db.vmPay_Users.Where(s => s.sUserName == UserId).FirstOrDefault();

                            d.iEmployee = Employee;
                            d.iSite = iSite;
                            d.iProject = iProject;
                            d.iEngineer = iEngineer;
                            d.dStartDateTime = dt1;
                            if (dtFixed == dt2)
                                dt2 = dtFixed;
                            else
                            {
                                if (dt1 > dt2)
                                {
                                    c.Id = 1;
                                    c.sDescription = "Start Date Cannot Be Greater Than End Date";
                                    return Ok(c);
                                }
                                if (dt1.Date != dt2.Date)
                                {
                                    c.Id = 2;
                                    c.sDescription = "Start Date & End Date should be the same";
                                    return Ok(c);
                                }
                            }
                            vtPay_Attendance att2 = db.vtPay_Attendance.Where(s => s.iEmployee == Employee 
                            && s.iTransactionId != id && dt1.Date == s.dStartDateTime.Date &&
                            dt1.TimeOfDay >= s.dStartDateTime.TimeOfDay && dt1.TimeOfDay <= s.dEndDateTime.TimeOfDay && 
                            s.iStatus < 5).FirstOrDefault();
                            if (att2 != null)
                            {
                                c.Id = 2;
                                c.sDescription = "Timein already exists for another entry";
                                return Ok(c);
                            }
                            vtPay_Attendance att3 = db.vtPay_Attendance.Where(s => s.iEmployee == Employee && s.iTransactionId != id && dt1.Date == s.dStartDateTime.Date &&
                            dt2.TimeOfDay >= s.dStartDateTime.TimeOfDay && dt2.TimeOfDay <= s.dEndDateTime.TimeOfDay && s.iStatus < 5).FirstOrDefault();
                            if (att3 != null)
                            {
                                c.Id = 2;
                                c.sDescription = "Timeout already exists for another entry";
                                return Ok(c);
                            }
                            vtPay_Attendance att4 = db.vtPay_Attendance.Where(s => s.iEmployee == Employee && s.iTransactionId != id 
                            && dt1.Date == s.dStartDateTime.Date &&
                            ((s.dStartDateTime.TimeOfDay >= dt1.TimeOfDay && s.dStartDateTime.TimeOfDay <=  dt2.TimeOfDay ) ||
                            (s.dEndDateTime.TimeOfDay >= dt1.TimeOfDay && s.dEndDateTime.TimeOfDay <= dt2.TimeOfDay))).FirstOrDefault();
                            if (att4 != null)
                            {
                                c.Id = 2;
                                c.sDescription = "Timein/Timeout already exists for another entry";
                                return Ok(c);
                            }
                            d.dEndDateTime = dt2;
                            d.ModifiedDate = DateTime.Now;
                            d.iModifiedBy = iUser;
                            db.tPay_Attendance.Update(d);
                            int j = db.SaveChanges();
                            c.Id = 1;
                            c.sDescription = "Data Updated Successfully";
                            return Ok(c);
                        }
                        else
                        {
                            c.Id = 2;
                            c.sDescription = "No Data Exists For Update";
                            return Ok(c);
                        }
                    }
                    else
                    {
                        c.Id = 2;
                        c.sDescription = "No Data Exists For Update";
                        return Ok(c);
                    }

                }
                else
            {
                c.Id = 2;
                c.sDescription = "Unauthorised";
                return Ok(c);
            }
        }
            catch (Exception e)
            {
                c.Id = 3;
                c.sDescription = e.Message.ToString();
                return Ok(e);
            }
        }
        [HttpGet("UpdateAttendanceApproved")]
        public ActionResult<StatusModel> UpdateAttendanceApproved(Int32 id, Int32 Employee, string Site, string Project, DateTime stDate, DateTime endDate, string Engineer, string UserId, [FromHeader] string APIKey)
        {
            StatusModel c = new StatusModel();
            if (Site != null)
                Site = Site.Replace(";amp;", "&");
            if (Project != null)
                Project = Project .Replace(";amp;", "&");
            if (Engineer != null)
                Engineer = Engineer.Replace(";amp;", "&");
            try
            {
                if (APIKey == "34JGH445-98FD-8IED-8LPO-343G25656D23")
                {
                    if (id != 0)
                    {
                        tPay_Attendance d = db.tPay_Attendance.Where(s => s.iTransactionId == id).FirstOrDefault();
                        if (d != null)
                        {
                            Int32 iSite = 0; Int32 iProject = 0; Int32 iEngineer = 0; Int32 iUser = 0;
                            vmHCM_Site s = db.vmHCM_Site.Where(s => s.sName == Site).FirstOrDefault();
                            if (s != null)
                                iSite = s.iMasterId;
                            vmHCM_Project p = db.vmHCM_Project.Where(s => s.sName == Project).FirstOrDefault();
                            if (p != null)
                                iProject = p.iMasterId;
                            //vmPay_Engineer e = db.vmPay_Engineer.Where(s => s.sName == Engineer).FirstOrDefault();
                            //if (e != null)
                            //    iEngineer = e.iMasterId;

            

                            vmPay_Users u = db.vmPay_Users.Where(s => s.sUserName == UserId).FirstOrDefault();

                            d.iEmployee = Employee;
                            d.iSite = iSite;
                            d.iProject = iProject;
                            d.iEngineer = iEngineer;
                            d.dStartDateTime = stDate;
                            if (dtFixed == endDate)
                                endDate = dtFixed;
                            else
                            {
                                if (stDate > endDate)
                                {
                                    c.Id = 1;
                                    c.sDescription = "Start Date Cannot Be Greater Than End Date";
                                    return Ok(c);
                                }
                                if (stDate.Date != endDate.Date)
                                {
                                    c.Id = 2;
                                    c.sDescription = "Start Date & End Date should be the same";
                                    return Ok(c);
                                }
                            }
                            vtPay_Attendance att2 = db.vtPay_Attendance.Where(s => s.iEmployee == Employee && s.iTransactionId != id && stDate.Date == s.dStartDateTime.Date &&
                            stDate.TimeOfDay >= s.dStartDateTime.TimeOfDay && stDate.TimeOfDay <= s.dEndDateTime.TimeOfDay && s.iStatus < 5).FirstOrDefault();
                            if (att2 != null)
                            {
                                c.Id = 2;
                                c.sDescription = "Timein already exists for another entry";
                                return Ok(c);
                            }
                            vtPay_Attendance att3 = db.vtPay_Attendance.Where(s => s.iEmployee == Employee && s.iTransactionId != id && stDate.Date == s.dStartDateTime.Date &&
                            endDate.TimeOfDay >= s.dStartDateTime.TimeOfDay && endDate.TimeOfDay <= s.dEndDateTime.TimeOfDay && s.iStatus < 5).FirstOrDefault();
                            if (att3 != null)
                            {
                                c.Id = 2;
                                c.sDescription = "Timeout already exists for another entry";
                                return Ok(c);
                            }
                            d.dEndDateTime = endDate;
                            d.ModifiedDate = DateTime.Now;
                            d.iModifiedBy = iUser;
                            d.iApprovedBy = iUser;
                            d.ApprovalDate = DateTime.Now;
                            db.tPay_Attendance.Update(d);
                            db.SaveChanges();
                            c.Id = 1;
                            c.sDescription = "Data Updated Successfully";
                            return Ok(c);
                        }
                        else
                        {
                            c.Id = 2;
                            c.sDescription = "No Data Exists For Update";
                            return Ok(c);
                        }
                    }
                    else
                    {
                        c.Id = 2;
                        c.sDescription = "No Data Exists For Update";
                        return Ok(c);
                    }

                }
                else
                {
                    c.Id = 2;
                    c.sDescription = "Unauthorised";
                    return Ok(c);
                }
            }
            catch (Exception e)
            {
                c.Id = 3;
                c.sDescription = e.Message.ToString();
                return Ok(e);
            }
        }
        [HttpGet("UpdatePassword")]
        public ActionResult<StatusModel> UpdatePassword(string sUserName, string sPwd  , [FromHeader] string APIKey)
        {
            StatusModel c = new StatusModel();
            try
            {
                if (APIKey == "34JGH445-98FD-8IED-8LPO-343G25656D23")
                {
                    if (sUserName != "")
                    {
                        CCryptoEngine cr = new CCryptoEngine();
                        tmPay_Users d = db.tmPay_Users.Where(s => s.sUserName == sUserName).FirstOrDefault();
                        if (d != null)
                        {
 
                            d.sPassword = cr.Encrypt(sPwd, "neox-3hn8-sqoy19");
                            d.sToken = cr.Encrypt(sPwd, "taws-3hn8-sqoy19"); ;
                            d.ModifiedDate = DateTime.Now;
                            d.iModifiedBy = d.iUserId;
 
                            db.tmPay_Users.Update(d);
                            db.SaveChanges();
                            c.Id = 1;
                            c.sDescription = "Password Updated";
                            return Ok(c);
                        }
                   
                        else
                        {
                            c.Id = 2;
                            c.sDescription = "No Data Exists For Update";
                            return Ok(c);
                        }
                    }
                    else
                    {
                        c.Id = 2;
                        c.sDescription = "No Data Exists For Update";
                        return Ok(c);
                    }

                }
                else
                {
                    c.Id = 2;
                    c.sDescription = "Unauthorised";
                    return Ok(c);
                }
            }
            catch (Exception e)
            {
                c.Id = 3;
                c.sDescription = e.Message.ToString();
                return Ok(e);
            }
        }
        [HttpPost("ApproveAll")]
        public ActionResult<StatusModel> ApproveAll(Int16 UserId, [FromBody] List<vtPay_Attendance> strAtts, [FromHeader] string APIKey)
        {
            StatusModel c = new StatusModel();
            try
            {
                JavaScriptSerializer js = new JavaScriptSerializer();

                var list = strAtts;// js.Deserialize<List<vtPay_Attendance>>(strAtts);
                List<vtPay_Attendance> atts = list.Where(o => o.isSelected==1).ToList();
                if (atts == null)
                {
                    c.Id = 2;
                    c.sDescription = "No Data Exists For Update";
                    return Ok(c);
                }

                foreach (vtPay_Attendance att in atts)
                {
                    if(att.isSelected ==1)
                    {
                        tPay_Attendance d = db.tPay_Attendance.Where(s => s.iTransactionId == att.iTransactionId).FirstOrDefault();
                        if (d != null)
                        {
                            d.iApprovedBy = UserId;
                            d.ApprovalDate = DateTime.Now;
                            d.ModifiedDate = DateTime.Now;
                            d.iModifiedBy = UserId;
                            db.tPay_Attendance.Update(d);
                            db.SaveChanges();
                        }
                    }
                }
                c.Id = 1;
                c.sDescription = "Data Updated Successfully";
                return Ok(c);

            }
            catch (Exception e)
            {
                c.Id = 3;
                c.sDescription = e.Message.ToString();
                return Ok(e);
            }
        }
        private bool UpdateSQL(string cmd)
        {
            bool chk = false;
            try
            {
                string query = String.Format(cmd);
                using (var command = db.Database.GetDbConnection().CreateCommand())
                {
                    command.CommandType = System.Data.CommandType.Text;
                    command.CommandText = query;
                    command.CommandTimeout = 0;
                    db.Database.OpenConnection();
                    command.ExecuteNonQuery();
                    db.Database.CloseConnection();
                }
                chk = true;
            }
            catch (System.Exception e)
            {
                string err = e.Message.ToString();
                chk = false;
            }
            return chk;
        }

    }
}
  