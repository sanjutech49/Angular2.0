using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Contracts;
using MML.Contracts.CommonDomainObjects;
using MML.Web.LoanCenter.Helpers.Enums;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    [Serializable]
    public class NewLoanApplicationListState : IListState
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="CurrentPage"></param>
        /// <param name="BoundDate"></param>
        /// <param name="SortColumn"></param>
        public NewLoanApplicationListState( int CurrentPage = 1, GridDateFilter BoundDate = GridDateFilter.AllOpen, NewLoanApplicationAttribute SortColumn = NewLoanApplicationAttribute.ApplicationDate, String sortDirection = "DESC", String activityTypeFilter = "", String loanPurposeFilter = "", string borrowerStatusFilter = null )
        {
            this.CurrentPage = CurrentPage;
            this.BoundDate = BoundDate;
            this.SortColumn = SortColumn;
            this.SortDirection = sortDirection;
            this.LoanPurposeFilter = loanPurposeFilter;
            this.BorrowerStatusFilter = borrowerStatusFilter;
        }

        /// <summary>
        /// 
        /// </summary>
        public NewLoanApplicationAttribute SortColumn
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public GridDateFilter BoundDate
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public int CurrentPage
        {
            get;
            set;
        }

        public String SortDirection { get; set; }

        public String LoanPurposeFilter { get; set; }

        public String BorrowerStatusFilter { get; set; }
    }
}