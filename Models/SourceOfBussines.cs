using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Web.LoanCenter.Helpers.Enums;

namespace MML.Web.LoanCenter.Models
{
    /// <summary>
    /// 
    /// </summary>
    public class SourceOfBussines
    {
        /// <summary>
        /// 
        /// </summary>
        public SourceOfBussines()
        {
            //this.LeadSourceType = LeadSourceTypeEnum.Attorney;
        }

        /// <summary>
        /// 
        /// </summary>
        //public LeadSourceTypeEnum LeadSourceType
        //{
        //    get;
        //    set;
        //}

        /// <summary>
        /// 
        /// </summary>
        public String ContactName
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public String Company
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public String PreferredPhone
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public String AlternatePhone
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public String Email
        {
            get;
            set;
        }
    }
}