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
    public class OrderRequestedListState : ListState
    {
        public OrderRequestedListState( int currentPage = 1, GridDateFilter boundDate = GridDateFilter.AllOpen, String sortDirection = "DESC",
                                        OrderRequestedAttribute sortColumn = OrderRequestedAttribute.Age )
            :base( currentPage,  boundDate, sortDirection )
        {
            this.SortColumn = sortColumn;
        }

        /// <summary>
        /// Selected Column for Sorting
        /// </summary>
        public OrderRequestedAttribute SortColumn { get; set; }

        /// <summary>
        /// Order Type
        /// </summary>
        public OrderType OrderType { get; set; }

        /// <summary>
        /// Non Conforming
        /// </summary>
        public Boolean NonConforming { get; set; }

        /// <summary>
        /// Rush
        /// </summary>
        public Boolean Rush { get; set; }

        /// <summary>
        /// Loan Purpose Filter
        /// </summary>
        public String LoanPurposeFilter { get; set; }

        /// <summary>
        /// Rush Filter
        /// </summary>
        public String RushFilter { get; set; }

        /// <summary>
        /// Non Conforming
        /// </summary>
        public String NonConformingFilter { get; set; }


    }
}