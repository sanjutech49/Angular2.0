using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MML.Web.LoanCenter.Models
{
    /// <summary>
    /// 
    /// </summary>
    [Serializable]
    public class EMail
    {
        /// <summary>
        /// 
        /// </summary>
        public String From { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public String Subject { get; set; }
        
        /// <summary>
        /// 
        /// </summary>
        public DateTime DateReceived { get; set; }
    }
}