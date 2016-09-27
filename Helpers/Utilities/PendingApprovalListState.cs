using System;
using MML.Contracts.CommonDomainObjects;
using MML.Web.LoanCenter.Helpers.Enums;
using MML.Contracts;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    [Serializable]
    public class PendingApprovalListState : IListState
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="CurrentPage"></param>
        /// <param name="ActivityType"></param>
        /// <param name="SortColumn"></param>
        /// <param name="sortDirection"></param>
        public PendingApprovalListState( int CurrentPage = 1, GridActivityTypeFilter ActivityType = GridActivityTypeFilter.AllLoans, PendingApprovalAttribute SortColumn = PendingApprovalAttribute.Date, String sortDirection = "DESC" )
        {
            this.CurrentPage = CurrentPage;
            this.ActivityType = ActivityType;
            this.SortColumn = SortColumn;
            this.SortDirection = sortDirection;
        }

        /// <summary>
        /// 
        /// </summary>
        public PendingApprovalAttribute SortColumn
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

        public String SortDirection
        {
            get;
            set;
        }

        public GridActivityTypeFilter ActivityType
        {
            get;
            set;
        }
    }
}