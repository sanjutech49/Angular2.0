using System;
using MML.Contracts.CommonDomainObjects;
using MML.Web.LoanCenter.Helpers.Enums;
using MML.Contracts;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    [Serializable]
    public class CompletedLoansListState : IListState
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="CurrentPage"></param>
        /// <param name="BoundDate"></param>
        /// <param name="SortColumn"></param>
        /// <param name="sortDirection"></param>
        public CompletedLoansListState(int CurrentPage = 1, GridDateFilter BoundDate = GridDateFilter.AllOpen, CompletedLoansAttribute SortColumn = CompletedLoansAttribute.AppDate, String sortDirection = "DESC", string borrowerStatusFilter = null)
        {
            this.CurrentPage = CurrentPage;
            this.BoundDate = BoundDate;
            this.SortColumn = SortColumn;
            this.SortDirection = sortDirection;
            this.BorrowerStatusFilter = borrowerStatusFilter;
        }

        /// <summary>
        /// 
        /// </summary>
        public CompletedLoansAttribute SortColumn
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

        public String BorrowerStatusFilter { get; set; }
    }
}