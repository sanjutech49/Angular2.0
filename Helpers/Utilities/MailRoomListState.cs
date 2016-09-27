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
    public class MailRoomListState : IListState
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="CurrentPage"></param>
        /// <param name="BoundDate"></param>
        /// <param name="SortColumn"></param>
        public MailRoomListState( int CurrentPage = 1, GridDateFilter BoundDate = GridDateFilter.AllOpen, MailRoomAttribute SortColumn = MailRoomAttribute.DueDate, String sortDirection = "ASC", String documentTypeFilter = "" )
        {
            this.CurrentPage = CurrentPage;
            this.BoundDate = BoundDate;
            this.SortColumn = SortColumn;
            this.SortDirection = sortDirection;
            this.DocumentTypeFilter = documentTypeFilter;
        } 

        /// <summary>
        /// 
        /// </summary>
        public MailRoomAttribute SortColumn
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

        public String DocumentTypeFilter { get; set; }

    }
}