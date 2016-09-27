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
    public class OrderExceptionListState : ListState
    {
        public OrderExceptionListState( int currentPage = 1, GridDateFilter boundDate = GridDateFilter.AllOpen, String sortDirection = "DESC",
                                        OrderExceptionAttribute sortColumn = OrderExceptionAttribute.Age )
            :base( currentPage,  boundDate, sortDirection )
        {
            this.SortColumn = sortColumn;
        }

        /// <summary>
        /// Sort Column
        /// </summary>
        public OrderExceptionAttribute SortColumn { get; set; }

        /// Exception Type
        /// </summary>
        public String ExceptionType { get; set; }
    }
}