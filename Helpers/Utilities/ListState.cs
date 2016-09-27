using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Contracts.CommonDomainObjects;
using MML.Contracts;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    [Serializable]
    public class ListState : IListState
    {
        public ListState( int currentPage = 1, GridDateFilter boundDate = GridDateFilter.AllOpen, String sortDirection = "DESC" )
        {
            this.CurrentPage = currentPage;
            this.BoundDate = boundDate;
            this.SortDirection = sortDirection;
        }

        /// <summary>
        /// Filter inside Grid 
        /// </summary>
        public GridDateFilter BoundDate { get; set; }

        /// <summary>
        /// Current Selected Page
        /// </summary>
        public int CurrentPage { get; set; }

        /// <summary>
        /// Sort direction for columns in grid
        /// </summary>
        public String SortDirection { get; set; }
    }
}