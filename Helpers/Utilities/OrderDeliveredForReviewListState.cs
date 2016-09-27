using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Contracts.CommonDomainObjects;
using MML.Web.LoanCenter.Helpers.Enums;
using MML.Contracts;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    [Serializable]
    public class OrderDeliveredForReviewListState : ListState
    {
        public OrderDeliveredForReviewListState( int currentPage = 1, GridDateFilter boundDate = GridDateFilter.AllOpen, String sortDirection = "DESC",
                                       OrderDeliveredForReviewAttribute sortColumn = OrderDeliveredForReviewAttribute.Age )
            : base( currentPage, boundDate, sortDirection )
        {
            this.SortColumn = sortColumn;
        }

        /// <summary>
        /// Selected Column for Sorting
        /// </summary>
        public OrderDeliveredForReviewAttribute SortColumn { get; set; }

        /// <summary>
        /// Appraisal Order Status
        /// </summary>
        public AppraisalOrderStatus AppraisalOrderStatus { get; set; }
    }
}