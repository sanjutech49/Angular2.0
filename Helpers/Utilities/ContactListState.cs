using System;
using MML.Contracts.CommonDomainObjects;
using MML.Web.LoanCenter.Helpers.Enums;

namespace MML.Web.LoanCenter.Helpers.Utilities
{
    /// <summary>
    /// 
    /// </summary>
    [Serializable]
    public class ContactListState
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="CurrentPage"></param>
        /// <param name="BoundDate"></param>
        /// <param name="SortColumn"></param>
        /// <param name="sortDirection"></param>
        public ContactListState( int CurrentPage = 1, GridDateFilter BoundDate = GridDateFilter.AllOpen, ContactViewAttribute SortColumn = ContactViewAttribute.None, string sortDirection = "", Int32 contactStatusFilter = -1, String loanPurposeFilter = "", int conciergeFilter = -1 )
        {
            this.CurrentPage = CurrentPage;
            this.BoundDate = BoundDate;
            this.SortColumn = SortColumn;
            this.SortDirection = sortDirection;
            this.ContactStatusFilter = contactStatusFilter;
            this.LoanPurposeFilter = loanPurposeFilter;
            this.ConciergeFilter = conciergeFilter;
        }

        /// <summary>
        /// 
        /// </summary>
        public ContactViewAttribute SortColumn
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

        /// <summary>
        /// 
        /// </summary>
        public string SortDirection
        {
            get;
            set;
        }

        public Int32 ContactStatusFilter
        {
            get;
            set;
        }

        public String LoanPurposeFilter { get; set; }

        public int ConciergeFilter { get; set; }
    }
}