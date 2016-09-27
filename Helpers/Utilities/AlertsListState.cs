using System;
using MML.Contracts.CommonDomainObjects;
using MML.Web.LoanCenter.Helpers.Enums;
using MML.Contracts;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    [Serializable]
    public class AlertsListState : IListState
    {
		/// <summary>
		/// AlertsListState
		/// </summary>
		/// <param name="CurrentPage"></param>
		/// <param name="BoundDate"></param>
		/// <param name="SortColumn"></param>
		/// <param name="sortDirection"></param>
        public AlertsListState( int CurrentPage = 1, GridDateFilter BoundDate = GridDateFilter.AllOpen, AlertsAttribute SortColumn = AlertsAttribute.ConciergeFullName, String sortDirection = "DESC", String loanPurposeFilter = "" )
        {
            this.CurrentPage = CurrentPage;
            this.BoundDate = BoundDate;
            this.SortColumn = SortColumn;
            this.SortDirection = sortDirection;
            this.LoanPurposeFilter = loanPurposeFilter;
        }

        /// <summary>
        /// 
        /// </summary>
        public AlertsAttribute SortColumn
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

        public String ActivityTypeFilter { get; set; }
    }
}