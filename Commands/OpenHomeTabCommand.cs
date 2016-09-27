using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MML.Common;
using MML.Web.LoanCenter.Helpers.Utilities;
using MML.Web.LoanCenter.ViewModels;
using MML.Contracts;
using MML.Web.Facade;
using MML.Common.Helpers;
using MML.Web.LoanCenter.Helpers.Enums;

namespace MML.Web.LoanCenter.Commands
{
    /// <summary>
    /// Opens Home tab showing Task grid with state that is preserved in session (Officer task list state, page number reset to 1)
    /// </summary>
    public class OpenHomeTabCommand : ICommand
    {
        private String _viewName = String.Empty;
        private dynamic _viewModel = null;
        private Dictionary<string, object> _inputParameters = null;
        private HttpContextBase _httpContext = null;

        public string ViewName
        {
            get { return _viewName; }
        }

        public dynamic ViewData
        {
            get { return _viewModel; }
        }

        public Dictionary<string, object> InputParameters
        {
            get
            {
                return _inputParameters;
            }
            set
            {
                _inputParameters = value;
            }
        }

        public HttpContextBase HttpContext
        {
            get { return _httpContext; }
            set { _httpContext = value; }
        }

        public void Execute()
        {
            OfficerTasksViewModel taskViewModel = null;
            if (_httpContext.Session["OfficerTaskViewModel"] != null)
                taskViewModel = new OfficerTasksViewModel().FromXml(_httpContext.Session["OfficerTaskViewModel"].ToString());
            else
                taskViewModel = new OfficerTasksViewModel();

            OfficerTaskListState taskListState = null;
            if ((_httpContext != null) && (_httpContext.Session["OfficerTaskListState"] != null))
                taskListState = (OfficerTaskListState)_httpContext.Session["OfficerTaskListState"];
            else
                taskListState = new OfficerTaskListState();

            FilterViewModel userFilterViewModel = null;
            if ((_httpContext != null) && (_httpContext.Session["FilterViewModel"] != null))
            {
                userFilterViewModel = new FilterViewModel().FromXml(_httpContext.Session["FilterViewModel"].ToString());
                userFilterViewModel.FilterContext = Helpers.Enums.FilterContextEnum.OfficerTask;
            }
            else
            {
                // possible state retrieval?
                userFilterViewModel = new FilterViewModel();
                userFilterViewModel.FilterContext = Helpers.Enums.FilterContextEnum.OfficerTask;
            }

            // reset Page Number to 1st on Tab change
            taskListState.CurrentPage = 1;

            UserAccount user = null;
            if (_httpContext.Session[ SessionHelper.UserData ] != null)
                user = (UserAccount)_httpContext.Session[ SessionHelper.UserData ];
            else throw new InvalidOperationException("UserData is null");

            var result = TaskServiceFacade.GetTasks( _httpContext.Session[ SessionHelper.UserAccountIds ] != null ? ( List<int> )_httpContext.Session[ SessionHelper.UserAccountIds ] : new List<int> { },
                                                    taskListState.BoundDate,
                                                    taskListState.CurrentPage,
                                                    EnumHelper.GetStringValue(taskListState.SortColumn),
                                                    taskListState.SortDirection,
                                                    user.UserAccountId
                                                    );

            if (result != null)
            {
                taskViewModel.OfficerTasks = result.OfficerTasks;
                taskViewModel.PageCount = result.TotalPages;
                taskViewModel.TotalItems = result.TotalItems;
                taskViewModel.CurrentPage = taskListState.CurrentPage;
            }

            OfficerTaskGridHelper.ProcessPagingOptions(taskListState, taskViewModel);

            OfficerTaskGridHelper.ApplyClassCollection(taskViewModel);

            _viewName = "_officertask";
            _viewModel = taskViewModel;

            /* Persist new state */
            _httpContext.Session["OfficerTaskViewModel"] = taskViewModel.ToXml();
            _httpContext.Session["OfficerTaskListState"] = taskListState;
            _httpContext.Session["FilterViewModel"] = userFilterViewModel.ToXml();
            _httpContext.Session["CurrentTab"] = LoanCenterTab.OfficerTask;
        }
    }
}