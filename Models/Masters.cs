using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HCMSys.Models
{
  
     
    public class tmHCM_Project
    {
        [Key]
        public Int32 iMasterId { get; set; }
        public string sName { get; set; }
        public string sCode { get; set; }
        public string sArabicName { get; set; }
        public int iStatus { get; set; }
        public DateTime CreatedDate { get; set; }
        public int iCreatedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int iModifiedBy { get; set; }

    }
    public class vmHCM_Project
    {
        [Key]
        public Int32 iMasterId { get; set; }
        public string sName { get; set; }
        public string sCode { get; set; }
        public string sArabicName { get; set; }
        public int iStatus { get; set; }
        public string sStatus { get; set; }
        public int iCreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        public int iModifiedBy { get; set; }
    }
	 
}

