using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Contracts;
using MML.Web.LoanCenter.Helpers.Enums;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    /// <summary>
    /// 
    /// </summary>
    [Serializable]
    public class OfficerTaskListState
    {
        /// <summary>
        /// 
        /// </summary>
        public OfficerTaskListState(int page = 1, OfficerTaskAttribute sortColumn = OfficerTaskAttribute.DateAndTime, DateFilter boundDate = DateFilter.Today, string sortDirection = "ASC")
        {
            this.BoundDate = boundDate;
            this.CurrentPage = page;
            this.SortColumn = sortColumn;
            this.SortDirection = sortDirection;
        }
        
        /// <summary>
        /// 
        /// </summary>
        public OfficerTaskAttribute SortColumn { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public DateFilter BoundDate { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public int CurrentPage { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string SortDirection { get; set; }
    }
}