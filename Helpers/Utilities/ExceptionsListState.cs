using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Contracts.CommonDomainObjects;
using MML.Web.LoanCenter.Helpers.Enums;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public class ExceptionsListState : ListState
    {
        public ExceptionsListState( int currentPage = 1, GridDateFilter boundDate = GridDateFilter.AllOpen, String sortDirection = "DESC",
                                       OrderExceptionAttribute sortColumn = OrderExceptionAttribute.OrderStatus )
            : base( currentPage, boundDate, sortDirection )
        {
            this.SortColumn = sortColumn;
        }

        /// <summary>
        /// Selected Column for Sorting
        /// </summary>
        public OrderExceptionAttribute SortColumn { get; set; }
    }
}