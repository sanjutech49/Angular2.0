using System;
using MML.Contracts.CommonDomainObjects;
using MML.Web.LoanCenter.Helpers.Enums;
using MML.Contracts;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    [Serializable]
    public class CancelLoanListState : IListState
    {
		/// <summary>
		/// AlertsListState
		/// </summary>
		/// <param name="CurrentPage"></param>
		/// <param name="BoundDate"></param>
		/// <param name="SortColumn"></param>
		/// <param name="sortDirection"></param>
        public CancelLoanListState(int CurrentPage = 1, GridDateFilter BoundDate = GridDateFilter.AllOpen, CancelAttribute SortColumn = CancelAttribute.None, String sortDirection = "", String borrowerStatusFilter = null)
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
        public CancelAttribute SortColumn
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