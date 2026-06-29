using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace HCMSys.Models
{
    public class tmHCM_Employee
    {
        [Key]
        public Int32 iMasterId { get; set; }
        public string sCode { get; set; }
        public string? sName { get; set; }
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime? JoiningDate { get; set; }
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime? RevisionDate { get; set; }
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime? EffectiveDate { get; set; }
        public Int32 iDesignation { get; set; }
        public Int32 iReportingTo { get; set; }
        public Int32 iPayYear { get; set; }        
        public Int32 iDepartment { get; set; }
        public Int32 iCategory { get; set; }
        public Int32 iCurrency { get; set; }
        public Int32 iProject { get; set; }
        public string? sWorkEmail { get; set; }
        public string? sWorkPhoneNo { get; set; }    
        public Int32 iBank { get; set; }
        public string? sBankBranch { get; set; }
        public string? sAccountNo { get; set; }
        public Int32 iPaymentType { get; set; }
        public Int32 iAirlineSector { get; set; }
        public Int32 iTravelClass { get; set; }
        public Int32 iEmployeeStatus { get; set; }
        public Int32? iStatus { get; set; }
        public DateTime? CreatedDate { get; set; }
        public Int32 iCreatedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public Int32 iModifiedBy { get; set; }
        public Int32 iRevision { get; set; }
    }
 
    public class vmHCM_Employee
    {
        [Key]
        public Int32 iMasterId { get; set; }
        public Int32 id { get; set; }
        public string sCode { get; set; }
        public string sName { get; set; }
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime JoiningDate { get; set; }
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime RevisionDate { get; set; }
        [DisplayFormat(DataFormatString = "{0:yyyy-MM-dd}", ApplyFormatInEditMode = true)]
        public DateTime EffectiveDate { get; set; }

        public Int32 iCategory { get; set; }
        public string sCategoryName { get; set; }
        public Int32 iDesignation { get; set; }
        public string sDesignationName { get; set; }
        public Int32 iEmployeeStatus { get; set; }
        public string sEmployeeStatusName { get; set; }

        public Int32 iProject { get; set; }
        public string sProject { get; set; }
        public Int32 iReportingTo { get; set; }
        public string sReportingTo { get; set; }
        public Int32 iPayYear { get; set; }
        public string sCalendar { get; set; }
        public Int32 iDepartment { get; set; }
        public string sDepartment { get; set; }
        public Int32 iCurrency { get; set; }
        public string sCurrency { get; set; }
        public string sWorkEmail { get; set; }
        public string sWorkPhoneNo { get; set; }
 
        public Int32 iBank { get; set; }
        public string sBank { get; set; }
        public string sBankBranch { get; set; }
        public string sAccountNo { get; set; }
        public Int32 iPaymentType { get; set; }
        public string sPaymentType { get; set; }
        public Int32 iAirlineSector { get; set; }
        public string sAirlineSector { get; set; }
        public Int32 iTravelClass { get; set; }
        public string sTravelClass { get; set; }

        public int iStatus { get; set; }
        public int TimesheetType { get; set; }
        
        public string sStatus { get; set; }
        public Int32 iCreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        public Int32 iModifiedBy { get; set; }
        public Int32 iRevision { get; set; }
        
    }
   
    public class EmployeeModel
    {
        public vmHCM_Employee employee { get; set; }
       
    }
}
