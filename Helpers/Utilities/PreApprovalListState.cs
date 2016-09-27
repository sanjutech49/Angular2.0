using System;
using MML.Contracts.CommonDomainObjects;
using MML.Web.LoanCenter.Helpers.Enums;
using MML.Contracts;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    [Serializable]
    public class PreApprovalListState : IListState
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="CurrentPage"></param>
        /// <param name="BoundDate"></param>
        /// <param name="SortColumn"></param>
        /// <param name="sortDirection"></param>
        public PreApprovalListState( int CurrentPage = 1, GridDateFilter BoundDate = GridDateFilter.AllOpen, PreApprovalAttribute SortColumn = PreApprovalAttribute.Empty, String sortDirection = "" )
        {
            this.CurrentPage = CurrentPage;
            this.BoundDate = BoundDate;
            this.SortColumn = SortColumn;
            this.SortDirection = sortDirection;
        }

        /// <summary>
        /// 
        /// </summary>
        public PreApprovalAttribute SortColumn
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
    }
}