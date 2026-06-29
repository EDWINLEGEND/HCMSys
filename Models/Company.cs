using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace HCMSys.Models
{
 
    public class tsHCM_MasterSeries
    {
        [Key]
        public Int32 iTransId { get; set; }
        public Int32 iModuleId { get; set; }
        public string sModuleName { get; set; }
        public string sVoucherSeries { get; set; }
    }
   
}
