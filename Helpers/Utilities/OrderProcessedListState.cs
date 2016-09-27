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
    public class OrderProcessedListState : ListState
    {
        public OrderProcessedListState(int currentPage = 1, GridDateFilter boundDate = GridDateFilter.AllOpen, String sortDirection = "DESC",
                                       OrderProcessedAttribute sortColumn = OrderProcessedAttribute.Age )
            : base( currentPage, boundDate, sortDirection )
        {
            this.SortColumn = sortColumn;
        }

        /// <summary>
        /// Selected Column for Sorting
        /// </summary>
        public OrderProcessedAttribute SortColumn { get; set; }

        /// <summary>
        /// Appraisal Order Status
        /// </summary>
        public AppraisalOrderStatus AppraisalOrderStatus { get; set; }
    }
}