using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Web.LoanCenter.Models;
using MML.Web.LoanCenter.Helpers.Enums;
using MML.Contracts.DomainModels;
using System.Web.WebPages.Html;
using MML.Contracts;

namespace MML.Web.LoanCenter.ViewModels
{
    /// <summary>
    /// 
    /// </summary>
    [Serializable]
    public class IndexViewModel
    {
        public IndexViewModel()
        {
            this.ItemsPerPage = 10;
            this.FilterModel = new FilterViewModel();
            this.TaskOwners = new List<SelectListItem>();
            this.ProspectLO = new List<SelectListItem>();
            this.StatusList = new List<SelectListItem>();
        }

        /// <summary>
        /// 
        /// </summary>
        public MainControl Target
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public int PageCount
        {
            get;
            set;
        }
        
        /// <summary>
        /// 
        /// </summary>
        public int ItemsPerPage
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public IList<Appointment> Appointments
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public IList<EMail> Inbox
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public IList<EMail> Sent
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public IList<EMail> Draft
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public List<MML.Contracts.DomainModels.OfficerTask> OfficerTasks
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public List<Pipeline> PipelineItems
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public List<Alert> Alerts
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public List<Referal> Referals
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public List<Dashboard> DashboardItems
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public List<MML.Contracts.ContactView> Contacts
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public int TargetOfficerTask
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public int TargetPipeline
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public int TargetContact
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public int TotalItems
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public int OfficerTaskDateFilter
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public List<SelectListItem> TaskOwners
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public List<SelectListItem> ProspectLO
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public List<SelectListItem> StatusList
        {
            get;
            set;
        }
                
        /// <summary>
        /// 
        /// </summary>
        public FilterViewModel FilterModel
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public Int32 TotalContactItems
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public Int32 TotalContactPages
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public LoanCenterTab CurrentTab
        {
            get;
            set;
        }


        /// <summary>
        /// 
        /// </summary>
        public OfficerTask CurrentTask
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public ContactView CurrentContact
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public int PageGroups
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public int LastPageItems
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public int StartPage
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public int EndPage
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
        public bool LastPageDots
        {
            get;
            set;
        }

        /// <summary>
        /// 
        /// </summary>
        public bool LastPageDotsTask
        {
            get;
            set;
        }
    }
}
