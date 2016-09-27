using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Web.LoanCenter.Helpers.Enums;
using MML.Contracts.CommonDomainObjects;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    public class DeliveredForReviewListState : ListState
    {
        public DeliveredForReviewListState( int currentPage = 1, GridDateFilter boundDate = GridDateFilter.AllOpen, String sortDirection = "DESC",
                                       OrderDeliveredForReviewAttribute sortColumn = OrderDeliveredForReviewAttribute.DeliveredDate )
            : base( currentPage, boundDate, sortDirection )
        {
            this.SortColumn = sortColumn;
        }

        /// <summary>
        /// Selected Column for Sorting
        /// </summary>
        public OrderDeliveredForReviewAttribute SortColumn { get; set; }
    }
}